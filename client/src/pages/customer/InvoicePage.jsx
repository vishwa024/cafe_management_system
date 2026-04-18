// // // import { useQuery } from '@tanstack/react-query';
// // // import { Link, useParams } from 'react-router-dom';
// // // import { ArrowLeft, Download, FileText, Star } from 'lucide-react';
// // // import api from '../../services/api';
// // // import CustomerFooter from '../../components/customer/CustomerFooter';

// // // export default function InvoicePage() {
// // //   const { orderId } = useParams();

// // //   const { data: order, isLoading, error } = useQuery({
// // //     queryKey: ['invoice-order', orderId],
// // //     queryFn: async () => {
// // //       const res = await api.get(`/orders/${orderId}`);
// // //       return res.data;
// // //     },
// // //     enabled: Boolean(orderId),
// // //   });

// // //   const formatAmount = (value) => `Rs.${Number(value || 0).toFixed(2)}`;
// // //   const formatDate = (value) =>
// // //     new Date(value).toLocaleString('en-IN', {
// // //       day: '2-digit',
// // //       month: '2-digit',
// // //       year: 'numeric',
// // //       hour: '2-digit',
// // //       minute: '2-digit',
// // //       hour12: false,
// // //     });

// // //   const downloadPdf = async () => {
// // //     try {
// // //       const response = await api.get(`/orders/${orderId}/invoice`, { responseType: 'blob' });
// // //       const blobUrl = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
// // //       const link = document.createElement('a');
// // //       link.href = blobUrl;
// // //       link.download = `invoice-${order?.orderId || orderId}.pdf`;
// // //       document.body.appendChild(link);
// // //       link.click();
// // //       link.remove();
// // //       window.URL.revokeObjectURL(blobUrl);
// // //     } catch (err) {
// // //       alert(err.response?.data?.message || 'Invoice is not available yet.');
// // //     }
// // //   };

// // //   return (
// // //     <div className="min-h-screen bg-[#faf5ef]">
// // //       <header className="border-b border-[#e8dccd] bg-white/95 backdrop-blur sticky top-0 z-20">
// // //         <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
// // //           <Link to="/orders" className="inline-flex items-center gap-2 text-sm font-medium text-[#9a6331] hover:text-[#7f4d24]">
// // //             <ArrowLeft size={16} />
// // //             Back to orders
// // //           </Link>
// // //           <div className="text-right">
// // //             <p className="text-xs uppercase tracking-[0.28em] text-[#b78a5f]">Invoice Ready</p>
// // //             <p className="text-sm text-[#6d5847]">Roller Coaster Cafe</p>
// // //           </div>
// // //         </div>
// // //       </header>

// // //       <main className="max-w-5xl mx-auto px-4 py-8">
// // //         {isLoading ? (
// // //           <div className="rounded-[28px] border border-[#eadfce] bg-white p-10 text-center text-[#7b6858]">Loading your invoice...</div>
// // //         ) : error || !order ? (
// // //           <div className="rounded-[28px] border border-[#eadfce] bg-white p-10 text-center">
// // //             <h1 className="text-2xl font-semibold text-[#3e2f23]">Invoice not available</h1>
// // //             <p className="mt-2 text-[#7b6858]">We could not load this invoice right now.</p>
// // //           </div>
// // //         ) : (
// // //           <div className="space-y-6">
// // //             <section className="rounded-[32px] border border-[#eadfce] bg-white p-8 shadow-[0_20px_60px_rgba(80,52,28,0.08)]">
// // //               <div className="flex flex-wrap items-start justify-between gap-6">
// // //                 <div className="max-w-2xl">
// // //                   <p className="text-sm text-[#6b5846]">Dear Customer,</p>
// // //                   <h1 className="mt-2 text-3xl font-semibold text-[#2e241d]">Your invoice is now available.</h1>
// // //                   <p className="mt-4 text-lg leading-8 text-[#5d4c3d]">
// // //                     Thank you for your recent order at Roller Coaster Cafe. Your bill has been prepared and you can
// // //                     view or download it anytime from this page.
// // //                   </p>
// // //                   <div className="mt-6 grid gap-4 sm:grid-cols-3">
// // //                     <div className="rounded-2xl border border-[#efe4d5] bg-[#fcf8f2] px-5 py-4">
// // //                       <p className="text-xs uppercase tracking-[0.24em] text-[#aa7a4d]">Amount</p>
// // //                       <p className="mt-2 text-xl font-semibold text-[#2e241d]">{formatAmount(order.totalAmount)}</p>
// // //                     </div>
// // //                     <div className="rounded-2xl border border-[#efe4d5] bg-[#fcf8f2] px-5 py-4">
// // //                       <p className="text-xs uppercase tracking-[0.24em] text-[#aa7a4d]">Date</p>
// // //                       <p className="mt-2 text-base font-medium text-[#2e241d]">{formatDate(order.createdAt)}</p>
// // //                     </div>
// // //                     <div className="rounded-2xl border border-[#efe4d5] bg-[#fcf8f2] px-5 py-4">
// // //                       <p className="text-xs uppercase tracking-[0.24em] text-[#aa7a4d]">Invoice</p>
// // //                       <p className="mt-2 text-base font-medium text-[#2e241d]">{order.invoiceNumber || order.orderId}</p>
// // //                     </div>
// // //                   </div>
// // //                 </div>

// // //                 <div className="w-full max-w-sm rounded-[28px] border border-[#eadfce] bg-[#fffaf4] p-6">
// // //                   <div className="flex items-center gap-3">
// // //                     <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f4e3cf] text-[#9a6331]">
// // //                       <FileText size={20} />
// // //                     </div>
// // //                     <div>
// // //                       <p className="text-sm font-medium text-[#2e241d]">View Invoice</p>
// // //                       <p className="text-sm text-[#7b6858]">Open the bill as PDF</p>
// // //                     </div>
// // //                   </div>
// // //                   <button
// // //                     type="button"
// // //                     onClick={downloadPdf}
// // //                     className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#d07b34] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#b96827]"
// // //                   >
// // //                     <Download size={16} />
// // //                     Download Invoice PDF
// // //                   </button>
// // //                   <p className="mt-4 text-xs leading-6 text-[#8a7563] break-all">
// // //                     View Invoice: {window.location.origin}/invoice/{order._id}
// // //                   </p>
// // //                 </div>
// // //               </div>
// // //             </section>

// // //             <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
// // //               <div className="rounded-[28px] border border-[#eadfce] bg-white p-8">
// // //                 <h2 className="text-2xl font-semibold text-[#2e241d]">E-Bill</h2>
// // //                 <p className="mt-1 text-sm text-[#7b6858]">Roller Coaster Cafe</p>
// // //                 <div className="mt-6 overflow-hidden rounded-3xl border border-[#efe4d5]">
// // //                   <table className="w-full text-left">
// // //                     <thead className="bg-[#fcf8f2] text-sm text-[#9a6331]">
// // //                       <tr>
// // //                         <th className="px-5 py-4 font-medium">Item</th>
// // //                         <th className="px-5 py-4 font-medium">Qty</th>
// // //                         <th className="px-5 py-4 font-medium">Rate</th>
// // //                         <th className="px-5 py-4 font-medium">Price</th>
// // //                       </tr>
// // //                     </thead>
// // //                     <tbody className="divide-y divide-[#f0e7db] text-[#3d3026]">
// // //                       {(order.items || []).map((item, index) => (
// // //                         <tr key={`${item._id || item.name}-${index}`}>
// // //                           <td className="px-5 py-4">{item.name}</td>
// // //                           <td className="px-5 py-4">{item.quantity}</td>
// // //                           <td className="px-5 py-4">{formatAmount(item.price)}</td>
// // //                           <td className="px-5 py-4">{formatAmount((item.price || 0) * (item.quantity || 0))}</td>
// // //                         </tr>
// // //                       ))}
// // //                     </tbody>
// // //                   </table>
// // //                 </div>
// // //               </div>

