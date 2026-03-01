import { useEffect, useRef, useState } from "react";
import {
  fetchWeatherByCoordinates,
  getWeatherRecommendation,
  WeatherData,
} from "../services/weatherService";

interface Coords {
  latitude: number;
  longitude: number;
}

interface UseWeatherResult {
  weather: WeatherData | null;
  recommendation: string;
  loading: boolean;
}

export const useWeather = (coords: Coords | null): UseWeatherResult => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [recommendation, setRecommendation] = useState<string>(
    "Conditions normal – travel is generally safe."
  );
  const [loading, setLoading] = useState(false);
  const debounceTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!coords) {
      setWeather(null);
      setRecommendation("Select a member to see their local weather.");
      return;
    }

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(async () => {
      setLoading(true);
      const data = await fetchWeatherByCoordinates(coords.latitude, coords.longitude);
      setWeather(data);
      setRecommendation(getWeatherRecommendation(data));
      setLoading(false);
    }, 800);

    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, [coords?.latitude, coords?.longitude]);

  return { weather, recommendation, loading };
};

