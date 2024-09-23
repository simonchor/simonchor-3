const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const functions = require("firebase-functions");

const app = express();
const PORT = process.env.PORT || 8081;

// Middleware
app.use(cors({
    origin: 'https://simonchor-website.web.app', // 调整为你的前端运行的域名
}));
app.use(bodyParser.json());
app.use(express.json());

// MongoDB 连接
mongoose.connect( 'mongodb+srv://chorchungho:69744796simon@simonchors.vnrl9.mongodb.net/?retryWrites=true&w=majority&appName=simonchors', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log('Connected to MongoDB Atlas');
    })
    .catch((err) => {
        console.error('Failed to connect to MongoDB Atlas', err);
    });

// 用户 Schema
const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    profilePicture: { type: String, default: './LOL_Gwen_default_pro_pic.png' },
    description: { type: String, default: 'My name is, Atum!' },
    deckName: { type: String, default: 'Default Deck' }, // 增加该字段
    mainDeck: { type: [Number], default: [] }, // 假设卡组是卡片标识符的数组
    extraDeck: { type: [Number], default: [] }, // 增加该字段
    sideDeck: { type: [Number], default: [] } // 增加该字段
});

const User = mongoose.model('User', userSchema);

// 注册路由
app.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const newUser = new User({ name, email, password });
        await newUser.save();
        res.status(201).json(newUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// 登录路由
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    console.log('Login request received:', req.body); // 调试时打印请求体
    try {
        const user = await User.findOne({ email, password });
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(400).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error('Login error:', error); // 调试时打印错误
        res.status(400).json({ message: error.message });
    }
});

// 更新个人资料路由
app.put('/profile', async (req, res) => {
    const { email, name, profilePicture, description } = req.body;
    try {
        const user = await User.findOneAndUpdate({ email }, { name, profilePicture, description }, { new: true });
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(400).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// 获取用户路由
app.get('/api/user', async (req, res) => {
    const { email } = req.query; // 确保从查询参数中提取 email
    if (!email) {
        return res.status(400).json({ message: 'Email query parameter is required' });
    }
    try {
        const user = await User.findOne({ email });
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error(`Error fetching user: ${error.message}`);
        res.status(500).json({ message: error.message });
    }
});

// 登出路由
app.post('/api/logout', (req, res) => {
    res.status(200).send({ message: 'Logged out successfully' });
});

// 更新卡组信息路由
app.put('/build_deck', async (req, res) => {
    const { email, deckName, mainDeck, extraDeck, sideDeck } = req.body;
    try {
        const user = await User.findOneAndUpdate(
            { email },
            { deckName, mainDeck, extraDeck, sideDeck },
            { new: true } // 返回更新后的文档
        );
        if (user) {
            res.status(200).json({ message: 'Deck saved successfully', user });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Error saving deck:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// 定义主题 Schema
const themeSchema = new mongoose.Schema({
    cardName: String,
    deckname: String,
    comment: String,
    deckImage: String,
});

const Theme = mongoose.model('Theme', themeSchema);

// 获取主题路由
app.get('/api/themes', async (req, res) => {
    try {
        const themes = await Theme.find({});
        res.status(200).json(themes);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// 定义 strongcard Schema
const strongcardSchema = new mongoose.Schema({
    cardName: String,
    comment: String,
    strongcardImage: String,
});

const strongcard = mongoose.model('strongcard', strongcardSchema);

// 获取 strongcard 路由
app.get('/api/strongcards', async (req, res) => {
    try {
        const strongCards = await strongcard.find({});
        res.status(200).json(strongCards);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// 定义商店 Schema
const shopSchema = new mongoose.Schema({
    shopName: String,
    location: String,
    mapUrl: String,
    workingHours: String,
});

const HKIshop = mongoose.model('HKIshop', shopSchema);
const KWLshop = mongoose.model('KWLshop', shopSchema);
const NTshop = mongoose.model('NTshop', shopSchema);

// HKIshops 路由
app.get('/api/hkishops', async (req, res) => {
    try {
        const hkiShops = await HKIshop.find({});
        res.status(200).json(hkiShops);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch HKI shops data' });
    }
});

// KWLshops 路由
app.get('/api/kwlshops', async (req, res) => {
    try {
        const kwlShops = await KWLshop.find({});
        res.status(200).json(kwlShops);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch KWL shops data' });
    }
});

// NTshops 路由
app.get('/api/ntshops', async (req, res) => {
    try {
        const ntShops = await NTshop.find({});
        res.status(200).json(ntShops);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch NT shops data' });
    }
});

// 定义 cardexplain Schema
const cardexplainSchema = new mongoose.Schema({
    sampleName: String,
});

const SampleName = mongoose.model('SampleName', cardexplainSchema);

// 获取 sampleName 路由
app.get('/api/sampleName', async (req, res) => {
    try {
        const samplename = await SampleName.find({});
        res.status(200).json(samplename);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch sampleName data' });
    }
});

exports.app = functions.https.onRequest(app);
