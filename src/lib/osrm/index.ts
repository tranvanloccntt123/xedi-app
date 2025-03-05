import OpenRouteService from "openrouteservice-js";

const key = process.env.EXPO_PUBLIC_OSM_KEY || "5b3ce3597851110001cf6248d4ba4124efb84421b18767e18ddf489f";

export const OrsDirections = new OpenRouteService.Directions({ api_key: key });

export function decodePolyline(encoded: string): [number, number][] {
  const coordinates: [number, number][] = [];
  let index = 0;
  let lat = 0;
  let lng = 0;

  while (index < encoded.length) {
    // Decode latitude
    let shift = 0;
    let result = 0;
    let byte: number;
    do {
      byte = encoded.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);
    lat += result & 1 ? ~(result >> 1) : result >> 1;

    // Decode longitude
    shift = 0;
    result = 0;
    do {
      byte = encoded.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);
    lng += result & 1 ? ~(result >> 1) : result >> 1;

    // Add to coordinates (convert to decimal degrees)
    coordinates.push([lng / 1e5, lat / 1e5]);
  }

  return coordinates;
}
