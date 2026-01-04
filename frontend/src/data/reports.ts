import type { Report } from '../types';

/**
 * Global Report Ledger: Mock data for the CampusLink Civic Network.
 * Used for testing the Profile dashboard and Map pinning logic.
 */
export const reportsData: Report[] = [
  {
    id: 'RPT-001',
    type: 'Street Light',
    description: 'Terminal street light failure near Sector Gate 2. Area is completely dark after 18:00.',
    status: 'In Progress',
    date: '2025-12-20',
    location: { lat: 22.5585, lng: 88.3960 } // Coords for Map pinning
  },
  {
    id: 'RPT-002',
    type: 'Road Safety',
    description: 'Large pothole on the main campus bypass. Hazard for student cyclists.',
    status: 'Resolved',
    date: '2025-12-18',
    location: { lat: 22.5570, lng: 88.3975 }
  },
  {
    id: 'RPT-003',
    type: 'Safety Concern',
    description: 'Blocked emergency exit in the IT building basement due to construction debris.',
    status: 'Pending',
    date: '2026-01-02',
    location: { lat: 22.5592, lng: 88.3958 }
  },
  {
    id: 'RPT-004',
    type: 'Water Supply',
    description: 'Leak detected in the main drinking water node near the Library entrance.',
    status: 'Resolved',
    date: '2025-12-25',
    location: { lat: 22.5582, lng: 88.3968 }
  }
];