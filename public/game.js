let level = 1;

const scenarios = [
  {
    text: "You face a dragon",
    choices: ["Stay calm", "Panic"],
    good: 0
  },
  {
    text: "Your spell failed",
    choices: ["Try again", "Give up"],
    good: 0
  },
  {
    text: "You lost treasure",
    choices: ["Think calmly", "Get angry"],
    good: 0
  }
];

function nextScenario() {
  const s = scenarios[Math.floor(Math.random() * scenarios.length)];

  document.getElementById("scenario").innerText = s.text;

  const cards = document.getElementById("cards");
  cards.innerHTML = "";

  s.choices.forEach((choice, i) => {
    const el = document.createElement("div");
    el.className = "card";
    el.innerText = choice;

    el.onclick = () => {
      if (i === s.good) level++;
      nextScenario();
    };

    cards.appendChild(el);
  });

  document.getElementById("stats").innerText =
    "Level: " + level;
}