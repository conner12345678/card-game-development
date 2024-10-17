// Step 1: Import necessary modules
const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const axios = require('axios'); // Axios for API requests

// Global variables
let num = 0;
let id = 'zt2cuykzhv7j';

// Step 2: Initialize the Express app
const app = express();
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

// Utility functions for working with JSON data
const getCards = () => {
    const data = fs.readFileSync('./data/war-data.json', 'utf8');
    return data ? JSON.parse(data) : [];
};

const saveCards = (cards) => {
    fs.writeFileSync('./data/war-data.json', JSON.stringify(cards, null, 2));
};

// Step 3: Routes

// GET: Home route to render the index page
app.get('/', (req, res) => {
    res.render('index');
});

// GET: War game logic
app.get('/warGame', (req, res) => {
    const cards = getCards();

    if (cards.length < 1) {
        num = 0;
    } else {
        const lastCardValue = cards[cards.length - 1][0].value;

        // Adjust face cards and ace
        if (['JACK', 'KING', 'QUEEN'].includes(lastCardValue)) {
            cards[cards.length - 1][0].value = '10';
        } else if (lastCardValue === 'ACE') {
            cards[cards.length - 1][0].value = '1';
        }

        // Save modified cards
        saveCards(cards);

        // Update the score
        num += Number(cards[cards.length - 1][0].value);
    }

    res.render('warGame', { cards });
});

// GET: Fetch a random hand from the Deck of Cards API
app.get('/randomhand', async (req, res) => {
    const cards = getCards();

    try {
        const response = await axios.get(`https://www.deckofcardsapi.com/api/deck/${id}/draw/?count=1`);
        console.log(response.data.cards);

        // Add the drawn card to the card list and save it
        cards.push(response.data.cards);
        saveCards(cards);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch data from the API',
            error: error.message,
        });
    }

    res.redirect('/warGame');
});

// GET: Restart the game by resetting data and shuffling a new deck
app.get('/restartGame', async (req, res) => {
    let cards = getCards();
    cards = []; // Reset cards
    num = 0; // Reset the score

    saveCards(cards); // Save the empty cards array

    try {
        const response = await axios.get('https://www.deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1');
        id = response.data.deck_id; // Update the global deck ID
    } catch (error) {
        console.error('Error fetching new deck:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch new deck',
            error: error.message,
        });
    }

    res.redirect('/warGame');
});

// Step 4: Set up the server to listen on a port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
