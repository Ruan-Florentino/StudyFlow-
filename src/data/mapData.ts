import { MapPin, Hotel, Camera, Plane } from 'lucide-react';

export interface Destination {
  id: string;
  name: string;
  country: string;
  type: 'destination' | 'hotel' | 'attraction' | 'airport';
  coordinates: [number, number]; // [longitude, latitude]
  price: number;
  days: number;
  image: string;
  category: 'cheap' | 'international' | 'beach' | 'snow' | 'romantic' | 'family';
  region: 'Europe' | 'America' | 'Asia' | 'Africa' | 'Oceania';
}

export const DESTINATIONS: Destination[] = [
  {
    id: '1',
    name: 'Paris',
    country: 'França',
    type: 'destination',
    coordinates: [2.3522, 48.8566],
    price: 3200,
    days: 3,
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
    category: 'romantic',
    region: 'Europe'
  },
  {
    id: '2',
    name: 'Roma',
    country: 'Itália',
    type: 'destination',
    coordinates: [12.4964, 41.9028],
    price: 2800,
    days: 4,
    image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80',
    category: 'international',
    region: 'Europe'
  },
  {
    id: '3',
    name: 'Tóquio',
    country: 'Japão',
    type: 'destination',
    coordinates: [139.6503, 35.6762],
    price: 5500,
    days: 7,
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=800&q=80',
    category: 'international',
    region: 'Asia'
  },
  {
    id: '4',
    name: 'Nova York',
    country: 'EUA',
    type: 'destination',
    coordinates: [-74.0060, 40.7128],
    price: 4200,
    days: 5,
    image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800&q=80',
    category: 'family',
    region: 'America'
  },
  {
    id: '5',
    name: 'Maldivas',
    country: 'Maldivas',
    type: 'destination',
    coordinates: [73.5093, 4.1755],
    price: 8500,
    days: 5,
    image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=800&q=80',
    category: 'beach',
    region: 'Asia'
  },
  {
    id: '6',
    name: 'Swiss Alps',
    country: 'Suíça',
    type: 'destination',
    coordinates: [8.2275, 46.8182],
    price: 4800,
    days: 4,
    image: 'https://images.unsplash.com/photo-1531310197839-ccf54634509e?auto=format&fit=crop&w=800&q=80',
    category: 'snow',
    region: 'Europe'
  },
  {
    id: '7',
    name: 'Bali',
    country: 'Indonésia',
    type: 'destination',
    coordinates: [115.1889, -8.4095],
    price: 1800,
    days: 10,
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
    category: 'cheap',
    region: 'Asia'
  }
];

export const HOTELS = [
  { id: 'h1', name: 'Ritz Paris', coordinates: [2.3285, 48.8681], price: 1200 },
  { id: 'h2', name: 'The Plaza NY', coordinates: [-73.9740, 40.7644], price: 950 },
];

export const ATTRACTIONS = [
  { id: 'a1', name: 'Eiffel Tower', coordinates: [2.2945, 48.8584] },
  { id: 'a2', name: 'Colosseum', coordinates: [12.4922, 41.8902] },
];
