import { ITripRequest } from '@/src/types';

export const mockTripRequests: ITripRequest[] = [
  {
    id: '1',
    customerId: 'customer1',
    startLocation: 'Hanoi City Center',
    endLocation: 'Noi Bai International Airport',
    departureTime: new Date('2025-01-15T10:00:00'),
    status: 'pending',
    requestTime: new Date('2025-01-14T15:30:00'),
    updatedAt: new Date('2025-01-14T15:30:00'),
    riderRequests: [],
  },
  {
    id: '2',
    customerId: 'customer2',
    startLocation: 'Ho Chi Minh City Center',
    endLocation: 'Tan Son Nhat International Airport',
    departureTime: new Date('2025-01-16T14:30:00'),
    status: 'pending',
    requestTime: new Date('2025-01-15T09:45:00'),
    updatedAt: new Date('2025-01-15T09:45:00'),
    riderRequests: ['rider1'],
  },
  {
    id: '3',
    customerId: 'customer3',
    startLocation: 'Da Nang Beach',
    endLocation: 'Da Nang City Center',
    departureTime: new Date('2025-01-17T11:15:00'),
    status: 'pending',
    requestTime: new Date('2025-01-16T18:20:00'),
    updatedAt: new Date('2025-01-16T18:20:00'),
    riderRequests: ['rider2', 'rider3'],
  },
];

