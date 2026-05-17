let level = 1;

const emoji = {
  happy: "😊",
  sad: "😢",
  angry: "😡",
  calm: "😌",
  afraid: "😱"
};

const scenarios = [
  {
    text: "You are a knight facing a dangerous dragon",
    feeling: "afraid",
    helpful: [
      "Take a deep breath and stay steady",
      "Think carefully before acting",
      "Move back slowly to stay safe"
    ],
    lessHelpful: [
      "Run without looking",
      "Freeze completely"
    ]
  },
  {
    text: "Your spell failed in front of others",
    feeling: "sad",
    helpful: [
      "Try again calmly",
      "Ask someone for help",
      "Remind yourself mistakes help you learn"
    ],
    lessHelpful: [
      "Give up",
      "Say you're bad at everything"
    ]
  },
  {
    text: "Someone took your treasure",
    feeling: "angry",
    helpful: [
      "Take a breath",
      "Think before reacting",
      "Solve the problem calmly"
    ],
    lessHelpful: [
      "Destroy everything",
      "Yell uncontrollably"
    ]
  }
];

function nextScenario() {
  const s = scenarios[Math.floor(Math.random() * scenarios.length)];

  document.getElementById("scenario").innerHTML = `
    <h2>${s.text}</h2>
    <p>${emoji[s.feeling]} ${s.feeling}</p>
  `;

  const cards = document.getElementById("cards");
  cards.innerHTML = "";

  s.helpful.forEach(choice => createCard(choice, true));
  s.lessHelpful.forEach(choice => createCard(choice, false));

  document.getElementById("stats").innerText =
    "🌟 Level: " + level;
}

function createCard(text, good) {
  const el = document.createElement("div");
  el.className = "card";
  el.innerText = text;

  el.onclick = () => {
    if (good) {
      level++;
    }
    nextScenario();
  };

  document.getElementById("cards").appendChild(el);
}