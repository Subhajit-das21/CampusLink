import type { MapLocation, TransportVehicle } from '../types';

export const mapLocations: MapLocation[] = [
  // Campuses
  {
    id: 'campus-1',
    name: 'Main Campus',
    type: 'campus',
    lat: 28.5450,
    lng: 77.1920,
  },
  {
    id: 'campus-2',
    name: 'Engineering Block',
    type: 'campus',
    lat: 28.5455,
    lng: 77.1925,
  },
  
  // Colleges
  {
    id: 'college-1',
    name: 'Science College',
    type: 'college',
    lat: 28.5460,
    lng: 77.1930,
  },
  {
    id: 'college-2',
    name: 'Arts College',
    type: 'college',
    lat: 28.5440,
    lng: 77.1910,
  },
  
  // Shops
  {
    id: 'shop-1',
    name: 'Campus Cafe',
    type: 'shop',
    category: 'Food',
    lat: 28.5448,
    lng: 77.1918,
  },
  {
    id: 'shop-2',
    name: 'QuickPrint Express',
    type: 'shop',
    category: 'Printing',
    lat: 28.5452,
    lng: 77.1922,
  },
  {
    id: 'shop-3',
    name: 'MediCare Pharmacy',
    type: 'shop',
    category: 'Medical',
    lat: 28.5458,
    lng: 77.1928,
  },
];

export const transportVehicles: TransportVehicle[] = [
  {
    id: 'bus-1',
    type: 'bus',
    number: '405',
    route: 'Campus - City Center',
    lat: 28.5449,
    lng: 77.1919,
    status: 'moving',
  },
  {
    id: 'bus-2',
    type: 'bus',
    number: '302',
    route: 'Campus - Railway Station',
    lat: 28.5453,
    lng: 77.1923,
    status: 'stopped',
  },
  {
    id: 'train-1',
    type: 'train',
    number: '12345',
    route: 'Local Express',
    lat: 28.5465,
    lng: 77.1935,
    status: 'moving',
  },
];
