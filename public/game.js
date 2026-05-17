let level = 1;
let role = "";

// ✅ ROLES
const roles = {
  knight: { name: "Knight", emoji: "⚔️" },
  mage: { name: "Mage", emoji: "🧙‍♂️" },
  dragon: { name: "Dragon", emoji: "🐉" }
};

// ✅ EMOTIONS
const emotions = {
  angry: "😡",
  sad: "😢",
  afraid: "😱",
  calm: "😌"
};

// ✅ START GAME
function startWithRole(selected) {
  role = selected;
  level = 1;

  document.getElementById("menu").style.display = "none";
  document.getElementById("game").style.display = "block";

  nextScenario();
}

// ✅ MAIN LOOP
function nextScenario() {
  const s = generateScenario();

  document.getElementById("scenario").innerHTML = `
    <h2>${s.text}</h2>
    <p>${emotions[s.feeling]} You feel ${s.feeling}</p>
    <p>💭 What do you do FIRST?</p>
  `;

  document.getElementById("stats").innerHTML = `
    ${roles[role].emoji} ${roles[role].name} | 🌟 Level ${level}
  `;

  const container = document.getElementById("cards");
  container.innerHTML = "";

  // ✅ STEP 1: PROCESSING
  const processingChoices = [
    "Pause and take a deep breath",
    "Notice and name your feeling",
    "Give yourself a moment to think"
  ];

  processingChoices.forEach(choice => {
    const el = document.createElement("div");
    el.className = "card";

    el.innerHTML = `
      <div class="avatar">🧠</div>
      <div class="choice-text">${choice}</div>
    `;

    el.onclick = () => {
      showDecisionPhase(s);
    };

    container.appendChild(el);
  });
}

// ✅ STEP 2: DECISION
function showDecisionPhase(s) {
  const container = document.getElementById("cards");
  container.innerHTML = "";

  document.getElementById("scenario").innerHTML += `
    <p>✅ You paused. Now what action do you take?</p>
  `;

  s.good.forEach(choice => createCard(choice, true));
  s.bad.forEach(choice => createCard(choice, false));
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
    if (good) {
      level++;
      showFeedback("✨ You handled your feeling in a safe way", "lightgreen");
    } else {
      showFeedback("💭 That reaction might make things harder", "orange");
    }
  };

  document.getElementById("cards").appendChild(el);
}

// ✅ FEEDBACK
function showFeedback(text, color) {
  const msg = document.createElement("div");

  msg.innerText = text;
  msg.style.color = color;
  msg.style.marginTop = "20px";
  msg.style.fontSize = "18px";

  document.getElementById("cards").appendChild(msg);

  setTimeout(() => {
    nextScenario();
  }, 1500);
}

// ✅ INFINITE THERAPEUTIC SCENARIO GENERATOR
function generateScenario() {
  const feelings = ["angry", "sad", "afraid"];

  const situations = {
    knight: [
      "you are protecting villagers during an attack",
      "you feel pressure to lead others through danger",
      "you face a powerful enemy in battle",
      "you failed to protect someone important"
    ],

    mage: [
      "your spell failed in front of others",
      "you feel unsure about your abilities",
      "you are learning a difficult spell",
      "someone criticizes your magic"
    ],

    dragon: [
      "someone tried to take your treasure",
      "you feel misunderstood by others",
      "intruders enter your cave",
      "you feel a powerful fire of anger building"
    ]
  };

  const feeling = feelings[Math.floor(Math.random() * feelings.length)];
  const text =
    "As a " + roles[role].name + ", " +
    situations[role][Math.floor(Math.random() * situations[role].length)];

  return {
    text: text,
    feeling: feeling,

    // ✅ THERAPY-ALIGNED RESPONSES
    good: [
      "Pause and think before acting",
      "Choose a calm response",
      "Stay in control of your feelings",
      "Act in a safe and thoughtful way"
    ],

    bad: [
      "React immediately without thinking",
      "Let the feeling take control",
      "Blame others instantly",
      "Lose control of your behavior"
    ]
  };
}
