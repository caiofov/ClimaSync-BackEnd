import { TuyaContext } from "@tuya/tuya-connector-nodejs";
import CONFIG from "./config";

export const sendTuyaCommand = async (on: boolean) => {
  const context = new TuyaContext({
    baseUrl: "https://openapi.tuyaus.com",
    accessKey: CONFIG.TUYA_CLIENT_ID,
    secretKey: CONFIG.TUYA_CLIENT_SECRET,
  });

  const commands = await context.request({
    path: `/v1.0/iot-03/devices/${CONFIG.TUYA_DEVICE_ID}/commands`,
    method: "POST",
    body: {
      commands: [{ code: "switch_1", value: on }],
    },
  });
  if (!commands.success) new Error();
  return commands;
};
