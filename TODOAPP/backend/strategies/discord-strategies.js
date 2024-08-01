const passport = require('passport');
const { Strategy } = require('passport-discord');
const { User } = require('../models/users.js');

passport.serializeUser((user, done) => {
    // console.log(`Inside serializeUser with user: ${user}`);
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    // console.log(`Deserializing user with id: ${id}`);
    try {
        const findUser = await User.findById(id);
        if (!findUser) {
            // console.log(`No user found with id: ${id}`);
            return done(null, false);
        }
        console.log(`User deserialized: ${findUser}`);
        done(null, findUser);
    } catch (err) {
        // console.error(`Error during deserialization: ${err}`);
        done(err, null);
    }
});

passport.use(
    new Strategy(
        {    // use your credentials
            clientID: "XXXXXXXXXXXXX",
            clientSecret: "XXXXXXXXXXXX",
            callbackURL: "http://localhost:4000/api/auth/discord/redirect",
            scope:["identify","email"],
        },
        async (accessToken, refreshToken, profile, done) => {
            // console.log("Discord profile received:", profile);
            let user;
            try {
                user = await User.findOne({ email: profile.email });
                if (!user) {
                    const newUser = new User({
                        email: profile.email,// discord -email is set to be the email/ problem with this is that when the user login with discord they cannot use their email for signup
                        password: profile.id, // discord -id is set to be the password
                    });
                    const newSavedUser = await newUser.save();
                    // console.log("New user created and saved:", newSavedUser);
                }
                user = await User.findOne({ email: profile.email });
                // console.log(`User found in database: ${user}`);
                return done(null, user);
            } catch (err) {
                // console.error(`Error during Discord authentication: ${err}`);
                return done(err, null);
            }
        }
    )
);

module.exports = passport;
