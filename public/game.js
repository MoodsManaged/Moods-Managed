let level = 1;
let role = "";

// ✅ ROLES
const roles = {
  mage: { name: "Mage", emoji: "🧙‍♂️" },
  knight: { name: "Knight", emoji: "⚔️" },
  dragon: { name: "Dragon", emoji: "🐉" }
};

// ✅ EMOJIS
const emoji = {
  afraid: "😱",
  sad: "😢",
  angry: "😡"
};

// ✅ SCENARIOS
const scenarios = [
  {
    text: "You are a knight facing a dangerous dragon",
    feeling: "afraid",
    good: ["Breathe slowly", "Think before acting"],
    bad: ["Run blindly", "Freeze"]
  },
  {
    text: "Your spell failed in front of others",
    feeling: "sad",
    good: ["Try again calmly", "Ask for help"],
    bad: ["Give up", "Say you're bad"]
  },
  {
    text: "Someone took your treasure",
    feeling: "angry",
    good: ["Stay calm", "Think first"],
    bad: ["Destroy everything", "Yell"]
  }
];

// ✅ START GAME WITH ROLE
function startWithRole(selected) {
  role = selected;

  document.getElementById("menu").style.display = "none";
  document.getElementById("game").style.display = "block";

  nextScenario();
}

// ✅ SCENARIO
function nextScenario() {
  const s = scenarios[Math.floor(Math.random() * scenarios.length)];

  document.getElementById("scenario").innerHTML = `
    <h2>${s.text}</h2>
    <p>${emoji[s.feeling]} ${s.feeling}</p>
  `;

  document.getElementById("stats").innerHTML = `
    ${roles[role].emoji} ${roles[role].name} | 🌟 Level ${level}
  `;

  const container = document.getElementById("cards");
  container.innerHTML = "";

  s.good.forEach(choice => createCard(choice, true));
  s.bad.forEach(choice => createCard(choice, false));
}

// ✅ CARD
function createCard(text, good) {
  const el = document.createElement("div");
  el.className = "card";

  el.innerHTML = `
    <div class="avatar">${good ? "✨" : "⚠️"}</div>
    <div>${text}</div>
  `;

  el.onclick = () => {
    if (good) {
      level++;
      showFeedback("✨ Great choice!", "lightgreen");
    } else {
      showFeedback("⚠️ Try a better way", "orange");
    }
  };

  document.getElementById("cards").appendChild(el);
}

// ✅ FEEDBACK + LEVEL PROGRESSION
function showFeedback(text, color) {
  const info = document.createElement("div");
  info.innerText = text;
  info.style.fontSize = "22px";
  info.style.color = color;
  info.style.marginTop = "20px";

  document.getElementById("cards").appendChild(info);

  setTimeout(() => {
    if (level === 5) {
      showLevelUp("🌟 Apprentice Master!");
    } else if (level === 10) {
      showLevelUp("🏆 True Emotional Hero!");
    } else {
      nextScenario();
    }
  }, 1200);
}

// ✅ LEVEL UP SCREEN
function showLevelUp(title) {
  const game = document.getElementById("game");

  game.innerHTML = `
    <h1>${title}</h1>
    <p>You reached Level ${level}</p>
    <button onclick="continueGame()">Continue Journey</button>
  `;
}

// ✅ CONTINUE
function continueGame() {
  document.getElementById("game").innerHTML = `
    <div id="stats"></div>
    <div id="scenario"></div>
    <div id="cards"></div>
  `;
  nextScenario();
}
