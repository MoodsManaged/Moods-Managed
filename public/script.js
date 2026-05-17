const socket = new WebSocket("wss://moods-managed.onrender.com/");

let playerId = null;
let playerName = "";

// Emojis
const moodEmojis = {
  happy: "😊",
  sad: "😢",
  angry: "😡",
  calm: "😌",
  afraid: "😱"
};

// Card pool
const allCards = [
  { text: "Give a hug", mood: "happy" },
  { text: "Tell a joke", mood: "happy" },
  { text: "Run away", mood: "afraid" },
  { text: "Hide quickly", mood: "afraid" },
  { text: "Shout loudly", mood: "angry" },
  { text: "Kick something", mood: "angry" },
  { text: "Breathe deeply", mood: "calm" },
  { text: "Sit quietly", mood: "calm" },
  { text: "Cry softly", mood: "sad" },
  { text: "Walk away", mood: "sad" }
];

// Join
function joinGame() {
  playerName = document.getElementById("nameInput").value || "Player";

  document.getElementById("joinScreen").style.display = "none";
  document.getElementById("info").textContent = "Connecting...";
}

// Connect
socket.onopen = () => {
  console.log("Connected");
};

// Receive messages
socket.onmessage = (event) => {
  const data = JSON.parse(event.data);

  if (data.type === "init") {
    playerId = data.id;

    document.getElementById("info").textContent =
      `🎮 ${playerName} (Player ${playerId})`;

    socket.send(JSON.stringify({
      type: "join",
      name: playerName
    }));
  }

  if (data.type === "newRound") {
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
    <h2>📖 ${scenario.text}</h2>
    <p>Feeling: ${moodEmojis[scenario.feeling]} ${scenario.feeling}</p>
  `;

  renderCards();
}

// Random cards
function getRandomCards() {
  return [...allCards]
    .sort(() => Math.random() - 0.5)
    .slice(0, 4);
}

// Render cards
function renderCards() {
  const container = document.getElementById("cards");
  container.innerHTML = "";

  const cards = getRandomCards();

  cards.forEach((card, i) => {
    const el = document.createElement("div");
    el.className = "card";

    el.innerHTML = `
      ${moodEmojis[card.mood]}<br>
      ${card.text}
    `;

    el.style.opacity = "0";

    setTimeout(() => {
      el.style.opacity = "1";
    }, i * 150);

    el.onclick = () => {
      el.style.background = "gold";
      el.style.transform = "scale(1.3) rotateY(20deg)";

      setTimeout(() => submitCard(card), 200);
    };

    container.appendChild(el);
  });
}

// Submit
function submitCard(card) {
  socket.send(JSON.stringify({
    type: "submitCard",
    playerId
  }));

  document.getElementById("cards").innerHTML =
    "<h3>✅ Submitted!</h3>";
}

// Show submissions
function showSubmissions(submissions) {
  const container = document.getElementById("cards");
  container.innerHTML = "<h3>👑 Pick a winner</h3>";

  submissions.forEach((s) => {
    const el = document.createElement("div");
    el.className = "card";

    el.innerHTML = `
      ${moodEmojis[s.card.mood]}<br>
      ${s.card.text}
    `;

    el.onclick = () => {
      chooseWinner(s.playerId);
    };

    container.appendChild(el);
  });
}

// Choose winner
function chooseWinner(id) {
  socket.send(JSON.stringify({
    type: "chooseWinner",
    winnerId: id
  }));
}

// Results
function showResult(winner, scores) {
  document.getElementById("scenario").innerHTML =
    `<h2>🎉 Player ${winner} wins!</h2>`;

  let text = "";
  for (let id in scores) {
    text += `🏆 Player ${id}: ${scores[id]}<br>`;
  }

  document.getElementById("cards").innerHTML =
    `<h3>Scores</h3>${text}`;
}