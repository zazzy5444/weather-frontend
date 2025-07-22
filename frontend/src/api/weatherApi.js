export async function getWeatherByCity(city) {
  const res = await fetch(`/api/weather?city=${encodeURIComponent(city)}`);
  if (!res.ok) throw new Error('Failed to fetch weather data');
  return await res.json();
}

export async function getWeatherByLatLon(lat, lon) {
  const res = await fetch(`/api/weather?lat=${lat}&lon=${lon}`);
  if (!res.ok) throw new Error('Failed to fetch weather data');
  return await res.json();
}