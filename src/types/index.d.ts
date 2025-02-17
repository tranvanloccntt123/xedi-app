export interface IChatMessage {
  id: string;
  chatRoomId: string;
  senderId: string;
  message: string;
  messageType: "text" | "image" | "system";
  sentAt: Date;
}

export interface IChatRoom {
  id: string;
  tripRequestId?: string;
  fixedRouteId?: string;
  customerId: string;
  driverId: string;
  status: "active" | "pending" | "closed";
  createdAt: Date;
  updatedAt: Date;
}

export interface InputLocation {
  display_name: string;
  lat: number;
  lon: number;
}

export interface FixedRouteOrderForm {
  name: string;
  phone: string;
  note?: string;
}

export interface IFixedRoute {
  id: number;
  user_id: string;
  startLocation: InputLocation;
  endLocation: InputLocation;
  departureTime: string;
  totalSeats: number;
  availableSeats: number;
  price: number;
  created_at: Date;
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
  id: number;
  user_id: string;
  startLocation: InputLocation;
  endLocation: InputLocation;
  departureTime: Date;
  status: number;
  type: "Delivery" | "Taxi";
}

export interface ITripRequestForFixedRoute {
  id: string;
  fixedRouteId: string;
  customerId: string;
  requestType: "join" | "cancel";
  status: "pending" | "accepted" | "rejected" | "cancelled";
  requestTime: Date;
  updatedAt: Date;
}

export interface IUser {
  id: string;
  name: string;
  phone: string;
  email?: string;
  role: "customer" | "driver";
  vehicleId?: string;
  totalRatings?: number;
  averageRating?: number;
  createdAt?: Date;
  password?: string;
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

export interface INewsFeedItem {
  id: string;
  users: IUser;
  created_at: Date;
  fixed_routes: IFixedRoute[];
  content: string;
}

export interface UserState {
  currentUser: IUser | null;
  loading: boolean;
  error: string | null;
}

export interface IFixedRouteOrder {
  id: string;
  fixed_route_id: number;
  user_id: string;
  name: string;
  phone_number: string;
  note?: string;
  created_at: Date;
  /*
    Status:
    - 0: Request
    - 1: Accept Request
  */
  status: 0 | 1;
}

export interface INotification {
  id: number;
  body: string;
  users?: IUser;
  created_at: string;
}

export interface IUserCoin {
  id: number;
  created_at: string;
  coins: number;
  user_id: string;
}