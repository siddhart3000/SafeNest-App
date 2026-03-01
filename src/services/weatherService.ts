import Constants from "expo-constants";
import { logError } from "../utils/errorHandler";

export interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeedKmh: number;
  rainProbability: number;
  description: string;
  icon: string;
}

const getApiKey = (): string | null => {
  const embeddedKey =
    process.env.EXPO_PUBLIC_WEATHER_API_KEY ??
    (Constants.expoConfig?.extra as any)?.weatherApiKey ??
    null;
  return embeddedKey && embeddedKey.length > 0 ? embeddedKey : null;
};

export const fetchWeatherByCoordinates = async (
  latitude: number,
  longitude: number
): Promise<WeatherData | null> => {
  const apiKey = getApiKey();
  if (!apiKey) {
    logError("weather.fetchWeatherByCoordinates", "Missing EXPO_PUBLIC_WEATHER_API_KEY");
    return null;
  }

  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`);
    }

    const json = await response.json();

    const temperature = json.main?.temp ?? 0;
    const humidity = json.main?.humidity ?? 0;
    const windSpeedMs = json.wind?.speed ?? 0;
    const rainProbability =
      json.rain?.["1h"] != null ? Math.min(json.rain["1h"] * 100, 100) : 0;
    const description = json.weather?.[0]?.description ?? "Unknown";
    const icon = json.weather?.[0]?.icon ?? "01d";

    const windSpeedKmh = windSpeedMs * 3.6;

    return {
      temperature,
      humidity,
      windSpeedKmh,
      rainProbability,
      description,
      icon,
    };
  } catch (error) {
    logError("weather.fetchWeatherByCoordinates", error);
    return null;
  }
};

export const getWeatherRecommendation = (weather: WeatherData | null): string => {
  if (!weather) return "Weather data unavailable";

  const { temperature, rainProbability, windSpeedKmh } = weather;

  if (temperature > 35) return "Heat Alert – stay hydrated & avoid direct sun.";
  if (temperature < 10) return "Cold Alert – wear warm clothing if going out.";
  if (rainProbability > 60) return "High chance of rain – carry an umbrella.";
  if (windSpeedKmh > 40) return "Windy conditions – stay cautious outdoors.";

  return "Conditions normal – travel is generally safe.";
};

