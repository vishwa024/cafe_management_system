const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');
const Inventory = require('../models/inventory');
const WasteLog = require('../models/Waste');
const User = require('../models/User');

const ACTIVE_STATUSES = ['placed', 'confirmed', 'preparing'];
const READY_STATUS = 'ready';
const HISTORY_STATUSES = ['ready', 'completed', 'delivered', 'cancelled', 'canceled'];

const populateKitchenOrder = (query) => query
  .populate('customer', 'name phone')
  .populate('assignedStaff', 'name role isActive lastSeen')
  .populate('deliveryAgent', 'name role isOnline isActive lastSeen')
  .populate('items.menuItem', 'name category image');

const normalizeOrder = (order) => {
  const data = order.toObject ? order.toObject() : order;
  return {
    ...data,
    customerName: data.guestName || data.customer?.name || 'Customer',
    groupedCategory: data.items?.[0]?.menuItem?.category || data.orderType || 'Other',
  };
};

const getKitchenOrders = async (req, res) => {
  try {
    const orders = await populateKitchenOrder(
      Order.find({ status: { $in: ACTIVE_STATUSES } }).sort({ createdAt: -1, updatedAt: -1 })
    );
    res.json(orders.map(normalizeOrder));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

const getReadyOrders = async (req, res) => {
  try {
    const orders = await populateKitchenOrder(
      Order.find({ status: READY_STATUS }).sort({ readyAt: -1, updatedAt: -1, createdAt: -1 })
    );
    res.json(orders.map(normalizeOrder));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getKitchenHistoryOrders = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const orders = await populateKitchenOrder(
      Order.find({
        $or: [
          { status: { $in: HISTORY_STATUSES } },
          { createdAt: { $lt: today } },
        ],
      }).sort({
        completedAt: -1,
        readyAt: -1,
        updatedAt: -1,
        createdAt: -1,
      })
    );
    res.json(orders.map(normalizeOrder));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getKitchenTeamStatus = async (req, res) => {
  try {
    const members = await User.find({ role: { $in: ['kitchen'] } })
      .select('name role isActive isOnline lastSeen vehicleType')
      .sort({ role: 1, name: 1 });

    res.json(members.map((member) => ({
      _id: member._id,
      name: member.name,
      role: member.role,
      isAvailable: member.role === 'delivery' ? !!member.isOnline : !!member.isActive,
      lastSeen: member.lastSeen,
      vehicleType: member.vehicleType || null,
    })));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── Helper: Deduct inventory stock when order is marked Ready ───────────────
// For each order item → fetch MenuItem with ingredients → deduct currentStock
const deductStockForOrder = async (order, updatedBy) => {
  const deductionSummary = {
    deducted: [],
    skipped: [],
  };

  try {
    for (const orderItem of order.items) {
      const menuItemId = orderItem.menuItem?._id || orderItem.menuItem?.id || orderItem.menuItem;
      if (!menuItemId) {
        deductionSummary.skipped.push({
          orderItem: orderItem.name || 'Unknown item',
          reason: 'Menu item reference missing',
        });
        continue;
      }

      // Fetch menu item with its ingredients (inventoryItem ref + quantity per unit)
      const menuItem = await MenuItem.findById(menuItemId)
        .populate('ingredients.inventoryItem');

      if (!menuItem || !Array.isArray(menuItem.ingredients) || menuItem.ingredients.length === 0) {
        deductionSummary.skipped.push({
          orderItem: orderItem.name || menuItem?.name || 'Unknown item',
          reason: 'No ingredients linked to menu item',
        });
        continue;
      }

      const orderedQty = Number(orderItem.quantity) || 1;

      for (const ingredient of menuItem.ingredients) {
        const invItem = ingredient.inventoryItem;
        if (!invItem || !invItem._id) {
          deductionSummary.skipped.push({
            orderItem: menuItem.name,
            reason: 'Ingredient inventory item missing',
          });
          continue;
        }

        // Total to deduct = ingredient quantity per dish × number of dishes ordered
        const deductAmount = Number(ingredient.quantity || 0) * orderedQty;
        if (deductAmount <= 0) continue;

        // Fetch fresh inventory doc to avoid stale data
        const inventoryDoc = await Inventory.findById(invItem._id);
        if (!inventoryDoc) continue;

        const before = inventoryDoc.currentStock;
        inventoryDoc.currentStock = Math.max(0, before - deductAmount);

        // Push to stockHistory if the model supports it
        if (Array.isArray(inventoryDoc.stockHistory)) {
          inventoryDoc.stockHistory.push({
            change: -deductAmount,
            note: `Auto-deducted: Order #${order._id} marked Ready (${menuItem.name} × ${orderedQty})`,
            date: new Date(),
            updatedBy: updatedBy || null,
          });
        }

        await inventoryDoc.save();

        deductionSummary.deducted.push({
          inventoryItem: inventoryDoc.name,
          before,
          after: inventoryDoc.currentStock,
          deducted: deductAmount,
          unit: inventoryDoc.unit,
          menuItem: menuItem.name,
          orderedQty,
        });

        console.log(
          `[Stock] ${inventoryDoc.name}: ${before} → ${inventoryDoc.currentStock} ${inventoryDoc.unit} (deducted ${deductAmount} for ${menuItem.name} × ${orderedQty})`
        );
      }
    }
  } catch (err) {
    // Log but don't crash the order status update
    console.error('[Stock Deduction Error]', err.message);
    deductionSummary.skipped.push({
      orderItem: 'Order deduction',
      reason: err.message,
    });
  }

  return deductionSummary;
};

// ─── Update Order Status ──────────────────────────────────────────────────────
const updateOrderStatus = async (req, res) => {
  try {
    const newStatus = String(req.body.status || '').toLowerCase();

    // Populate menuItem so deductStockForOrder can access it
    const order = await Order.findById(req.params.id)
      .populate('items.menuItem');

    if (!order) return res.status(404).json({ message: 'Order not found' });

    const current = String(order.status || '').toLowerCase();
    const validFlow = {
      placed: 'preparing',
      confirmed: 'preparing',
      preparing: 'ready',
      ready: 'completed',
    };

    if (validFlow[current] !== newStatus) {
      return res.status(400).json({ message: `Invalid transition ${current} -> ${newStatus}` });
    }

    order.status = newStatus;
    order.statusHistory.push({
      status: newStatus,
      updatedAt: new Date(),
      updatedBy: req.user?._id || null,
      note: 'Kitchen updated status',
    });

    if (newStatus === 'ready') {
      order.readyAt = new Date();

      if (!order.inventoryDeductedAt) {
        const deductionSummary = await deductStockForOrder(order, req.user?._id);
        order.inventoryDeductedAt = new Date();
        order.statusHistory.push({
          status: newStatus,
          updatedAt: new Date(),
          updatedBy: req.user?._id || null,
          note: `Inventory auto-deducted for ${deductionSummary.deducted.length} ingredient row(s)`,
        });
      }

      // Emit low stock alert after deduction
      const io = req.app.get('io');
      if (io) {
        try {
          const lowStock = await Inventory.find({
            $expr: { $lte: ['$currentStock', '$reorderLevel'] },
          });
          if (lowStock.length > 0) {
            io.emit('lowStockAlert', lowStock);
          }
        } catch (_) {}
      }
    }

    if (newStatus === 'completed') {
      order.completedAt = new Date();
    }

    await order.save();

    const io = req.app.get('io');
    if (io) {
      io.emit('orderStatusUpdated', { orderId: order._id, status: order.status });
      io.to(`order:${order._id}`).emit('order-updated', { orderId: order._id, status: order.status });
    }

    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const toggleItemAvailability = async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Menu item not found' });

    item.isAvailable = !item.isAvailable;
    await item.save();

    const io = req.app.get('io') || req.io;
    if (io) {
      io.emit('menuItemAvailabilityChanged', {
        itemId: item._id,
        name: item.name,
        isAvailable: item.isAvailable,
      });
    }

    res.json({ message: `${item.name} is now ${item.isAvailable ? 'available' : 'unavailable'}`, item });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getRecipe = async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id).populate('ingredients.inventoryItem', 'name unit');
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json({
      name: item.name,
      description: item.description,
      imageUrl: item.imageUrl,
      recipe: item.recipe,
      ingredients: item.ingredients,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const logWaste = async (req, res) => {
  try {
    const { inventoryItemId, quantity, reason } = req.body;
    if (!inventoryItemId || !quantity || !reason) {
      return res.status(400).json({ message: 'inventoryItemId, quantity, and reason are required' });
    }

    const item = await Inventory.findById(inventoryItemId);
    if (!item) return res.status(404).json({ message: 'Inventory item not found' });

    item.currentStock = Math.max(0, item.currentStock - Number(quantity));
    item.stockHistory.push({
      change: -Number(quantity),
      note: `Waste logged: ${reason}`,
      date: new Date(),
      updatedBy: req.user._id,
    });
    await item.save();

    const wasteEntry = new WasteLog({
      inventoryItem: inventoryItemId,
      quantity,
      unit: item.unit,
      reason,
      loggedBy: req.user._id,
    });
    await wasteEntry.save();

    const io = req.app.get('io') || req.io;
    if (io) {
      io.emit('wasteLogged', { item: item.name, quantity, unit: item.unit, reason });
      const lowStock = await Inventory.find({ $expr: { $lte: ['$currentStock', '$reorderLevel'] } });
      if (lowStock.length > 0) io.emit('lowStockAlert', lowStock);
    }

    res.status(201).json({ message: 'Waste logged', wasteEntry, updatedStock: item.currentStock });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getWasteLogs = async (req, res) => {
  try {
    const logs = await WasteLog.find()
      .sort({ createdAt: -1 })
      .limit(50)
      .populate('inventoryItem', 'name unit')
      .populate('loggedBy', 'name');
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getKitchenStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const completedToday = await Order.find({
      status: { $in: ['completed', 'delivered'] },
      createdAt: { $gte: today },
    });

    let totalPrepTime = 0;
    let counted = 0;
    completedToday.forEach((order) => {
      const readyAt = order.readyAt || order.updatedAt;
      if (readyAt && order.createdAt) {
        const diff = (new Date(readyAt) - new Date(order.createdAt)) / 1000 / 60;
        if (Number.isFinite(diff) && diff >= 0) {
          totalPrepTime += diff;
          counted += 1;
        }
      }
    });

    const avgPrepTime = counted > 0 ? Number((totalPrepTime / counted).toFixed(1)) : 0;
    const activeOrders = await Order.countDocuments({ status: 'preparing' });
    const pendingOrders = await Order.countDocuments({ status: { $in: ['placed', 'confirmed'] } });

    res.json({
      completedToday: completedToday.length,
      avgPrepTimeMinutes: avgPrepTime,
      currentlyPreparing: activeOrders,
      pendingOrders,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getKitchenOrders,
  getReadyOrders,
  getKitchenHistoryOrders,
  getKitchenTeamStatus,
  updateOrderStatus,
  toggleItemAvailability,
  getRecipe,
  logWaste,
  getWasteLogs,
  getKitchenStats,
};
