// const express = require('express');
// const router = express.Router();
// const passport = require('passport');
// const {
//   register, login, sendOTP, verifyOTP,
//   refreshToken, logout, forgotPassword, resetPassword,
// } = require('../controllers/authController');
// const { generateAccessToken } = require('../utils/generateToken');

// router.post('/register', register);
// router.post('/login', login);
// router.post('/send-otp', sendOTP);
// router.post('/verify-otp', verifyOTP);
// router.post('/refresh-token', refreshToken);
// router.post('/logout', logout);
// router.post('/forgot-password', forgotPassword);
// router.post('/reset-password', resetPassword);

// // Google OAuth
// router.get('/google', 
//   passport.authenticate('google', { 
//     scope: ['profile', 'email'], 
//     session: false,
//     prompt: 'select_account'
//   })
// );

// router.get('/google/callback',
//   passport.authenticate('google', { 
//     session: false, 
//     failureRedirect: `${process.env.CLIENT_URL || 'http://localhost:5173'}/login?error=google_auth_failed`
//   }),
//   (req, res) => {
//     try {
//       const accessToken = generateAccessToken(req.user);
//       const frontendUrl = process.env.CLIENT_URL || 'http://localhost:5173';
//       // Redirect to frontend OAuth handler with token
//       res.redirect(`${frontendUrl}/oauth-redirect?token=${accessToken}&user=${encodeURIComponent(JSON.stringify(req.user))}`);
//     } catch (error) {
//       console.error('Google callback error:', error);
//       res.redirect(`${process.env.CLIENT_URL || 'http://localhost:5173'}/login?error=token_generation_failed`);
//     }
//   }
// );


// module.exports = router;


const express = require('express');
const router = express.Router();
const passport = require('passport');
const {
  register, login, sendOTP, verifyOTP,
  refreshToken, logout, forgotPassword, resetPassword,
} = require('../controllers/authController');
const { generateAccessToken } = require('../utils/generateToken');
const { protect } = require('../middleware/auth');
const User = require('../models/User');

router.post('/register', register);
router.post('/login', login);
router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);
router.post('/refresh-token', refreshToken);
router.post('/logout', logout);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Update profile
router.put('/profile', protect, async (req, res) => {
  try {
    const { name, phone, profilePhoto } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { 
        name: name || req.user.name,
        phone: phone || req.user.phone,
        profilePhoto: profilePhoto || req.user.profilePhoto
      },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        profilePhoto: user.profilePhoto,
        role: user.role
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get profile
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Google OAuth
router.get('/google', 
  passport.authenticate('google', { 
    scope: ['profile', 'email'], 
    session: false,
    prompt: 'select_account'
  })
);

router.get('/google/callback',
  passport.authenticate('google', { 
    session: false, 
    failureRedirect: `${process.env.CLIENT_URL || 'http://localhost:5173'}/login?error=google_auth_failed`
  }),
  (req, res) => {
    try {
      const accessToken = generateAccessToken(req.user);
      const frontendUrl = process.env.CLIENT_URL || 'http://localhost:5173';
      // Redirect to frontend OAuth handler with token
      res.redirect(`${frontendUrl}/oauth-redirect?token=${accessToken}&user=${encodeURIComponent(JSON.stringify(req.user))}`);
    } catch (error) {
      console.error('Google callback error:', error);
      res.redirect(`${process.env.CLIENT_URL || 'http://localhost:5173'}/login?error=token_generation_failed`);
    }
  }
);

module.exports = router;