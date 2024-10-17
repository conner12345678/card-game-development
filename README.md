# War Card Game

This is a simple war card game using the Deck of Cards API. Players can draw cards, view the current game state, and restart the game with a new deck.

## How to Run

1. Download the project and open it in VS Code.
2. Open the terminal and run:

```bash
  npm install
  node server.js
```

3. Open your browser and go to:

```
http://localhost:5000/
```

## Game Routes

- `/` - Home page.
- `/warGame` - View the current game.
- `/randomhand` - Draw a random card.
- `/restartGame` - Restart the game and shuffle a new deck.

## Requirements

Install these packages:

```bash
npm install express ejs body-parser axios
```

# Blackjack Game with Node.js and Express
This is a simple Blackjack game built with Node.js, Express, and the Deck of Cards API. The game allows you to play a basic version of Blackjack where you can draw cards, stand, and compare scores with the dealer.

Features
Player vs Dealer game mode
Cards are drawn from the Deck of Cards API
Basic Blackjack rules:
Numbered cards are worth their face value
Face cards (JACK, QUEEN, KING) are worth 10 points
The ACE is worth either 1 or 10 points depending on the current hand
Player and dealer can stand when they are satisfied with their hands
The game ends when one of the players busts (goes over 21) or both players stand
Displays who wins or loses based on hand values
Installation
Clone the repository or download the source code.

```bash
git clone <repository_url>
cd blackjack-game
```
Install the required dependencies.

```bash
npm install
Run the application locally.
```

```bash
node app.js
Open your browser and navigate to http://localhost:5000.
```

Game Instructions
Start the game: Navigate to http://localhost:5000 in your browser. You'll be presented with an interface to play Blackjack.

Draw a card: You can draw a random card for either player (/randomhand/p1) or the dealer (/randomhand/p2) from the deck.

Stand: You can choose to "Stand" by going to /pStand for the player or /dStand for the dealer.

Restart the game: To restart the game with a new shuffled deck, visit /restart.

Files and Folders
app.js: The main server code that handles routing and game logic.
/public: Contains static files like the HTML interface.
/data: JSON files for saving the player's and dealer's hands.
views/blackjack.ejs: Template for rendering the game's UI using EJS.
How the Game Works
Deck Initialization: The game starts by shuffling a deck of cards using the Deck of Cards API.
Turn System:
The player draws cards and accumulates points until they either "Bust" (over 21) or choose to stand.
The dealer then takes their turn following the same rules.
End of Game: If both players stand, their total points are compared, and the winner is declared.
If a player busts, the other player wins automatically.
If both stand and their points are compared, the higher total wins.
Restarting the Game: The game can be restarted at any time by visiting /restart.
API Endpoints
/randomhand/p1: Draw a card for the player.
/randomhand/p2: Draw a card for the dealer.
/pStand: Player stands.
/dStand: Dealer stands.
/restart: Restart the game with a fresh deck.
Technologies Used
Node.js: JavaScript runtime.
Express.js: Web framework for building the server and routing.
Deck of Cards API: External API for drawing and shuffling cards.
EJS: Templating engine for rendering the Blackjack game UI.
Body-Parser: Middleware for handling form submissions and JSON data.
License
This project is for learning purposes and does not have an associated license. Feel free to modify and expand upon it.











