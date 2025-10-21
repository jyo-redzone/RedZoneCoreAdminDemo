import { z } from 'zod';

export const UserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  role: z.enum(['tenant_admin', 'member'], {
    errorMap: () => ({ message: 'Role must be tenant_admin or member' }),
  }),
});

export const TeamSchema = z.object({
  name: z.string().min(2, 'Team name must be at least 2 characters'),
  sportId: z.string().min(1, 'Sport is required'),
});

export const PitchSchema = z.object({
  name: z.string().min(2, 'Pitch name must be at least 2 characters'),
  clubId: z.string().min(1, 'Club is required'),
});

export const CameraSchema = z.object({
  pitchId: z.string().min(1, 'Pitch is required'),
  sportContext: z.enum(['football', 'rugby', 'hockey'], {
    errorMap: () => ({ message: 'Sport context must be football, rugby, or hockey' }),
  }),
  name: z.string().optional(),
});

export const ClubSchema = z.object({
  name: z.string().min(2, 'Club name must be at least 2 characters'),
});

export const SportSchema = z.object({
  name: z.string().min(2, 'Sport name must be at least 2 characters'),
  clubId: z.string().min(1, 'Club is required'),
});