// // //               <div className="space-y-6">
// // //                 <section className="rounded-[28px] border border-[#eadfce] bg-white p-6">
// // //                   <h3 className="text-lg font-semibold text-[#2e241d]">Order details</h3>
// // //                   <div className="mt-4 space-y-3 text-sm text-[#5d4c3d]">
// // //                     <div className="flex justify-between gap-4"><span>Order Number</span><span className="font-medium text-[#2e241d]">{order.orderId}</span></div>
// // //                     <div className="flex justify-between gap-4"><span>Order Type</span><span className="font-medium capitalize text-[#2e241d]">{order.orderType}</span></div>
// // //                     <div className="flex justify-between gap-4"><span>Payment</span><span className="font-medium capitalize text-[#2e241d]">{order.paymentMethod}</span></div>
// // //                     <div className="flex justify-between gap-4"><span>Status</span><span className="font-medium capitalize text-[#2e241d]">{order.status}</span></div>
// // //                   </div>
// // //                 </section>

// // //                 <section className="rounded-[28px] border border-[#eadfce] bg-white p-6">
// // //                   <h3 className="text-lg font-semibold text-[#2e241d]">Bill Summary</h3>
// // //                   <div className="mt-4 space-y-3 text-sm text-[#5d4c3d]">
// // //                     <div className="flex justify-between gap-4"><span>Subtotal</span><span>{formatAmount(order.subtotal || order.totalAmount)}</span></div>
// // //                     <div className="flex justify-between gap-4"><span>GST</span><span>{formatAmount(order.taxAmount || 0)}</span></div>
// // //                     {!!order.deliveryFee && <div className="flex justify-between gap-4"><span>Delivery Fee</span><span>{formatAmount(order.deliveryFee)}</span></div>}
// // //                     {!!order.preOrderFee && <div className="flex justify-between gap-4"><span>Pre-order Fee</span><span>{formatAmount(order.preOrderFee)}</span></div>}
// // //                     <div className="flex justify-between gap-4 border-t border-[#efe4d5] pt-3 text-base font-semibold text-[#2e241d]">
// // //                       <span>Total</span>
// // //                       <span>{formatAmount(order.totalAmount)}</span>
// // //                     </div>
// // //                   </div>
// // //                 </section>

// // //                 <section className="rounded-[28px] border border-[#eadfce] bg-white p-6">
// // //                   <div className="flex items-start gap-3">
// // //                     <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-2xl bg-[#fdf0e4] text-[#d07b34]">
// // //                       <Star size={18} />
// // //                     </div>
// // //                     <div>
// // //                       <h3 className="text-lg font-semibold text-[#2e241d]">How was your experience?</h3>
// // //                       <p className="mt-1 text-sm leading-6 text-[#7b6858]">Tell us how your order went today.</p>
// // //                       <Link
// // //                         to={`/menu/item/${order.items?.[0]?.menuItem?._id || order.items?.[0]?.menuItem || ''}`}
// // //                         className="mt-4 inline-flex rounded-full border border-[#d8c3af] px-4 py-2 text-sm font-medium text-[#9a6331] transition hover:border-[#b97844] hover:text-[#7f4d24]"
// // //                       >
// // //                         Leave a review
// // //                       </Link>
// // //                     </div>
// // //                   </div>
// // //                 </section>
// // //               </div>
// // //             </section>
// // //           </div>
// // //         )}
// // //       </main>

// // //       <CustomerFooter />
// // //     </div>
// // //   );
// // // }

// // import { useQuery } from '@tanstack/react-query';
// // import { Link, useParams } from 'react-router-dom';
// // import { ArrowLeft, Download, FileText, Star, Printer, Home, Phone, Mail, MapPin } from 'lucide-react';
// // import api from '../../services/api';
// // import CustomerFooter from '../../components/customer/CustomerFooter';
// // import { useRef } from 'react';

// // export default function InvoicePage() {
// //   const { orderId } = useParams();
// //   const invoiceRef = useRef();

// //   const { data: order, isLoading, error } = useQuery({
// //     queryKey: ['invoice-order', orderId],
// //     queryFn: async () => {
// //       const res = await api.get(`/orders/${orderId}`);
// //       return res.data;
// //     },
// //     enabled: Boolean(orderId),
// //   });

// //   const formatAmount = (value) => `₹${Number(value || 0).toLocaleString('en-IN')}`;
// //   const formatDate = (value) =>
// //     new Date(value).toLocaleString('en-IN', {
// //       day: '2-digit',
// //       month: '2-digit',
// //       year: 'numeric',
// //       hour: '2-digit',
// //       minute: '2-digit',
// //     });

// //   const downloadPdf = async () => {
// //     try {
// //       const response = await api.get(`/orders/${orderId}/invoice`, { responseType: 'blob' });
// //       const blobUrl = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
// //       const link = document.createElement('a');
// //       link.href = blobUrl;
// //       link.download = `invoice-${order?.orderId || orderId}.pdf`;
// //       document.body.appendChild(link);
// //       link.click();
// //       link.remove();
// //       window.URL.revokeObjectURL(blobUrl);
// //     } catch (err) {
// //       alert(err.response?.data?.message || 'Invoice is not available yet.');
// //     }
// //   };

// //   const printInvoice = () => {
// //     const printContent = invoiceRef.current;
// //     const originalContent = document.body.innerHTML;
// //     document.body.innerHTML = printContent.innerHTML;
// //     window.print();
// //     document.body.innerHTML = originalContent;
// //     window.location.reload();
// //   };

// //   return (
// //     <div className="min-h-screen bg-[#f5f0eb]">
// //       <header className="border-b border-[#e0d5c8] bg-white/95 backdrop-blur sticky top-0 z-20">
// //         <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
// //           <Link to="/orders" className="inline-flex items-center gap-2 text-sm font-medium text-[#b97844] hover:text-[#9e6538]">
// //             <ArrowLeft size={16} />
// //             Back to orders
// //           </Link>
// //           <div className="flex gap-2">
// //             <button
// //               onClick={printInvoice}
// //               className="inline-flex items-center gap-2 rounded-full border border-[#e0d5c8] px-4 py-2 text-sm font-medium text-[#6b5f54] hover:bg-[#faf8f5] transition-all"
// //             >
// //               <Printer size={16} />
// //               Print
// //             </button>
// //             <button
// //               onClick={downloadPdf}
// //               className="inline-flex items-center gap-2 rounded-full bg-[#b97844] px-4 py-2 text-sm font-semibold text-white hover:bg-[#9e6538] transition-all"
// //             >
// //               <Download size={16} />
// //               Download PDF
// //             </button>
// //           </div>
// //         </div>
// //       </header>

