const passport = require('passport');
const {Strategy} = require('passport-facebook');;
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
        {    
            clientID: "XXXXXXXXXXXXXXX",
            clientSecret: "XXXXXXXXXXXXXXXXXXXX",
            callbackURL: "http://localhost:4000/api/auth/facebook/redirect",
            profileFields: ["id", "name"] // Include username field
        },
        async (accessToken, refreshToken, profile, done) => {
            // console.log("Facebook profile received:", profile);
            const name=`${profile.name.givenName}-${profile.name.familyName}`;
            const facebookId=profile.id
            let user;
            try {
                user = await User.findOne({ email: name });
                if (!user) {
                    const newUser = new User({
                        email:name,
                        password: facebookId,
                    });
                    const newSavedUser = await newUser.save();
                    // console.log("New user created and saved:", newSavedUser);
                }
                user = await User.findOne({ email: name});
                // console.log(`User found in database: ${user}`);
                return done(null, user);
            }
            catch (err) {
                // console.error(`Error during Facebook authentication: ${err}`);
                return done(err, null);
            }
        }
    )
);

module.exports = passport;
