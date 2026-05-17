const ws = new WebSocket(`ws://${location.host}`);

let playerId;
let isMessenger = false;

const info = document.getElementById("info");
const cardsDiv = document.getElementById("cards");
const scenarioDiv = document.getElementById("scenario");
const submissionsDiv = document.getElementById("submissions");
const scoreDiv = document.getElementById("scoreboard");

ws.onopen = () => {
  console.log("CONNECTED ✅");
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);

  if (data.type === "init") {
    playerId = data.id;
    info.innerText = `🧍 You are Player ${playerId}`;
  }

  if (data.type === "newRound") {
    isMessenger = data.messenger === playerId;

    scenarioDiv.innerHTML = `
      <h2>📜 Scenario</h2>
      <p>${data.scenario.text}</p>
      <p><b>Feeling:</b> ${data.scenario.feeling}</p>
    `;

    submissionsDiv.innerHTML = "";

    if (isMessenger) {
      info.innerText = "👑 You are the Messenger!";
      cardsDiv.innerHTML = "⏳ Waiting for players...";
    } else {
      info.innerText = "🪄 Choose a coping card:";
      renderHand();
    }
  }

  if (data.type === "showSubmissions") {
    if (!isMessenger) return;

    cardsDiv.innerHTML = "";

    submissionsDiv.innerHTML = "<h3>👑 Pick the best card</h3>";

    data.submissions.forEach((s) => {
      const div = document.createElement("div");
      div.className = "card";
      div.innerText = s.card;

      div.onclick = () => {
        ws.send(JSON.stringify({
          type: "chooseWinner",
          playerId,
          winnerId: s.playerId
        }));
      };

      submissionsDiv.appendChild(div);
    });
  }

if (data.type === "roundResult") {
  info.innerText = `✨ Player ${data.winner} helped the kingdom!`;

  document.body.style.boxShadow = "0 0 40px gold";
  
  setTimeout(() => {
    document.body.style.boxShadow = "none";
  }, 1000);

  updateScores(data.scores);
}
    info.innerText = `✨ Player ${data.winner} helped the kingdom!`;

    updateScores(data.scores);
  }
};

function renderHand() {
  cardsDiv.innerHTML = "";

  const hand = [
    "🌬 Take deep breaths",
    "🧑‍🤝‍🧑 Talk to a friend",
    "🛌 Take a break",
    "🔟 Count to 10",
    "🙋 Ask for help"
  ];

  hand.forEach(card => {
    const div = document.createElement("div");
    div.className = "card";
    div.innerText = card;

    div.onclick = () => {
      ws.send(JSON.stringify({
  type: "submitCard",
  playerId,
  card
}));

      cardsDiv.innerHTML = "⏳ Waiting for others...";
    };

    cardsDiv.appendChild(div);
  });
}

function updateScores(scores) {
  scoreDiv.innerHTML = "<h3>🏆 Scoreboard</h3>";

  Object.keys(scores).forEach(id => {
    const p = document.createElement("p");
    p.innerText = `Player ${id}: ${scores[id]} points`;
    scoreDiv.appendChild(p);
  });
}