// //       <main className="max-w-5xl mx-auto px-4 py-8">
// //         {isLoading ? (
// //           <div className="rounded-xl border border-[#e0d5c8] bg-white p-10 text-center">Loading your invoice...</div>
// //         ) : error || !order ? (
// //           <div className="rounded-xl border border-[#e0d5c8] bg-white p-10 text-center">
// //             <h1 className="text-2xl font-semibold text-[#3f3328]">Invoice not available</h1>
// //             <p className="mt-2 text-[#6b5f54]">We could not load this invoice right now.</p>
// //           </div>
// //         ) : (
// //           <div className="space-y-6">
// //             {/* Invoice Card */}
// //             <div ref={invoiceRef} className="bg-white rounded-xl shadow-lg overflow-hidden">
// //               {/* Header */}
// //               <div className="bg-gradient-to-r from-[#3f3328] to-[#5a4a3a] p-6 text-white">
// //                 <div className="flex justify-between items-start">
// //                   <div>
// //                     <img 
// //                       src="https://rollercoastercafe.com/assets/images/roller_logo.png" 
// //                       alt="Roller Coaster Cafe"
// //                       className="h-12 w-12 rounded-full bg-white p-1 mb-3"
// //                     />
// //                     <h1 className="text-2xl font-bold">Roller Coaster Cafe</h1>
// //                     <p className="text-white/70 text-sm mt-1">TAX INVOICE</p>
// //                   </div>
// //                   <div className="text-right">
// //                     <p className="text-sm text-white/70">Invoice #</p>
// //                     <p className="text-xl font-semibold">{order.invoiceNumber || order.orderId}</p>
// //                     <p className="text-xs text-white/50 mt-1">Date: {formatDate(order.createdAt)}</p>
// //                   </div>
// //                 </div>
// //               </div>

// //               {/* Bill To Section */}
// //               <div className="p-6 border-b border-[#e8e0d6] bg-[#faf8f5]">
// //                 <div className="grid md:grid-cols-2 gap-4">
// //                   <div>
// //                     <h3 className="text-sm font-semibold text-[#3f3328] uppercase tracking-wide">Bill To</h3>
// //                     <p className="text-[#6b5f54] mt-2">
// //                       {order.deliveryAddress?.name || 'Customer'}<br />
// //                       {order.deliveryAddress?.text || 'Address not available'}<br />
// //                       {order.deliveryAddress?.phone && <span>Phone: {order.deliveryAddress.phone}</span>}
// //                     </p>
// //                   </div>
// //                   <div>
// //                     <h3 className="text-sm font-semibold text-[#3f3328] uppercase tracking-wide">Order Details</h3>
// //                     <div className="mt-2 space-y-1 text-sm text-[#6b5f54]">
// //                       <p>Order ID: {order.orderId}</p>
// //                       <p className="capitalize">Order Type: {order.orderType}</p>
// //                       <p className="capitalize">Payment: {order.paymentMethod}</p>
// //                       <p className="capitalize">Status: {order.status}</p>
// //                     </div>
// //                   </div>
// //                 </div>
// //               </div>

// //               {/* Items Table */}
// //               <div className="p-6">
// //                 <table className="w-full">
// //                   <thead>
// //                     <tr className="border-b-2 border-[#e8e0d6]">
// //                       <th className="text-left py-3 text-sm font-semibold text-[#3f3328]">#</th>
// //                       <th className="text-left py-3 text-sm font-semibold text-[#3f3328]">Item Description</th>
// //                       <th className="text-center py-3 text-sm font-semibold text-[#3f3328]">Quantity</th>
// //                       <th className="text-right py-3 text-sm font-semibold text-[#3f3328]">Unit Price</th>
// //                       <th className="text-right py-3 text-sm font-semibold text-[#3f3328]">Total</th>
// //                     </tr>
// //                   </thead>
// //                   <tbody>
// //                     {(order.items || []).map((item, index) => (
// //                       <tr key={index} className="border-b border-[#f0e8e0]">
// //                         <td className="py-3 text-sm text-[#6b5f54]">{index + 1}</td>
// //                         <td className="py-3">
// //                           <p className="text-sm font-medium text-[#3f3328]">{item.name}</p>
// //                           {item.variant && <p className="text-xs text-[#a0968c]">{item.variant}</p>}
// //                           {item.addons?.length > 0 && (
// //                             <p className="text-xs text-[#a0968c]">+ {item.addons.join(', ')}</p>
// //                           )}
// //                         </td>
// //                         <td className="py-3 text-sm text-[#6b5f54] text-center">{item.quantity}</td>
// //                         <td className="py-3 text-sm text-[#6b5f54] text-right">{formatAmount(item.price || item.unitPrice)}</td>
// //                         <td className="py-3 text-sm font-medium text-[#3f3328] text-right">
// //                           {formatAmount((item.price || item.unitPrice || 0) * (item.quantity || 0))}
// //                         </td>
// //                       </tr>
// //                     ))}
// //                   </tbody>
// //                 </table>
// //               </div>

// //               {/* Summary Section */}
// //               <div className="p-6 border-t border-[#e8e0d6] bg-[#faf8f5]">
// //                 <div className="flex justify-end">
// //                   <div className="w-full max-w-xs space-y-2">
// //                     <div className="flex justify-between text-sm">
// //                       <span className="text-[#6b5f54]">Subtotal</span>
// //                       <span className="text-[#3f3328]">{formatAmount(order.subtotal || order.totalAmount)}</span>
// //                     </div>
// //                     <div className="flex justify-between text-sm">
// //                       <span className="text-[#6b5f54]">GST (5%)</span>
// //                       <span className="text-[#3f3328]">{formatAmount(order.taxAmount || 0)}</span>
// //                     </div>
// //                     {order.deliveryFee > 0 && (
// //                       <div className="flex justify-between text-sm">
// //                         <span className="text-[#6b5f54]">Delivery Fee</span>
// //                         <span className="text-[#3f3328]">{formatAmount(order.deliveryFee)}</span>
// //                       </div>
// //                     )}
// //                     {order.preOrderFee > 0 && (
// //                       <div className="flex justify-between text-sm">
// //                         <span className="text-[#6b5f54]">Pre-order Fee</span>
// //                         <span className="text-[#3f3328]">{formatAmount(order.preOrderFee)}</span>
// //                       </div>
// //                     )}
// //                     {order.discount > 0 && (
// //                       <div className="flex justify-between text-sm text-green-600">
// //                         <span>Discount</span>
// //                         <span>-{formatAmount(order.discount)}</span>
// //                       </div>
// //                     )}
// //                     <div className="flex justify-between text-lg font-bold pt-2 border-t border-[#e0d5c8]">
// //                       <span className="text-[#3f3328]">Total Amount</span>
// //                       <span className="text-[#b97844]">{formatAmount(order.totalAmount)}</span>
// //                     </div>
// //                   </div>
// //                 </div>
// //               </div>

