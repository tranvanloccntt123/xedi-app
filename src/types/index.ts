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
  location?: InputLocation;
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
  status: IFixedRouteStatus;
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
  lat?: number;
  lon?: number;
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
  trip_requests: ITripRequest[];
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
  location: InputLocation;
  status: IFixedRouteOrderStatus;
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

export interface PhotonReverseResponse {
  features: [
    {
      geometry: {
        coordinates: number[];
        type: "Point";
      };
      type: "Feature";
      properties: {
        osm_id: number;
        extent: number;
        country: string;
        city: string;
        countrycode: string;
        postcode: string;
        locality: string;
        type: string;
        osm_type: string;
        osm_key: string;
        street: string;
        district: string;
        osm_value: string;
        name: string;
      };
    }
  ];
  type: string;
}

export type SupabaseTableFilter<T = any> = {
  data: Array<T>;
  status: number;
  statusText: string;
};

export type SupabaseTableInsert<T = any> = {
  data: Array<T>;
  error: any;
};

export type SupbaseParams = {
  select?: any;
  pageNums?: number;
  id?: number;
  date?: string;
};

export type SelectLocationType = "start-location" | "end-location";

export type LatLng = {
  latitude: number;
  longitude: number;
};

export interface IDriverTripRequest {
  id: number;
  user_id: string;
  trip_request_id: number;
  price: number;
  users?: IUser;
  status: IDriverTripRequestStatus;
}

export enum IDriverTripRequestStatus {
  PENDING = 0,
  CUSTOMER_ACCEPT = 1,
}

export enum IFixedRouteStatus {
  PENDING = 0,
  RUNNING = 1,
  FINISHED = 2,
}

export enum IFixedRouteOrderStatus {
  PENDING = 0,
  ACCEPT = 1,
}
