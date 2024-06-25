import CONFIG from "./config";
import { getAllPlaces, listUsersByPlace, updateLastMessage } from "./dao";
import { AlertThresholds, WEATHER_ALERT } from "./enums/weather";
import { AlertType, User } from "./models/user";
import { WeatherResponse } from "./models/weather";
import { sendTuyaCommand } from "./tuya";
import { getWeatherByName } from "./weather";

// este arquivo contém as funções do cron job para coletar as informações de clima e notificar os usuários
const admin = require("firebase-admin");

const serviceAccount = {
  type: "service_account",
  project_id: CONFIG.FIREBASE_PROJECT_ID,
  private_key_id: CONFIG.FIREBASE_PRIVATE_KEY_ID,
  private_key: CONFIG.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  client_email: CONFIG.FIREBASE_CLIENT_EMAIL,
  client_id: CONFIG.FIREBASE_CLIENT_ID,
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: CONFIG.FIREBASE_CLIENT_X509_CERT_URL,
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Definir listas de mensagens para diferentes tipos de alertas
const hydrationAlerts = [
  {
    title: "Hora de se hidratar! 🥤",
    body: "O clima está seco. Beba água regularmente para se manter fresco e bem-hidratado.",
  },
  {
    title: "Hidrate-se! 🥤",
    body: "Beba água e evite atividades exaustivas ao ar livre.",
  },
  {
    title: "Clima seco! 🌞🥤",
    body: "Lembre-se de se hidratar regularmente. Beba água e proteja-se do sol.",
  },
];

const sunAlerts = [
  {
    title: "Alerta! ☀️🧴",
    body: "Hoje está ensolarado e a intensidade solar está alta. Lembre-se de usar protetor solar!",
  },
  {
    title: "Dica: 🌞🕶️🧴",
    body: "Chapéu, óculos de sol e protetor solar são seus melhores amigos hoje!",
  },
  {
    title: "Reaplique o protetor solar! ☀️🔄🧴",
    body: "Lembre-se de reaplicar o protetor solar se estiver ao ar livre por muito tempo!",
  },
  {
    title: "Clima quente e ensolarado! ☀️🧴",
    body: "Lembre-se de usar protetor solar e proteger-se do sol.",
  },
];

const rainAlerts = [
  {
    title: "Cuidado nas estradas molhadas! 🚗🌧️",
    body: "Dirija com segurança na chuva.",
  },
  {
    title: "Tempo chuvoso! 🌧️🧥",
    body: "Mantenha-se seco e protegido.",
  },
  {
    title: "Previsão de chuva forte! ☔🌂",
    body: "Não esqueça de uma boa capa de chuva.",
  },
  {
    title: "Prepare-se para a chuva! 🌧️",
    body: "Não esqueça o guarda-chuva e vista roupas impermeáveis.",
  },
  {
    title: "Não saia sem guarda-chuva! ☔",
    body: "A chuva está chegando.",
  },
  {
    title: "Clima chuvoso! 🌦️",
    body: "Use seu guarda-chuva e vista roupas adequadas para enfrentar o dia.",
  },
];

const coldAlerts = [
  {
    title: "Prepare-se para o frio! ❄️🧥🧣",
    body: "Camadas de roupas e um casaco quente são essenciais.",
  },
  {
    title: "Cachecol e luvas! 🧣❄️",
    body: "Não esqueça do cachecol e das luvas! O frio está intenso lá fora.",
  },
  {
    title: "Hora de um chá quentinho! ☕❄️",
    body: "Mantenha-se aquecido neste clima gelado.",
  },
  {
    title: "Bota uma bota! 🥾🤪❄️",
    body: "Proteja seus pés do frio.",
  },
];

const alertsForInfo = (info: WeatherResponse, thresholds: AlertThresholds) => {
  // identifica quais alertas vão ser ativados com essas informações de clima
  const alerts: AlertType[] = [];

  if (info.results.temp >= thresholds.hot) alerts.push("alerta_calor");
  else if (info.results.temp <= thresholds.cold) alerts.push("alerta_frio");

  if (info.results.humidity <= thresholds.humidity)
    alerts.push("alerta_hidratacao");

  console.log(info.results.condition_code);

  if (WEATHER_ALERT.RAINY.includes(info.results.condition_code))
    alerts.push("alerta_chuva");
  else if (WEATHER_ALERT.SUNNY.includes(info.results.condition_code))
    alerts.push("alerta_sol");

  return alerts;
};

// Função para obter a lista de mensagens com base no tipo de alerta
const getAlertsList = (alertType) => {
  switch (alertType) {
    case "alerta_hidratacao":
      return hydrationAlerts;
    case "alerta_sol":
      return sunAlerts;
    case "alerta_chuva":
      return rainAlerts;
    case "alerta_frio":
      return coldAlerts;
    default:
      console.error("Tipo de alerta desconhecido:", alertType);
      return [];
  }
};

// Função para escolher uma mensagem aleatória de uma lista
const getRandomMessage = (alerts) => {
  const randomIndex = Math.floor(Math.random() * alerts.length);
  return alerts[randomIndex];
};

//Verificar se usuário possui alerta ativado
const isAlertActivatedForUser = (user, alertType) => {
  switch (alertType) {
    case "alerta_hidratacao":
      return user.alerta_hidratacao;
    case "alerta_sol":
      return user.alerta_sol;
    case "alerta_chuva":
      return user.alerta_chuva;
    case "alerta_frio":
      return user.alerta_frio;
    default:
      return false;
  }
};

//Enviar alertas e salvar o mais recente
const alertUsers = (users, alertsTypes) => {
  // Visitando cada usuário
  users.forEach((user) => {
    // Verifica se algum alerta já foi enviado para este usuário
    let notificationSent = false;

    const registrationToken = user.firebase_token;
    if (registrationToken == "pushToken") return;

    // Visitando alertas gatilhados para este usuário
    alertsTypes.forEach((alertType) => {
      // Se já enviou notificação para este usuário, sair do loop
      if (notificationSent) return;

      const alertMessages = getAlertsList(alertType);
      if (
        alertMessages.length > 0 &&
        isAlertActivatedForUser(user, alertType)
      ) {
        const { title, body } = getRandomMessage(alertMessages);
        const message = {
          notification: {
            title: title,
            body: body,
          },
          token: registrationToken,
        };

        admin
          .messaging()
          .send(message)
          .then((response) => {
            console.log(
              "Notificação enviada com sucesso para:",
              user.firebase_token
            );
          })
          .catch((error) => {
            console.error("Erro ao enviar notificação:", error);
          });

        // Atualiza o último alerta enviado para o usuário
        updateLastMessage(title, body, alertType, registrationToken);

        // Marca que uma notificação foi enviada para este usuário
        notificationSent = true;
      }
    });
  });
};

const controlDevices = async (users: User[], on: boolean) => {
  console.log(`\t${on ? "Ligando" : "Desligando"} os dispositivos`);
  for (const user of users) sendTuyaCommand(on, user.device_id);
};

export const searchForAlerts = async (thresholds: AlertThresholds) => {
  const alertsFound: { [city: string]: string[] } = {};
  const places = await getAllPlaces();

  for (const place of places) {
    console.log(`> Gerando alertas para a cidade ${place}`);

    const info = await getWeatherByName(place);

    const alerts = alertsForInfo(info, thresholds);
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
