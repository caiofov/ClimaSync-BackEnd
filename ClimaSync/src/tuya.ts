import { TuyaContext, TuyaResponse } from "@tuya/tuya-connector-nodejs";
import CONFIG from "./config";
import { ConvertedTuyaStatus, TuyaStatusResponse } from "./models/tuya";
import { TUYA_COMMANDS } from "./enums/tuya";

// este arquivo contém as requisições para a API da tuya

const _getTuyaContext = () =>
  new TuyaContext({
    baseUrl: "https://openapi.tuyaus.com",
    accessKey: CONFIG.TUYA_CLIENT_ID,
    secretKey: CONFIG.TUYA_CLIENT_SECRET,
  });

export const sendTuyaCommand = async (on: boolean, deviceID: string) => {
  const commands = await _getTuyaContext().request({
    path: `/v1.0/iot-03/devices/${deviceID}/commands`,
    method: "POST",
    body: {
      commands: [{ code: "switch_1", value: on }],
    },
  });
  return commands;
};

export const getTuyaStatus = async (deviceID: string) => {
  const status: TuyaResponse<TuyaStatusResponse> =
    await _getTuyaContext().request({
      method: "GET",
      path: `/v1.0/devices/${deviceID}`,
    });

  return {
    isOnline: status.result.online,
    isTurnedOn: status.result.status.find((i) => i.code == TUYA_COMMANDS.SWITCH)
      .value as boolean,
  } as ConvertedTuyaStatus;
};
