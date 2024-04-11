import { configureStore, createSlice } from "@reduxjs/toolkit";
import { TuyaContext } from "@tuya/tuya-connector-nodejs";
import CONFIG from "../config";

interface PlugInfo {
  context: TuyaContext;
  device: string;
  status: any;
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
  status: {},
};

const plugReducer = createSlice({
  name: "plug",
  initialState,
  reducers: {
    updateStatus: (state, status: any) => {
      state.status = status;
    },
  },
});

const plugStore = configureStore({
  reducer: { plug: plugReducer.reducer },
});
const plugActions = plugReducer.actions;

export const plugOnOrOff = async (on: boolean) => {
  const status = await makeTuyaRequest(on, plugStore.getState().plug);
  console.log(status);
  plugStore.dispatch(plugActions.updateStatus(status));
};
