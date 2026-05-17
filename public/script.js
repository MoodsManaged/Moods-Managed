let mode = "";
let playerId = null;
let playerName = "";
let level = 1;

const socket = new WebSocket("wss://moods-managed.onrender.com/");

const emoji = {
  happy: "😊",
  sad: "😢",
  angry: "😡",
  calm: "😌",
  afraid: "😱"
};

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

// ✅ AI scenario generator
const characters = ["dragon", "wizard", "knight", "robot", "villager"];
const situations = [
  "lost something important",
  "found a magical treasure",
  "is being chased",
  "won a huge battle",
  "made a big mistake",
  "is alone in the forest",
  "met a mysterious stranger"
];
const feelings = ["happy", "sad", "angry", "afraid", "calm"];

function generateScenario() {
  return {
    text: `A ${characters[Math.floor(Math.random()*characters.length)]} ${situations[Math.floor(Math.random()*situations.length)]}`,
    feeling: feelings[Math.floor(Math.random()*feelings.length)]
  };
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
  document.getElementById("info").textContent = "🏰 Story Mode Begins!";
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

// ✅ SINGLE PLAYER
function nextSingle() {
  showScenario(generateScenario());
}

// ✅ STORY MODE
function nextStory() {
  const s = generateScenario();

  document.getElementById("info").textContent =
    `🏆 Level ${level}`;

  showScenario(s);
}

// ✅ DISPLAY
function showScenario(s) {
  document.getElementById("scenario").innerHTML =
    `<h2>${s.text}</h2>
     <p>${emoji[s.feeling]} ${s.feeling}</p>`;

  renderCards(s.feeling);
}

// ✅ CARDS
function getCards(feeling) {
  return cardsPool
    .sort(() => Math.random() - 0.5)
    .slice(0, 4)
    .map(text => ({ text, mood: feeling }));
}

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

// ✅ CARD ACTION
function chooseCard(card) {
  if (mode === "single") {
    document.getElementById("info").textContent =
      `You chose: ${card.text}`;
    setTimeout(nextSingle, 1500);
  }

  if (mode === "story") {
    level++;
    document.getElementById("info").textContent =
      "✨ Level up!";
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

// ✅ MULTI RESULT
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