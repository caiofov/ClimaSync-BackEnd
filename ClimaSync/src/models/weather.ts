import { ConditionCodeType, ConditionSlugType } from "../enums/weather";

interface WeatherForecast {
  date: string;
  weekday: string;
  max: number;
  min: number;
  cloudiness: number;
  rain: number;
  rain_probability: number;
  wind_speedy: string;
  description: string;
  condition: string;
}

interface WeatherResults {
  temp: number;
  date: string;
  time: string;
  condition_code: ConditionCodeType;
  description: string;
  currently: string;
  cid: string;
  city: string;
  img_id: string;
  humidity: number;
  cloudiness: number;
  rain: number;
  wind_speedy: string;
  wind_direction: number;
  wind_cardinal: string;
  sunrise: string;
  sunset: string;
  moon_phase: string;
  condition_slug: ConditionSlugType;
  city_name: string;
  timezone: string;
  forecast: WeatherForecast[];
  cref?: string;
}

export interface WeatherResponse {
  by: string;
  valid_key: boolean;
  results: WeatherResults;
  execution_time: number;
  from_cache: boolean;
}

export interface LocationInput {
  latitude: number;
  longitude: number;
  token: string;
}
