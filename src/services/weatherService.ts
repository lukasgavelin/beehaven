import { WeatherData } from '../types';

// WMO Weather Interpretation Codes → human-readable label
function wmoCodeToCondition(code: number): string {
  if (code === 0) return 'Clear sky';
  if (code <= 3) return 'Partly cloudy';
  if (code <= 48) return 'Fog';
  if (code <= 67) return 'Rain';
  if (code <= 77) return 'Snow';
  if (code <= 82) return 'Showers';
  if (code <= 86) return 'Snow showers';
  if (code <= 99) return 'Thunderstorm';
  return 'Unknown';
}

export async function fetchWeather(lat: number, lon: number): Promise<WeatherData> {
  const url =
    `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${lat}&longitude=${lon}` +
    `&current=temperature_2m,precipitation,cloud_cover,weather_code,relative_humidity_2m` +
    `&timezone=auto`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Weather fetch failed: ${response.status}`);
  }

  const json = await response.json();
  const current = json.current;

  return {
    temp: Math.round(current.temperature_2m),
    condition: wmoCodeToCondition(current.weather_code),
    humidity: Math.round(current.relative_humidity_2m),
    weatherCode: current.weather_code,
  };
}
