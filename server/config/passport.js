// // const GoogleStrategy = require('passport-google-oauth20').Strategy;
// // const User = require('../models/User');

// // module.exports = (passport) => {
// //   passport.use(
// //     new GoogleStrategy(
// //       {
// //         clientID: process.env.GOOGLE_CLIENT_ID,
// //         clientSecret: process.env.GOOGLE_CLIENT_SECRET,
// //         callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5000/api/auth/google/callback',
// //       },
// //       async (accessToken, refreshToken, profile, done) => {
// //         try {
// //           console.log('Google OAuth - Email:', profile.emails?.[0]?.value);

// //           if (!profile.emails || !profile.emails[0]) {
// //             return done(new Error('No email found from Google'), null);
// //           }

// //           const email = profile.emails[0].value;

// //           // Check if user exists
// //           let user = await User.findOne({ email });

// //           if (!user) {
// //             // Create new user
// //             user = await User.create({
// //               name: profile.displayName || email.split('@')[0],
// //               email: email,
// //               googleId: profile.id,
// //               isEmailVerified: true,
// //               role: 'customer',
// //               profilePicture: profile.photos?.[0]?.value || null,
// //             });
// //             console.log('New user created via Google:', user.email);
// //           } else if (!user.googleId) {
// //             // Update existing user with googleId
// //             user.googleId = profile.id;
// //             await user.save();
// //             console.log('Existing user updated with Google ID:', user.email);
// //           }

// //           return done(null, user);
// //         } catch (error) {
// //           console.error('Google Strategy Error:', error);
// //           return done(error, null);
// //         }
// //       }
// //     )
// //   );

// //   passport.serializeUser((user, done) => {
// //     done(null, user.id);
// //   });

// //   passport.deserializeUser(async (id, done) => {
// //     try {
// //       const user = await User.findById(id);
// //       done(null, user);
// //     } catch (error) {
// //       done(error, null);
// //     }
// //   });
// // };

// const GoogleStrategy = require('passport-google-oauth20').Strategy;
// const User = require('../models/User');

// // Don't wrap in a function - export directly
// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//       callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5000/api/auth/google/callback',
//     },
//     async (accessToken, refreshToken, profile, done) => {
//       try {
//         console.log('Google OAuth - Email:', profile.emails?.[0]?.value);

//         if (!profile.emails || !profile.emails[0]) {
//           return done(new Error('No email found from Google'), null);
//         }

//         const email = profile.emails[0].value;

//         let user = await User.findOne({ email });

//         if (!user) {
//           user = await User.create({
//             name: profile.displayName || email.split('@')[0],
//             email: email,
//             googleId: profile.id,
//             isEmailVerified: true,
//             role: 'customer',
//           });
//           console.log('New user created via Google:', user.email);
//         } else if (!user.googleId) {
//           user.googleId = profile.id;
//           await user.save();
//           console.log('Existing user updated with Google ID:', user.email);
//         }

//         return done(null, user);
//       } catch (error) {
//         console.error('Google Strategy Error:', error);
//         return done(error, null);
//       }
//     }
//   )
// );

// passport.serializeUser((user, done) => {
//   done(null, user.id);
// });

// passport.deserializeUser(async (id, done) => {
//   try {
//     const user = await User.findById(id);
//     done(null, user);
//   } catch (error) {
//     done(error, null);
//   }
// });

// module.exports = passport;

const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

module.exports = function(passport) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5000/api/auth/google/callback',
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          console.log('Google OAuth - Email:', profile.emails?.[0]?.value);

          if (!profile.emails || !profile.emails[0]) {
            return done(new Error('No email found from Google'), null);
          }

          const email = profile.emails[0].value;

          let user = await User.findOne({ email });

          if (!user) {
            user = await User.create({
              name: profile.displayName || email.split('@')[0],
              email: email,
              googleId: profile.id,
              isEmailVerified: true,
              role: 'customer',
            });
            console.log('New user created via Google:', user.email);
          } else if (!user.googleId) {
            user.googleId = profile.id;
            await user.save();
            console.log('Existing user updated with Google ID:', user.email);
          }

          return done(null, user);
        } catch (error) {
          console.error('Google Strategy Error:', error);
          return done(error, null);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });
};