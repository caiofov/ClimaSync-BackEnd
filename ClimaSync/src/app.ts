import { stat } from "fs";
import CONFIG from "./config";
import { getTuyaStatus } from "./tuya";
// Este arquivo deve conter todos as rotas da aplicação. É ele que é chamado quando esse projeto é rodado.

const express = require("express");
const app = express();

app.listen(CONFIG.PORT, () => {
  console.log(`Server is running on port ${CONFIG.PORT}`);
});

// TUYA

app.get("/tuya/status", async (req, res) => {
  const status = await getTuyaStatus();
  res.status(200).json(status);
});
