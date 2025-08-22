// Fetch car recommendations based on price
export async function fetchCarRecommendations(price: number) {
  const res = await fetch(`${import.meta.env.VITE_API_HOST || ''}/user/suggest-car/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ price }),
  });
  if (!res.ok) throw new Error('Failed to fetch car recommendations');
  return res.json();
}
// Predict car price
export async function predictPrice(payload: {
  name: string;
  model: string;
  gearbox: string;
  year: number;
  mile: number;
  body_health: number;
  engine_status: string;
}) {
  const res = await fetch(`${import.meta.env.VITE_API_HOST || ''}/user/predict-price/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to get prediction');
  return res.json();
}
// API utility for car names and models
export async function fetchCarNames() {
  const res = await fetch(`${import.meta.env.VITE_API_HOST || ''}/cars/names/`);
  if (!res.ok) throw new Error('Failed to fetch car brands');
  return res.json();
}

export async function fetchCarModels(name: string) {
  const res = await fetch(`${import.meta.env.VITE_API_HOST || ''}/cars/models?name=${encodeURIComponent(name)}`);
  if (!res.ok) throw new Error('Failed to fetch car models');
  return res.json();
}

// Interface for car search result
export interface CarSearchResult {
  name: string;
  image: string;
  price: number;
  source: string;
  link: string;
}

// Search for cars across different websites
export async function searchCars(searchTerm: string): Promise<{ data: CarSearchResult[] }> {
  const res = await fetch(`${import.meta.env.VITE_API_HOST || ''}/user/search?search=${encodeURIComponent(searchTerm)}`);
  if (!res.ok) throw new Error('Failed to search cars');
  return res.json();
}
