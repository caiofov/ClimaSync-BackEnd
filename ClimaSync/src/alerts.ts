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

// Definir listas de mensagens para diferentes tipos de alertas
const hydrationAlerts = [
  {
    title: 'Hora de se hidratar! 🥤',
    body: 'O clima está seco. Beba água regularmente para se manter fresco e bem-hidratado.'
  },
  {
    title: 'Hidrate-se! 🥤',
    body: 'Beba água e evite atividades exaustivas ao ar livre.'
  },
  {
    title: 'Clima quente e seco! 🌞🥤',
    body: 'Lembre-se de se hidratar regularmente. Beba água e proteja-se do sol.'
  }
];

const sunAlerts = [
  {
    title: 'Alerta! ☀️🧴',
    body: 'Hoje está ensolarado e a intensidade solar está alta. Lembre-se de usar protetor solar!'
  },
  {
    title: 'Dica: 🌞🕶️🧴',
    body: 'Chapéu, óculos de sol e protetor solar são seus melhores amigos hoje!'
  },
  {
    title: 'Reaplique o protetor solar! ☀️🔄🧴',
    body: 'Lembre-se de reaplicar o protetor solar se estiver ao ar livre por muito tempo!'
  },
  {
    title: 'Clima quente e ensolarado! ☀️🧴',
    body: 'Lembre-se de usar protetor solar e proteger-se do sol.'
  }
];

const rainAlerts = [
  {
    title: 'Cuidado nas estradas molhadas! 🚗🌧️',
    body: 'Dirija com segurança na chuva.'
  },
  {
    title: 'Tempo chuvoso! 🌧️🧥',
    body: 'Mantenha-se seco e protegido.'
  },
  {
    title: 'Previsão de chuva forte! ☔🌂',
    body: 'Não esqueça de uma boa capa de chuva.'
  },
  {
    title: 'Prepare-se para a chuva! 🌧️',
    body: 'Não esqueça o guarda-chuva e vista roupas impermeáveis.'
  },
  {
    title: 'Não saia sem guarda-chuva! ☔',
    body: 'A chuva está chegando.'
  },
  {
    title: 'Clima chuvoso! 🌦️',
    body: 'Use seu guarda-chuva e vista roupas adequadas para enfrentar o dia.'
  }
];

const coldAlerts = [
  {
    title: 'Prepare-se para o frio! ❄️🧥🧣',
    body: 'Camadas de roupas e um casaco quente são essenciais.'
  },
  {
    title: 'Cachecol e luvas! 🧣❄️',
    body: 'Não esqueça do cachecol e das luvas! O frio está intenso lá fora.'
  },
  {
    title: 'Hora de um chá quentinho! ☕❄️',
    body: 'Mantenha-se aquecido neste clima gelado.'
  },
  {
    title: 'Bota uma bota! 🤪❄️',
    body: 'Proteja seus pés do frio.'
  }
];

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

// Função para obter a lista de mensagens com base no tipo de alerta
const getAlertsList = (alertType) => {
  switch (alertType) {
    case 'alerta_hidratacao':
      return hydrationAlerts;
    case 'alerta_sol':
      return sunAlerts;
    case 'alerta_chuva':
      return rainAlerts;
    case 'alerta_frio':
      return coldAlerts;
    default:
      console.error('Tipo de alerta desconhecido:', alertType);
      return [];
  }
};

// Função para escolher uma mensagem aleatória de uma lista
const getRandomMessage = (alerts) => {
  const randomIndex = Math.floor(Math.random() * alerts.length);
  return alerts[randomIndex];
};

//Enviar alertas e salvar o mais recente
const alertUsers = (users: User[], alertsTypes: AlertType[]) => {
  alertsTypes.forEach(alertType => {
    const alertMessages = getAlertsList(alertType);
    if (alertMessages.length > 0) {
      users.forEach((user) => {
        const registrationToken = user.firebase_token;
        const { title, body } = getRandomMessage(alertMessages);
        const message = {
          notification: {
            title: title,
            body: body,
          },
          token: registrationToken,
        };

        //TODO: SALVAR NO BANCO TITLE, BODY, TYPE E DATA ULTIMA NOTIFICACAO

        admin.messaging().send(message)
          .then((response) => {
            console.log('Notificação enviada com sucesso para:', user.firebase_token);
          })
          .catch((error) => {
            console.error('Erro ao enviar notificação:', error);
          });
      });
    }
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
