export const CONDITION_SLUG = {
  STORM: "storm",
  SNOW: "snow",
  HAIL: "hail",
  RAIN: "rain",
  FOG: "fog",
  CLEAR_DAY: "clear_day",
  CLEAR_NIGHT: "clear_night",
  CLOUD: "cloud",
  CLOUDLY_DAY: "cloudly_day",
  CLOUDLY_NIGHT: "cloudly_night",
  NONE_DAY: "none_day",
  NONE_NIGHT: "none_night",
} as const;

export const CONDITION_CODE = {
  STRONG_STORM: 0,
  TROPICAL_STORM: 1,
  HURRICANE: 2,
  SEVERE_THUNDERSTORMS: 3,
  THUNDERSTORMS: 4,
  MIXED_SNOW_AND_RAIN: 5,
  MIXED_RAIN_AND_SLEET: 6,
  MIXED_SNOW_AND_SLEET: 7,
  LIGHT_SLEET: 8,
  DRIZZLE: 9,
  FREEZING_RAIN: 10,
  FEW_DRIZZLES: 11,
  FEW_DRIZZLES_ALT: 12,
  LIGHT_SNOW: 13,
  SNOW_STORM: 14,
  SNOW_WINDSTORM: 15,
  SNOW: 16,
  HAIL: 17,
  SLEET: 18,
  DUST: 19,
  FOG: 20,
  SANDSTORM: 21,
  SMOKY: 22,
  HEAVY_WIND: 23,
  WINDSTORM: 24,
  COLD_WEATHER: 25,
  CLOUDY_WEATHER: 26,
  CLEAR_WEATHER: 27,
  CLOUDY_WEATHER_ALT: 28,
  PARTLY_CLOUDY: 29,
  PARTLY_CLOUDY_ALT: 30,
  CLEAR_WEATHER_ALT: 31,
  SUNNY: 32,
  STARRY: 33,
  MOSTLY_SUNNY: 34,
  MIXED_RAIN_AND_HAIL: 35,
  HOT_WEATHER: 36,
  ISOLATED_THUNDERSTORMS: 37,
  SCATTERED_THUNDERSTORMS: 38,
  SCATTERED_THUNDERSTORMS_ALT: 39,
  SCATTERED_SHOWERS: 40,
  HEAVY_SNOW: 41,
  SNOW_DRIZZLE: 42,
  HEAVY_SNOW_ALT: 43,
  MOSTLY_SUNNY_WITH_SOME_CLOUDS: 44,
  RAIN: 45,
  SNOW_FALL: 46,
  ISOLATED_THUNDERSTORMS_ALT: 47,
  SERVICE_NOT_AVAILABLE: 48,
} as const;

export type ConditionCodeType =
  (typeof CONDITION_CODE)[keyof typeof CONDITION_CODE];

export type ConditionSlugType =
  (typeof CONDITION_SLUG)[keyof typeof CONDITION_SLUG];

export interface AlertThresholds {
  hot: number;
  cold: number;
  humidity: number;
}

export const WEATHER_ALERT = {
  RAINY: [
    CONDITION_CODE.STRONG_STORM,
    CONDITION_CODE.TROPICAL_STORM,
    CONDITION_CODE.RAIN,
    CONDITION_CODE.MIXED_RAIN_AND_HAIL,
    CONDITION_CODE.MIXED_RAIN_AND_SLEET,
    CONDITION_CODE.FREEZING_RAIN,
  ] as number[],
  SUNNY: [
    CONDITION_CODE.SUNNY,
    CONDITION_CODE.MOSTLY_SUNNY,
    CONDITION_CODE.MOSTLY_SUNNY_WITH_SOME_CLOUDS,
  ] as number[],
};

export const validateThreshold = (thresholds: any) => {
  return {
    hot: thresholds.hot ?? 30,
    cold: thresholds.cold ?? 22,
    humidity: thresholds.humidity ?? 60,
  } as AlertThresholds;
};
