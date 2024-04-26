import React, { useState } from 'react';
import './App.css';

function App() {
  const [snakes, setSnakes] = useState('');
  const [ladders, setLadders] = useState('');
  const [players, setPlayers] = useState('');
  const [gameLog, setGameLog] = useState([]);

  const handleSetup = async () => {
    const response = await fetch('http://localhost:5000/setup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        snakes: snakes.split('\n').map(line => line.trim().split(' ').map(Number)),
        ladders: ladders.split('\n').map(line => line.trim().split(' ').map(Number)),
        players: players.split('\n').map(line => line.trim()),
      }),
    });
    const data = await response.json();
    console.log(data);
  };

  const handlePlay = async () => {
    const response = await fetch('http://localhost:5000/play', {
      method: 'POST',
    });
    const data = await response.json();
    console.log(data);
    setGameLog(data);
  };
  const handleClearLog = () => {
    setGameLog([]);
  };


  return (
    <div className="App">
      <h1>Snake and Ladder Game</h1>
      <div>
        <h2>Setup</h2>
        <div>
          <textarea placeholder="Enter snakes (head tail)" value={snakes} onChange={(e) => setSnakes(e.target.value)}></textarea>
        </div>
        <div>
          <textarea placeholder="Enter ladders (start end)" value={ladders} onChange={(e) => setLadders(e.target.value)}></textarea>
        </div>
        <div>
          <textarea placeholder="Enter players" value={players} onChange={(e) => setPlayers(e.target.value)}></textarea>
        </div>
        <button onClick={handleSetup}>Setup Game</button>
      </div>
      <div>
        <h2>Play</h2>
        <button onClick={handlePlay}>Play Game</button>
      </div>
      <div>
        <h2>Game Log</h2>
        <button onClick={handleClearLog}>Clear Log</button>
        <ul>
          {gameLog.map((move, index) => (
            <li key={index}>
              {move.player} rolled a {move.dice_roll} and moved from {move.initial_position} to {move.final_position}
              {move.winner && ` - ${move.winner} wins the game`}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
