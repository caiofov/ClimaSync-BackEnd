import CONFIG from "./config";
import { getTuyaStatus, sendTuyaCommand } from "./tuya";
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

app.post("/tuya/switch/:value", async (req, res) => {
  if (!["true", "false"].includes(req.params.value)) {
    res
      .status(403)
      .json(`Invalid value '${req.params.value}' - required 'true' or 'false'`);
  } else {
    const value: boolean = JSON.parse(req.params.value);
    const commands = await sendTuyaCommand(value);
    res.status(200).json(commands);
  }
});