// //               {/* Footer */}
// //               <div className="p-6 text-center border-t border-[#e8e0d6] bg-white">
// //                 <div className="flex justify-center gap-6 text-xs text-[#a0968c] mb-3">
// //                   <span>Thank you for dining with us!</span>
// //                   <span>•</span>
// //                   <span>GST: 24AAQCR1234A1Z</span>
// //                   <span>•</span>
// //                   <span>FSSAI: 12345678901234</span>
// //                 </div>
// //                 <p className="text-xs text-[#a0968c]">
// //                   For any queries, please contact: +91-91067 34266 | hello@rollercoastercafe.com
// //                 </p>
// //                 <p className="text-xs text-[#c0b5a8] mt-2">
// //                   This is a computer generated invoice and does not require a signature.
// //                 </p>
// //               </div>
// //             </div>

// //             {/* Rate Your Experience */}
// //             <div className="bg-white rounded-xl p-6 shadow-sm">
// //               <div className="flex items-start gap-4">
// //                 <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
// //                   <Star size={20} className="text-amber-600" />
// //                 </div>
// //                 <div className="flex-1">
// //                   <h3 className="font-semibold text-[#3f3328]">How was your experience?</h3>
// //                   <p className="text-sm text-[#6b5f54] mt-1">Tell us how your order went today.</p>
// //                   <Link
// //                     to={`/menu/item/${order.items?.[0]?.menuItem?._id || order.items?.[0]?.menuItem || ''}`}
// //                     className="inline-flex items-center gap-2 mt-3 rounded-full bg-amber-50 px-4 py-2 text-sm font-medium text-amber-600 hover:bg-amber-100 transition-all"
// //                   >
// //                     Leave a Review
// //                     <Star size={14} />
// //                   </Link>
// //                 </div>
// //               </div>
// //             </div>
// //           </div>
// //         )}
// //       </main>

// //       <CustomerFooter />
// //     </div>
// //   );
// // }

// import { useQuery } from '@tanstack/react-query';
// import { Link, useParams } from 'react-router-dom';
// import { ArrowLeft, Printer, Star } from 'lucide-react';
// import api from '../../services/api';
// import CustomerFooter from '../../components/customer/CustomerFooter';

// export default function InvoicePage() {
//   const { orderId } = useParams();

//   const { data: order, isLoading, error } = useQuery({
//     queryKey: ['invoice-order', orderId],
//     queryFn: async () => {
//       const res = await api.get(`/orders/${orderId}`);
//       return res.data;
//     },
//     enabled: Boolean(orderId),
//   });

//   const formatAmount = (value) => `₹${Number(value || 0).toLocaleString('en-IN')}`;
  
//   const formatDate = (value) =>
//     new Date(value).toLocaleString('en-IN', {
//       day: '2-digit',
//       month: 'short',
//       year: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit',
//     });

//   const printInvoice = () => {
//     const printWindow = window.open('', '_blank');
    
//     printWindow.document.write(`
//       <!DOCTYPE html>
//       <html>
//         <head>
//           <title>Invoice - ${order?.orderId || orderId}</title>
//           <style>
//             * {
//               margin: 0;
//               padding: 0;
//               box-sizing: border-box;
//             }
//             body {
//               font-family: 'Arial', 'Helvetica', sans-serif;
//               background: #fff;
//               padding: 40px;
//             }
//             .invoice-box {
//               max-width: 800px;
//               margin: 0 auto;
//               background: #fff;
//               border: 1px solid #ddd;
//               box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
//             }
//             .invoice-header {
//               padding: 30px;
//               border-bottom: 1px solid #eee;
//               background: #faf8f5;
//             }
//             .logo-section {
//               display: flex;
//               justify-content: space-between;
//               align-items: flex-start;
//               margin-bottom: 20px;
//             }
//             .logo {
//               display: flex;
//               align-items: center;
//               gap: 10px;
//             }
//             .logo img {
//               width: 50px;
//               height: 50px;
//               border-radius: 50%;
//             }
//             .logo h2 {
//               font-size: 20px;
//               color: #3f3328;
//             }
//             .invoice-type {
//               text-align: right;
//             }
//             .invoice-type h1 {
//               font-size: 24px;
//               color: #b97844;
//               margin-bottom: 5px;
//             }
//             .invoice-type p {
//               font-size: 11px;
//               color: #999;
//             }
//             .restaurant-name {
//               font-size: 28px;
//               font-weight: bold;
//               color: #3f3328;
//               margin-bottom: 5px;
//             }
//             .restaurant-tagline {
//               font-size: 12px;
//               color: #999;
//               margin-bottom: 20px;
//             }
//             .info-section {
//               padding: 25px 30px;
//               display: flex;
//               justify-content: space-between;
//               border-bottom: 1px solid #eee;
//               background: #fff;
//             }
//             .info-box h3 {
//               font-size: 12px;
//               color: #999;
//               text-transform: uppercase;
//               margin-bottom: 10px;
//               letter-spacing: 1px;
//             }
//             .info-box p {
//               font-size: 13px;
//               color: #333;
//               margin-bottom: 5px;
//               line-height: 1.5;
//             }
//             .info-box .bold {
//               font-weight: bold;
//               color: #3f3328;
//             }
//             .items-section {
//               padding: 25px 30px;
//             }
//             table {
//               width: 100%;
//               border-collapse: collapse;
//             }
//             th {
//               text-align: left;
//               padding: 12px 8px;
//               background: #f5f5f5;
//               border-bottom: 2px solid #e0e0e0;
//               font-size: 12px;
//               color: #666;
//               font-weight: 600;
//               text-transform: uppercase;
//               letter-spacing: 0.5px;
//             }
//             td {
//               padding: 12px 8px;
//               border-bottom: 1px solid #eee;
//               font-size: 13px;
//               color: #555;
//             }
//             .text-center {
//               text-align: center;
//             }
//             .text-right {
//               text-align: right;
//             }
//             .summary-section {
//               padding: 25px 30px;
//               background: #faf8f5;
//               border-top: 1px solid #eee;
//               text-align: right;
//             }
//             .summary-row {
//               display: flex;
//               justify-content: flex-end;
//               margin-bottom: 8px;
//               font-size: 13px;
//             }
//             .summary-label {
//               width: 150px;
//               text-align: left;
//               color: #666;
//             }
//             .summary-value {
//               width: 120px;
//               text-align: right;
//               font-weight: 500;
//               color: #333;
//             }
//             .total-row {
//               margin-top: 10px;
//               padding-top: 10px;
//               border-top: 2px solid #ddd;
//               font-size: 16px;
//               font-weight: bold;
//             }
//             .total-row .summary-value {
//               color: #b97844;
//               font-size: 18px;
//             }
//             .footer {
//               padding: 20px 30px;
//               text-align: center;
//               border-top: 1px solid #eee;
//               font-size: 11px;
//               color: #999;
//               line-height: 1.6;
//             }
//             .thankyou {
//               margin-top: 10px;
//               font-size: 13px;
//               color: #b97844;
//               font-weight: 500;
//             }
//             @media print {
//               body {
//                 padding: 0;
//                 margin: 0;
//               }
//               .invoice-box {
//                 border: none;
//                 box-shadow: none;
//               }
//               .no-print {
//                 display: none;
//               }
//             }
//           </style>
//         </head>
//         <body>
//           <div class="invoice-box">
//             <div class="invoice-header">
//               <div class="logo-section">
//                 <div class="logo">
//                   <img src="https://rollercoastercafe.com/assets/images/roller_logo.png" alt="Logo" />
//                   <h2>Roller Coaster</h2>
//                 </div>
//                 <div class="invoice-type">
//                   <h1>TAX INVOICE</h1>
//                   <p>Original for Customer</p>
//                 </div>
//               </div>
//               <div class="restaurant-name">Roller Coaster Cafe</div>
//               <div class="restaurant-tagline">A symphony of flavors in a warm and welcoming ambiance.</div>
//             </div>

