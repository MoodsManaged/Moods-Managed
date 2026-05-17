let level = 1;

// ✅ PLAYER GROWTH (THERAPY SKILLS)
let skills = {
  courage: 0,
  calm: 0,
  empathy: 0,
  thinking: 0
};

// ✅ EMOJIS
const emoji = {
  happy: "😊",
  sad: "😢",
  angry: "😡",
  calm: "😌",
  afraid: "😱"
};

// ✅ THERAPEUTIC SCENARIOS (FIRST PERSON + MATCHED FEELINGS)
const scenarios = [
  {
    text: "You are a knight facing a dragon that looks very dangerous",
    feeling: "afraid",
    helpful: [
      "Take a deep breath and stay steady",
      "Think carefully before acting",
      "Move back slowly to stay safe"
    ],
    lessHelpful: [
      "Run without looking where you're going",
      "Freeze and do nothing"
    ]
  },
  {
    text: "You are a wizard and your spell failed in front of others",
    feeling: "sad",
    helpful: [
      "Remind yourself mistakes help you learn",
      "Try again calmly",
      "Ask someone for help"
    ],
    lessHelpful: [
      "Give up completely",
      "Say you're bad at everything"
    ]
  },
  {
    text: "You are a dragon and someone took your treasure",
    feeling: "angry",
    helpful: [
      "Take a breath before reacting",
      "Think about what happened",
      "Try to solve the problem without hurting anyone"
    ],
    lessHelpful: [
      "Destroy everything around you",
      "Yell and lose control"
    ]
  },
  {
    text: "You are a knight being praised by the kingdom",
    feeling: "happy",
    helpful: [
      "Thank others kindly",
      "Stay humble",
      "Share the success"
    ],
    lessHelpful: [
      "Brag loudly",
      "Act like you're better than others"
    ]
  },
  {
    text: "You are a wizard resting peacefully in your tower",
    feeling: "calm",
    helpful: [
      "Enjoy the peaceful moment",
      "Practice breathing slowly",
      "Reflect quietly"
    ],
    lessHelpful: [
      "Worry about things that aren’t happening",
      "Rush around for no reason"
    ]
  }
];

// ✅ NO REPEAT SYSTEM
let shuffled = [];

function getScenario() {
  if (shuffled.length === 0) {
    shuffled = [...scenarios].sort(() => Math.random() - 0.5);
  }
  return shuffled.pop();
}

// ✅ START GAME
function startStory() {
  document.getElementById("modeScreen").style.display = "none";
  nextScenario();
}

// ✅ DISPLAY SKILLS
function showSkills() {
  document.getElementById("stats").innerHTML = `
    🌟 Level: ${level}  
    💪 Courage: ${skills.courage}  
    😌 Calm: ${skills.calm}  
    ❤️ Empathy: ${skills.empathy}  
    🧠 Thinking: ${skills.thinking}
  `;
}

// ✅ NEXT
function nextScenario() {
  const s = getScenario();

  showSkills();

  document.getElementById("scenario").innerHTML = `
    <h2>${s.text}</h2>
    <p>Your feeling: ${emoji[s.feeling]} ${s.feeling}</p>
  `;

  showChoices(s);
}

// ✅ SHOW CHOICES
function showChoices(s) {
  const container = document.getElementById("cards");
  container.innerHTML = "";

  // ✅ Helpful choices
  s.helpful.forEach(choice => {
    createCard(choice, "helpful");
  });

  // ✅ Less helpful choices
  s.lessHelpful.forEach(choice => {
    createCard(choice, "lessHelpful");
  });
}

// ✅ CREATE CARD
function createCard(text, type) {
  const el = document.createElement("div");
  el.className = "card";
  el.innerHTML = text;

  el.onclick = () => choose(text, type);

  document.getElementById("cards").appendChild(el);
}

// ✅ HANDLE CHOICE
function choose(text, type) {
  if (type === "helpful") {
    // ✅ Positive skill growth
    skills.courage += 1;
    skills.calm += 1;
    skills.empathy += 1;
    skills.thinking += 1;

    document.getElementById("info").textContent =
      "✨ That was a helpful choice. You handled your feelings well!";

    level++;
  } else {
    // ✅ GENTLE REDIRECTION (not punishment)
    skills.thinking += 1;

    document.getElementById("info").textContent =
      "💭 That choice might make things harder. Let's try another way next time.";
  }

  setTimeout(nextScenario, 2500);
}