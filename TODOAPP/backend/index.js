const express = require("express");
const routes = require("./routes/index.js");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const mongoose = require("mongoose");
const MongoStore = require("connect-mongo");
const passport = require("passport");
const cors = require("cors");
require("./strategies/local-strategies.js");
require("./strategies/discord-strategies.js");
require("./strategies/facebook-strategies.js");
require("./strategies/google-strategies.js");


const app = express();

mongoose.connect("mongodb://localhost:27017/mernstack")
    .then(() => console.log("Connected to database"))
    .catch((err) => console.log(`Error: ${err}`));

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}));

app.use(express.json());
app.use(cookieParser("helloworld"));

app.use(
    session({
        secret: "dipesh ko id",
        saveUninitialized: false,
        resave: false,
        cookie: {
            maxAge: 60000 * 60, // 1 hour
        },
        store: MongoStore.create({
            client: mongoose.connection.getClient(),
        }),
    })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(routes);

app.get('/home', (req, res) => {
    if (req.isAuthenticated()) {
        return res.status(200).send('Welcome to the home page!');
    } else {
        return res.status(401).send('Unauthorized');
    }
});

app.get("/api/auth/status", (req, res) => {
    console.log("Checking authentication status:", req.isAuthenticated(), req.user);
    if (req.isAuthenticated()) {
        res.status(200).send({ email: req.user.email});
    } else {
        res.sendStatus(401); // Unauthorized if no user is logged in
    }
});


app.get("/api/auth/discord", passport.authenticate("discord"));
app.get('/api/auth/discord/redirect', passport.authenticate('discord', {
    failureRedirect: 'http://localhost:3000/login'
}), (req, res) => {
    req.logIn(req.user, (err) => {
        if (err) {
            console.error("Error during Discord login:", err);
            return res.redirect('/login');
        }
        res.redirect('http://localhost:3000/');
    });
});

app.get("/api/auth/facebook", passport.authenticate("facebook"));
app.get('/api/auth/facebook/redirect', passport.authenticate('facebook', {
    failureRedirect: 'http://localhost:3000/login'
}), (req, res) => {
    req.logIn(req.user, (err) => {
        if (err) {
            console.error("Error during Facebook login:", err);
            return res.redirect('/login');
        }
        res.redirect('http://localhost:3000/');
    });
});

app.get('/api/auth/google', passport.authenticate('google'));
app.get('/api/auth/google/redirect', passport.authenticate('google', {
    failureRedirect: 'http://localhost:3000/login'
}), (req, res) => {
    req.logIn(req.user, (err) => {
        if (err) {
            console.error("Error during Google login:", err);
            return res.redirect('/login');
        }
        res.redirect('http://localhost:3000/'); // Redirect to home or another page
    });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server has started on port ${PORT}`);
});

