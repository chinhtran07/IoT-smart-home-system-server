const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const router = express.Router();
const config = require('../config/jwt');
const User = require('../models/User');


router.post('/register', async (req, res) => {
    const { username, password, firstName, lastName, email } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);

    try {
        const newUser = await User.create({ username, password: hashedPassword, firstName, lastName, email });
        res.status(201).json({ message: 'User registered', userId: newUser.id });
    } catch (err) {
        res.status(500).json({ error: 'User registration failed' , trace: `${err}`});
    }
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ where: { username } });

    if (!user) return res.status(400).json({ message: 'User not found' });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(401).json({ message: 'Invalid password' });

    user.lastLogin = new Date();
    await user.save();

    const accessToken = jwt.sign({ id: user.id, username: user.username }, config.secret, {
        expiresIn: config.expiresIn,
    });

    res.json({ accessToken });
});

module.exports = router;