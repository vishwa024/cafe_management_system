// export default function AdminPagination({
//   page,
//   totalPages,
//   totalItems,
//   pageSize,
//   label = 'items',
//   onPageChange,
// }) {
//   if (!totalItems) return null;

//   const start = (page - 1) * pageSize + 1;
//   const end = Math.min(page * pageSize, totalItems);
//   const pageItems = [];

//   for (let current = 1; current <= totalPages; current += 1) {
//     const isEdgePage = current === 1 || current === totalPages;
//     const isNearCurrent = Math.abs(current - page) <= 1;

//     if (isEdgePage || isNearCurrent) {
//       pageItems.push(current);
//     } else if (pageItems[pageItems.length - 1] !== '...') {
//       pageItems.push('...');
//     }
//   }

//   return (
//     <div className="flex flex-wrap items-center justify-between gap-4 mt-6">
//       <p className="text-sm text-gray-500">
//         Showing {start}-{end} of {totalItems} {label}
//       </p>

//       <div className="flex items-center gap-2">
//         <button
//           onClick={() => onPageChange(page - 1)}
//           disabled={page === 1}
//           className="px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed hover:border-primary"
//         >
//           Previous
//         </button>

//         <div className="flex items-center gap-2">
//           {pageItems.map((item, index) => (
//             item === '...' ? (
//               <span
//                 key={`ellipsis-${index}`}
//                 className="px-2 py-2 text-sm font-semibold text-gray-400"
//               >
//                 ...
//               </span>
//             ) : (
//               <button
//                 key={item}
//                 onClick={() => onPageChange(item)}
//                 className={`min-w-[42px] px-3 py-2 rounded-xl border text-sm font-semibold transition-colors ${
//                   page === item
//                     ? 'border-primary bg-primary text-white'
//                     : 'border-gray-200 bg-white text-gray-700 hover:border-primary'
//                 }`}
//               >
//                 {item}
//               </button>
//             )
//           ))}
//         </div>

//         <button
//           onClick={() => onPageChange(page + 1)}
//           disabled={page === totalPages}
//           className="px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed hover:border-primary"
//         >
//           Next
//         </button>
//       </div>
//     </div>
//   );
// }
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function AdminPagination({
  page,
  totalPages,
  totalItems,
  pageSize,
  label = 'items',
  onPageChange,
}) {
  if (!totalItems || totalPages <= 1) return null;

  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalItems);
  const pageItems = [];

  for (let current = 1; current <= totalPages; current += 1) {
    const isEdgePage = current === 1 || current === totalPages;
    const isNearCurrent = Math.abs(current - page) <= 1;

    if (isEdgePage || isNearCurrent) {
      pageItems.push(current);
    } else if (pageItems[pageItems.length - 1] !== '...') {
      pageItems.push('...');
    }
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 mt-6 pt-4 border-t border-[#e8e0d6]">
      <p className="text-sm text-[#6b5f54]">
        Showing <span className="font-medium text-[#3f3328]">{start}-{end}</span> of{' '}
        <span className="font-medium text-[#3f3328]">{totalItems}</span> {label}
      </p>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className="px-4 py-2 rounded-xl border border-[#e8e0d6] bg-white text-sm font-medium text-[#6b5f54] disabled:opacity-40 disabled:cursor-not-allowed hover:border-[#b97844] hover:text-[#b97844] transition-all"
        >
          Previous
        </button>

        <div className="flex items-center gap-2">
          {pageItems.map((item, index) => (
            item === '...' ? (
              <span key={`ellipsis-${index}`} className="px-2 py-2 text-sm font-medium text-[#a0968c]">
                ...
              </span>
            ) : (
              <button
                key={item}
                onClick={() => onPageChange(item)}
                className={`min-w-[42px] px-3 py-2 rounded-xl border text-sm font-medium transition-all ${
                  page === item
                    ? 'border-[#b97844] bg-[#b97844] text-white'
                    : 'border-[#e8e0d6] bg-white text-[#6b5f54] hover:border-[#b97844] hover:text-[#b97844]'
                }`}
              >
                {item}
              </button>
            )
          ))}
        </div>

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          className="px-4 py-2 rounded-xl border border-[#e8e0d6] bg-white text-sm font-medium text-[#6b5f54] disabled:opacity-40 disabled:cursor-not-allowed hover:border-[#b97844] hover:text-[#b97844] transition-all"
        >
          Next
        </button>
      </div>
    </div>
  );
}