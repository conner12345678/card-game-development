// Step 1: Import necessary modules
const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
// Optional
const axios = require('axios'); // Axios to make API requests

var num = 0

// Step 2: Initialize the Express app
const app = express();
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');

// Load tasks from JSON file
const getCards = () => {
    const data = fs.readFileSync('./data/war-data.json', 'utf8');
    if (!data) {
        return [];
    } else {
        return JSON.parse(data);
    };
};

const saveCards = (cards) => {
    fs.writeFileSync('./data/war-data.json', JSON.stringify(cards, null, 2));
};

// GET: Show all tasks
app.get('/', (req, res) => {
    res.render('index');
});

app.get('/warGame', (req, res) => {
    const cards = getCards()
    if(cards.length < 1){
        num = 0
    } else {
        if(cards[cards.length-1][0].value == 'JACK' || cards[cards.length-1][0].value == 'KING' || cards[cards.length-1][0].value == 'QUEEN' || cards[cards.length-1][0].value == 'JACK'){
            cards[cards.length-1][0].value = '10'
            saveCards(cards)
        }else if(cards[cards.length-1][0].value == 'ACE'){
            cards[cards.length-1][0].value = '1'
            saveCards(cards)
        }else{
            cards[cards.length-1][0].value == cards[cards.length-1][0].value
            saveCards(cards)
        }
        num = num + Number(cards[cards.length-1][0].value)
    }
    res.render('warGame', { cards });
});

// Step 3: Create a GET route to handle API request
app.get('/randomhand', async (req, res) => {
    const cards = getCards()
    try {
        // Step 4: Make an API request to fetch random users
        const response = await axios.get('https://www.deckofcardsapi.com/api/deck/zt2cuykzhv7j/draw/?count=1');
        // OR
        
        console.log(response.data.cards)
        // Step 5: Send the data back as a response
        cards.push(response.data.cards)
        saveCards(cards)
    } catch (error) {
        // Step 6: Handle any errors that occur during the request
        res.status(500).json({
            success: false,
            message: 'Failed to fetch data from the API',
            error: error.message
        });
    }
    res.redirect('/warGame')
});

// Step 7: Set up the server to listen on a port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});