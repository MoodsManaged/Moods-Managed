let level = 1;
let role = "";
let usedIndexes = [];

// ✅ ROLE DATA
const roles = {
  knight: { name: "Knight", emoji: "⚔️" },
  mage: { name: "Mage", emoji: "🧙‍♂️" },
  dragon: { name: "Dragon", emoji: "🐉" }
};

// ✅ ROLE-LOCKED SCENARIOS
const roleScenarios = {
  knight: [
    {
      text: "You are a knight protecting villagers from danger",
      good: ["Stay brave and help", "Lead others to safety"],
      bad: ["Run away", "Ignore them"]
    },
    {
      text: "You face an enemy in battle",
      good: ["Stay calm and plan", "Defend wisely"],
      bad: ["Attack blindly", "Panic"]
    }
  ],

  mage: [
    {
      text: "You are a mage whose spell failed in front of others",
      good: ["Try again calmly", "Stay patient"],
      bad: ["Give up", "Say you're bad"]
    },
    {
      text: "You are learning a difficult new spell",
      good: ["Practice slowly", "Focus carefully"],
      bad: ["Quit early", "Rush"]
    }
  ],

  dragon: [
    {
      text: "You are a dragon protecting your treasure",
      good: ["Stay calm and observe", "Act wisely"],
      bad: ["Burn everything", "Lose control"]
    },
    {
      text: "You sense intruders near your cave",
      good: ["Watch carefully", "Defend thoughtfully"],
      bad: ["Attack without thinking", "Panic"]
    }
  ]
};

// ✅ START GAME
function startWithRole(selected) {
  role = selected;
  level = 1;
  usedIndexes = [];

  document.getElementById("menu").style.display = "none";
  document.getElementById("game").style.display = "block";

  nextScenario();
}

// ✅ GET UNIQUE SCENARIO
function getScenario() {
  const list = roleScenarios[role];

  // ✅ END GAME IF ALL USED
  if (usedIndexes.length === list.length) {
    return null;
  }

  let index;

  do {
    index = Math.floor(Math.random() * list.length);
  } while (usedIndexes.includes(index));

  usedIndexes.push(index);
  return list[index];
}

// ✅ LOAD SCENARIO
function nextScenario() {
  const s = getScenario();

  if (!s) {
    showEnding();
    return;
  }

  document.getElementById("scenario").innerHTML = `
    <h2>${s.text}</h2>
  `;

  document.getElementById("stats").innerHTML = `
    ${roles[role].emoji} ${roles[role].name} | 🌟 Level ${level}
  `;

  const container = document.getElementById("cards");
  container.innerHTML = "";

  s.good.forEach(c => createCard(c, true));
  s.bad.forEach(c => createCard(c, false));
}

// ✅ CREATE CARD
function createCard(text, good) {
  const el = document.createElement("div");
  el.className = "card";

  el.innerHTML = `
    <div class="avatar">${good ? "✨" : "⚠️"}</div>
    <div class="choice-text">${text}</div>
  `;

  el.onclick = () => {
    if (good) level++;
    showFeedback(good);
  };

  document.getElementById("cards").appendChild(el);
}

// ✅ FEEDBACK
function showFeedback(good) {
  const msg = document.createElement("div");
  msg.innerText = good ? "✨ Good choice!" : "⚠️ Try another path";
  msg.style.marginTop = "20px";
  msg.style.fontSize = "18px";

  document.getElementById("cards").appendChild(msg);

  setTimeout(nextScenario, 1200);
}

// ✅ FINAL ENDING (NO RESTART LOOP)
function showEnding() {
  document.getElementById("game").innerHTML = `
    <h1>🌟 Journey Complete</h1>
    <p>You mastered emotional choices as a ${roles[role].name}</p>
    <p>Final Level: ${level}</p>
  `;
}