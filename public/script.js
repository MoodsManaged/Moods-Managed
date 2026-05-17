let level = 1;

// ✅ PLAYER STATS
let stats = {
  courage: 0,
  wisdom: 0,
  kindness: 0
};

// ✅ EMOJIS
const emoji = {
  happy: "😊",
  sad: "😢",
  angry: "😡",
  calm: "😌",
  afraid: "😱"
};

// ✅ FANTASY SCENARIOS
const scenarios = [
  {
    text: "You are a knight facing a fire-breathing dragon",
    feeling: "afraid",
    good: ["Stand your ground bravely", "Protect the villagers"],
    bad: ["Run away in fear", "Abandon your armor"]
  },
  {
    text: "You are a wizard whose spell has backfired",
    feeling: "angry",
    good: ["Calm yourself and try again", "Study the spell carefully"],
    bad: ["Blame others", "Destroy your spellbook"]
  },
  {
    text: "You are a dragon and someone stole your treasure",
    feeling: "angry",
    good: ["Search wisely", "Track the thief calmly"],
    bad: ["Burn everything", "Attack randomly"]
  },
  {
    text: "You are a knight being praised by the kingdom",
    feeling: "happy",
    good: ["Thank everyone kindly", "Stay humble"],
    bad: ["Boast loudly", "Demand more rewards"]
  },
  {
    text: "You are a wizard resting in a peaceful tower",
    feeling: "calm",
    good: ["Meditate", "Practice gentle magic"],
    bad: ["Ignore your duties", "Fall asleep completely"]
  }
];

// ✅ START GAME
function startStory() {
  document.getElementById("modeScreen").style.display = "none";
  nextScenario();
}

// ✅ GET RANDOM SCENARIO
function nextScenario() {
  const s = scenarios[Math.floor(Math.random() * scenarios.length)];

  displayStats();

  document.getElementById("scenario").innerHTML = `
    <h2>${s.text}</h2>
    <p>${emoji[s.feeling]} ${s.feeling}</p>
  `;

  renderChoices(s);
}

// ✅ DISPLAY STATS
function displayStats() {
  document.getElementById("stats").innerHTML = `
    <b>Level:</b> ${level} |
    💪 Courage: ${stats.courage} |
    🧠 Wisdom: ${stats.wisdom} |
    ❤️ Kindness: ${stats.kindness}
  `;
}

// ✅ RENDER CHOICES
function renderChoices(s) {
  const container = document.getElementById("cards");
  container.innerHTML = "";

  // Good choices
  s.good.forEach(choice => {
    createCard(choice, true);
  });

  // Bad choices
  s.bad.forEach(choice => {
    createCard(choice, false);
  });
}

// ✅ CREATE CARD
function createCard(text, isGood) {
  const el = document.createElement("div");
  el.className = "card";
  el.innerHTML = text;

  el.onclick = () => choose(text, isGood);

  document.getElementById("cards").appendChild(el);
}

// ✅ HANDLE CHOICE
function choose(text, isGood) {
  if (isGood) {
    stats.courage++;
    stats.wisdom++;
    stats.kindness++;

    document.getElementById("info").textContent =
      "✨ Wise choice! You grow stronger.";

    level++;
  } else {
    stats.courage--;
    document.getElementById("info").textContent =
      "⚠️ That choice had consequences...";
  }

  setTimeout(nextScenario, 2000);
}