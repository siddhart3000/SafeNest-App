import { useEffect, useRef, useState } from "react";
import {
  fetchWeatherByCoordinates,
  getWeatherRecommendation,
  WeatherData,
} from "../services/weatherService";
import { logError } from "../utils/errorHandler";

interface Coords {
  latitude: number;
  longitude: number;
}

interface UseWeatherResult {
  weather: WeatherData | null;
  recommendation: string;
  loading: boolean;
}

const isValidCoordinate = (lat: any, lng: any): boolean => {
  return (
    typeof lat === "number" &&
    typeof lng === "number" &&
    !Number.isNaN(lat) &&
    !Number.isNaN(lng)
  );
};

export const useWeather = (coords: Coords | null): UseWeatherResult => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [recommendation, setRecommendation] = useState<string>(
    "Conditions normal – travel is generally safe."
  );
  const [loading, setLoading] = useState(false);
  const debounceTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!mountedRef.current) {
      return;
    }

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    if (!coords || !isValidCoordinate(coords.latitude, coords.longitude)) {
      if (!mountedRef.current) {
        return;
      }

      setWeather(null);
      setRecommendation("Select a member to see their local weather.");
      return;
    }

    debounceTimeout.current = setTimeout(async () => {
      try {
        if (!mountedRef.current) return;
        setLoading(true);
        const data = await fetchWeatherByCoordinates(coords.latitude, coords.longitude);
        if (!mountedRef.current) return;
        setWeather(data);
        setRecommendation(getWeatherRecommendation(data));
      } catch (error) {
        logError("useWeather.fetch", error);
      } finally {
        if (mountedRef.current) {
          setLoading(false);
        }
      }
    }, 800);

    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, [coords?.latitude, coords?.longitude]);

  return { weather, recommendation, loading };
};


