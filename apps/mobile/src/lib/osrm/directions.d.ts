// Core types
interface Summary {
  distance: number; // Meters
  duration: number; // Seconds
}

interface Step {
  distance: number; // Meters
  duration: number; // Seconds
  type: number; // Instruction type
  instruction: string;
  name: string;
  way_points: [number, number];
  exit_number?: number;
}

interface Segment {
  distance: number; // Meters
  duration: number; // Seconds
  steps: Step[];
}

interface Warning {
  code: number;
  message: string;
}

interface ExtraSummary {
  value: number;
  distance: number;
  amount: number;
}

interface Extras {
  waytypes?: {
    values: [number, number, number][];
    summary: ExtraSummary[];
  };
  steepness?: {
    values: [number, number, number][];
    summary: ExtraSummary[];
  };
  roadaccessrestrictions?: {
    values: [number, number, number][];
    summary: ExtraSummary[];
  };
}

interface Route {
  summary: Summary;
  segments: Segment[];
  bbox: [number, number, number, number]; // [minLon, minLat, maxLon, maxLat]
  geometry: string; // Encoded polyline
  way_points: [number, number];
  warnings?: Warning[];
  extras?: Extras;
}

interface Query {
  coordinates: [number, number][];
  profile: string;
  profileName?: string;
  format: string;
  extra_info?: string[];
}

interface Engine {
  version: string;
  build_date: string;
  graph_date: string;
}

interface Metadata {
  attribution: string;
  service: string;
  timestamp: number;
  query: Query;
  engine: Engine;
}

interface DirectionsResponse {
  bbox: [number, number, number, number];
  routes: Route[];
  metadata: Metadata;
}
