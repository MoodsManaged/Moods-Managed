const socket = new WebSocket("wss://moods-managed.onrender.com/");

let playerId = null;
let playerName = "";
let currentMessenger = null;

// 🎨 Mood emojis
const moodEmojis = {
  happy: "😊",
  sad: "😢",
  angry: "😡",
  calm: "😌",
  afraid: "😱"
};

// 🎴 Bigger card pool
const allCards = [
  { text: "Give them a hug", mood: "happy" },
  { text: "Tell a joke", mood: "happy" },
  { text: "Run away", mood: "afraid" },
  { text: "Hide behind a rock", mood: "afraid" },
  { text: "Shout loudly", mood: "angry" },
  { text: "Kick something", mood: "angry" },
  { text: "Take a deep breath", mood: "calm" },
  { text: "Sit quietly", mood: "calm" },
  { text: "Cry quietly", mood: "sad" },
  { text: "Walk away slowly", mood: "sad" }
];

// ✅ Join game
function joinGame() {
  const input = document.getElementById("nameInput");
  playerName = input.value || "Player";

  document.getElementById("joinScreen").style.display = "none";
  document.getElementById("info").textContent = "Connecting...";
}

// ✅ Connect
socket.onopen = () => {
  console.log("✅ Connected");
};

// ✅ Messages
socket.onmessage = (event) => {
  const data = JSON.parse(event.data);

  if (data.type === "init") {
    playerId = data.id;

    document.getElementById("info").textContent =
      `🎮 You are ${playerName} (Player ${playerId})`;

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

// ✅ Show scenario
function showScenario(scenario) {
  document.getElementById("scenario").innerHTML = `
    <h2>📖 ${scenario.text}</h2>
    <p><b>Feeling:</b> ${moodEmojis[scenario.feeling]} ${scenario.feeling}</p>
  `;

  renderCards();
}

// ✅ RANDOM CARD HAND
function getRandomCards(count = 4) {
  const shuffled = [...allCards].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

// ✅ Render cards with animation
function renderCards() {
  const container = document.getElementById("cards");
  container.innerHTML = "";

  const myCards = getRandomCards();

  myCards.forEach((card, index) => {
    const btn = document.createElement("div");
    btn.className = "card";

    btn.innerHTML = `
      ${moodEmojis[card.mood]}<br>
      ${card.text}
    `;

    // ✨ appearance animation
    btn.style.opacity = "0";
    btn.style.transform = "translateY(20px)";

    setTimeout(() => {
      btn.style.transition = "0.4s";
      btn.style.opacity = "1";
      btn.style.transform = "translateY(0)";
    }, index * 150);

    // 🎮 click effect
    btn.onclick = () => {
      btn.style.transform = "scale(1.2)";
      btn.style.background = "gold";

      setTimeout(() => submitCard(card), 200);
    };

    container.appendChild(btn);
  });
}

// ✅ Submit card
function submitCard(card) {
  socket.send(JSON.stringify({
    type: "submitCard",
    playerId: playerId,
    card: card
  }));

  document.getElementById("cards").innerHTML =
    "<h3>✅ Card submitted!</h3>";
}

// ✅ Show submissions (messenger view)
function showSubmissions(submissions) {
  const container = document.getElementById("cards");
  container.innerHTML = "<h3>👑 Choose a winner:</h3>";

  submissions.forEach((s, index) => {
    const btn = document.createElement("div");
    btn.className = "card";

    btn.innerHTML = `
      ${moodEmojis[s.card.mood]}<br>
      ${s.card.text}
    `;

    btn.style.opacity = "0";

    setTimeout(() => {
      btn.style.transition = "0.3s";
      btn.style.opacity = "1";
    }, index * 150);

    btn.onclick = () => {
      btn.style.background = "gold";
      chooseWinner(s.playerId);
    };

    container.appendChild(btn);
  });
}

// ✅ Choose winner
function chooseWinner(id) {
  socket.send(JSON.stringify({
    type: "chooseWinner",
    winnerId: id
  }));
}

// ✅ Show results
function showResult(winner, scores) {
  document.getElementById("scenario").innerHTML =
    `🎉 <h2>Player ${winner} wins!</h2>`;

  let scoreText = "";

  for (let id in scores) {
    scoreText += `🏆 Player ${id}: ${scores[id]}<br>`;
  }

  document.getElementById("cards").innerHTML =
    `<h3>Scoreboard</h3>${scoreText}`;
}
``