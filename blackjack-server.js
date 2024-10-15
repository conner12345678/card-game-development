const express = require('express')
const app = express()
const axios = require('axios')
const path = require('path')
const fs = require('fs')
const bodyParser = require('body-parser')
var pNumber = 0
var dNumber = 0
var turn = 0

app.use(bodyParser.urlencoded({ extended:true }))
app.use(express.static('public'))
app.set('view engine', 'ejs')

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

app.get('/', (req,res)=>{
    res.sendFile(path.join(__dirname, './public/index.html'))
})

app.get('/game/blackjack', (req,res) => {
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
                turn = 1
            }
            else if(pNumber > 21){
                pNumber = "Bust!"
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
                turn = 0
            }
            else if(pNumber > 21){
                pNumber = "Bust!"
            }
        }
    }
    res.render('blackjack', { pCards, dCards, pNumber, dNumber, turn })
})

app.get('/randomhand/p1', async (req,res)=>{
    const cards = getPCards()
    try{
        const response = await axios.get('https://www.deckofcardsapi.com/api/deck/7mxggn611j3x/draw/?count=1')
        cards.push(response.data.cards)
        savePCards(cards)
        res.redirect('/game/blackjack')
    }
    catch(error){
        res.status(404).send('test failure')
    }
})

app.get('/randomhand/p2', async (req,res)=>{
    const cards = getDCards()
    try{
        const response = await axios.get('https://www.deckofcardsapi.com/api/deck/7mxggn611j3x/draw/?count=1')
        cards.push(response.data.cards)
        saveDCards(cards)
        res.redirect('/game/blackjack')
    }
    catch(error){
        res.status(404).send('test failure')
    }
})

app.listen(5000, ()=>{
    console.log('http://localhost:5000')
})