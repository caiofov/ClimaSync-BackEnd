import { config as dotEnvConfig } from "dotenv";
// Este arquivo configura as envs do arquivo .env.
// Ele é útil para dar tipo ao valores das envs e organizar todas em um lugar

dotEnvConfig();

const CONFIG = {
  PORT: Number(process.env.SERVER_PORT),
  TUYA_CLIENT_ID: process.env.TUYA_ACCESS_ID,
  TUYA_CLIENT_SECRET: process.env.TUYA_ACCESS_SECRET,
  TUYA_DEVICE_ID: process.env.TUYA_ACCESS_SECRET,
};

export default CONFIG;
