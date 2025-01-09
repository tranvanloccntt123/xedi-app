export interface IChatMessage {
  id: string;
  chatRoomId: string;
  senderId: string;
  message: string;
  messageType: 'text' | 'image' | 'system';
  sentAt: Date;
}

export interface IChatRoom {
  id: string;
  tripRequestId?: string;
  fixedRouteId?: string;
  customerId: string;
  driverId: string;
  status: 'active' | 'pending' | 'closed';
  createdAt: Date;
  updatedAt: Date;
}

export interface IFixedRoute {
  id: string;
  driverId: string;
  startLocation: string;
  endLocation: string;
  departureTime: string;
  totalSeats: number;
  availableSeats: number;
  price: number;
  createdAt: Date;
}

export interface IRating {
  id: string;
  driverId: string;
  customerId: string;
  tripId: string;
  rating: number;
  comment?: string;
  createdAt: Date;
}

export interface ITripRequest {
  id: string;
  customerId: string;
  startLocation: string;
  endLocation: string;
  departureTime: Date;
  status: 'pending' | 'accepted' | 'rejected' | 'cancelled';
  requestTime: Date;
  updatedAt: Date;
}

export interface ITripRequestForFixedRoute {
  id: string;
  fixedRouteId: string;
  customerId: string;
  requestType: 'join' | 'cancel';
  status: 'pending' | 'accepted' | 'rejected' | 'cancelled';
  requestTime: Date;
  updatedAt: Date;
}

export interface IUser {
  id: string;
  name: string;
  phone: string;
  password: string;
  email?: string;
  role: 'customer' | 'driver';
  vehicleId?: string;
  totalRatings?: number;
  averageRating?: number;
  createdAt: Date;
}

export interface IVehicle {
  id: string;
  driverId: string;
  licensePlate: string;
  model: string;
  color?: string;
  capacity: number;
  createdAt: Date;
}

