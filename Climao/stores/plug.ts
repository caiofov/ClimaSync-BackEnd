import { configureStore, createSlice } from "@reduxjs/toolkit";
import { TuyaContext, TuyaResponse } from "@tuya/tuya-connector-nodejs";
import CONFIG from "../config";

type ResultType = {
  code: string;
  value: string;
};
type PlugStatus = TuyaResponse<ResultType>;
interface PlugInfo {
  context: TuyaContext;
  device: string;
  status: PlugStatus;
}

const makeTuyaRequest = async (on: boolean, plug: PlugInfo) => {
  const commands = await plug.context.request({
    path: `/v1.0/iot-03/devices/${plug.device}/commands`,
    method: "POST",
    body: {
      commands: [{ code: "switch_1", value: on }],
    },
  });
  if (!commands.success) new Error();

  return commands;
};

const initialState: PlugInfo = {
  context: new TuyaContext({
    baseUrl: "https://openapi.tuyaus.com",
    accessKey: CONFIG.tuyaAccessID,
    secretKey: CONFIG.tuyaAccessSecret,
  }),
  device: CONFIG.tuyaDeviceID, //TODO: mais tomadas
  status: { result: [] as ResultType[] },
};

const plugReducer = createSlice({
  name: "plug",
  initialState,
  reducers: {
    updateStatus: (state, action: { payload: PlugStatus }) => {
      state.status = action.payload;
    },
  },
});

export const plugStore = configureStore({
  reducer: { plug: plugReducer.reducer },
});
const plugActions = plugReducer.actions;

export const updateStatus = async () => {
  // const plug = plugStore.getState().plug;
  // plugStore.dispatch(
  //   plugActions.updateStatus(
  //     await plug.context.deviceStatus.status({ device_id: plug.device })
  //   )
  // );
  const context = new TuyaContext({
    baseUrl: "https://openapi.tuyaus.com",
    accessKey: CONFIG.tuyaAccessID,
    secretKey: CONFIG.tuyaAccessSecret,
  });
  return await context.deviceStatus.status({ device_id: CONFIG.tuyaDeviceID });
};
export const plugOnOrOff = async (on: boolean) => {
  const plug = plugStore.getState().plug;
  await makeTuyaRequest(on, plug);

  updateStatus();
};

export const isOn = () => {
  plugStore.getState().plug.status.result;
};
