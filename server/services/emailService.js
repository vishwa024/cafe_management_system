// const nodemailer = require('nodemailer');

// const hasEmailConfig = process.env.SMTP_HOST && process.env.SMTP_PORT && process.env.SMTP_USER && process.env.SMTP_PASS && process.env.FROM_EMAIL;
// const transporter = hasEmailConfig
//   ? nodemailer.createTransport({
//       host: process.env.SMTP_HOST,
//       port: process.env.SMTP_PORT,
//       secure: false,
//       auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
//     })
//   : null;

// const cafeEmailTemplate = (body) => `
// <!DOCTYPE html>
// <html>
// <head>
//   <style>
//     body { font-family: 'Segoe UI', sans-serif; background: #f5f5f5; margin: 0; padding: 0; }
//     .container { max-width: 560px; margin: 40px auto; background: #fff; border-radius: 12px; overflow: hidden; }
//     .header { background: linear-gradient(135deg, #e63946, #ff6b35); padding: 32px; text-align: center; }
//     .header h1 { color: #fff; margin: 0; font-size: 24px; }
//     .header p { color: rgba(255,255,255,0.85); margin: 6px 0 0; font-size: 13px; }
//     .body { padding: 32px; }
//     .otp-box { background: #f9f9f9; border: 2px dashed #e63946; border-radius: 12px; padding: 24px; text-align: center; margin: 20px 0; }
//     .otp-box span { font-size: 42px; font-weight: 800; letter-spacing: 10px; color: #e63946; }
//     .footer { background: #1a1a1a; color: #888; text-align: center; padding: 20px; font-size: 12px; }
//   </style>
// </head>
// <body>
//   <div class="container">
//     <div class="header">
//       <h1>Roller Coaster Cafe</h1>
//       <p>Every sip, every bite, an adventure.</p>
//     </div>
//     <div class="body">${body}</div>
//     <div class="footer">
//       &copy; 2024 Roller Coaster Cafe. All rights reserved.<br>
//       This is an automated email. Please do not reply.
//     </div>
//   </div>
// </body>
// </html>
// `;

// const sendMail = async ({ to, subject, body }) => {
//   if (!transporter) return;

//   try {
//     await transporter.sendMail({
//       from: `"Roller Coaster Cafe" <${process.env.FROM_EMAIL}>`,
//       to,
//       subject,
//       html: cafeEmailTemplate(body),
//     });
//   } catch (err) {
//     console.error('Email send failed:', err.message);
//   }
// };

// exports.sendAccountDeletionEmail = async ({ email, name, role, reason }) => sendMail({
//   to: email,
//   subject: 'Account Removal Notice - Roller Coaster Cafe',
//   body: `
//     <p>Hi ${name || 'there'},</p>
//     <p>Your <strong>${role || 'user'}</strong> account at Roller Coaster Cafe has been removed by an administrator.</p>
//     <p><strong>Reason:</strong></p>
//     <div class="otp-box" style="border-style: solid; text-align: left;">
//       <span style="font-size: 16px; font-weight: 600; letter-spacing: 0; color: #333;">${reason || 'No reason provided.'}</span>
//     </div>
//     <p>If you believe this was a mistake, please contact the admin team.</p>
//   `,
// });

// exports.sendOTPEmail = async (email, otp, name = 'there') => sendMail({
//   to: email,
//   subject: `Your OTP Code - ${otp}`,
//   body: `
//     <p>Hi ${name},</p>
//     <p>Your one-time verification code is:</p>
//     <div class="otp-box"><span>${otp}</span></div>
//     <p>This OTP is valid for <strong>5 minutes</strong>. Do not share it with anyone.</p>
//   `,
// });

// exports.sendResetEmail = async (email, otp, name = 'there') => sendMail({
//   to: email,
//   subject: 'Password Reset OTP - Roller Coaster Cafe',
//   body: `
//     <p>Hi ${name},</p>
//     <p>We received a request to reset your password. Your reset OTP is:</p>
//     <div class="otp-box"><span>${otp}</span></div>
//     <p>This OTP expires in <strong>5 minutes</strong>. If you did not request this, ignore this email.</p>
//   `,
// });

// exports.sendOrderConfirmation = async (email, name, order, statusOverride = '', messageOverride = '') => {
//   const status = (statusOverride || order?.status || 'placed').toLowerCase();
//   const appBaseUrl = process.env.CLIENT_URL || process.env.FRONTEND_URL || 'http://localhost:5173';
//   const trackUrl = order?._id ? `${appBaseUrl.replace(/\/$/, '')}/track/${order._id}` : '';

//   const subjectMap = {
//     placed: `Order Placed - #${order.orderId}`,
//     confirmed: `Order Confirmed - #${order.orderId}`,
//     ready: `Order Ready - #${order.orderId}`,
//     'out-for-delivery': `Order On The Way - #${order.orderId}`,
//     delivered: `Order Delivered - #${order.orderId}`,
//     completed: `Order Completed - #${order.orderId}`,
//     cancelled: `Order Cancelled - #${order.orderId}`,
//   };

