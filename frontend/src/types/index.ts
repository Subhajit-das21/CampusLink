export interface Service {
  id: string;
  name: string;
  category: 'Food' | 'Printing' | 'Medical' | 'Repairs';
  distance: number;
  isOpen: boolean;
  address: string;
  description: string;
}

export interface Report {
  id: string;
  type: string;
  description: string;
  status: 'Pending' | 'In Progress' | 'Resolved';
  date: string;
}

export interface MapLocation {
  id: string;
  name: string;
  type: 'campus' | 'shop' | 'college' | 'transport';
  lat: number;
  lng: number;
  category?: string;
}

export interface TransportVehicle {
  id: string;
  type: 'bus' | 'train';
  number: string;
  route: string;
  lat: number;
  lng: number;
  status: 'moving' | 'stopped';
}
