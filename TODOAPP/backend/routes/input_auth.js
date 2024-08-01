const express = require('express');
const {User} = require('../models/users');
const { validationResult, checkSchema, matchedData } = require("express-validator");
const { hashPassword } = require('../utils/helpers');
const passport = require("passport");
const { createUserValidationSchema } = require("../utils/validationSchemas");

const router = express.Router();

router.post('/register', checkSchema(createUserValidationSchema), async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) return res.status(400).send(result.array());
    const data = matchedData(req);
    console.log(data);
    data.password = hashPassword(data.password);
    console.log(data);
    const newUser = new User(data);
    try {
        const newSavedUser = await newUser.save();
        res.status(201).json({ message: 'User registered successfully', user: newSavedUser });
    } catch (err) {
        console.error(err);
        if (err.code === 11000) {
            res.status(400).json({ error: 'Email already in use' });
        } else {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
});

router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            console.error("Error during authentication:", err);
            return res.status(500).json({ error: err.message });
        }
        if (!user) {
            console.log("Authentication failed: User not found or invalid password");
            return res.status(400).json({ error: 'Invalid email or password' });
        }
        req.logIn(user, (err) => {
            if (err) {
                console.error("Error during login:", err);
                return res.status(500).json({ error: err.message });
            }
            console.log("User logged in successfully:", user);
            return res.status(200).json({ message: 'Logged in successfully', user });
        });
    })(req, res, next);
});


router.post('/logout', (req, res) => {
    console.log('Received logout request');
    if (!req.user) {
        console.log('No user is currently logged in');
        res.redirect('http://localhost:3000/login')
        return res.status(401).json({ message: 'No user is currently logged in' });
    }

    req.logout((err) => {
        if (err) {
            return res.status(500).json({ message: 'Logout failed', error: err });
        }
        req.session.destroy((err) => {
            if (err) {
                return res.status(500).json({ message: 'Session destroy failed', error: err });
            }
            res.clearCookie('connect.sid'); // Clear the session cookie
            return res.status(200).json({ message: 'Logged out successfully' });
        });
    });
});


module.exports = router;
