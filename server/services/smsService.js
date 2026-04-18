const axios = require('axios');

const FAST2SMS_BASE_URL = 'https://www.fast2sms.com/dev/bulkV2';
const hasFast2SmsConfig = Boolean(process.env.FAST2SMS_AUTHORIZATION);
const hasTwilioConfig = Boolean(
  process.env.TWILIO_ACCOUNT_SID
  && process.env.TWILIO_AUTH_TOKEN
  && process.env.TWILIO_PHONE
);

const getTrackUrl = (order) => {
  if (!order?._id) return '';
  const appBaseUrl = process.env.CLIENT_URL || process.env.FRONTEND_URL || 'http://localhost:5173';
  return `${appBaseUrl.replace(/\/$/, '')}/track/${order._id}`;
};

const normalizeFast2SmsNumber = (phone) => {
  const digits = String(phone || '').replace(/\D/g, '');
  if (!digits) return '';
  if (digits.length === 10) return digits;
  if (digits.length > 10) return digits.slice(-10);
  return digits;
};

const sendFast2Sms = async (phone, message) => {
  if (!hasFast2SmsConfig || !message) return;

  const mobile = normalizeFast2SmsNumber(phone);
  if (!mobile || mobile.length < 10) {
    console.warn(`Fast2SMS skipped: invalid phone number "${phone}"`);
    return;
  }

  try {
    await axios.post(
      FAST2SMS_BASE_URL,
      {
        route: process.env.FAST2SMS_ROUTE || 'q',
        message,
        flash: '0',
        numbers: mobile,
      },
      {
        headers: {
          authorization: process.env.FAST2SMS_AUTHORIZATION,
          'Content-Type': 'application/json',
        },
        timeout: 15000,
      }
    );
  } catch (err) {
    console.error('Fast2SMS send failed:', err.response?.data || err.message);
  }
};

const sendTwilioSms = async (phone, message) => {
  if (!hasTwilioConfig || !message) return;

  try {
    const twilio = require('twilio');
    const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE,
      to: phone,
    });
  } catch (err) {
    console.error('Twilio SMS send failed:', err.message);
  }
};

const sendSms = async (phone, message) => {
  if (hasFast2SmsConfig) {
    await sendFast2Sms(phone, message);
    return;
  }

  if (hasTwilioConfig) {
    await sendTwilioSms(phone, message);
    return;
  }

  console.warn('SMS skipped: no Fast2SMS or Twilio configuration found.');
};

exports.sendOTPSMS = async (phone, otp) => {
  await sendSms(phone, `Your Roller Coaster Cafe OTP is: ${otp}. Valid for 5 minutes. Do not share.`);
};

exports.sendOrderSMS = async (phone, orderOrId, status, options = {}) => {
  if (!phone) return;

  const orderId = typeof orderOrId === 'string' ? orderOrId : orderOrId?.orderId;
  const trackUrl = options.trackUrl || (typeof orderOrId === 'object' ? getTrackUrl(orderOrId) : '');
  const deliveryPhone = options.deliveryPhone || orderOrId?.deliveryAgent?.phone || '';
  const deliveryOtp = String(options.deliveryOtp || orderOrId?.deliveryOTP || '').trim();
  const messageOverride = options.messageOverride?.trim?.();

  const messages = {
    placed: `Order #${orderId} has been placed at Roller Coaster Cafe. We will update you as the cafe accepts it.${trackUrl ? ` Track here: ${trackUrl}` : ''}`,
    confirmed: `Order #${orderId} confirmed at Roller Coaster Cafe. We are preparing your order.`,
    ready: `Order #${orderId} is ready for pickup at Roller Coaster Cafe.`,
    'out-for-delivery': `Order #${orderId} is out for delivery.${deliveryOtp ? ` Your OTP is ${deliveryOtp}.` : ''}${deliveryPhone ? ` Rider: ${deliveryPhone}.` : ''}${trackUrl ? ` Track here: ${trackUrl}` : ''}`,
    delivered: `Order #${orderId} delivered. Enjoy your meal and rate us in the app.`,
    cancelled: `Order #${orderId} has been cancelled. Refunds are processed within 3-5 days.`,
  };

  const body = messageOverride || messages[status];
  if (!body) return;

  await sendSms(phone, body);
};

exports.sendAdministrativeSMS = async (phone, message) => {
  if (!message) return;
  await sendSms(phone, message);
};
