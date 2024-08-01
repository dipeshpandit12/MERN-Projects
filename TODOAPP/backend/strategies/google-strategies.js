const passport = require('passport');
const { Strategy } = require('passport-google-oauth20');
const { User } = require('../models/users.js'); // Adjust path as needed

passport.serializeUser((user, done) => {
    // Serialize user ID to store in session
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    // Deserialize user based on ID from session
    try {
        const findUser = await User.findById(id);
        if (!findUser) {
            return done(null, false);
        }
        done(null, findUser);
    } catch (err) {
        done(err, null);
    }
});

passport.use(new Strategy({
    clientID: "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
    clientSecret: "XXXXXXXXXXXXXXXXXXXXXXXXXXX",
    callbackURL: "http://localhost:4000/api/auth/google/redirect",
    scope: ['profile'] // Request profile information
}, async (accessToken, refreshToken, profile, done) => {
    const googleId = profile.id;
    const name = `${profile.name.givenName}_${profile.name.familyName}`;
    // console.log(profile);
    let user;
    try {
        // Find user by Google ID
        user = await User.findOne({email: name });
        if (!user) {
            // Create a new user if not found
            const newUser = new User({
                email:name,
                password: googleId
            });
            const newSavedUser = await newUser.save();
        }
        // Find the user again after saving
        user = await User.findOne({email: name });
        return done(null, user);
    } catch (err) {
        return done(err, null);
    }
}));

module.exports = passport;
