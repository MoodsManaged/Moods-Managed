const express = require("express");
const app = express();

// ✅ Serve public folder
app.use(express.static("public"));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running");
});