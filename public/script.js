const socket = new WebSocket("wss://moods-managed.onrender.com/");

let playerId = null;
let playerName = "";
let currentMessenger = null;

// Join game
function joinGame() {
  const input = document.getElementById("nameInput");
  playerName = input.value || "Player";

  document.getElementById("joinScreen").style.display = "none";
  document.getElementById("info").textContent = "Connecting...";
}

// Connect
socket.onopen = () => {
  console.log("✅ Connected to server");
};

// Receive messages
socket.onmessage = (event) => {
  const data = JSON.parse(event.data);

  if (data.type === "init") {
    playerId = data.id;

    document.getElementById("info").textContent =
      "🎮 You are " + playerName + " (Player " + playerId + ")";

    // Send name to server
    socket.send(JSON.stringify({
      type: "join",
      name: playerName
    }));
  }

  if (data.type === "newRound") {
    currentMessenger = data.messenger;
    showScenario(data.scenario);
  }

  if (data.type === "showSubmissions") {
    showSubmissions(data.submissions);
  }

  if (data.type === "roundResult") {
    showResult(data.winner, data.scores);
  }
};

// Show scenario
function showScenario(scenario) {
  document.getElementById("scenario").innerHTML = `
    <h2>${scenario.text}</h2>
    <p><b>Feeling:</b> ${scenario.feeling}</p>
  `;

  renderCards();
}

// Cards
const cards = [
  { text: "Give them a hug", mood: "happy" },
  { text: "Run away", mood: "afraid" },
  { text: "Shout loudly", mood: "angry" },
  { text: "Sit quietly", mood: "calm" }
];

// Render cards
function renderCards() {
  const container = document.getElementById("cards");
  container.innerHTML = "";

  cards.forEach((card) => {
    const btn = document.createElement("div");
    btn.className = "card";
    btn.textContent = card.text + " (" + card.mood + ")";

    btn.onclick = () => submitCard(card);

    container.appendChild(btn);
  });
}

// Submit card
function submitCard(card) {
  socket.send(JSON.stringify({
    type: "submitCard",
    playerId: playerId,
    card: card
  }));

  document.getElementById("cards").innerHTML =
    "<p>✅ Card submitted!</p>";
}

// Show submissions (messenger only)
function showSubmissions(submissions) {
  const container = document.getElementById("cards");
  container.innerHTML = "<h3>Choose a winner:</h3>";

  submissions.forEach((s) => {
    const btn = document.createElement("div");
    btn.className = "card";
    btn.textContent = s.card.text;

    btn.onclick = () => chooseWinner(s.playerId);

    container.appendChild(btn);
  });
}

// Choose winner
function chooseWinner(id) {
  socket.send(JSON.stringify({
    type: "chooseWinner",
    winnerId: id
  }));
}

// Show results
function showResult(winner, scores) {
  document.getElementById("scenario").innerHTML =
    `<h2>🏆 Player ${winner} wins!</h2>`;

  let scoreText = "";
  for (let id in scores) {
    scoreText += `Player ${id}: ${scores[id]}<br>`;
  }

  document.getElementById("cards").innerHTML =
    `<h3>Scores</h3>${scoreText}`;
}