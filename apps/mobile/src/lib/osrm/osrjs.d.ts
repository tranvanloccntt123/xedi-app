declare module "openrouteservice-js" {
  const Directions: new (options: {
    api_key: string;
    hosts?: string;
  }) => Directions;

  export interface Directions {
    calculate(options: {
      coordinates: [number, number][]; // Array of [longitude, latitude]
      profile:
        | "driving-car"
        | "driving-hgv"
        | "cycling-regular"
        | "cycling-road"
        | "cycling-mountain"
        | "cycling-electric"
        | "foot-walking"
        | "foot-hiking"
        | "wheelchair";
      format?: "json" | "geojson"; // Response format
      units?: "m" | "km" | "mi"; // Distance units
      language?: string; // e.g., "en", "de"
      geometry_simplify?: boolean; // Simplify geometry
      instructions?: boolean; // Include instructions
      instructions_format?: "text" | "html"; // Instruction format
      [key: string]: any; // Allow additional options
    }): Promise<DirectionsResponse>;
  }

  // Optionally declare Geocode if you plan to use it
  export interface Geocode {
    geocode(options: {
      text: string; // Search query
      boundary?: {
        country?: string; // e.g., "DE"
        rect?: {
          min_lon: number;
          min_lat: number;
          max_lon: number;
          max_lat: number;
        };
      };
      size?: number; // Max results
      [key: string]: any; // Allow additional options
    }): Promise<any>; // Define a specific GeocodeResponse interface if needed
  }
}
