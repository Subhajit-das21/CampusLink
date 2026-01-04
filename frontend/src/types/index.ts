/** * CORE DATA SCHEMA: Nexus Link 2026 
 */

export type ServiceCategory = 'Food' | 'Printing' | 'Medical' | 'Repairs' | 'Other' | 'Homestay' | 'Store' | 'Stationery';

export interface Service {
  _id: string;       // MongoDB primary key
  id: string;        // Frontend mapped ID for React keys
  name: string;
  category: ServiceCategory;
  distance: number;  // Static distance from Gate 1
  isOpen: boolean;   // Fallback status
  address: string;
  description: string;
  lat: number;       // Required for Advanced Markers
  lng: number;       // Required for Advanced Markers
  placeId?: string;  // Required for Live Status synchronization
}

export interface Report {
  id: string;
  type: string;
  description: string;
  status: 'Pending' | 'In Progress' | 'Resolved';
  date: string;
  userId?: string;
  location?: { lat: number; lng: number }; // For reporting issues on the map
}

export interface MapLocation {
  id: string;
  name: string;
  type: 'campus' | 'shop' | 'college' | 'transport';
  lat: number;
  lng: number;
  category?: string;
  isCustomNode?: boolean; // To distinguish user-added nodes
}

export interface TransportVehicle {
  id: string;
  type: 'bus' | 'train';
  number: string;
  route: string;
  lat: number;
  lng: number;
  status: 'moving' | 'stopped';
  lastUpdated: string; // ISO timestamp for real-time tracking
}