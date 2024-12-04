export enum RouteName {
  Login = 'Login',
  Register = 'Register',
  Home = 'Home',
  Booking = 'Booking',
  Confirmation = 'Confirmation',
  BookingsHistory = 'BookingsHistory',
  TripRequest = 'TripRequest',
  TripRequestForFixedRoute = 'TripRequestForFixedRoute',
  UserProfile = 'UserProfile',
  VehicleRegistration = 'VehicleRegistration',
}

export type RouteParamsList = {
  [RouteName.Login]: undefined;
  [RouteName.Register]: undefined;
  [RouteName.Home]: { userId: string };
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
};

