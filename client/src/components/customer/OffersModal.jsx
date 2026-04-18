// // frontend/src/components/customer/OffersModal.jsx
// import { useQuery } from '@tanstack/react-query';
// import { X, Copy, CheckCircle, Percent, Gift, Coffee, Pizza } from 'lucide-react';
// import { useState } from 'react';
// import toast from 'react-hot-toast';
// import api from '../../services/api';

// export default function OffersModal({ onClose, onSelectOffer }) {
//   const [copiedCode, setCopiedCode] = useState(null);
  
//   const { data: offers = [], isLoading } = useQuery({
//     queryKey: ['offers-modal'],
//     queryFn: () => api.get('/customer/offers').then(res => res.data),
//   });

//   const copyCode = async (code) => {
//     try {
//       await navigator.clipboard.writeText(code);
//       setCopiedCode(code);
//       toast.success(`${code} copied!`);
//       setTimeout(() => setCopiedCode(null), 2000);
//     } catch {
//       toast.error('Failed to copy');
//     }
//   };

//   const getOfferIcon = (type) => {
//     if (type === 'percentage') return <Percent size={18} className="text-[#b97844]" />;
//     return <Gift size={18} className="text-[#b97844]" />;
//   };

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
//       <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden shadow-2xl mx-4">
//         {/* Header */}
//         <div className="flex items-center justify-between p-5 border-b border-[#e8e0d6] bg-white sticky top-0">
//           <div>
//             <h2 className="font-display text-xl font-bold text-[#3f3328]">Available Offers</h2>
//             <p className="text-sm text-[#6b5f54] mt-0.5">Apply coupon to save on your order</p>
//           </div>
//           <button 
//             onClick={onClose} 
//             className="w-8 h-8 flex items-center justify-center hover:bg-[#faf8f5] rounded-full transition-all"
//           >
//             <X size={18} className="text-[#6b5f54]" />
//           </button>
//         </div>
        
//         {/* Body */}
//         <div className="p-5 overflow-y-auto max-h-[calc(85vh-80px)]">
//           {isLoading ? (
//             <div className="space-y-3">
//               {[1, 2, 3].map(i => (
//                 <div key={i} className="h-28 bg-[#faf8f5] animate-pulse rounded-xl" />
//               ))}
//             </div>
//           ) : offers.length === 0 ? (
//             <div className="text-center py-12">
//               <div className="w-16 h-16 mx-auto bg-[#faf8f5] rounded-full flex items-center justify-center mb-3">
//                 <Gift size={24} className="text-[#a0968c]" />
//               </div>
//               <p className="text-[#6b5f54] font-medium">No active offers</p>
//               <p className="text-sm text-[#a0968c] mt-1">Check back soon for new discounts</p>
//             </div>
//           ) : (
//             <div className="space-y-3">
//               {offers.map((offer) => (
//                 <div 
//                   key={offer._id} 
//                   className="border border-[#e8e0d6] rounded-xl p-4 hover:shadow-md transition-all hover:border-[#b97844]/30"
//                 >
//                   <div className="flex items-start justify-between gap-4">
//                                     {/* Left Section */}
//                     <div className="flex-1">
//                       <div className="flex items-center gap-2 mb-2">
//                         {getOfferIcon(offer.type)}
//                         <span className="text-xs font-semibold text-[#b97844] bg-[#faf8f5] px-2 py-0.5 rounded-full">
//                           {offer.type === 'percentage' ? `${offer.value}% OFF` : `₹${offer.value} OFF`}
//                         </span>
//                       </div>
//                       <p className="font-mono font-bold text-lg text-[#3f3328] tracking-wider">{offer.code}</p>
//                       <p className="text-sm text-[#6b5f54] mt-1 line-clamp-1">
//                         {offer.description || `Get ${offer.discountLabel} on your order`}
//                       </p>
//                       {offer.minOrderAmount > 0 && (
//                         <p className="text-xs text-[#a0968c] mt-1">Min. order ₹{offer.minOrderAmount}</p>
//                       )}
//                     </div>
                    
//                     {/* Right Section - Buttons */}
//                     <div className="flex flex-col gap-2">
//                       <button
//                         onClick={() => copyCode(offer.code)}
//                         className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full border border-[#e8e0d6] text-[#6b5f54] text-sm hover:border-[#b97844] hover:text-[#b97844] transition-all whitespace-nowrap"
//                       >
//                         {copiedCode === offer.code ? (
//                           <>
//                             <CheckCircle size={14} /> Copied
//                           </>
//                         ) : (
//                           <>
//                             <Copy size={14} /> Copy
//                           </>
//                         )}
//                       </button>
//                       <button
//                         onClick={() => {
//                           onSelectOffer(offer);
//                           onClose();
//                         }}
//                         className="flex items-center justify-center px-3 py-1.5 rounded-full bg-[#b97844] text-white text-sm hover:bg-[#9e6538] transition-all whitespace-nowrap"
//                       >
//                         Apply Coupon
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
        
//         {/* Footer */}
//         <div className="p-4 border-t border-[#e8e0d6] bg-[#faf8f5]">
//           <p className="text-xs text-[#a0968c] text-center">
//             💡 Coupons can be applied only once per order. Some offers may have minimum order requirements.
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }

