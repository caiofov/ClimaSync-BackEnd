import { config as dotEnvConfig } from "dotenv";
dotEnvConfig();

const CONFIG = {
  PORT: Number(process.env.SERVER_PORT),
};
export default CONFIG;
