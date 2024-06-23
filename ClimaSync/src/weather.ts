import CONFIG from "./config";
import { LocationOutput, WeatherResponse } from "./models/weather";

// faz as requisições para a API de clima

const BASE_URL = "https://api.hgbrasil.com";

//função geral de requisição
const makeWeatherRequest = async (params: URLSearchParams) => {
  params.append("key", CONFIG.WEATHER_KEY);
  const url = `${BASE_URL}/weather?` + params;

  console.log(`Requesting ${url}`);
  const response: WeatherResponse = await fetch(url).then((r) => r.json());
  return response;
};

//busca as informações pelo nome da cidade
export const getWeatherByName = async (name: string) => {
  return makeWeatherRequest(new URLSearchParams({ city_name: name }));
};

//busca as informações pela coordenada
export const getWeather = async (latitude: number, longitude: number) => {
  return makeWeatherRequest(
    new URLSearchParams({
      lat: latitude.toString(),
      lon: longitude.toString(),
    })
  );
};

export const transformWeatherResponse = (info: WeatherResponse) =>
  ({
    temp: info.results.temp,
    city: info.results.city,
    city_name: info.results.city_name,
    date: info.results.date,
    time: info.results.time,
    humidity: info.results.humidity,
    condition: info.results.description,
  } as LocationOutput);
