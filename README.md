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