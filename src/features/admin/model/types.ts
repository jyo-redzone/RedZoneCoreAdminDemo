export type Id = string;

export type Role = 'super_admin' | 'tenant_admin' | 'member';

export type EntityKind = 'home' | 'club' | 'sport' | 'team' | 'user' | 'pitch' | 'camera';

export interface Club {
  id: Id;
  name: string;
}

export interface Sport {
  id: Id;
  clubId: Id;
  name: string;
}

export interface Team {
  id: Id;
  sportId: Id;
  name: string;
}

export interface User {
  id: Id;
  teamId: Id;
  name: string;
  email: string;
  role: Exclude<Role, 'super_admin'>;
  status: 'active' | 'invited';
}

export interface Pitch {
  id: Id;
  clubId: Id;
  name: string;
}

export interface Camera {
  id: Id;
  pitchId: Id;
  sportContext: 'football' | 'rugby' | 'hockey';
  name?: string; // Optional custom label
}

export interface PitchesCategory {
  id: Id;
  name: string;
  type: 'category';
}

export type AnyEntity = Club | Sport | Team | User | Pitch | Camera | PitchesCategory;

// Represents the current node selection in the tree
export type Path = {
  clubId?: Id;
  sportId?: Id;
  teamId?: Id;
  userId?: Id;
  pitchId?: Id;
  cameraId?: Id;
  pitchesRoot?: boolean; // Special marker for pitches root view
};

// View model for list rows
export interface ListItemVM {
  id: Id;
  primary: string; // display name
  secondary?: string; // role/email/status for users; sport for team; etc.
  icon: React.ReactNode;
}

export type AdminKind = 'home' | 'clubs' | 'sports' | 'users' | 'teams' | 'pitches' | 'cameras';
