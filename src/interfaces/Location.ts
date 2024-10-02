export interface Location {
  latitude: number | null;
  longitude: number | null;
}

export interface LocationContextType {
  userLocation: Location | null;
  fetchLocation: () => void;
}
