export interface UserLocation {
  latitude: number;
  longitude: number;
}

export interface UserDocument {
  name?: string;
  email?: string | null;
  familyId?: string | null;
  role?: string | null;
  photoURL?: string | null;
  batteryLevel?: number | null;
  currentLocation?: UserLocation | null;
  lastOnline?: any;
  isOnline?: boolean;
}

