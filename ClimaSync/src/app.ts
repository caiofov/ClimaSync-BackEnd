import CONFIG from "./config";
import { getTuyaStatus, sendTuyaCommand } from "./tuya";
import { getWeather } from "./weather";
import * as express from "express";

// Este arquivo deve conter todos as rotas da aplicação. É ele que é chamado quando esse projeto é rodado.

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
      .status(422)
      .json(`Invalid value '${req.params.value}' - allowed 'true' or 'false'`);
  } else {
    const value: boolean = JSON.parse(req.params.value);
    const commands = await sendTuyaCommand(value);

    if (!commands.success)
      res.status(500).json("[Tuya] - Error on executing command");
    else res.status(200).json(commands);
  }
});

app.get("/weather/:lat/:lon", async (req, res) => {
  const lat = Number(req.params.lat);
  const lon = Number(req.params.lon);
  const response = await getWeather(lat, lon);
  res.status(200).json(response);
});
