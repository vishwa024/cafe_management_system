const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { allowRoles } = require('../middleware/roleCheck');
const Order = require('../models/Order');
const { TableStatus } = require('../models/TableStatus');

const TABLE_SLOT_BUFFER_MINUTES = 90;
const INACTIVE_ORDER_STATUSES = ['completed', 'delivered', 'cancelled'];

const sortTables = (tables) =>
  [...tables].sort((a, b) => Number(a.number) - Number(b.number));

const parseScheduledTime = (value) => {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const getTableSlotWindow = (scheduledAt) => {
  const start = new Date(scheduledAt);
  start.setMinutes(start.getMinutes() - TABLE_SLOT_BUFFER_MINUTES);

  const end = new Date(scheduledAt);
  end.setMinutes(end.getMinutes() + TABLE_SLOT_BUFFER_MINUTES);

  return { start, end };
};

const shapeReservation = (reservation) => ({
  orderId: reservation._id,
  scheduledTime: reservation.scheduledTime || null,
  status: reservation.status,
  customerName: reservation.guestName || reservation.customer?.name || 'Customer',
  customerPhone: reservation.guestPhone || reservation.customer?.phone || '',
  guestCount: reservation.guestCount || null,
  tableNumber: reservation.tableNumber || '',
  orderType: reservation.isPreOrder ? `pre-order ${reservation.preOrderMethod || 'dine-in'}` : reservation.orderType,
});

const loadTables = async () => {
  await TableStatus.ensureDefaults();
  const tables = await TableStatus.find().lean();
  return sortTables(tables);
};

const loadTableReservations = async (tableNumbers, scheduledAt = null) => {
  const query = {
    tableNumber: { $in: tableNumbers },
    status: { $nin: INACTIVE_ORDER_STATUSES },
    $or: [
      { orderType: 'dine-in' },
      { isPreOrder: true, preOrderMethod: 'dine-in' },
    ],
  };

  if (scheduledAt) {
    const { start, end } = getTableSlotWindow(scheduledAt);
    query.scheduledTime = { $gte: start, $lte: end };
  }

  return Order.find(query)
    .select('_id tableNumber scheduledTime status guestName guestPhone guestCount customer orderType isPreOrder preOrderMethod createdAt')
    .sort({ scheduledTime: 1, createdAt: 1 })
    .populate('customer', 'name phone')
    .lean();
};

const decorateTables = async (tables, { scheduledTime } = {}) => {
  const scheduledAt = parseScheduledTime(scheduledTime);
  const tableNumbers = tables.map((table) => String(table.number));
  const reservations = await loadTableReservations(tableNumbers, scheduledAt);
  const upcomingReservations = await loadTableReservations(tableNumbers, null);
  const upcomingByTable = new Map();

  upcomingReservations.forEach((reservation) => {
    if (!reservation?.scheduledTime) return;
    const key = String(reservation.tableNumber || '');
    const current = upcomingByTable.get(key);
    if (!current || new Date(reservation.scheduledTime) < new Date(current.scheduledTime)) {
      upcomingByTable.set(key, reservation);
    }
  });

  return tables.map((table) => {
    const currentReservation = reservations.find((reservation) => String(reservation.tableNumber) === String(table.number));
    const nextReservation = upcomingByTable.get(String(table.number));
    const currentBookingBlocksSlot = Boolean(
      scheduledAt &&
      !table.isAvailable &&
      table.bookedAt &&
      (() => {
        const bookedAt = new Date(table.bookedAt);
        if (Number.isNaN(bookedAt.getTime())) return true;
        const bookingEnd = new Date(bookedAt);
        bookingEnd.setMinutes(bookingEnd.getMinutes() + TABLE_SLOT_BUFFER_MINUTES);
        return scheduledAt <= bookingEnd;
      })()
    );

    return {
      ...table,
      slotAvailable: scheduledAt
        ? !currentReservation && !currentBookingBlocksSlot
        : table.isAvailable,
      currentReservation: currentReservation ? shapeReservation(currentReservation) : null,
      nextReservation:
        nextReservation && (!currentReservation || String(nextReservation._id) !== String(currentReservation._id))
          ? shapeReservation(nextReservation)
          : null,
    };
  });
};

router.get('/statuses', async (req, res) => {
  try {
    const tables = await loadTables();
    const enrichedTables = await decorateTables(tables, { scheduledTime: req.query.scheduledTime });
    res.json({ tables: enrichedTables });
  } catch (error) {
    res.status(500).json({ message: 'Failed to load table statuses' });
  }
});

router.post('/:number/book', async (req, res) => {
  try {
    const { customerName, customerPhone = '', guestCount } = req.body;
    const tableNumber = String(req.params.number || '').trim();

    if (!customerName?.trim()) {
      return res.status(400).json({ message: 'Customer name is required' });
    }

    if (!guestCount || Number(guestCount) < 1) {
      return res.status(400).json({ message: 'Guest count is required' });
    }

    await TableStatus.ensureDefaults();
    const table = await TableStatus.findOne({ number: tableNumber });

    if (!table) {
      return res.status(404).json({ message: 'Table not found' });
    }

    if (!table.isAvailable) {
      return res.status(409).json({ message: `Table ${tableNumber} is already booked` });
    }

    table.isAvailable = false;
    table.bookedBy = customerName.trim();
    table.bookedPhone = customerPhone?.trim?.() || null;
    table.bookedGuests = Number(guestCount);
    table.bookedAt = new Date();
    await table.save();

    const tables = await loadTables();
    res.json({
      message: `Table ${tableNumber} booked successfully`,
      table,
      tables,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to book table' });
  }
});

router.patch('/:number/release', protect, allowRoles('staff', 'admin', 'manager'), async (req, res) => {
  try {
    const tableNumber = String(req.params.number || '').trim();

    await TableStatus.ensureDefaults();
    const table = await TableStatus.findOne({ number: tableNumber });

    if (!table) {
      return res.status(404).json({ message: 'Table not found' });
    }

    table.isAvailable = true;
    table.bookedBy = null;
    table.bookedPhone = null;
    table.bookedGuests = null;
    table.bookedAt = null;
    await table.save();

    const tables = await loadTables();
    res.json({
      message: `Table ${tableNumber} is available now`,
      table,
      tables,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to release table' });
  }
});

module.exports = router;
