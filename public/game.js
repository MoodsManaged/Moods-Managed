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
    helpful: ["Take a deep breath", "Think before acting", "Move carefully"],
    lessHelpful: ["Run blindly", "Freeze in fear"]
  },
  {
    text: "Your spell failed in front of others",
    feeling: "sad",
    helpful: ["Try again calmly", "Ask for help", "Stay patient"],
    lessHelpful: ["Give up", "Say you're bad"]
  },
  {
    text: "Someone took your treasure",
    feeling: "angry",
    helpful: ["Stay calm", "Think first", "Solve it peacefully"],
    lessHelpful: ["Destroy everything", "Yell loudly"]
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

  document.getElementById("stats").innerText = "Level: " + level;
}

function createCard(text, good) {
  const el = document.createElement("div");
  el.className = "card";
  el.innerText = text;

  el.onclick = () => {
    if (good) level++;
    nextScenario();
  };

  document.getElementById("cards").appendChild(el);
}
``