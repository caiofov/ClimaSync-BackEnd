import { TuyaContext } from "@tuya/tuya-connector-nodejs";
import CONFIG from "./config";

const _getTuyaContext = () =>
  new TuyaContext({
    baseUrl: "https://openapi.tuyaus.com",
    accessKey: CONFIG.TUYA_CLIENT_ID,
    secretKey: CONFIG.TUYA_CLIENT_SECRET,
  });

export const sendTuyaCommand = async (on: boolean) => {
  const commands = await _getTuyaContext().request({
    path: `/v1.0/iot-03/devices/${CONFIG.TUYA_DEVICE_ID}/commands`,
    method: "POST",
    body: {
      commands: [{ code: "switch_1", value: on }],
    },
  });
  return commands;
};

export const getTuyaStatus = async () => {
  const status = await _getTuyaContext().deviceStatus.status({
    device_id: CONFIG.TUYA_DEVICE_ID,
  });

  return status;
};
