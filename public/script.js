alert("SCRIPT IS RUNNING ✅");
// ✅ Connect to your LIVE server
const socket = new WebSocket("wss://moods-managed.onrender.com");

let playerId = null;
let currentMessenger = null;

// ✅ Connection status (for debugging)
socket.onopen = () => {
  console.log("✅ Connected to server!");
};

socket.onerror = (err) => {
  console.error("❌ Connection error:", err);
};

socket.onclose = () => {
  console.log("⚠️ Disconnected from server");
};

// ✅ Handle messages from server
socket.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log("📩 Received:", data);

  if (data.type === "init") {
    playerId = data.id;
    console.log("🎮 You are player", playerId);
  }

  if (data.type === "newRound") {
    currentMessenger = data.messenger;
