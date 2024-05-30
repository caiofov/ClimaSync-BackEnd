import CONFIG from "./config";
import { WeatherResponse } from "./models/weather";
// faz as requisições para a API de clima

const BASE_URL = "https://api.hgbrasil.com";

export const getWeather = async (latitude: number, longitude: number) => {
  const url =
    `${BASE_URL}/weather?` +
    new URLSearchParams({
      key: CONFIG.WEATHER_KEY,
      lat: latitude.toString(),
      lon: longitude.toString(),
    });
  console.log(`Requesting ${url}`);
  const response: WeatherResponse = await fetch(url).then((r) => r.json());
  return response;
};
