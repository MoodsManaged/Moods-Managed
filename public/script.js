alert("JS IS RUNNING ✅");

// Connect to server
const socket = new WebSocket("wss://moods-managed.onrender.com/");

// Test connection
socket.onopen = () => {
  console.log("✅ Connected to server");
};

// Test message
socket.onmessage = (event) => {
  console.log("📩 Message received:", event.data);
};

// BASIC TEST UI (so we KNOW JS works)
document.getElementById("scenario").innerHTML = `
  <h2>✅ JS is working!</h2>
  <p>If you see this, the problem is FIXED.</p>
`;

document.getElementById("cards").innerHTML = `
  <div class="card">Test Card 1</div>
  <div class="card">Test Card 2</div>
`;
``