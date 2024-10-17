// Step 1: Import necessary modules
const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const axios = require('axios'); // Axios for API requests
const path = require('path')
const app = express();

// Global variables
let num = 0;
var pNumber = 0
var dNumber = 0
var turn = 0
var end1 = 0
var end2 = 0
// var id = 'p7phujhkj3yf'

//gets a new shuffled id and sets it to the variable id
const random_id = async () => {
    const data = await axios.get('https://www.deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1')
    return data.data.deck_id
}
const rand_id = random_id()
var id = rand_id
// Step 2: Initialize the Express app
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

const getPCards = () => {
    const data = fs.readFileSync(path.join(__dirname, '/data/blackjack-data.json'), 'utf8')
    // console.log(data)
    if(data.length < 1){
        return []
    }else{
        return JSON.parse(data)
    }
}
const savePCards = (data) => {
    fs.writeFileSync('./data/blackjack-data.json', JSON.stringify(data, null, 2), 'utf8')
}

const getDCards = () => {
    const data = fs.readFileSync(path.join(__dirname, '/data/blackjack-data-dealer.json'), 'utf8')
    if(data.length < 1){
        return []
    }else{
        return JSON.parse(data)
    }
}
const saveDCards = (data) =>{
    fs.writeFileSync('./data/blackjack-data-dealer.json', JSON.stringify(data, null, 2), 'utf8')
}
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
app.get('/game/blackjack', async (req,res) => {
    const pCards = getPCards()
    const dCards = getDCards()
    if(turn == 0){
        if(pCards.length < 1){
            pNumber = 0
        } else {
            if(pNumber <= 21){
                if(pCards[pCards.length-1][0].value == 'JACK' || pCards[pCards.length-1][0].value == 'KING' || pCards[pCards.length-1][0].value == 'QUEEN' || pCards[pCards.length-1][0].value == 'JACK'){
                    pCards[pCards.length-1][0].value = '10'
                }else if(pCards[pCards.length-1][0].value == 'ACE'){
                    pCards[pCards.length-1][0].value = '1'
                }else{
                    pCards[pCards.length-1][0].value == pCards[pCards.length-1][0].value
                }
                pNumber = pNumber + Number(pCards[pCards.length-1][0].value)
                if(end2 == 0){
                    turn = 1
                }
                else{
                    turn = 0
                }
            }
            else if(pNumber > 21){
                pNumber = "Bust!"
                dNumber = "You win!"
            }
        }
    }else if(turn == 1){
        if(dCards.length < 1){
            dNumber = 0
        }else{
            if(dNumber <= 21){
                if(dCards[dCards.length-1][0].value == 'JACK' || dCards[dCards.length-1][0].value == 'KING' || dCards[dCards.length-1][0].value == 'QUEEN' || dCards[dCards.length-1][0].value == 'JACK'){
                    dCards[dCards.length-1][0].value = '10'
                }else if(dCards[dCards.length-1][0].value == 'ACE'){
                    dCards[dCards.length-1][0].value = '1'
                }else{
                    dCards[dCards.length-1][0].value == dCards[dCards.length-1][0].value
                }
                dNumber = dNumber + Number(dCards[dCards.length-1][0].value)
                if(end1 == 0){
                    turn = 0
                }else{
                    turn = 1
                }
            }
            else if(pNumber > 21){
                dNumber = "Bust!"
                pNumber = 'You win!'
            }
        }
    }
    res.render('blackjack', { pCards, dCards, pNumber, dNumber, turn, end1, end2 })
})

app.get('/randomhand/p1', async (req,res)=>{
    const cards = getPCards()
    try{
        if(!id){
            res.redirect('/restart')
        }
        const response = await axios.get(`https://www.deckofcardsapi.com/api/deck/${id}/draw/?count=1`)
        cards.push(response.data.cards)
        savePCards(cards)
        res.redirect('/game/blackjack')
    }
    catch(error){
        console.log(error)
        res.status(404).send(error)
    }
})

app.get('/randomhand/p2', async (req,res)=>{
    const cards = getDCards()
    try{
        const response = await axios.get(`https://www.deckofcardsapi.com/api/deck/${id}/draw/?count=1`)
        cards.push(response.data.cards)
        saveDCards(cards)
        res.redirect('/game/blackjack')
    }
    catch(error){
        res.status(404).send('test failure')
    }
})

app.get('/pStand', (req,res)=>{
    if(end1 == 0){
        end1 = 1
    }
    if(end1 + end2 == 2){
        if(pNumber > dNumber){
            pNumber = 'You win!'
            dNumber = 'You lose!'
        }else{
            dNumber = 'You win!'
            pNumber = 'You lose!'
        }
    }
    if(turn == 0){
        turn = 1
    }else{
        turn = 0
    }
    res.redirect('/game/blackjack')
})

app.get('/dStand', (req,res)=>{
    if(end2 == 0){
        end2 = 1
    }
    if(end1 + end2 == 2){
        if(pNumber > dNumber){
            pNumber = 'You win!'
            dNumber = 'You lose!'
        }else{
            dNumber = 'You win!'
            pNumber = 'You lose!'
        }
    }
    if(turn == 0){
        turn = 1
    }else{
        turn = 0
    }
    res.redirect('/game/blackjack')
})

app.get('/restart', async (req,res)=>{
    var pCards = getPCards()
    var dCards = getPCards()
    pCards = []
    dCards = []
    turn = 0
    savePCards(pCards)
    saveDCards(dCards)
    const response = await axios.get('https://www.deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1')
    id = response.data.deck_id
    res.redirect('/game/blackjack')
})

// Step 4: Set up the server to listen on a port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
