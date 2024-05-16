import CONFIG from "./config";
// Este arquivo deve conter todos as rotas da aplicação. É ele que é chamado quando esse projeto é rodado.

const express = require("express");
const app = express();

app.listen(CONFIG.PORT, () => {
  console.log(`Server is running on port ${CONFIG.PORT}`);
});
