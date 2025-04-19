
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

type SelectLocationType = "start-location" | "end-location";

type LatLng = {
  latitude: number;
  longitude: number;
};

type CustomerInFixedRouteType = "TripRequest" | "FixedRouteOrder";

type CustomerInFixedRoute = {
  id: string;
  user: IUser;
  startLocation: InputLocation;
  endLocation: InputLocation;
  type: CustomerInFixedRouteType;
};

type XediFontSize = "xs" | "2xs" | "sm" | "md" | "lg" | "xl" | "2xl";

type XediFontWeight =
  | "100"
  | "200"
  | "300"
  | "400"
  | "500"
  | "600"
  | "700"
  | "800"
  | "900";

type XediFont = {
  Inter_100Thin: number;
  Inter_100Thin_Italic: number;
  Inter_200ExtraLight: number;
  Inter_200ExtraLight_Italic: number;
  Inter_300Light: number;
  Inter_300Light_Italic: number;
  Inter_400Regular: number;
  Inter_400Regular_Italic: number;
  Inter_500Medium: number;
  Inter_500Medium_Italic: number;
  Inter_600SemiBold: number;
  Inter_600SemiBold_Italic: number;
  Inter_700Bold: number;
  Inter_700Bold_Italic: number;
  Inter_800ExtraBold: number;
  Inter_800ExtraBold_Italic: number;
  Inter_900Black: number;
  Inter_900Black_Italic: number;
};
