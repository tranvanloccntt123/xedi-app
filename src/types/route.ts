export enum RouteName {
  Login = 'Login',
  Register = 'Register',
  RoleSelection = 'RoleSelection',
  MainTab = 'MainTab',
  Home = 'Home',
  Booking = 'Booking',
  Confirmation = 'Confirmation',
  BookingsHistory = 'BookingsHistory',
  TripRequest = 'TripRequest',
  TripRequestForFixedRoute = 'TripRequestForFixedRoute',
  UserProfile = 'UserProfile',
  VehicleRegistration = 'VehicleRegistration',
  Settings = 'Settings',
  CreateFixedRoute = 'CreateFixedRoute',
  TripRequestDetails = 'TripRequestDetails',
}

export type RouteParamsList = {
  [RouteName.Login]: undefined;
  [RouteName.Register]: {
    role: "customer" | "driver";
  };
  [RouteName.RoleSelection]: undefined;
  [RouteName.MainTab]: undefined;
  [RouteName.Home]: undefined;
  [RouteName.Booking]: undefined;
  [RouteName.Confirmation]: {
    bookingId: string;
  };
  [RouteName.BookingsHistory]: undefined;
  [RouteName.TripRequest]: undefined;
  [RouteName.TripRequestForFixedRoute]: {
    fixedRouteId: string;
    customerId: string;
  };
  [RouteName.UserProfile]: {
    userId: string;
  };
  [RouteName.VehicleRegistration]: {
    driverId: string;
  };
  [RouteName.Settings]: undefined;
  [RouteName.CreateFixedRoute]: undefined;
  [RouteName.TripRequestDetails]: {
    requestId: string;
  };
};

