const express = require('express')
const app = express()
const axios = require('axios')
const path = require('path')
const fs = require('fs')
const bodyParser = require('body-parser')
var number = 0

app.use(bodyParser.urlencoded({ extended:true }))
app.use(express.static('public'))
app.set('view engine', 'ejs')

const getCards = () => {
    const data = fs.readFileSync(path.join(__dirname, '/data/blackjack-data.json'), 'utf8')
    // console.log(data)
    if(data.length < 1){
        return []
    }else{
        return JSON.parse(data)
    }
}
const saveCards = (data) => {
    fs.writeFileSync('./data/blackjack-data.json', JSON.stringify(data, null, 2), 'utf8')
}

app.get('/', (req,res)=>{
    res.sendFile(path.join(__dirname, './public/index.html'))
})

app.get('/game/blackjack', (req,res) => {
    const cards = getCards()
    if(cards.length < 1){
        number = 0
    } else {
        if(cards[cards.length-1][0].value == 'JACK' || cards[cards.length-1][0].value == 'KING' || cards[cards.length-1][0].value == 'QUEEN' || cards[cards.length-1][0].value == 'JACK'){
            cards[cards.length-1][0].value = '10'
        }else if(cards[cards.length-1][0].value == 'ACE'){
            cards[cards.length-1][0].value = '1'
        }else{
            cards[cards.length-1][0].value == cards[cards.length-1][0].value
        }
        number = number + Number(cards[cards.length-1][0].value)
    }
    res.render('blackjack', { cards, number })
})

app.get('/randomhand', async (req,res)=>{
    const cards = getCards()
    try{
        const response = await axios.get('https://www.deckofcardsapi.com/api/deck/7mxggn611j3x/draw/?count=1')
        cards.push(response.data.cards)
        saveCards(cards)
        res.redirect('/game/blackjack')
    }
    catch(error){
        res.status(404).send('test failure')
    }
})

app.listen(5000, ()=>{
    console.log('http://localhost:5000')
})