//             <div class="info-section">
//               <div class="info-box">
//                 <h3>BILL TO</h3>
//                 <p class="bold">${order?.deliveryAddress?.name || 'Customer'}</p>
//                 <p>${order?.deliveryAddress?.text || 'Address not available'}</p>
//                 ${order?.deliveryAddress?.phone ? `<p>Phone: ${order.deliveryAddress.phone}</p>` : ''}
//               </div>
//               <div class="info-box">
//                 <h3>ORDER DETAILS</h3>
//                 <p><span class="bold">Invoice No.:</span> ${order?.invoiceNumber || order?.orderId}</p>
//                 <p><span class="bold">Order ID:</span> ${order?.orderId}</p>
//                 <p><span class="bold">Date:</span> ${formatDate(order?.createdAt)}</p>
//                 <p><span class="bold">Order Type:</span> ${order?.orderType?.charAt(0).toUpperCase() + order?.orderType?.slice(1)}</p>
//                 <p><span class="bold">Payment:</span> ${order?.paymentMethod?.charAt(0).toUpperCase() + order?.paymentMethod?.slice(1)}</p>
//               </div>
//             </div>

//             <div class="items-section">
//               <table>
//                 <thead>
//                   <tr>
//                     <th>#</th>
//                     <th>Item Description</th>
//                     <th class="text-center">Qty</th>
//                     <th class="text-right">Unit Price</th>
//                     <th class="text-right">Total</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   ${(order?.items || []).map((item, index) => `
//                     <tr>
//                       <td>${index + 1}</td>
//                       <td>
//                         <strong>${item.name}</strong>
//                         ${item.variant ? `<div style="font-size: 11px; color: #888;">${item.variant}</div>` : ''}
//                         ${item.addons?.length > 0 ? `<div style="font-size: 11px; color: #888;">+ ${item.addons.join(', ')}</div>` : ''}
//                       </td>
//                       <td class="text-center">${item.quantity}</td>
//                       <td class="text-right">${formatAmount(item.price || item.unitPrice)}</td>
//                       <td class="text-right">${formatAmount((item.price || item.unitPrice || 0) * (item.quantity || 0))}</td>
//                     </tr>
//                   `).join('')}
//                 </tbody>
//               </table>
//             </div>

//             <div class="summary-section">
//               <div class="summary-row">
//                 <span class="summary-label">Subtotal:</span>
//                 <span class="summary-value">${formatAmount(order?.subtotal || order?.totalAmount)}</span>
//               </div>
//               <div class="summary-row">
//                 <span class="summary-label">GST (5%):</span>
//                 <span class="summary-value">${formatAmount(order?.taxAmount || 0)}</span>
//               </div>
//               ${order?.deliveryFee > 0 ? `
//               <div class="summary-row">
//                 <span class="summary-label">Delivery Fee:</span>
//                 <span class="summary-value">${formatAmount(order.deliveryFee)}</span>
//               </div>
//               ` : ''}
//               ${order?.preOrderFee > 0 ? `
//               <div class="summary-row">
//                 <span class="summary-label">Pre-order Fee:</span>
//                 <span class="summary-value">${formatAmount(order.preOrderFee)}</span>
//               </div>
//               ` : ''}
//               ${order?.discount > 0 ? `
//               <div class="summary-row">
//                 <span class="summary-label">Discount:</span>
//                 <span class="summary-value" style="color: green;">-${formatAmount(order.discount)}</span>
//               </div>
//               ` : ''}
//               <div class="summary-row total-row">
//                 <span class="summary-label">Total Amount:</span>
//                 <span class="summary-value">${formatAmount(order?.totalAmount)}</span>
//               </div>
//             </div>

//             <div class="footer">
//               <p>GST: 24AAQCR1234A1Z | FSSAI: 12345678901234</p>
//               <p>For any queries, please contact: +91-91067 34266 | hello@rollercoastercafe.com</p>
//               <div class="thankyou">Thank you for dining with Roller Coaster Cafe!</div>
//               <p style="font-size: 10px; margin-top: 10px;">This is a computer generated invoice and does not require a signature.</p>
//             </div>
//           </div>
//         </body>
//       </html>
//     `);
    
//     printWindow.document.close();
//     printWindow.print();
//   };

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="w-12 h-12 border-4 border-[#b97844] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
//           <p className="text-gray-500">Loading invoice...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error || !order) {
//     return (
//       <div className="min-h-screen bg-gray-50">
//         <div className="max-w-4xl mx-auto px-4 py-20 text-center">
//           <div className="bg-red-50 rounded-xl p-8">
//             <h2 className="text-xl font-bold text-red-600 mb-2">Invoice Not Available</h2>
//             <p className="text-gray-600">We could not load this invoice right now.</p>
//             <Link to="/orders" className="inline-flex items-center gap-2 mt-4 text-[#b97844] hover:underline">
//               <ArrowLeft size={14} /> Back to Orders
//             </Link>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
//         <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
//           <Link to="/orders" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#b97844]">
//             <ArrowLeft size={16} />
//             Back to Orders
//           </Link>
//           <button
//             onClick={printInvoice}
//             className="inline-flex items-center gap-2 rounded-lg bg-[#b97844] px-4 py-2 text-sm font-semibold text-white hover:bg-[#9e6538] transition-all"
//           >
//             <Printer size={16} />
//             Print Invoice
//           </button>
//         </div>
//       </header>

//       <main className="max-w-4xl mx-auto px-4 py-8">
//         {/* Invoice Display */}
//         <div className="bg-white rounded-xl shadow-lg overflow-hidden">
//           {/* Header */}
//           <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-[#faf8f5] to-white">
//             <div className="flex justify-between items-start">
//               <div className="flex items-center gap-3">
//                 <img 
//                   src="https://rollercoastercafe.com/assets/images/roller_logo.png" 
//                   alt="Logo"
//                   className="w-12 h-12 rounded-full object-cover"
//                 />
//                 <div>
//                   <h2 className="font-bold text-xl text-[#3f3328]">Roller Coaster</h2>
//                   <p className="text-xs text-gray-400">Roller Coaster Cafe</p>
//                 </div>
//               </div>
//               <div className="text-right">
//                 <h1 className="text-2xl font-bold text-[#b97844]">TAX INVOICE</h1>
//                 <p className="text-xs text-gray-400">Original for Customer</p>
//               </div>
//             </div>
//           </div>

