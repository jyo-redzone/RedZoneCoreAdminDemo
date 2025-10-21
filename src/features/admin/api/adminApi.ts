import {
  AnyEntity,
  Camera,
  Club,
  EntityKind,
  Id,
  Path,
  Pitch,
  PitchesCategory,
  Sport,
  Team,
  User,
} from '../model/types';
import { cameras, clubs, pitches, sports, teams, users } from './fixtures';

// Simulate API latency
const delay = () => new Promise((resolve) => setTimeout(resolve, 150));

export const adminApi = {
  async list(
    kind: EntityKind,
    path: Path,
    query = '',
    page = 1,
    pageSize = 20,
  ): Promise<{ items: AnyEntity[]; total: number }> {
    await delay();

    let allItems: AnyEntity[] = [];

    switch (kind) {
      case 'home':
        // Show only top-level items: clubs and pitches category
        const pitchesCategory: PitchesCategory = {
          id: 'pitches-root',
          name: 'Pitches',
          type: 'category',
        };
        allItems = [...clubs, ...pitches];
        break;
      case 'club':
        allItems = clubs;
        break;
      case 'sport':
        allItems = path.clubId ? sports.filter((s) => s.clubId === path.clubId) : sports;
        break;
      case 'team':
        allItems = path.sportId ? teams.filter((t) => t.sportId === path.sportId) : teams;
        break;
      case 'user':
        allItems = path.teamId ? users.filter((u) => u.teamId === path.teamId) : users;
        break;
      case 'pitch':
        allItems = path.clubId ? pitches.filter((p) => p.clubId === path.clubId) : pitches;
        break;
      case 'camera':
        allItems = path.pitchId ? cameras.filter((c) => c.pitchId === path.pitchId) : cameras;
        break;
    }

    // Apply search filter
    if (query) {
      const lowerQuery = query.toLowerCase();
      allItems = allItems.filter((item) => {
        if ('name' in item && item.name && item.name.toLowerCase().includes(lowerQuery))
          return true;
        if ('email' in item && item.email && item.email.toLowerCase().includes(lowerQuery))
          return true;
        return false;
      });
    }

    const total = allItems.length;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const items = allItems.slice(startIndex, endIndex);

    return { items, total };
  },

  async get(kind: EntityKind, id: Id): Promise<AnyEntity> {
    await delay();

    const allItems = this.getAllItems(kind);
    const item = allItems.find((item) => item.id === id);

    if (!item) {
      throw new Error(`${kind} with id ${id} not found`);
    }

    return item;
  },

  async create(kind: EntityKind, payload: Partial<AnyEntity>, path: Path): Promise<AnyEntity> {
    await delay();

    const newId = `new-${Date.now()}`;
    // Create a proper entity based on kind
    let newItem: AnyEntity;

    switch (kind) {
      case 'club':
        newItem = {
          id: newId,
          name: 'name' in payload ? payload.name || 'New Club' : 'New Club',
        } as Club;
        break;
      case 'sport':
        newItem = {
          id: newId,
          clubId: 'clubId' in payload ? payload.clubId || '' : path.clubId || '',
          name: 'name' in payload ? payload.name || 'New Sport' : 'New Sport',
        } as Sport;
        break;
      case 'team':
        newItem = {
          id: newId,
          sportId: 'sportId' in payload ? payload.sportId || '' : path.sportId || '',
          name: 'name' in payload ? payload.name || 'New Team' : 'New Team',
        } as Team;
        break;
      case 'user':
        newItem = {
          id: newId,
          teamId: 'teamId' in payload ? payload.teamId || '' : path.teamId || '',
          name: 'name' in payload ? payload.name || 'New User' : 'New User',
          email: 'email' in payload ? payload.email || '' : '',
          role: 'role' in payload ? payload.role || 'member' : 'member',
          status: 'status' in payload ? payload.status || 'active' : 'active',
        } as User;
        break;
      case 'pitch':
        newItem = {
          id: newId,
          clubId: 'clubId' in payload ? payload.clubId || '' : path.clubId || '',
          name: 'name' in payload ? payload.name || 'New Pitch' : 'New Pitch',
        } as Pitch;
        break;
      case 'camera':
        newItem = {
          id: newId,
          pitchId: 'pitchId' in payload ? payload.pitchId || '' : path.pitchId || '',
          sportContext: 'sportContext' in payload ? payload.sportContext || 'football' : 'football',
          name: 'name' in payload ? payload.name : undefined,
        } as Camera;
        break;
      default:
        throw new Error(`Unknown entity kind: ${kind}`);
    }

    // In a real app, this would be sent to the server
    return newItem;
  },

  async update(kind: EntityKind, id: Id, patch: Partial<AnyEntity>): Promise<AnyEntity> {
    await delay();

    const allItems = this.getAllItems(kind);
    const itemIndex = allItems.findIndex((item) => item.id === id);

    if (itemIndex === -1) {
      throw new Error(`${kind} with id ${id} not found`);
    }

    const existingItem = allItems[itemIndex];
    const updatedItem = { ...existingItem, ...patch } as AnyEntity;
    // In a real app, this would update the server
    return updatedItem;
  },

  async remove(kind: EntityKind, ids: Id[]): Promise<void> {
    await delay();

    // In a real app, this would delete from the server
    console.log(`Removing ${ids.length} ${kind}(s):`, ids);
  },

  async inviteUser(payload: {
    teamId: Id;
    name: string;
    email: string;
    role: 'tenant_admin' | 'member';
  }): Promise<User> {
    await delay();

    const newUser: User = {
      id: `user-${Date.now()}`,
      teamId: payload.teamId,
      name: payload.name,
      email: payload.email,
      role: payload.role,
      status: 'invited',
    };

    return newUser;
  },

  async changeUserRole(ids: Id[], role: 'tenant_admin' | 'member'): Promise<void> {
    await delay();

    // In a real app, this would update the server
    console.log(`Changing role to ${role} for users:`, ids);
  },

  // Helper method to get all items of a specific kind
  getAllItems(kind: EntityKind): AnyEntity[] {
    switch (kind) {
      case 'home':
        const pitchesCategory: PitchesCategory = {
          id: 'pitches-root',
          name: 'Pitches',
          type: 'category',
        };
        return [...clubs, pitchesCategory];
      case 'club':
        return clubs;
      case 'sport':
        return sports;
      case 'team':
        return teams;
      case 'user':
        return users;
      case 'pitch':
        return pitches;
      case 'camera':
        return cameras;
      default:
        return [];
    }
  },
};