//   const introMap = {
//     placed: `Your order <strong>#${order.orderId}</strong> has been placed successfully.`,
//     confirmed: `Your order <strong>#${order.orderId}</strong> has been confirmed by the cafe.`,
//     ready: `Your order <strong>#${order.orderId}</strong> is now ready.`,
//     'out-for-delivery': `Your order <strong>#${order.orderId}</strong> is now out for delivery.`,
//     delivered: `Your order <strong>#${order.orderId}</strong> has been delivered successfully.`,
//     completed: `Your order <strong>#${order.orderId}</strong> has been completed.`,
//     cancelled: `Your order <strong>#${order.orderId}</strong> has been cancelled.`,
//   };

//   return sendMail({
//     to: email,
//     subject: subjectMap[status] || `Order Update - #${order.orderId}`,
//     body: `
//       <p>Hi ${name},</p>
//       <p>${introMap[status] || `There is an update for your order <strong>#${order.orderId}</strong>.`}</p>
//       <p>Order Type: <strong>${order.orderType}</strong></p>
//       <p>Total: <strong>Rs. ${order.totalAmount}</strong></p>
//       ${messageOverride ? `<p>${messageOverride}</p>` : '<p>We will keep you updated as your order progresses.</p>'}
//       ${trackUrl ? `<p><a href="${trackUrl}" style="display:inline-block;padding:12px 18px;background:#e63946;color:#fff;text-decoration:none;border-radius:999px;font-weight:700;">Track Order</a></p>` : ''}
//     `,
//   });
// };

const nodemailer = require('nodemailer');

const hasEmailConfig = process.env.SMTP_HOST && process.env.SMTP_PORT && process.env.SMTP_USER && process.env.SMTP_PASS && process.env.FROM_EMAIL;
const transporter = hasEmailConfig
  ? nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    })
  : null;

