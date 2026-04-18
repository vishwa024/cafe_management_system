import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
  CalendarDays,
  CreditCard,
  Minus,
  Plus,
  Printer,
  Receipt,
  RefreshCw,
  Search,
  ShoppingBag,
  Table2,
  Trash2,
  UtensilsCrossed,
  Wallet,
  XCircle,
  CheckCircle,
  Users,
  Clock
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';

const PAYMENT_OPTIONS = [
  { value: 'cash', label: 'Cash', icon: Wallet, color: 'bg-emerald-100 text-emerald-700' },
  { value: 'card', label: 'Card / UPI', icon: CreditCard, color: 'bg-blue-100 text-blue-700' },
];

const ORDER_TYPES = [
  { value: 'takeaway', label: 'Takeaway', icon: ShoppingBag, color: 'bg-violet-100 text-violet-700' },
  { value: 'dine-in', label: 'Dine-In', icon: Table2, color: 'bg-emerald-100 text-emerald-700' },
  { value: 'pre-order', label: 'Pre-Order', icon: CalendarDays, color: 'bg-orange-100 text-orange-700' },
];

function fallbackImage() {
  return 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=80';
}

function buildKey(itemId, variant) {
  return `${itemId}-${variant || 'base'}`;
}

function formatDateTime(value) {
  return value ? new Date(value).toLocaleString() : 'Not scheduled';
}

function openReceipt(order) {
  const receiptWindow = window.open('', '_blank', 'width=760,height=900');
  if (!receiptWindow) {
    toast.error('Allow popups to print the receipt');
    return;
  }

  const rows = (order.items || [])
    .map((item) => `
      <tr>
        <td style="padding:8px 0;border-bottom:1px solid #eee;">${item.name}</td>
        <td style="padding:8px 0;border-bottom:1px solid #eee;text-align:center;">${item.quantity}</td>
        <td style="padding:8px 0;border-bottom:1px solid #eee;text-align:right;">Rs. ${item.totalPrice}</td>
       </tr>
    `)
    .join('');

  receiptWindow.document.write(`
    <html>
      <head>
        <title>Receipt ${order.orderId}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 28px; color: #2d2722; }
          h1, h2, p { margin: 0; }
          .top { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom: 20px; }
          .muted { color:#74695e; font-size: 12px; }
          table { width:100%; border-collapse: collapse; margin-top: 18px; }
          .totals { margin-top:18px; width:100%; max-width:280px; margin-left:auto; }
          .totals div { display:flex; justify-content:space-between; padding:6px 0; }
          .total { font-weight:bold; font-size:18px; border-top:1px solid #ddd; margin-top:6px; padding-top:10px; }
          .chip { display:inline-block; padding:6px 10px; border-radius:999px; background:#f3e4d4; color:#8e5b33; font-size:12px; font-weight:bold; }
        </style>
      </head>
      <body>
        <div class="top">
          <div>
            <h1>Roller Coaster Cafe</h1>
            <p class="muted">POS Counter Receipt</p>
          </div>
          <div style="text-align:right;">
            <div class="chip">${order.orderType}</div>
            <p style="margin-top:10px;font-weight:bold;">#${order.orderId}</p>
            <p class="muted">${new Date(order.createdAt).toLocaleString()}</p>
          </div>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px;">
          <div><p class="muted">Guest</p><p>${order.guestName || 'Walk-In Guest'}</p></div>
          <div><p class="muted">Phone</p><p>${order.guestPhone || '-'}</p></div>
          <div><p class="muted">Table / Token</p><p>${order.tableNumber || '-'}</p></div>
          <div><p class="muted">Payment</p><p>${order.paymentMethod}</p></div>
        </div>

        <table>
          <thead>
            <tr><th style="text-align:left;">Item</th><th>Qty</th><th style="text-align:right;">Amount</th></tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>

        <div class="totals">
          <div><span>Subtotal</span><span>Rs. ${order.subtotal}</span></div>
          <div><span>GST</span><span>Rs. ${order.taxAmount || 0}</span></div>
          ${order.preOrderFee ? `<div><span>Pre-order fee</span><span>Rs. ${order.preOrderFee}</span></div>` : ''}
          <div class="total"><span>Total</span><span>Rs. ${order.totalAmount}</span></div>
        </div>
        ${order.specialNotes ? `<p style="margin-top:18px;"><strong>Notes:</strong> ${order.specialNotes}</p>` : ''}
      </body>
    </html>
  `);
  receiptWindow.document.close();
  receiptWindow.focus();
  receiptWindow.print();
}

