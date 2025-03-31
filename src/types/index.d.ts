interface IChatMessage {
  id: string;
  chatRoomId: string;
  senderId: string;
  message: string;
  messageType: "text" | "image" | "system";
  sentAt: Date;
}

interface IChatRoom {
  id: string;
  tripRequestId?: string;
  fixedRouteId?: string;
  customerId: string;
  driverId: string;
  status: "active" | "pending" | "closed";
  createdAt: Date;
  updatedAt: Date;
}

interface InputLocation {
  display_name: string;
  lat: number;
  lon: number;
}

interface FixedRouteOrderForm {
  name: string;
  phone: string;
  note?: string;
  location?: InputLocation;
}

interface IFixedRoute {
  id: number;
  user_id: string;
  startLocation: InputLocation;
  endLocation: InputLocation;
  departureTime: string;
  totalSeats: number;
  availableSeats: number;
  price: number;
  created_at: Date;
  status: number;
}

interface IRating {
  id: string;
  driverId: string;
  customerId: string;
  tripId: string;
  rating: number;
  comment?: string;
  createdAt: Date;
}

interface ITripRequest {
  id: number;
  user_id: string;
  users?: IUser;
  startLocation: InputLocation;
  endLocation: InputLocation;
  departureTime: Date;
  status: number;
  type: "Delivery" | "Taxi";
  created_at?: string;
  fixed_route_id?: number;
  fixed_routes?: IFixedRoute;
}

interface IUser {
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

interface IVehicle {
  id: string;
  driverId: string;
  licensePlate: string;
  model: string;
  color?: string;
  capacity: number;
  createdAt: Date;
}

interface INewsFeedItem {
  id: string;
  users: IUser;
  created_at: Date;
  fixed_routes: IFixedRoute[];
  trip_requests: ITripRequest[];
  content: string;
  comments: [{ count: number }];
}

interface UserState {
  currentUser: IUser | null;
  loading: boolean;
  error: string | null;
}

interface IFixedRouteOrder {
  id: string;
  fixed_route_id: number;
  user_id: string;
  users?: IUser;
  name: string;
  phone_number: string;
  note?: string;
  created_at: Date;
  location: InputLocation;
  status: number;
}

interface INotification {
  id: number;
  body: string;
  users?: IUser;
  created_at: string;
}

interface IUserCoin {
  id: number;
  created_at: string;
  coins: number;
  user_id: string;
}

interface PhotonReverseResponse {
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

type SupabaseTableFilter<T = any> = {
  data: Array<T>;
  status: number;
  statusText: string;
};

type SupabaseTableInsert<T = any> = {
  data: Array<T>;
  error: any;
};

type SupabaseFilter = {
  filter: "lte" | "lt" | "gte" | "gt" | "eq";
  filed: string;
  data: string | number;
};

type SupabaseOrFilter = {
  query: string;
};

type SupabaseAndFilter = {
  query: string;
};

type SupabaseParams = {
  select?: any;
  pageNums?: number;
  id?: number;
  date?: string;
  filter?: SupabaseFilter[];
  andFilter?: SupabaseAndFilter[];
  orFilter?: SupabaseOrFilter[];
  byCurrentUser?: boolean;
};

type SelectLocationType = "start-location" | "end-location";

type LatLng = {
  latitude: number;
  longitude: number;
};

interface IDriverTripRequest {
  id: number;
  user_id: string;
  trip_request_id: number;
  price: number;
  users?: IUser;
  status: number;
  trip_requests?: ITripRequest;
}

interface IComment {
  id: string;
  users?: IUser;
  parent_id?: string;
  created_at: Date;
  content: string;
  feed_id?: number;
  feed?: INewsFeedItem;
}

type CustomerInFixedRouteType = "TripRequest" | "FixedRouteOrder";

type CustomerInFixedRoute = {
  id: string;
  user: IUser;
  startLocation: InputLocation;
  endLocation: InputLocation;
  type: CustomerInFixedRouteType;
};
