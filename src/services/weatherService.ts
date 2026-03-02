export interface WeatherData {
  temperature: number;
  description: string;
  humidity: number;
  windSpeedKmh: number;
  rainProbability: number;
}

export async function fetchWeatherByCoordinates(
  latitude: number,
  longitude: number
): Promise<WeatherData> {
  if (
    typeof latitude !== "number" ||
    typeof longitude !== "number" ||
    Number.isNaN(latitude) ||
    Number.isNaN(longitude)
  ) {
    throw new Error("Invalid coordinates for weather");
  }

  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}` +
    `&current=temperature_2m,relative_humidity_2m,wind_speed_10m` +
    `&hourly=precipitation_probability`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Weather API request failed");
  }

  const json = await response.json();

  if (!json?.current) {
    throw new Error("Malformed weather response");
  }

  return {
    temperature: Number(json.current.temperature_2m ?? 0),
    description: "Current conditions",
    humidity: Number(json.current.relative_humidity_2m ?? 0),
    windSpeedKmh: Number(json.current.wind_speed_10m ?? 0),
    rainProbability: Number(json.hourly?.precipitation_probability?.[0] ?? 0),
  };
}

export const getWeatherRecommendation = (weather: WeatherData | null): string => {
  if (!weather) return "Weather data unavailable";

  const { temperature, rainProbability, windSpeedKmh } = weather;

  if (temperature > 35) return "Heat Alert – stay hydrated & avoid direct sun.";
  if (temperature < 10) return "Cold Alert – wear warm clothing if going out.";
  if (rainProbability > 60) return "High chance of rain – carry an umbrella.";
  if (windSpeedKmh > 40) return "Windy conditions – stay cautious outdoors.";

  return "Conditions normal – travel is generally safe.";
};

