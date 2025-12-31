import type { Service } from '../types';

export const servicesData: Service[] = [
  {
    id: '1',
    name: 'Campus Cafe',
    category: 'Food',
    distance: 250,
    isOpen: true,
    address: '123 University Road',
    description: 'Popular student hangout spot serving coffee, snacks, and light meals. Known for affordable prices and cozy atmosphere.'
  },
  {
    id: '2',
    name: 'QuickPrint Express',
    category: 'Printing',
    distance: 180,
    isOpen: true,
    address: '45 College Street',
    description: 'Fast and reliable printing services. Specializes in assignments, projects, and thesis printing. 24/7 service available.'
  },
  {
    id: '3',
    name: 'MediCare Pharmacy',
    category: 'Medical',
    distance: 420,
    isOpen: false,
    address: '78 Health Avenue',
    description: 'Trusted pharmacy with licensed pharmacists. Wide range of medicines and health products available.'
  },
  {
    id: '4',
    name: 'Tech Repair Hub',
    category: 'Repairs',
    distance: 350,
    isOpen: true,
    address: '92 Innovation Lane',
    description: 'Expert laptop and phone repair services. Quick turnaround time. Specializes in student devices.'
  },
  {
    id: '5',
    name: 'Biriyani Corner',
    category: 'Food',
    distance: 320,
    isOpen: true,
    address: '15 Food Street',
    description: 'Authentic biriyani and local cuisine. Student-friendly portions and pricing. Late night delivery available.'
  },
  {
    id: '6',
    name: 'CopyZone',
    category: 'Printing',
    distance: 150,
    isOpen: true,
    address: '23 Campus Road',
    description: 'Photocopy, scanning, and binding services. Closest to campus gate. Student discounts available.'
  },
];