//           {/* Info Section */}
//           <div className="p-6 grid md:grid-cols-2 gap-6 border-b border-gray-100">
//             <div>
//               <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">BILL TO</h3>
//               <p className="font-medium text-gray-800">{order.deliveryAddress?.name || 'Customer'}</p>
//               <p className="text-sm text-gray-600">{order.deliveryAddress?.text || 'Address not available'}</p>
//               {order.deliveryAddress?.phone && (
//                 <p className="text-sm text-gray-600">Phone: {order.deliveryAddress.phone}</p>
//               )}
//             </div>
//             <div>
//               <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">ORDER DETAILS</h3>
//               <div className="space-y-1 text-sm">
//                 <p><span className="text-gray-500">Invoice No.:</span> <span className="text-gray-800">{order.invoiceNumber || order.orderId}</span></p>
//                 <p><span className="text-gray-500">Order ID:</span> <span className="text-gray-800">{order.orderId}</span></p>
//                 <p><span className="text-gray-500">Date:</span> <span className="text-gray-800">{formatDate(order.createdAt)}</span></p>
//                 <p><span className="text-gray-500">Order Type:</span> <span className="text-gray-800 capitalize">{order.orderType}</span></p>
//                 <p><span className="text-gray-500">Payment:</span> <span className="text-gray-800 capitalize">{order.paymentMethod}</span></p>
//               </div>
//             </div>
//           </div>

//           {/* Items Table */}
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">#</th>
//                   <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Item Description</th>
//                   <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Qty</th>
//                   <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Unit Price</th>
//                   <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Total</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-100">
//                 {(order.items || []).map((item, index) => (
//                   <tr key={index} className="hover:bg-gray-50">
//                     <td className="px-6 py-4 text-sm text-gray-500">{index + 1}</td>
//                     <td className="px-6 py-4">
//                       <p className="font-medium text-gray-800">{item.name}</p>
//                       {item.variant && <p className="text-xs text-gray-400">{item.variant}</p>}
//                       {item.addons?.length > 0 && (
//                         <p className="text-xs text-gray-400">+ {item.addons.join(', ')}</p>
//                       )}
//                     </td>
//                     <td className="px-6 py-4 text-sm text-gray-600 text-center">{item.quantity}</td>
//                     <td className="px-6 py-4 text-sm text-gray-600 text-right">{formatAmount(item.price || item.unitPrice)}</td>
//                     <td className="px-6 py-4 text-sm font-medium text-gray-800 text-right">
//                       {formatAmount((item.price || item.unitPrice || 0) * (item.quantity || 0))}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           {/* Summary */}
//           <div className="p-6 border-t border-gray-100 bg-gray-50">
//             <div className="flex justify-end">
//               <div className="w-72 space-y-2">
//                 <div className="flex justify-between text-sm">
//                   <span className="text-gray-500">Subtotal:</span>
//                   <span className="text-gray-800">{formatAmount(order.subtotal || order.totalAmount)}</span>
//                 </div>
//                 <div className="flex justify-between text-sm">
//                   <span className="text-gray-500">GST (5%):</span>
//                   <span className="text-gray-800">{formatAmount(order.taxAmount || 0)}</span>
//                 </div>
//                 {order.deliveryFee > 0 && (
//                   <div className="flex justify-between text-sm">
//                     <span className="text-gray-500">Delivery Fee:</span>
//                     <span className="text-gray-800">{formatAmount(order.deliveryFee)}</span>
//                   </div>
//                 )}
//                 {order.preOrderFee > 0 && (
//                   <div className="flex justify-between text-sm">
//                     <span className="text-gray-500">Pre-order Fee:</span>
//                     <span className="text-gray-800">{formatAmount(order.preOrderFee)}</span>
//                   </div>
//                 )}
//                 {order.discount > 0 && (
//                   <div className="flex justify-between text-sm text-green-600">
//                     <span>Discount:</span>
//                     <span>-{formatAmount(order.discount)}</span>
//                   </div>
//                 )}
//                 <div className="flex justify-between pt-2 border-t border-gray-200">
//                   <span className="font-bold text-gray-800">Total Amount:</span>
//                   <span className="font-bold text-[#b97844] text-lg">{formatAmount(order.totalAmount)}</span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Footer */}
//           <div className="p-6 text-center border-t border-gray-100">
//             <p className="text-xs text-gray-400">GST: 24AAQCR1234A1Z | FSSAI: 12345678901234</p>
//             <p className="text-xs text-gray-400 mt-1">For any queries, please contact: +91-91067 34266 | hello@rollercoastercafe.com</p>
//             <p className="text-sm text-[#b97844] mt-3">Thank you for dining with Roller Coaster Cafe!</p>
//             <p className="text-xs text-gray-400 mt-2">This is a computer generated invoice and does not require a signature.</p>
//           </div>
//         </div>

//         {/* Rate Experience */}
//         <div className="mt-6 bg-white rounded-xl p-6 shadow-sm">
//           <div className="flex items-center gap-4">
//             <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
//               <Star size={20} className="text-amber-600" />
//             </div>
//             <div className="flex-1">
//               <h3 className="font-semibold text-gray-800">Rate your experience</h3>
//               <p className="text-sm text-gray-500">Tell us how your order went today.</p>
//             </div>
//             <Link
//               to={`/menu/item/${order.items?.[0]?.menuItem?._id || order.items?.[0]?.menuItem || ''}`}
//               className="px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:border-amber-500 hover:text-amber-600 transition-all"
//             >
//               Leave a Review
//             </Link>
//           </div>
//         </div>
//       </main>

//       <CustomerFooter />
//     </div>
//   );
// }

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Printer, Star, CalendarDays, Truck, ShoppingBag, Table2, CheckCircle, Clock } from 'lucide-react';
import api from '../../services/api';
import CustomerFooter from '../../components/customer/CustomerFooter';

