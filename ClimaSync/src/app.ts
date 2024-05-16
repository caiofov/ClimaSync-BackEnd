import CONFIG from "./config";

const express = require("express");
const app = express();

app.listen(CONFIG.PORT, () => {
  console.log(`Server is running on port ${CONFIG.PORT}`);
});
