let level = 1;

const emoji = {
  good: "🧙‍♂️",
  bad: "👹",
  afraid: "😱",
  sad: "😢",
  angry: "😡"
};

const scenarios = [
  {
    text: "You are a knight facing a dangerous dragon",
    feeling: "afraid",
    helpful: [
      "Take a deep breath",
      "Think before acting",
      "Step back carefully"
    ],
    lessHelpful: [
      "Run blindly",
      "Freeze completely"
    ]
  }
];

function nextScenario() {
  const s = scenarios[Math.floor(Math.random() * scenarios.length)];

  document.getElementById("scenario").innerHTML = `
    <h2>${s.text}</h2>
    <p>${emoji[s.feeling]} ${s.feeling}</p>
  `;

  const container = document.getElementById("cards");
  container.innerHTML = "";

  s.helpful.forEach(choice => createCard(choice, true));
  s.lessHelpful.forEach(choice => createCard(choice, false));

  document.getElementById("stats").innerText =
    "🌟 Level: " + level;
}

function createCard(text, good) {
  const el = document.createElement("div");
  el.className = "card";

  el.innerHTML = `
    <div class="avatar">${good ? "🧙‍♂️" : "👹"}</div>
    <div class="choice-text">${text}</div>
  `;

  el.onclick = () => {
    if (good) level++;
    nextScenario();
  };

  document.getElementById("cards").appendChild(el);
}
``