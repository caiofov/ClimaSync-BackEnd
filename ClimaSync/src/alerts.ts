import { getAllPlaces, getUsersByPlaceAndAlert } from "./dao";
import { TEMP_ALERT, WEATHER_ALERT } from "./enums/weather";
import { AlertType, User } from "./models/user";
import { WeatherResponse } from "./models/weather";
import { getWeatherByName } from "./weather";

const alertsForInfo = (info: WeatherResponse) => {
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
    alerts.forEach((alert) => {
      if (user[alert])
        console.log(`Alert ${alert}, usuário ${user.firebase_token}`);
    });
  });
};

export const searchForAlerts = async () => {
  const alertsFound = {};
  const places = await getAllPlaces();

  for (const place of places) {
    console.log(`> Gerando alertas para a cidade ${place}`);

    const info = await getWeatherByName(place);

    const alerts = alertsForInfo(info);
    alertsFound[place] = alerts;

    if (alerts.length) {
      console.log(`\tAlertas encontrados: ${alerts}`);

      const users = await getUsersByPlaceAndAlert(place, alerts);
      alertUsers(users, alerts);
    } else {
      console.log("\tNenhum alerta encontrado");
    }
  }

  return alertsFound;
};
