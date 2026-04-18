// import { Link } from 'react-router-dom';
// import { motion } from 'framer-motion';

// export default function OperationsFallback({
//   eyebrow,
//   title,
//   description,
//   metrics = [],
//   highlights = [],
//   primaryLink = { to: '/', label: 'Back Home' },
//   secondaryLink,
// }) {
//   return (
//     <div className="min-h-screen bg-cream font-body">
//       <div className="max-w-6xl mx-auto px-6 py-10">
//         <div className="flex items-center justify-between gap-4 mb-8">
//           <Link to="/">
//             <img
//               src="https://rollercoastercafe.com/assets/images/roller_logo.png"
//               alt="Roller Coaster Cafe"
//               className="h-12 object-contain"
//             />
//           </Link>

//           <div className="flex gap-3">
//             {secondaryLink && (
//               <Link to={secondaryLink.to} className="btn-outline text-sm py-2">
//                 {secondaryLink.label}
//               </Link>
//             )}
//             <Link to={primaryLink.to} className="btn-primary text-sm py-2">
//               {primaryLink.label}
//             </Link>
//           </div>
//         </div>

//         <motion.div
//           initial={{ opacity: 0, y: 18 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="grid lg:grid-cols-[1.2fr,0.8fr] gap-6"
//         >
//           <section className="card p-8">
//             <p className="section-subtitle mb-3">{eyebrow}</p>
//             <h1 className="font-display text-4xl font-bold text-dark mb-4">{title}</h1>
//             <p className="text-gray-500 leading-relaxed max-w-2xl">{description}</p>

//             {metrics.length > 0 && (
//               <div className="grid sm:grid-cols-3 gap-4 mt-8">
//                 {metrics.map((metric) => (
//                   <div
//                     key={metric.label}
//                     className="rounded-2xl border border-gray-100 bg-gray-50 p-5"
//                   >
//                     <p className="text-3xl font-display font-bold text-primary">
//                       {metric.value}
//                     </p>
//                     <p className="text-sm font-semibold text-dark mt-1">
//                       {metric.label}
//                     </p>
//                     <p className="text-xs text-gray-500 mt-2">
//                       {metric.note}
//                     </p>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </section>

//           <section className="card p-8">
//             <h2 className="font-display text-2xl font-bold text-dark mb-4">
//               Ready For The Next Step
//             </h2>
//             <div className="space-y-3">
//               {highlights.map((item) => (
//                 <div
//                   key={item.title}
//                   className="rounded-2xl bg-primary/5 border border-primary/10 p-4"
//                 >
//                   <p className="font-semibold text-dark">{item.title}</p>
//                   <p className="text-sm text-gray-500 mt-1">{item.body}</p>
//                 </div>
//               ))}
//             </div>
//           </section>
//         </motion.div>
//       </div>
//     </div>
//   );
// }

import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function OperationsFallback({
  eyebrow,
  title,
  description,
  metrics = [],
  highlights = [],
  primaryLink = { to: '/', label: 'Back Home' },
  secondaryLink,
}) {
  return (
    <div className="min-h-screen bg-cream font-body">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between gap-4 mb-8">
          <Link to="/dashboard">
            <img
              src="https://rollercoastercafe.com/assets/images/roller_logo.png"
              alt="Roller Coaster Cafe"
              className="h-12 object-contain"
            />
          </Link>
          <div className="flex gap-3">
            {secondaryLink && (
              <Link to={secondaryLink.to} className="btn-outline text-sm py-2">
                {secondaryLink.label}
              </Link>
            )}
            <Link to={primaryLink.to} className="btn-primary text-sm py-2">
              {primaryLink.label}
            </Link>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid lg:grid-cols-[1.2fr,0.8fr] gap-6"
        >
          <section className="card p-8">
            <p className="section-subtitle mb-3">{eyebrow}</p>
            <h1 className="font-display text-4xl font-bold text-dark mb-4">{title}</h1>
            <p className="text-gray-500 leading-relaxed max-w-2xl">{description}</p>

            {metrics.length > 0 && (
              <div className="grid sm:grid-cols-3 gap-4 mt-8">
                {metrics.map((metric) => (
                  <div key={metric.label} className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
                    <p className="text-3xl font-display font-bold text-primary">{metric.value}</p>
                    <p className="text-sm font-semibold text-dark mt-1">{metric.label}</p>
                    <p className="text-xs text-gray-500 mt-2">{metric.note}</p>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="card p-8">
            <h2 className="font-display text-2xl font-bold text-dark mb-4">Ready For The Next Step</h2>
            <div className="space-y-3">
              {highlights.map((item) => (
                <div key={item.title} className="rounded-2xl bg-primary/5 border border-primary/10 p-4">
                  <p className="font-semibold text-dark">{item.title}</p>
                  <p className="text-sm text-gray-500 mt-1">{item.body}</p>
                </div>
              ))}
            </div>
          </section>
        </motion.div>
      </div>
    </div>
  );
}

