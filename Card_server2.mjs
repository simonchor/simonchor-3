import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: 'http://localhost:5173', // Adjust this if your frontend is running on a different port
}));
app.use(bodyParser.json());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/Card_search_users_info', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((err) => {
        console.error('Failed to connect to MongoDB', err);
    });

// User Schema
const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    profilePicture: { type: String, default: './LOL_Gwen_default_pro_pic.png' },
    description: { type: String, default: 'My name is, Atum!' },
    deckName: { type: String, default: 'Default Deck' }, // Add this field
    mainDeck: { type: [Number], default: [] }, // Add this field, assuming decks are arrays of card identifiers
    extraDeck: { type: [Number], default: [] }, // Add this field
    sideDeck: { type: [Number], default: [] } // Add this field
});

const User = mongoose.model('User', userSchema);

// Register route
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

// Login route
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    console.log('Login request received:', req.body); // Log request body for debugging
    try {
        const user = await User.findOne({ email, password });
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(400).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error('Login error:', error); // Log error for debugging
        res.status(400).json({ message: error.message });
    }
});

// Update Profile route
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

// Get User route
app.get('/api/user', async (req, res) => {
    const { email } = req.query; // Ensure you are extracting email from query parameters
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

// Logout route
app.post('/api/logout', (req, res) => {
    res.status(200).send({ message: 'Logged out successfully' });
});

// Update Deck Information route
app.put('/build_deck', async (req, res) => {
    const { email, deckName, mainDeck, extraDeck, sideDeck } = req.body;
    try {
        const user = await User.findOneAndUpdate(
            { email },
            { deckName, mainDeck, extraDeck, sideDeck },
            { new: true } // Return the updated document
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

// Define Theme schema
const themeSchema = new mongoose.Schema({
    cardName: String,
    deckname: String,
    comment: String,
    deckImage: String,
});

const Theme = mongoose.model('Theme', themeSchema);

// Route to get themes
app.get('/api/themes', async (req, res) => {
    try {
        const themes = await Theme.find({});
        res.status(200).json(themes);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// Define strongcard schema
const strongcardSchema = new mongoose.Schema({
    cardName: String,
    comment: String,
    strongcardImage: String,
});

const strongcard = mongoose.model('strongcard', strongcardSchema);

// Route to get strongcard
app.get('/api/strongcards', async (req, res) => {
    try {
        const strongCards = await strongcard.find({});
        res.status(200).json(strongCards);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// Define Shop Schema
const shopSchema = new mongoose.Schema({
    shopName: String,
    location: String,
    mapUrl: String,
    workingHours: String,
});

const HKIshop = mongoose.model('HKIshop', shopSchema);
const KWLshop = mongoose.model('KWLshop', shopSchema);
const NTshop = mongoose.model('NTshop', shopSchema);

// Endpoint for HKIshops
app.get('/api/hkishops', async (req, res) => {
    try {
        const hkiShops = await HKIshop.find({});
        res.status(200).json(hkiShops);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch HKI shops data' });
    }
});

// Endpoint for KWLshops
app.get('/api/kwlshops', async (req, res) => {
    try {
        const kwlShops = await KWLshop.find({});
        res.status(200).json(kwlShops);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch KWL shops data' });
    }
});

// Endpoint for NTshops
app.get('/api/ntshops', async (req, res) => {
    try {
        const ntShops = await NTshop.find({});
        res.status(200).json(ntShops);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch NT shops data' });
    }
});

// Define cardexplain Schema
const cardexplainSchema = new mongoose.Schema({
    sampleName:String,
});

const SampleName = mongoose.model('SampleName', cardexplainSchema);

// Endpoint for sampleName
app.get('/api/sampleName', async (req, res) => {
    try {
        const samplename = await SampleName.find({});
        res.status(200).json(samplename);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch sampleName data' });
    }
});



// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
