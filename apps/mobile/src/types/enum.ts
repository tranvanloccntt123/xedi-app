export enum IDriverTripRequestStatus {
  PENDING = 0,
  CUSTOMER_ACCEPT = 1,
  DRIVER_MERGED_TRIP_REQUEST = 2,
  GO_LIVE = 4,
  FINISHED = 3,
}

export enum IFixedRouteStatus {
  PENDING = 0,
  RUNNING = 1,
  FINISHED = 2,
}

export enum IFixedRouteOrderStatus {
  PENDING = 0,
  ACCEPT = 1,
  GO_LIVE = 4,
}

export enum IErrorRequest {
  NOT_FOUND = "Not Found",
}
