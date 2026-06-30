require("dotenv").config();

const app = require("./app");

const PORT = config.port;

app.listen(PORT, () => {
  console.log("--------------------------------");
  console.log(`🚀 Server running on port ${PORT}`);
  console.log("--------------------------------");
});
