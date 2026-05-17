const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

const PORT = process.env.PORT || 3000;

// ✅ GAME STATE
let players = {};
let turn = 0;

let gameState = {
  scores: {},
  usernames: {}
};

const scenarios = [
  { text: "You face a dragon", choices: ["Stay calm", "Panic"] },
  { text: "Your spell failed", choices: ["Try again", "Give up"] },
  { text: "You lost treasure", choices: ["Think calmly", "Get angry"] }
];

function getScenario() {
  return scenarios[Math.floor(Math.random() * scenarios.length)];
}

let currentScenario = getScenario();

io.on("connection", (socket) => {
  console.log("Player connected");

  socket.on("join", (username) => {
    players[socket.id] = username;
    gameState.usernames[socket.id] = username;
    gameState.scores[socket.id] = 0;

    io.emit("update", {
      players,
      turn,
      scenario: currentScenario,
      gameState
    });
  });

  socket.on("choice", (index) => {
    const ids = Object.keys(players);
    if (ids[turn] === socket.id) {

      if (index === 0) {
        gameState.scores[socket.id]++;
      }

      turn = (turn + 1) % ids.length;
      currentScenario = getScenario();

      io.emit("update", {
        players,
        turn,
        scenario: currentScenario,
        gameState
      });
    }
  });

  socket.on("disconnect", () => {
    delete players[socket.id];
    delete gameState.scores[socket.id];
    delete gameState.usernames[socket.id];
  });
});

server.listen(PORT, () => {
  console.log("Server running");
});