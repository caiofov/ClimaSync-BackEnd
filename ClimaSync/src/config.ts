import { config as dotEnvConfig } from "dotenv";
// Este arquivo configura as envs do arquivo .env.
// Ele é útil para dar tipo ao valores das envs e organizar todas em um lugar

dotEnvConfig();

const CONFIG = {
  PORT: Number(process.env.SERVER_PORT),
  TUYA_CLIENT_ID: process.env.TUYA_ACCESS_ID,
  TUYA_CLIENT_SECRET: process.env.TUYA_ACCESS_SECRET,
  WEATHER_KEY: process.env.WEATHER_KEY,
  POSTGRES_DB: process.env.POSTGRES_DB,
  POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD,
  POSTGRES_PORT: Number(process.env.POSTGRES_PORT),
  POSTGRES_USER: process.env.POSTGRES_USER,
  POSTGRES_HOST: process.env.POSTGRES_HOST,
  FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
  FIREBASE_PRIVATE_KEY_ID: process.env.FIREBASE_PRIVATE_KEY_ID,
  FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY,
  FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL,
  FIREBASE_CLIENT_ID: process.env.FIREBASE_CLIENT_ID,
  FIREBASE_CLIENT_X509_CERT_URL: process.env.FIREBASE_CLIENT_X509_CERT_URL
};

export default CONFIG;
