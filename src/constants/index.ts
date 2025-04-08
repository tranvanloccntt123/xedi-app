import { wrapTextStyle } from "../theme/AppStyles";
import AppColors from "./colors";

export const pattern = "@xedi.com";
export const Tables = {
  FIXED_ROUTES: "fixed_routes",
  FEED: "feed",
  USERS: "users",
  FIXED_ROUTE_ORDERS: "fixed_route_orders",
  PROFILES: "profiles",
  NOTIFICATIONS: "notifications",
  USER_COINS: "user_coins",
  TRIP_REQUESTS: "trip_requests",
  DRIVER_TRIP_REQUESTS: "driver_trip_requests",
  MERGE_TRIP_REQUESTS: "merge_trip_requests",
  COMMENTS: "comments",
  USER_LOCATION_STORE: "users_location_store",
  FEED_MEDIA: "feed_media",
};

export const CameraImageSize = {
  width: 3,
  height: 5,
};

export const PartTypes: any = [
  {
    trigger: "@",
    textStyle: wrapTextStyle(
      { fontWeight: "700", color: AppColors.primary },
      "2xs"
    ),
  },
];

export const MARKER_SIZE = [0, 80];

export const ZOOM_LEVEL = [0, 18];

export const DEFAULT_LOCATION = { lat: 21.028511, lon: 105.804817 };
