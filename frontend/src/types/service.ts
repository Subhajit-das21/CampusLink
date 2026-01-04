export type ServiceCategory = 'Food' | 'Printing' | 'Medical' | 'Repairs' | 'Other' | 'Homestay' | 'Store' | 'Stationery';

export interface Service {
  _id: string;      // MongoDB ID
  id: string;       // Frontend mapped ID
  name: string;
  category: ServiceCategory;
  description: string;
  address: string;
  isOpen: boolean;  // Fallback status from DB
  distance: number; // Static distance (usually from Gate)
  lat: number;
  lng: number;
  placeId?: string; // Required for Google Places Live Sync
  
  // Optional Live Data fields for runtime updates
  liveStatus?: {
    isOpen: boolean | null;
    lastSynced: string;
    regularOpeningHours?: any; // Modern Google Place class data
  };
}