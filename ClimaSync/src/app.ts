import CONFIG from "./config";
import { findOrCreateUser } from "./dao";
import { UserInput, validateUser } from "./models/user";
import { getTuyaStatus, sendTuyaCommand } from "./tuya";
import { logRequest } from "./utils";
import { getWeather } from "./weather";
import * as express from "express";
import * as bodyParser from "body-parser";
import { Request } from "express";
import { searchForAlerts } from "./alerts";

type CustomRequest<T> = Request<{}, {}, T>;

// Este arquivo deve conter todos as rotas da aplicação. É ele que é chamado quando esse projeto é rodado.

const app = express();

app.listen(CONFIG.PORT, () => {
  console.log(`Server is running on port ${CONFIG.PORT}`);
});

// JSON parser
const jsonParser = bodyParser.json();

app.post("/cron-job", async (req, res) => {
  logRequest(req);
  const result = await searchForAlerts();
  res.status(200).json(result);
});

// TUYA

app.get("/tuya/:deviceId/status", async (req, res) => {
  logRequest(req);
  const deviceID = req.params.deviceId;
  const status = await getTuyaStatus(deviceID);
  res.status(200).json(status);
});

app.post("/tuya/:deviceId/switch/:value", async (req, res) => {
  logRequest(req);
  const deviceID = req.params.deviceId;
  if (!["true", "false"].includes(req.params.value)) {
    res
      .status(422)
      .json(`Invalid value '${req.params.value}' - allowed 'true' or 'false'`);
  } else {
    const value: boolean = JSON.parse(req.params.value);
    const commands = await sendTuyaCommand(value, deviceID);

    if (!commands.success)
      res.status(500).json("[Tuya] - Error on executing command");
    else res.status(200).json(commands);
  }
});

// CLIMA

app.get("/weather/:lat/:lon", async (req, res) => {
  //TODO: receber token pra atualizar a localização se for diferente da que tá no banco
  logRequest(req);

  const lat = Number(req.params.lat);
  const lon = Number(req.params.lon);

  const response = await getWeather(lat, lon);
  res.status(200).json(response);
});

// USUÁRIOS

app.post("/user", jsonParser, async (req: CustomRequest<UserInput>, res) => {
  logRequest(req);
  const user = req.body;

  try {
    validateUser(user);
  } catch (error) {
    res.status(400).json({ error });
  }
  const userFound = await findOrCreateUser(user);
  res.status(200).json(userFound);
});

app.put(
  "/user/notification",
  async (req: CustomRequest<AlertUpdateInput>, res) => {
    const newAlert = req.body;
    validateAlert(newAlert);
    await updateUserAlert(newAlert);
    res.status(200).json("Alerta atualizado com sucesso");
  }
);