export default function InvoicePage() {
  const { orderId } = useParams();
  const isAuthenticated = Boolean(localStorage.getItem('token'));
  const appBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  const { data: order, isLoading, error } = useQuery({
    queryKey: ['invoice-order', orderId],
    queryFn: async () => {
      const res = isAuthenticated
        ? await api.get(`/orders/${orderId}`)
        : await axios.get(`${appBaseUrl}/orders/public/${orderId}`, { withCredentials: true });
      return res.data;
    },
    enabled: Boolean(orderId),
  });

  const formatAmount = (value) => `₹${Number(value || 0).toLocaleString('en-IN')}`;
  
  const formatDate = (value) =>
    new Date(value).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  // Get order type display name
  const getOrderTypeDisplay = () => {
    if (!order) return 'Order';
    if (order.isPreOrder) {
      const method = order.preOrderMethod || order.orderType;
      if (method === 'delivery') return 'Pre-order Delivery';
      if (method === 'takeaway') return 'Pre-order Takeaway';
      if (method === 'dine-in') return 'Pre-order Dine-In';
      return 'Pre-order';
    }
    if (order.orderType === 'delivery') return 'Delivery';
    if (order.orderType === 'takeaway') return 'Takeaway';
    if (order.orderType === 'dine-in') return 'Dine-In';
    return 'Order';
  };

  // Get order type icon
  const getOrderTypeIcon = () => {
    if (!order) return null;
    if (order.isPreOrder) return <CalendarDays size={14} className="inline mr-1" />;
    if (order.orderType === 'delivery') return <Truck size={14} className="inline mr-1" />;
    if (order.orderType === 'takeaway') return <ShoppingBag size={14} className="inline mr-1" />;
    if (order.orderType === 'dine-in') return <Table2 size={14} className="inline mr-1" />;
    return null;
  };

  const printInvoice = () => {
    const printWindow = window.open('', '_blank');
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice - ${order?.orderId || orderId}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Arial', 'Helvetica', sans-serif; background: #fff; padding: 40px; }
            .invoice-box { max-width: 800px; margin: 0 auto; background: #fff; border: 1px solid #ddd; }
            .invoice-header { padding: 30px; border-bottom: 1px solid #eee; background: #faf8f5; }
            .logo-section { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; }
            .logo { display: flex; align-items: center; gap: 10px; }
            .logo img { width: 50px; height: 50px; border-radius: 50%; }
            .logo h2 { font-size: 20px; color: #3f3328; }
            .invoice-type { text-align: right; }
            .invoice-type h1 { font-size: 24px; color: #b97844; margin-bottom: 5px; }
            .restaurant-name { font-size: 28px; font-weight: bold; color: #3f3328; margin-bottom: 5px; }
            .info-section { padding: 25px 30px; display: flex; justify-content: space-between; border-bottom: 1px solid #eee; }
            .info-box h3 { font-size: 12px; color: #999; text-transform: uppercase; margin-bottom: 10px; }
            .info-box p { font-size: 13px; color: #333; margin-bottom: 5px; }
            .info-box .bold { font-weight: bold; color: #3f3328; }
            .items-section { padding: 25px 30px; }
            table { width: 100%; border-collapse: collapse; }
            th { text-align: left; padding: 12px 8px; background: #f5f5f5; border-bottom: 2px solid #e0e0e0; font-size: 12px; }
            td { padding: 12px 8px; border-bottom: 1px solid #eee; font-size: 13px; }
            .text-center { text-align: center; }
            .text-right { text-align: right; }
            .summary-section { padding: 25px 30px; background: #faf8f5; text-align: right; }
            .summary-row { display: flex; justify-content: flex-end; margin-bottom: 8px; font-size: 13px; }
            .summary-label { width: 150px; text-align: left; color: #666; }
            .summary-value { width: 120px; text-align: right; font-weight: 500; color: #333; }
            .total-row { margin-top: 10px; padding-top: 10px; border-top: 2px solid #ddd; font-size: 16px; font-weight: bold; }
            .total-row .summary-value { color: #b97844; font-size: 18px; }
            .footer { padding: 20px 30px; text-align: center; border-top: 1px solid #eee; font-size: 11px; color: #999; }
            .payment-status { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; }
            .payment-paid { background: #d4edda; color: #155724; }
            @media print { body { padding: 0; margin: 0; } }
          </style>
        </head>
        <body>
          <div class="invoice-box">
            <div class="invoice-header">
              <div class="logo-section">
                <div class="logo">
                  <img src="https://rollercoastercafe.com/assets/images/roller_logo.png" alt="Logo" />
                  <h2>Roller Coaster</h2>
                </div>
                <div class="invoice-type">
                  <h1>TAX INVOICE</h1>
                  <p>Original for Customer</p>
                </div>
              </div>
              <div class="restaurant-name">Roller Coaster Cafe</div>
            </div>

            <div class="info-section">
              <div class="info-box">
                <h3>BILL TO</h3>
                <p class="bold">${order?.guestName || order?.customer?.name || 'Customer'}</p>
                <p>${order?.deliveryAddress?.text || order?.orderType === 'dine-in' ? 'Dine-In at Cafe' : 'Pickup from Cafe'}</p>
                ${order?.guestPhone ? `<p>Phone: ${order.guestPhone}</p>` : ''}
                ${order?.tableNumber ? `<p>Table: ${order.tableNumber}</p>` : ''}
              </div>
              <div class="info-box">
                <h3>ORDER DETAILS</h3>
                <p><span class="bold">Invoice No.:</span> ${order?.invoiceNumber || order?.orderId}</p>
                <p><span class="bold">Order ID:</span> ${order?.orderId}</p>
                <p><span class="bold">Date:</span> ${formatDate(order?.createdAt)}</p>
                <p><span class="bold">Order Type:</span> ${getOrderTypeDisplay()}</p>
                ${order?.scheduledTime ? `<p><span class="bold">Scheduled:</span> ${formatDate(order.scheduledTime)}</p>` : ''}
                <p><span class="bold">Payment:</span> ${order?.paymentMethod}</p>
              </div>
            </div>

            <div class="items-section">
              <table>
                <thead>
                  <tr><th>#</th><th>Item Description</th><th class="text-center">Qty</th><th class="text-right">Unit Price</th><th class="text-right">Total</th></tr>
                </thead>
                <tbody>
                  ${(order?.items || []).map((item, index) => `
                    <tr>
                      <td>${index + 1}</td>
                      <td><strong>${item.name}</strong>${item.variant ? `<div style="font-size:11px;color:#888;">${item.variant}</div>` : ''}${item.addons?.length ? `<div style="font-size:11px;color:#888;">+ ${item.addons.join(', ')}</div>` : ''}</td>
                      <td class="text-center">${item.quantity}</td>
                      <td class="text-right">${formatAmount(item.price || item.unitPrice)}</td>
                      <td class="text-right">${formatAmount((item.price || item.unitPrice || 0) * (item.quantity || 0))}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>

            <div class="summary-section">
              <div class="summary-row"><span class="summary-label">Subtotal:</span><span class="summary-value">${formatAmount(order?.subtotal)}</span></div>
              <div class="summary-row"><span class="summary-label">GST (5%):</span><span class="summary-value">${formatAmount(order?.taxAmount || 0)}</span></div>
              ${order?.deliveryFee ? `<div class="summary-row"><span class="summary-label">Delivery Fee:</span><span class="summary-value">${formatAmount(order.deliveryFee)}</span></div>` : ''}
              ${order?.preOrderFee ? `<div class="summary-row"><span class="summary-label">Pre-order Fee:</span><span class="summary-value">${formatAmount(order.preOrderFee)}</span></div>` : ''}
              ${order?.discount ? `<div class="summary-row"><span class="summary-label">Discount:</span><span class="summary-value" style="color:green;">-${formatAmount(order.discount)}</span></div>` : ''}
              <div class="summary-row total-row"><span class="summary-label">Total Amount:</span><span class="summary-value">${formatAmount(order?.totalAmount)}</span></div>
              <div class="summary-row" style="margin-top:10px;"><span class="summary-label">Payment Status:</span><span class="summary-value payment-paid">PAID</span></div>
            </div>

            <div class="footer">
              <p>GST: 24AAQCR1234A1Z | FSSAI: 12345678901234</p>
              <p>For queries: +91-91067 34266 | hello@rollercoastercafe.com</p>
              <p style="margin-top:10px;">Thank you for dining with Roller Coaster Cafe!</p>
            </div>
          </div>
        </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.print();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#b97844] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading invoice...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <div className="bg-red-50 rounded-xl p-8">
            <h2 className="text-xl font-bold text-red-600 mb-2">Invoice Not Available</h2>
            <p className="text-gray-600">Invoice will be available after order completion.</p>
            <Link to={isAuthenticated ? '/orders' : '/'} className="inline-flex items-center gap-2 mt-4 text-[#b97844] hover:underline">
              <ArrowLeft size={14} /> Back to Orders
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isPaid = order.paymentStatus === 'paid' || order.status === 'completed' || order.status === 'delivered';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to={isAuthenticated ? '/orders' : '/'} className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#b97844]">
            {/* <ArrowLeft size={16} /> Back to Orders */}
          </Link>
          <button
            onClick={printInvoice}
            className="inline-flex items-center gap-2 rounded-lg bg-[#b97844] px-4 py-2 text-sm font-semibold text-white hover:bg-[#9e6538] transition-all"
          >
            <Printer size={16} /> Print Invoice
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Invoice Display */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-[#faf8f5] to-white">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <img 
                  src="https://rollercoastercafe.com/assets/images/roller_logo.png" 
                  alt="Logo"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h2 className="font-bold text-xl text-[#3f3328]">Roller Coaster</h2>
                  <p className="text-xs text-gray-400">Roller Coaster Cafe</p>
                </div>
              </div>
              <div className="text-right">
                <h1 className="text-2xl font-bold text-[#b97844]">TAX INVOICE</h1>
                <p className="text-xs text-gray-400">Original for Customer</p>
              </div>
            </div>
          </div>

          {/* Order Type Badge */}
          <div className="px-6 pt-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700">
              {getOrderTypeIcon()}
              {getOrderTypeDisplay()}
            </span>
            {order.isPreOrder && order.scheduledTime && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-purple-50 text-purple-700 ml-2">
                <CalendarDays size={12} /> Scheduled: {formatDate(order.scheduledTime)}
              </span>
            )}
            {!isPaid && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-yellow-50 text-yellow-700 ml-2">
                <Clock size={12} /> Payment Pending
              </span>
            )}
          </div>

          {/* Info Section */}
          <div className="p-6 grid md:grid-cols-2 gap-6 border-b border-gray-100">
            <div>
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">BILL TO</h3>
              <p className="font-medium text-gray-800">{order.guestName || order.customer?.name || 'Customer'}</p>
              <p className="text-sm text-gray-600">
                {order.deliveryAddress?.text || 
                 (order.orderType === 'dine-in' ? 'Dine-In at Cafe' : 'Pickup from Cafe')}
              </p>
              {(order.guestPhone || order.customer?.phone) && (
                <p className="text-sm text-gray-600 mt-1">📞 {order.guestPhone || order.customer?.phone}</p>
              )}
              {order.tableNumber && (
                <p className="text-sm text-gray-600 mt-1">🍽️ Table: {order.tableNumber} | Guests: {order.guestCount || 2}</p>
              )}
            </div>
            <div>
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">ORDER DETAILS</h3>
              <div className="space-y-1 text-sm">
                <p><span className="text-gray-500">Invoice No.:</span> <span className="text-gray-800">{order.invoiceNumber || order.orderId}</span></p>
                <p><span className="text-gray-500">Order ID:</span> <span className="text-gray-800">{order.orderId}</span></p>
                <p><span className="text-gray-500">Date:</span> <span className="text-gray-800">{formatDate(order.createdAt)}</span></p>
                <p><span className="text-gray-500">Order Type:</span> <span className="text-gray-800 capitalize">{getOrderTypeDisplay()}</span></p>
                {order.scheduledTime && (
                  <p><span className="text-gray-500">Scheduled:</span> <span className="text-gray-800">{formatDate(order.scheduledTime)}</span></p>
                )}
                <p><span className="text-gray-500">Payment:</span> <span className="text-gray-800 capitalize">{order.paymentMethod}</span></p>
                <p>
                  <span className="text-gray-500">Status:</span>
                  {isPaid ? (
                    <span className="ml-2 inline-flex items-center gap-1 text-green-600"><CheckCircle size={12} /> Paid</span>
                  ) : (
                    <span className="ml-2 inline-flex items-center gap-1 text-amber-600"><Clock size={12} /> Pending</span>
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">#</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Item Description</th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Qty</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Unit Price</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {(order.items || []).map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-500">{index + 1}</td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-800">{item.name}</p>
                      {item.variant && <p className="text-xs text-gray-400">{item.variant}</p>}
                      {item.addons?.length > 0 && (
                        <p className="text-xs text-gray-400">+ {item.addons.join(', ')}</p>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 text-center">{item.quantity}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 text-right">{formatAmount(item.price || item.unitPrice)}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-800 text-right">
                      {formatAmount((item.price || item.unitPrice || 0) * (item.quantity || 0))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary */}
          <div className="p-6 border-t border-gray-100 bg-gray-50">
            <div className="flex justify-end">
              <div className="w-72 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal:</span>
                  <span className="text-gray-800">{formatAmount(order.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">GST (5%):</span>
                  <span className="text-gray-800">{formatAmount(order.taxAmount || 0)}</span>
                </div>
                {order.deliveryFee > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Delivery Fee:</span>
                    <span className="text-gray-800">{formatAmount(order.deliveryFee)}</span>
                  </div>
                )}
                {order.preOrderFee > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Pre-order Fee:</span>
                    <span className="text-gray-800">{formatAmount(order.preOrderFee)}</span>
                  </div>
                )}
                {order.discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Discount:</span>
                    <span>-{formatAmount(order.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between pt-2 border-t border-gray-200">
                  <span className="font-bold text-gray-800">Total Amount:</span>
                  <span className="font-bold text-[#b97844] text-lg">{formatAmount(order.totalAmount)}</span>
                </div>
                {isPaid && (
                  <div className="flex justify-between pt-2">
                    <span className="text-sm text-gray-500">Payment Status:</span>
                    <span className="text-sm font-semibold text-green-600 flex items-center gap-1">
                      <CheckCircle size={14} /> PAID
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 text-center border-t border-gray-100">
            <p className="text-xs text-gray-400">GST: 24AAQCR1234A1Z | FSSAI: 12345678901234</p>
            <p className="text-xs text-gray-400 mt-1">For any queries, please contact: +91-91067 34266 | hello@rollercoastercafe.com</p>
            <p className="text-sm text-[#b97844] mt-3">Thank you for dining with Roller Coaster Cafe!</p>
            <p className="text-xs text-gray-400 mt-2">This is a computer generated invoice and does not require a signature.</p>
          </div>
        </div>

        {/* Rate Experience
        <div className="mt-6 bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
              <Star size={20} className="text-amber-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800">Rate your experience</h3>
              <p className="text-sm text-gray-500">Tell us how your order went today.</p>
            </div>
            <Link
              to={`/menu/item/${order.items?.[0]?.menuItem?._id || order.items?.[0]?.menuItem || ''}`}
              className="px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:border-amber-500 hover:text-amber-600 transition-all"
            >
              Leave a Review
            </Link>
          </div> */}
        {/* </div> */}
      </main>

      <CustomerFooter />
    </div>
  );
}