export default function POSMode() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [orderType, setOrderType] = useState('takeaway');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [tableNumber, setTableNumber] = useState('');
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [ticketItems, setTicketItems] = useState([]);

  const { data: menuItems = [], isLoading, refetch } = useQuery({
    queryKey: ['staff-pos-menu'],
    queryFn: () => api.get('/menu').then((res) => res.data),
  });

  const { data: orderFeed } = useQuery({
    queryKey: ['staff-pos-orders'],
    queryFn: () => api.get('/orders', { params: { limit: 10 } }).then((res) => res.data),
    refetchInterval: 15000,
  });

  const recentPOSOrders = useMemo(() => {
    return (orderFeed?.orders || [])
      .filter((order) => order.source === 'staff-pos')
      .slice(0, 6);
  }, [orderFeed?.orders]);

  const categories = useMemo(() => {
    const names = menuItems.map((item) => item.category?.name).filter(Boolean);
    return ['All', ...new Set(names)];
  }, [menuItems]);

  const visibleMenu = useMemo(() => {
    const query = search.trim().toLowerCase();
    return menuItems.filter((item) => {
      if (item.isArchived) return false;
      if (selectedCategory !== 'All' && item.category?.name !== selectedCategory) return false;
      if (!query) return true;
      return (
        item.name?.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query) ||
        item.category?.name?.toLowerCase().includes(query)
      );
    });
  }, [menuItems, search, selectedCategory]);

  const addToTicket = (item) => {
    const key = buildKey(item._id);
    setTicketItems((prev) => {
      const existing = prev.find((entry) => entry.key === key);
      if (existing) {
        return prev.map((entry) => entry.key === key ? { ...entry, quantity: entry.quantity + 1 } : entry);
      }
      return [...prev, { key, menuItemId: item._id, name: item.name, basePrice: item.basePrice, quantity: 1 }];
    });
    toast.success(`${item.name} added`);
  };

  const updateQuantity = (key, nextQuantity) => {
    setTicketItems((prev) => {
      if (nextQuantity <= 0) return prev.filter((item) => item.key !== key);
      return prev.map((item) => item.key === key ? { ...item, quantity: nextQuantity } : item);
    });
  };

  const removeItem = (key) => setTicketItems((prev) => prev.filter((item) => item.key !== key));

  const subtotal = ticketItems.reduce((sum, item) => sum + item.basePrice * item.quantity, 0);
  const tax = Math.round(subtotal * 0.05);
  const preOrderFee = orderType === 'pre-order' ? 49 : 0;
  const total = subtotal + tax + preOrderFee;

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem('staffPosDraft');
      if (!raw) return;
      const draft = JSON.parse(raw);
      setOrderType(draft.orderType || 'takeaway');
      setPaymentMethod(draft.paymentMethod || 'cash');
      setTableNumber(draft.tableNumber || '');
      setGuestName(draft.guestName || '');
      setGuestPhone(draft.guestPhone || '');
      setNotes(draft.notes || '');
      setScheduledTime(draft.scheduledTime || '');
      setTicketItems(draft.ticketItems || []);
    } catch { }
  }, []);

  const submitMutation = useMutation({
    mutationFn: () => api.post('/orders/pos', {
      items: ticketItems.map((item) => ({ menuItemId: item.menuItemId, quantity: item.quantity })),
      orderType, paymentMethod, guestName, guestPhone, tableNumber, notes,
      scheduledTime: orderType === 'pre-order' ? scheduledTime : undefined,
    }),
    onSuccess: ({ data }) => {
      queryClient.invalidateQueries({ queryKey: ['staff-orders'] });
      queryClient.invalidateQueries({ queryKey: ['staff-preorders'] });
      queryClient.invalidateQueries({ queryKey: ['staff-pos-orders'] });
      toast.success(`Order #${data.order.orderId} created`);
      openReceipt(data.order);
      clearTicket(true, true);
    },
    onError: (error) => toast.error(error.response?.data?.message || 'Could not create order'),
  });

  const cancelMutation = useMutation({
    mutationFn: ({ orderId, reason }) => api.post(`/orders/${orderId}/cancel`, { reason }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff-orders'] });
      queryClient.invalidateQueries({ queryKey: ['staff-preorders'] });
      queryClient.invalidateQueries({ queryKey: ['staff-pos-orders'] });
      toast.success('Order cancelled');
    },
    onError: (error) => toast.error(error.response?.data?.message || 'Could not cancel order'),
  });

  const saveDraft = () => {
    const draft = { orderType, paymentMethod, tableNumber, guestName, guestPhone, notes, scheduledTime, ticketItems };
    localStorage.setItem('staffPosDraft', JSON.stringify(draft));
    toast.success('Draft saved');
  };

  const clearTicket = (clearSavedDraft = false, silent = false) => {
    setTicketItems([]);
    setNotes('');
    setGuestName('');
    setGuestPhone('');
    setTableNumber('');
    setScheduledTime('');
    if (clearSavedDraft) localStorage.removeItem('staffPosDraft');
    if (!silent) toast.success('Ticket cleared');
  };

  const submitPOSOrder = () => {
    if (!ticketItems.length) return toast.error('Add items first');
    if (orderType === 'dine-in' && !tableNumber.trim()) return toast.error('Enter table number');
    if (orderType === 'pre-order' && !scheduledTime) return toast.error('Select scheduled time');
    submitMutation.mutate();
  };

  return (
    <div className="min-h-screen bg-[#faf8f5]">
      {/* Header */}
      <header className="bg-white border-b border-[#e8e0d6] sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="font-display text-2xl font-bold text-[#3f3328]">POS Mode</h1>
              <p className="text-sm text-[#6b5f54]">Counter order management</p>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/staff" className="inline-flex items-center gap-2 rounded-lg border border-[#e8e0d6] bg-white px-4 py-2 text-sm font-medium text-[#6b5f54] hover:border-[#b97844] hover:text-[#b97844] transition-all">
                Back to Dashboard
              </Link>
              <button onClick={() => refetch()} className="p-2 rounded-lg border border-[#e8e0d6] bg-white hover:bg-[#faf8f5] transition-all">
                <RefreshCw size={16} className="text-[#6b5f54]" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left Column - Menu */}
          <div className="bg-white border border-[#e8e0d6] rounded-xl p-5">
            {/* Order Type Selection */}
            <div className="flex gap-3 mb-5">
              {ORDER_TYPES.map(({ value, label, icon: Icon, color }) => (
                <button
                  key={value}
                  onClick={() => setOrderType(value)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-all ${
                    orderType === value ? `${color} border-2 border-current` : 'bg-[#faf8f5] text-[#6b5f54] hover:bg-[#e8e0d6]'
                  }`}
                >
                  <Icon size={16} /> {label}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative mb-4">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a0968c]" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search menu..."
                className="w-full rounded-lg border border-[#e8e0d6] pl-9 pr-4 py-2 text-sm focus:border-[#b97844] focus:outline-none"
              />
            </div>

            {/* Categories */}
            <div className="flex gap-2 overflow-x-auto pb-3 mb-4">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                    selectedCategory === cat ? 'bg-[#b97844] text-white' : 'bg-[#faf8f5] text-[#6b5f54] hover:bg-[#e8e0d6]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Menu Grid */}
            <div className="grid grid-cols-2 gap-3 max-h-[500px] overflow-y-auto">
              {visibleMenu.map((item) => (
                <div key={item._id} className="border border-[#e8e0d6] rounded-xl overflow-hidden hover:shadow-md transition-all">
                  <div className="h-32 overflow-hidden">
                    <img src={item.image || fallbackImage()} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-3">
                    <p className="text-xs text-[#b97844] font-medium">{item.category?.name || 'Item'}</p>
                    <h3 className="font-semibold text-[#3f3328] text-sm mt-1 line-clamp-1">{item.name}</h3>
                    <p className="text-lg font-bold text-[#3f3328] mt-2">₹{item.basePrice}</p>
                    <button onClick={() => addToTicket(item)} className="w-full mt-3 py-1.5 rounded-lg bg-[#b97844] text-white text-sm font-medium hover:bg-[#9e6538] transition-all">
                      Add to Bill
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Ticket */}
          <div className="space-y-6">
            {/* Order Ticket */}
            <div className="bg-white border border-[#e8e0d6] rounded-xl p-5">
              <h2 className="font-semibold text-lg text-[#3f3328] mb-4 flex items-center gap-2">
                <Receipt size={18} className="text-[#b97844]" /> Current Ticket
              </h2>

              {/* Guest Details */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <input value={guestName} onChange={(e) => setGuestName(e.target.value)} placeholder="Guest name" className="rounded-lg border border-[#e8e0d6] p-2 text-sm focus:border-[#b97844] focus:outline-none" />
                <input value={guestPhone} onChange={(e) => setGuestPhone(e.target.value)} placeholder="Phone" className="rounded-lg border border-[#e8e0d6] p-2 text-sm focus:border-[#b97844] focus:outline-none" />
              </div>

              {/* Order Type Specific Fields */}
              {orderType === 'dine-in' && (
                <input value={tableNumber} onChange={(e) => setTableNumber(e.target.value)} placeholder="Table number" className="w-full rounded-lg border border-[#e8e0d6] p-2 text-sm mb-4 focus:border-[#b97844] focus:outline-none" />
              )}
              {orderType === 'pre-order' && (
                <input type="datetime-local" value={scheduledTime} onChange={(e) => setScheduledTime(e.target.value)} className="w-full rounded-lg border border-[#e8e0d6] p-2 text-sm mb-4 focus:border-[#b97844] focus:outline-none" />
              )}

              {/* Ticket Items */}
              <div className="max-h-64 overflow-y-auto space-y-2 mb-4">
                {ticketItems.length === 0 ? (
                  <p className="text-center text-[#a0968c] py-8">Add items to start billing</p>
                ) : (
                  ticketItems.map((item) => (
                    <div key={item.key} className="flex items-center justify-between p-2 bg-[#faf8f5] rounded-lg">
                      <div>
                        <p className="font-medium text-[#3f3328]">{item.name}</p>
                        <p className="text-xs text-[#6b5f54]">₹{item.basePrice} each</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <button onClick={() => updateQuantity(item.key, item.quantity - 1)} className="w-6 h-6 rounded-full bg-white border border-[#e8e0d6] flex items-center justify-center"><Minus size={12} /></button>
                          <span className="w-6 text-center font-medium">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.key, item.quantity + 1)} className="w-6 h-6 rounded-full bg-[#b97844] text-white flex items-center justify-center"><Plus size={12} /></button>
                        </div>
                        <button onClick={() => removeItem(item.key)} className="text-red-500"><Trash2 size={14} /></button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Payment Methods */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                {PAYMENT_OPTIONS.map(({ value, label, icon: Icon, color }) => (
                  <button
                    key={value}
                    onClick={() => setPaymentMethod(value)}
                    className={`flex items-center justify-center gap-2 py-2 rounded-lg font-medium transition-all ${
                      paymentMethod === value ? `${color} border` : 'bg-[#faf8f5] text-[#6b5f54] hover:bg-[#e8e0d6]'
                    }`}
                  >
                    <Icon size={14} /> {label}
                  </button>
                ))}
              </div>

              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Special instructions..." className="w-full rounded-lg border border-[#e8e0d6] p-2 text-sm mb-4 resize-none focus:border-[#b97844] focus:outline-none" rows={2} />

              {/* Totals */}
              <div className="border-t border-[#e8e0d6] pt-3 space-y-1 text-sm">
                <div className="flex justify-between"><span className="text-[#6b5f54]">Subtotal</span><span>₹{subtotal}</span></div>
                <div className="flex justify-between"><span className="text-[#6b5f54]">GST</span><span>₹{tax}</span></div>
                {preOrderFee > 0 && <div className="flex justify-between"><span className="text-[#6b5f54]">Pre-order fee</span><span>₹{preOrderFee}</span></div>}
                <div className="flex justify-between font-bold text-lg pt-2"><span>Total</span><span className="text-[#b97844]">₹{total}</span></div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 mt-4">
                <button onClick={saveDraft} className="flex-1 py-2 rounded-lg border border-[#e8e0d6] text-[#6b5f54] hover:border-[#b97844] hover:text-[#b97844] transition-all">Save Draft</button>
                <button onClick={() => clearTicket(false, false)} className="flex-1 py-2 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition-all">Clear</button>
                <button onClick={submitPOSOrder} disabled={submitMutation.isPending || !ticketItems.length} className="flex-1 py-2 rounded-lg bg-[#b97844] text-white font-medium hover:bg-[#9e6538] disabled:opacity-50 transition-all">
                  {submitMutation.isPending ? 'Creating...' : 'Create Order'}
                </button>
              </div>
            </div>

            {/* Recent POS Orders */}
            <div className="bg-white border border-[#e8e0d6] rounded-xl p-5">
              <h3 className="font-semibold text-[#3f3328] mb-3 flex items-center gap-2"><Clock size={16} className="text-[#b97844]" /> Recent Orders</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {recentPOSOrders.map((order) => (
                  <div key={order._id} className="flex items-center justify-between p-3 bg-[#faf8f5] rounded-lg">
                    <div>
                      <p className="font-mono text-sm font-medium">#{order.orderId}</p>
                      <p className="text-xs text-[#6b5f54]">{order.guestName || 'Guest'} • {order.items?.length} items</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">₹{order.totalAmount}</p>
                      <button onClick={() => openReceipt(order)} className="text-xs text-[#b97844] hover:underline">Print</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}