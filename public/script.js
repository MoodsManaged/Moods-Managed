let mode = "";

const socket = new WebSocket("wss://moods-managed.onrender.com/");

let playerId = null;
let playerName = "";

// Emojis
const emoji = {
  happy: "😊",
  sad: "😢",
  angry: "😡",
  calm: "😌",
  afraid: "😱"
};

// Cards
const cardsPool = [
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

// ✅ MODE SELECT
function startSingle() {
  mode = "single";
  document.getElementById("modeScreen").style.display = "none";

  document.getElementById("info").textContent =
    "🎮 Single Player Mode";

  startSingleRound();
}

function startMulti() {
  mode = "multi";
  document.getElementById("modeScreen").style.display = "none";
  document.getElementById("joinScreen").style.display = "block";
}

// ✅ JOIN MULTI
function joinGame() {
  playerName = document.getElementById("nameInput").value || "Player";

  document.getElementById("joinScreen").style.display = "none";
  document.getElementById("info").textContent = "Connecting...";
}

// ✅ SOCKET
socket.onmessage = (event) => {
  if (mode !== "multi") return;

  const data = JSON.parse(event.data);

  if (data.type === "init") {
    playerId = data.id;

    document.getElementById("info").textContent =
      `${playerName} (Player ${playerId})`;

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

// ✅ SINGLE PLAYER LOGIC
function startSingleRound() {
  const scenarios = [
    { text: "A dragon is sad", feeling: "sad" },
    { text: "A knight is scared", feeling: "afraid" },
    { text: "A wizard is angry", feeling: "angry" }
  ];

  const scenario =
    scenarios[Math.floor(Math.random() * scenarios.length)];

  showScenario(scenario);
}

// ✅ SHOW SCENARIO
function showScenario(s) {
  document.getElementById("scenario").innerHTML =
    `<h2>${s.text}</h2>
     <p>${emoji[s.feeling]} ${s.feeling}</p>`;

  renderCards();
}

// ✅ RANDOM CARDS
function getCards() {
  return [...cardsPool]
    .sort(() => Math.random() - 0.5)
    .slice(0, 4);
}

// ✅ RENDER
function renderCards() {
  const container = document.getElementById("cards");
  container.innerHTML = "";

  const cards = getCards();

  cards.forEach((card, i) => {
    const el = document.createElement("div");
    el.className = "card";

    el.innerHTML =
      `${emoji[card.mood]}<br>${card.text}`;

    el.style.opacity = "0";

    setTimeout(() => {
      el.style.opacity = "1";
    }, i * 150);

    el.onclick = () => handleCard(card);

    container.appendChild(el);
  });
}

// ✅ HANDLE CARD
function handleCard(card) {
  if (mode === "single") {
    document.getElementById("info").textContent =
      `You chose: ${card.text}`;
    setTimeout(startSingleRound, 2000);
  }

  if (mode === "multi") {
    socket.send(JSON.stringify({
      type: "submitCard",
      playerId
    }));

    document.getElementById("cards").innerHTML =
      "<h3>✅ Submitted</h3>";
  }
}

// ✅ MULTI RESULTS
function showSubmissions(subs) {
  const container = document.getElementById("cards");
  container.innerHTML = "<h3>Pick a winner</h3>";

  subs.forEach((s) => {
    const el = document.createElement("div");
    el.className = "card";

    el.innerHTML =
      `${emoji[s.card.mood]}<br>${s.card.text}`;

    el.onclick = () => {
      socket.send(JSON.stringify({
        type: "chooseWinner",
        winnerId: s.playerId
      }));
    };

    container.appendChild(el);
  });
}

function showResult(winner, scores) {
  document.getElementById("scenario").innerHTML =
    `<h2>🎉 Player ${winner} wins!</h2>`;
}