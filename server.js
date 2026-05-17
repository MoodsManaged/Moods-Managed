const express = require("express");
const WebSocket = require("ws");

const app = express();
const server = app.listen(3000, () => {
  console.log("http://localhost:3000");
});

app.use(express.static("public"));

const wss = new WebSocket.Server({ server });

let players = [];
let currentMessenger = 0;
let submissions = [];
let scores = {};
let gameStarted = false;

const scenarioCards = [
  { text: "A dragon lost its treasure.", feeling: "sad" },
  { text: "A knight is about to fight a monster.", feeling: "afraid" },
  { text: "A wizard’s spell failed.", feeling: "angry" }
];

wss.on("connection", (ws) => {
  const id = players.length;
  players.push({ id, ws });
  scores[id] = 0;

  console.log("Player connected:", id);

  ws.send(JSON.stringify({ type: "init", id }));

  // Start game when 3 players join
  if (players.length >= 3 && !gameStarted) {
    gameStarted = true;
    console.log("Starting game...");
    setTimeout(startRound, 1000);
  }

  ws.on("message", (msg) => {
    const data = JSON.parse(msg);

    if (data.type === "submitCard") {
      submissions.push({ playerId: data.playerId, card: data.card });

      // When all non-messenger players submitted
      if (submissions.length === players.length - 1) {
        const messenger = players[currentMessenger];

        if (messenger && messenger.ws.readyState === WebSocket.OPEN) {
          messenger.ws.send(JSON.stringify({
            type: "showSubmissions",
            submissions
          }));
        }
      }
    }

    if (data.type === "chooseWinner") {
      scores[data.winnerId] += 10;

      broadcast({
        type: "roundResult",
        winner: data.winnerId,
        scores
      });

      currentMessenger = (currentMessenger + 1) % players.length;
      submissions = [];

      setTimeout(startRound, 2000);
    }
  });
});

function startRound() {
  const scenario =
    scenarioCards[Math.floor(Math.random() * scenarioCards.length)];

  console.log("Starting round");

  broadcast({
    type: "newRound",
    messenger: currentMessenger,
    scenario
  });
}

function broadcast(data) {
  players.forEach((p) => {
    if (p.ws.readyState === WebSocket.OPEN) {
      p.ws.send(JSON.stringify(data));
    }
  });
}