const express = require("express");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const db = {
  players: [],
};

app.get("/users", (request, response) => {
  response.send(db);
  db.players = []; // Reiniciar para el próximo juego
});

app.post("/user", (request, response) => {
  const { body } = request;

  // Verificar si la opción de jugada está definida
  if (!body.choice) {
    response.status(400).send({ error: "Player did not select a choice." });
    return;
  }

  // Agregar jugador al array de players
  db.players.push(body);

  // Verifica si ambos jugadores han realizado sus elecciones
  if (db.players.length === 2) {
    const result = determineWinner(db.players[0], db.players[1]);
    
    // Añadir la información de posición a los jugadores
    db.players = addPlayerPositions(db.players, result);

    response.status(201).send({ result: result.result, players: db.players });
  } else {
    response.status(201).send({ players: db.players }); // Solo un jugador está presente, no se ha determinado el resultado
  }
});

function determineWinner(player1, player2) {
  const moves = {
    rock: { beats: "scissors" },
    paper: { beats: "rock" },
    scissors: { beats: "paper" }
  };

  if (player1.choice === player2.choice) {
    return { result: "Draw", players: [player1, player2] };
  } else if (moves[player1.choice].beats === player2.choice) {
    return { result: `${player1.name} wins`, winner: player1, loser: player2 };
  } else {
    return { result: `${player2.name} wins`, winner: player2, loser: player1 };
  }
}

function addPlayerPositions(players, result) {
  return players.map(player => {
    if (result.winner && player.name === result.winner.name) {
      return { ...player, position: 1 }; // Ganador
    }
    if (result.loser && player.name === result.loser.name) {
      return { ...player, position: 2 }; // Perdedor
    }
    return { ...player, position: "Draw" }; // Empate
  });
}

app.listen(5050, () => {
  console.log(`Server is running on http://localhost:${5050}`);
});
