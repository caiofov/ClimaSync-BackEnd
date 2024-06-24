import CONFIG from "./config";
import { getAllPlaces, listUsersByPlace } from "./dao";
import { TEMP_ALERT, WEATHER_ALERT } from "./enums/weather";
import { AlertType, User } from "./models/user";
import { WeatherResponse } from "./models/weather";
import { sendTuyaCommand } from "./tuya";
import { getWeatherByName } from "./weather";

// este arquivo contém as funções do cron job para coletar as informações de clima e notificar os usuários
const admin = require('firebase-admin');

const serviceAccount = {
  type: "service_account",
  project_id: CONFIG.FIREBASE_PROJECT_ID,
  private_key_id: CONFIG.FIREBASE_PRIVATE_KEY_ID,
  private_key: CONFIG.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  client_email: CONFIG.FIREBASE_CLIENT_EMAIL,
  client_id: CONFIG.FIREBASE_CLIENT_ID,
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: CONFIG.FIREBASE_CLIENT_X509_CERT_URL
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const alertsForInfo = (info: WeatherResponse) => {
  // identifica quais alertas vão ser ativados com essas informações de clima
  const alerts: AlertType[] = [];

  if (info.results.temp >= TEMP_ALERT.HOT) alerts.push("alerta_calor");
  else if (info.results.temp <= TEMP_ALERT.COLD) alerts.push("alerta_frio");

  if (info.results.humidity <= TEMP_ALERT.HUMIDITY)
    alerts.push("alerta_hidratacao");

  if (WEATHER_ALERT.RAINY.includes(info.results.condition_code))
    alerts.push("alerta_chuva");
  else if (WEATHER_ALERT.SUNNY.includes(info.results.condition_code))
    alerts.push("alerta_sol");

  return alerts;
};

const alertUsers = (users: User[], alerts: AlertType[]) => {
  users.forEach((user) => {
    const registrationToken = user.firebase_token;
    const message = {
      data: {
        title: 'Título da Notificação',
        body: 'Corpo da Notificação',
      },
      token: registrationToken,
    };

    admin.messaging().send(message)
      .then((response) => {
        console.log('Notificação enviada com sucesso para:', user.firebase_token);
      })
      .catch((error) => {
        console.error('Erro ao enviar notificação:', error);
      });
  });
};

const controlDevices = async (users: User[], on: boolean) => {
  console.log(`\t${on ? "Ligando" : "Desligando"} os dispositivos`);
  for (const user of users) sendTuyaCommand(on, user.device_id);
};

export const searchForAlerts = async () => {
  const alertsFound: { [city: string]: string[] } = {};
  const places = await getAllPlaces();

  for (const place of places) {
    console.log(`> Gerando alertas para a cidade ${place}`);

    const info = await getWeatherByName(place);

    const alerts = alertsForInfo(info);
    alertsFound[place] = alerts;

    if (alerts.length) {
      console.log(`\tAlertas encontrados: ${alerts}`);
      const users = await listUsersByPlace(place);

      //liga ou desliga os dispositivos com base no alerta
      if (alerts.includes("alerta_calor")) controlDevices(users, true);
      else if (alerts.includes("alerta_frio")) controlDevices(users, false);

      alertUsers(users, alerts);
    } else {
      console.log("\tNenhum alerta encontrado");
    }
  }

  return alertsFound;
};