// frontend/src/components/customer/OffersModal.jsx
import { useQuery } from '@tanstack/react-query';
import { X, Copy, CheckCircle, Percent, Gift } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../services/api';

export default function OffersModal({ onClose, onSelectOffer }) {
  const [copiedCode, setCopiedCode] = useState(null);
  const [expandedOffer, setExpandedOffer] = useState(null);
  
  const { data: offers = [], isLoading } = useQuery({
    queryKey: ['offers-modal'],
    queryFn: () => api.get('/customer/offers').then(res => res.data),
  });

  const copyCode = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      toast.success(`${code} copied!`);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch {
      toast.error('Failed to copy');
    }
  };

  const toggleReadMore = (offerId) => {
    setExpandedOffer(expandedOffer === offerId ? null : offerId);
  };

  const getOfferIcon = (type) => {
    if (type === 'percentage') return <Percent size={20} className="text-[#b97844]" />;
    return <Gift size={20} className="text-[#b97844]" />;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden shadow-2xl mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#e8e0d6] bg-white sticky top-0">
          <div>
            <h2 className="font-display text-2xl font-bold text-[#3f3328]">Available Offers</h2>
            <p className="text-base text-[#6b5f54] mt-1">Apply coupon to save on your order</p>
          </div>
          <button 
            onClick={onClose} 
            className="w-9 h-9 flex items-center justify-center hover:bg-[#faf8f5] rounded-full transition-all"
          >
            <X size={22} className="text-[#6b5f54]" />
          </button>
        </div>
        
        {/* Body */}
        <div className="p-5 overflow-y-auto max-h-[calc(85vh-80px)]">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-32 bg-[#faf8f5] animate-pulse rounded-xl" />
              ))}
            </div>
          ) : offers.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 mx-auto bg-[#faf8f5] rounded-full flex items-center justify-center mb-4">
                <Gift size={32} className="text-[#a0968c]" />
              </div>
              <p className="text-lg font-medium text-[#6b5f54]">No active offers</p>
              <p className="text-base text-[#a0968c] mt-2">Check back soon for new discounts</p>
            </div>
          ) : (
            <div className="space-y-4">
              {offers.map((offer) => {
                const isExpanded = expandedOffer === offer._id;
                const description = offer.description || `Get ${offer.discountLabel} on your order`;
                const shouldTruncate = description.length > 100;
                const displayDescription = isExpanded || !shouldTruncate 
                  ? description 
                  : description.substring(0, 100) + '...';
                
                return (
                  <div 
                    key={offer._id} 
                    className="border border-[#e8e0d6] rounded-xl p-5 hover:shadow-md transition-all hover:border-[#b97844]/30"
                  >
                    <div className="flex items-start justify-between gap-4">
                      {/* Left Section */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          {getOfferIcon(offer.type)}
                          <span className="text-sm font-semibold text-[#b97844] bg-[#faf8f5] px-3 py-1 rounded-full">
                            {offer.type === 'percentage' ? `${offer.value}% OFF` : `₹${offer.value} OFF`}
                          </span>
                        </div>
                        <p className="font-mono font-bold text-2xl text-[#3f3328] tracking-wider mb-2">{offer.code}</p>
                        
                        {/* Description with Read More */}
                        <div className="mb-3">
                          <p className="text-base text-[#6b5f54] leading-relaxed">
                            {displayDescription}
                          </p>
                          {shouldTruncate && (
                            <button
                              onClick={() => toggleReadMore(offer._id)}
                              className="text-sm text-[#b97844] hover:underline mt-1 font-medium"
                            >
                              {isExpanded ? 'Read less' : 'Read more'}
                            </button>
                          )}
                        </div>
                        
                        {offer.minOrderAmount > 0 && (
                          <p className="text-sm text-[#a0968c] mt-2">
                            💰 Minimum order: ₹{offer.minOrderAmount}
                          </p>
                        )}
                        {offer.endDate && (
                          <p className="text-sm text-[#a0968c] mt-1">
                            ⏰ Valid until: {new Date(offer.endDate).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      
                      {/* Right Section - Buttons */}
                      <div className="flex flex-col gap-3 min-w-[120px]">
                        <button
                          onClick={() => copyCode(offer.code)}
                          className="flex items-center justify-center gap-2 px-4 py-2 rounded-full border border-[#e8e0d6] text-[#6b5f54] text-base font-medium hover:border-[#b97844] hover:text-[#b97844] transition-all"
                        >
                          {copiedCode === offer.code ? (
                            <>
                              <CheckCircle size={18} /> Copied
                            </>
                          ) : (
                            <>
                              <Copy size={18} /> Copy Code
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => {
                            onSelectOffer(offer);
                            onClose();
                          }}
                          className="flex items-center justify-center px-4 py-2 rounded-full bg-[#b97844] text-white text-base font-semibold hover:bg-[#9e6538] transition-all"
                        >
                          Apply Coupon
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="p-4 border-t border-[#e8e0d6] bg-[#faf8f5]">
          <p className="text-sm text-[#a0968c] text-center">
            💡 Coupons can be applied only once per order. Some offers may have minimum order requirements.
          </p>
        </div>
      </div>
    </div>
  );
}