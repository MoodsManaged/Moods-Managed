let level = 1;
let usedScenarios = [];let role = "";
let finishedBase = false;

// ✅ ROLES
const roles = {
  knight: { name: "Knight", emoji: "⚔️" },
  mage: { name: "Mage", emoji: "🧙‍♂️" },
  dragon: { name: "Dragon", emoji: "🐉" }
};

// ✅ BASE SCENARIOS (THERAPY CORE)
const roleScenarios = {
  knight: [
    {
      text: "You are a knight protecting villagers under attack",
      good: ["Stay brave and lead", "Help others first"],
      bad: ["Run away", "Focus only on yourself"]
    },
    {
      text: "You face a dragon in battle",
      good: ["Stay calm and plan", "Defend wisely"],
      bad: ["Charge blindly", "Panic"]
    }
  ],

  mage: [
    {
      text: "Your spell failed in front of others",
      good: ["Try again calmly", "Stay patient"],
      bad: ["Give up", "Say you're not good"]
    },
    {
      text: "You study a difficult spell",
      good: ["Focus and practice", "Take your time"],
      bad: ["Rush", "Quit early"]
    }
  ],

  dragon: [
    {
      text: "Someone took your treasure",
      good: ["Stay calm", "Think before reacting"],
      bad: ["Burn everything", "Lose control"]
    },
    {
      text: "Intruders enter your cave",
      good: ["Observe carefully", "Protect wisely"],
      bad: ["Attack blindly", "Panic"]
    }
  ]
};

// ✅ START
function startWithRole(selected) {
  role = selected;
  level = 1;
  usedScenarios = [];
  finishedBase = false;

  document.getElementById("menu").style.display = "none";
  document.getElementById("game").style.display = "block";

  nextScenario();
}

// ✅ GET SCENARIO
function getScenario() {
  if (!finishedBase) {
    const list = roleScenarios[role];

    if (usedScenarios.length === list.length) {
      finishedBase = true;
      return null;
    }

    let s;
    do {
      s = list[Math.floor(Math.random() * list.length)];
    } while (usedScenarios.includes(s));

    usedScenarios.push(s);
    return s;
  }

  // ✅ AI-STYLE GENERATED SCENARIOS
  return generateScene();
}

// ✅ LOAD
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

// ✅ CARDS
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
  msg.innerText = good ? "✨ Good choice!" : "⚠️ Try another way next time";
  msg.style.marginTop = "20px";

  document.getElementById("cards").appendChild(msg);

  setTimeout(nextScenario, 1200);
}

// ✅ END SCREEN (THERAPEUTIC)
function showEnding() {
  const game = document.getElementById("game");

  game.innerHTML = `
    <h1>🌟 Journey Complete</h1>
    <p>You learned how to handle emotions as a ${roles[role].name}</p>
    <p>Level reached: ${level}</p>
    
    <button onclick="startInfinite()">Continue Adventure</button>
  `;
}

// ✅ CONTINUE → AI MODE
function startInfinite() {
  finishedBase = true;

  document.getElementById("game").innerHTML = `
    <div id="stats"></div>
    <div id="scenario"></div>
    <div id="cards"></div>
  `;

  nextScenario();
}

// ✅ AI-LIKE GENERATION (THERAPEUTIC)
function generateScene() {
  const feelings = ["angry", "sad", "afraid"];

  const situations = [
    "Someone challenges you",
    "You fail at something important",
    "You feel misunderstood",
    "Something unexpected happens"
  ];

  return {
    text: `As a ${roles[role].name}, ${situations[Math.floor(Math.random()*situations.length)]}`,
    good: [
      "Pause and think",
      "Stay calm and reflect",
      "Choose a safe response"
    ],
    bad: [
      "React instantly",
      "Blame others",
      "Lose control"
    ]
  };
}

