const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 5000;

let snakes = {};
let ladders = {};
let players = [];

const addSnake = (head, tail) => {
    snakes[head] = tail;
};

const addLadder = (start, end) => {
    ladders[start] = end;
};

const addPlayer = (name) => {
    players.push({ name, position: 0 });
};

const rollDice = () => {
    return Math.floor(Math.random() * 6) + 1;
};

const movePlayer = (player, steps) => {
    const currentPosition = player.position;
    let newPosition = currentPosition + steps;

    // Check for snakes
    if (newPosition in snakes) {
        newPosition = snakes[newPosition];
    }

    // Check for ladders
    if (newPosition in ladders) {
        newPosition = ladders[newPosition];
    }

    player.position = newPosition;
};


app.use(cors());
app.use(bodyParser.json());

app.post('/setup', (req, res) => {
    const { snakes: snakeList, ladders: ladderList, players: playerList } = req.body;

    snakes = {};
    ladders = {};
    players = [];

    snakeList.forEach(([head, tail]) => {
        addSnake(head, tail);
    });

    ladderList.forEach(([start, end]) => {
        addLadder(start, end);
    });

    playerList.forEach((name) => {
        addPlayer(name);
    });

    res.json({ message: 'Game setup successful' });
});

app.post('/play', (req, res) => {
    const moves = [];

    while (true) {
        for (const player of players) {
            const diceRoll = rollDice();
            movePlayer(player, diceRoll);

            moves.push({
                player: player.name,
                dice_roll: diceRoll,
                initial_position: player.position - diceRoll,
                final_position: player.position
            });

            if (player.position === 100) {
                moves.push({ winner: player.name });
                return res.json(moves);
            }
        }
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
