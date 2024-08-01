const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { User } = require('../models/users.js');
const { comparePassword } = require('../utils/helpers');

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, async (email, password, done) => {
    try {
        const user = await User.findOne({ email: email });
        if (!user) {
            // console.log('User not found with email:', email);
            return done(null, false, { message: 'User not found' });
        }

        const isMatch = comparePassword(password, user.password);
        if (!isMatch) {
            // console.log('Invalid password for user:', email);
            return done(null, false, { message: 'Invalid password' });
        }

        return done(null, user);
    } catch (err) {
        // console.error('Error during authentication:', err);
        return done(err);
    }
}));

passport.serializeUser((user, done) => {
    // console.log('Serializing user:', user);
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    console.log('Deserializing user with id:', id);
    try {
        const user = await User.findById(id);
        if (!user) {
            // console.log('User not found with id:', id);
            return done(null, false);
        }
        // console.log('User found:', user);
        done(null, user);
    } catch (err) {
        // console.error('Error during deserialization:', err);
        done(err, null);
    }
});

module.exports = passport;
