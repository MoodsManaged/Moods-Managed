let mode = "";
let playerId = null;
let playerName = "";
let level = 1;

const socket = new WebSocket("wss://moods-managed.onrender.com/");

// ✅ Emojis
const emoji = {
  happy: "😊",
  sad: "😢",
  angry: "😡",
  calm: "😌",
  afraid: "😱"
};

// ✅ CARD POOL
const cardsPool = [
  "Give a hug",
  "Run away",
  "Shout loudly",
  "Take a deep breath",
  "Tell a joke",
  "Hide quickly",
  "Cry softly",
  "Walk away",
  "Laugh loudly",
  "Stay calm"
];

// ✅ BETTER SCENARIOS (emotion matches story)
const scenarios = [
  { text: "You found a hidden treasure chest full of gold", feeling: "happy" },
  { text: "You reunited with someone you deeply missed", feeling: "happy" },

  { text: "You lost something that meant a lot to you", feeling: "sad" },
  { text: "You said goodbye to someone important", feeling: "sad" },

  { text: "Someone unfairly blamed you for something", feeling: "angry" },
  { text: "Your hard work was completely ignored", feeling: "angry" },

  { text: "You hear footsteps behind you in a dark forest", feeling: "afraid" },
  { text: "You are about to face a powerful enemy", feeling: "afraid" },

  { text: "You sit quietly by a peaceful lake at sunset", feeling: "calm" },
  { text: "You are resting after a long journey", feeling: "calm" }
];

// ✅ SMART SELECT (no repeats)
let shuffledScenarios = [];

function getScenario() {
  if (shuffledScenarios.length === 0) {
    shuffledScenarios = [...scenarios].sort(() => Math.random() - 0.5);
  }
  return shuffledScenarios.pop();
}

// ✅ MODES
function startSingle() {
  mode = "single";
  document.getElementById("modeScreen").style.display = "none";
  document.getElementById("info").textContent = "🎮 Single Player";
  nextSingle();
}

function startStory() {
  mode = "story";
  level = 1;
  document.getElementById("modeScreen").style.display = "none";
  document.getElementById("info").textContent = "🏰 Your story begins...";
  nextStory();
}

function startMulti() {
  mode = "multi";
  document.getElementById("modeScreen").style.display = "none";
  document.getElementById("joinScreen").style.display = "block";
}

function joinGame() {
  playerName = document.getElementById("nameInput").value || "Player";
  document.getElementById("joinScreen").style.display = "none";
  document.getElementById("info").textContent = "Connecting...";
}

// ✅ MULTIPLAYER
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

  if (data.type === "newRound") showScenario(data.scenario);
  if (data.type === "showSubmissions") showSubmissions(data.submissions);
  if (data.type === "roundResult") showResult(data.winner);
};

// ✅ GAME FLOW
function nextSingle() {
  showScenario(getScenario());
}

function nextStory() {
  document.getElementById("info").textContent =
    `🌟 Level ${level}`;
  showScenario(getScenario());
}

// ✅ DISPLAY SCENARIO (FIRST PERSON ✅)
function showScenario(s) {
  document.getElementById("scenario").innerHTML =
    `<h2>${s.text}</h2>
     <p><b>Your feeling:</b> ${emoji[s.feeling]} ${s.feeling}</p>`;

  renderCards(s.feeling);
}

// ✅ CARDS MATCH EMOTION
function getCards(feeling) {
  let filtered = cardsPool;

  // Optional: bias cards based on emotion
  if (feeling === "happy") filtered = ["Give a hug","Tell a joke","Laugh loudly"];
  if (feeling === "sad") filtered = ["Cry softly","Walk away","Stay quiet"];
  if (feeling === "angry") filtered = ["Shout loudly","Stomp away","Break something"];
  if (feeling === "afraid") filtered = ["Run away","Hide quickly","Call for help"];
  if (feeling === "calm") filtered = ["Take a deep breath","Sit quietly","Stay relaxed"];

  return filtered
    .sort(() => Math.random() - 0.5)
    .slice(0, 4)
    .map(text => ({ text, mood: feeling }));
}

// ✅ RENDER CARDS
function renderCards(feeling) {
  const container = document.getElementById("cards");
  container.innerHTML = "";

  const cards = getCards(feeling);

  cards.forEach((c, i) => {
    const el = document.createElement("div");
    el.className = "card";

    el.innerHTML = `${emoji[c.mood]}<br>${c.text}`;

    el.style.opacity = "0";

    setTimeout(() => {
      el.style.opacity = "1";
    }, i * 150);

    el.onclick = () => chooseCard(c);

    container.appendChild(el);
  });
}

// ✅ ACTION
function chooseCard(card) {
  document.getElementById("info").textContent =
    `You choose to: ${card.text}`;

  if (mode === "single") {
    setTimeout(nextSingle, 1500);
  }

  if (mode === "story") {
    level++;
    document.getElementById("info").textContent =
      "✨ You grow stronger...";
    setTimeout(nextStory, 1500);
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
  const c = document.getElementById("cards");
  c.innerHTML = "<h3>Pick Winner</h3>";

  subs.forEach((s) => {
    const el = document.createElement("div");
    el.className = "card";

    el.innerHTML = `${emoji[s.card.mood]}<br>${s.card.text}`;

    el.onclick = () => {
      socket.send(JSON.stringify({
        type: "chooseWinner",
        winnerId: s.playerId
      }));
    };

    c.appendChild(el);
  });
}

function showResult(winner) {
  document.getElementById("scenario").innerHTML =
    `<h2>🎉 Player ${winner} wins!</h2>`;
}