const cafeEmailTemplate = (body) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Segoe UI', sans-serif; background: #f5f5f5; margin: 0; padding: 0; }
    .container { max-width: 560px; margin: 40px auto; background: #fff; border-radius: 12px; overflow: hidden; }
    .header { background: linear-gradient(135deg, #e63946, #ff6b35); padding: 32px; text-align: center; }
    .header h1 { color: #fff; margin: 0; font-size: 24px; }
    .header p { color: rgba(255,255,255,0.85); margin: 6px 0 0; font-size: 13px; }
    .body { padding: 32px; }
    .otp-box { background: #f9f9f9; border: 2px dashed #e63946; border-radius: 12px; padding: 24px; text-align: center; margin: 20px 0; }
    .otp-box span { font-size: 42px; font-weight: 800; letter-spacing: 10px; color: #e63946; }
    .footer { background: #1a1a1a; color: #888; text-align: center; padding: 20px; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Roller Coaster Cafe</h1>
      <p>Every sip, every bite, an adventure.</p>
    </div>
    <div class="body">${body}</div>
    <div class="footer">
      &copy; 2024 Roller Coaster Cafe. All rights reserved.<br>
      This is an automated email. Please do not reply.
    </div>
  </div>
</body>
</html>
`;

const sendMail = async ({ to, subject, body }) => {
  if (!transporter) return;

  try {
    await transporter.sendMail({
      from: `"Roller Coaster Cafe" <${process.env.FROM_EMAIL}>`,
      to,
      subject,
      html: cafeEmailTemplate(body),
    });
  } catch (err) {
    console.error('Email send failed:', err.message);
  }
};

const APP_BASE_URL = (process.env.CLIENT_URL || process.env.FRONTEND_URL || 'http://localhost:5173').replace(/\/$/, '');
const formatCurrency = (value) => `Rs. ${Number(value || 0).toFixed(2)}`;

const getTrackUrl = (order) => {
  if (!order?._id) return '';
  if (order.isPreOrder) return `${APP_BASE_URL}/track-preorder/${order._id}`;

  const normalizedType = String(order.orderType || '').toLowerCase();
  if (normalizedType === 'delivery') return `${APP_BASE_URL}/track-delivery/${order._id}`;
  if (normalizedType === 'takeaway') return `${APP_BASE_URL}/track-takeaway/${order._id}`;
  if (normalizedType === 'dine-in') return `${APP_BASE_URL}/track-dinein/${order._id}`;
  return `${APP_BASE_URL}/track/${order._id}`;
};

exports.sendOTPEmail = async (email, otp, name = 'there', options = {}) => {
  const purpose = String(options.purpose || '').toLowerCase();
  const heading = purpose === 'login' ? 'Your login OTP is ready' : 'Your one-time verification code is:';
  const helperText = purpose === 'login'
    ? 'Use this OTP to finish signing in to your Roller Coaster Cafe account.'
    : 'Use this OTP to continue your Roller Coaster Cafe request.';

  return sendMail({
    to: email,
    subject: purpose === 'login' ? 'Login OTP - Roller Coaster Cafe' : `Your OTP Code - ${otp}`,
    body: `
      <p>Hi ${name},</p>
      <p>${heading}</p>
      <div class="otp-box"><span>${otp}</span></div>
      <p>${helperText}</p>
      <p>This OTP is valid for <strong>5 minutes</strong>. Do not share it with anyone.</p>
    `,
  });
};

exports.sendResetEmail = async (email, otp, name = 'there') => sendMail({
  to: email,
  subject: 'Password Reset OTP - Roller Coaster Cafe',
  body: `
    <p>Hi ${name},</p>
    <p>We received a request to reset your password. Your reset OTP is:</p>
    <div class="otp-box"><span>${otp}</span></div>
    <p>This OTP expires in <strong>5 minutes</strong>. If you did not request this, ignore this email.</p>
  `,
});

exports.sendOrderConfirmation = async (email, name, order, statusOverride = '', messageOverride = '') => {
  const status = String(statusOverride || order?.status || 'placed').toLowerCase();
  const trackUrl = getTrackUrl(order);
  const subjectMap = {
    placed: `Order Placed - #${order.orderId}`,
    confirmed: `Order Confirmed - #${order.orderId}`,
    ready: `Order Ready - #${order.orderId}`,
    'out-for-delivery': `Order On The Way - #${order.orderId}`,
    delivered: `Order Delivered - #${order.orderId}`,
    completed: `Order Completed - #${order.orderId}`,
    cancelled: `Order Cancelled - #${order.orderId}`,
  };
  const introMap = {
    placed: `Your order <strong>#${order.orderId}</strong> has been placed successfully.`,
    confirmed: `Your order <strong>#${order.orderId}</strong> has been confirmed by the cafe.`,
    ready: `Your order <strong>#${order.orderId}</strong> is ready now.`,
    'out-for-delivery': `Your order <strong>#${order.orderId}</strong> is now out for delivery.`,
    delivered: `Your order <strong>#${order.orderId}</strong> has been delivered successfully.`,
    completed: `Your order <strong>#${order.orderId}</strong> has been completed successfully.`,
    cancelled: `Your order <strong>#${order.orderId}</strong> has been cancelled.`,
  };
  const deliveryOtpBlock = status === 'out-for-delivery' && order?.deliveryOTP
    ? `
      <p><strong>Delivery OTP</strong></p>
      <div class="otp-box"><span>${order.deliveryOTP}</span></div>
      <p>Share this OTP only when the rider hands over your order.</p>
    `
    : '';

  return sendMail({
    to: email,
    subject: subjectMap[status] || `Order Update - #${order.orderId}`,
    body: `
      <p>Hi ${name || 'there'},</p>
      <p>${introMap[status] || `There is an update for your order <strong>#${order.orderId}</strong>.`}</p>
      <p>Order Type: <strong>${order.orderType}</strong></p>
      <p>Total: <strong>Rs. ${Number(order.totalAmount || 0).toFixed(2)}</strong></p>
      ${messageOverride ? `<p>${messageOverride}</p>` : '<p>We will keep you updated as your order progresses.</p>'}
      ${deliveryOtpBlock}
      ${trackUrl && status === 'out-for-delivery' ? `<p><a href="${trackUrl}" style="display:inline-block;padding:12px 18px;background:#e63946;color:#fff;text-decoration:none;border-radius:999px;font-weight:700;">Track Order</a></p>` : ''}
    `,
  });
};

exports.sendSupplierPurchaseOrderEmail = async ({
  to,
  supplierName = 'Supplier',
  orderNumber,
  totalAmount,
  deliveryAddress,
  notes,
  items = [],
  acceptUrl,
  rejectUrl,
}) => sendMail({
  to,
  subject: `Purchase Order ${orderNumber} - Roller Coaster Cafe`,
  body: `
    <p>Hi ${supplierName},</p>
    <p>Roller Coaster Cafe created a purchase order for low-stock inventory items.</p>
    <p><strong>Order Number:</strong> ${orderNumber}</p>
    <p><strong>Delivery Address:</strong> ${deliveryAddress}</p>
    ${notes ? `<p><strong>Notes:</strong> ${notes}</p>` : ''}
    <div style="margin: 20px 0;">
      <p><strong>Items</strong></p>
      <ul>
        ${items.map((item) => `<li>${item.itemName}: ${item.quantity} ${item.unit || 'units'}</li>`).join('')}
      </ul>
    </div>
    <div style="margin: 24px 0;">
      <a href="${acceptUrl}" style="display:inline-block;padding:12px 18px;background:#16a34a;color:#fff;text-decoration:none;border-radius:8px;font-weight:600;margin-right:10px;">Accept Order</a>
      <a href="${rejectUrl}" style="display:inline-block;padding:12px 18px;background:#dc2626;color:#fff;text-decoration:none;border-radius:8px;font-weight:600;">Reject Order</a>
    </div>
    <p>You can respond directly from this email link.</p>
  `,
});
