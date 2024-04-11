import { TuyaContext } from "@tuya/tuya-connector-nodejs";

import CONFIG from "../config";

const getContext = () =>
  new TuyaContext({
    baseUrl: "https://openapi.tuyaus.com",
    accessKey: CONFIG.tuyaAccessID,
    secretKey: CONFIG.tuyaAccessSecret,
  });

const makeRequest = async (on: boolean, id: string, context: TuyaContext) => {
  const commands = await context.request({
    path: `/v1.0/iot-03/devices/${id}/commands`,
    method: "POST",
    body: {
      commands: [{ code: "switch_1", value: on }],
    },
  });
  if (!commands.success) new Error();

  return commands;
};

const plugOn = async (id: string, context: TuyaContext) =>
  makeRequest(true, id, context);

const plugOff = async (id: string, context: TuyaContext) =>
  makeRequest(false, id, context);
