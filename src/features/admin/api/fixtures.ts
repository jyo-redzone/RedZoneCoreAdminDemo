import { Camera, Club, Pitch, Sport, Team, User } from '../model/types';

// Generate realistic mock data
export const clubs: Club[] = [
  { id: 'club-1', name: 'Palermo' },
  { id: 'club-2', name: 'Lommel' },
];

export const sports: Sport[] = [
  // Palermo sports
  { id: 'sport-1', clubId: 'club-1', name: 'Football' },
  { id: 'sport-2', clubId: 'club-1', name: 'Rugby' },
  // { id: 'sport-3', clubId: 'club-1', name: 'Hockey' },
  // Lommel sports
  { id: 'sport-4', clubId: 'club-2', name: 'Football' },
  // { id: 'sport-5', clubId: 'club-2', name: 'Basketball' },
];

export const teams: Team[] = [
  // Palermo Football teams
  { id: 'team-1', sportId: 'sport-1', name: "Men's First Team" },
  { id: 'team-2', sportId: 'sport-1', name: "Ladies' Team" },
  { id: 'team-3', sportId: 'sport-1', name: 'U19 Academy' },
  { id: 'team-4', sportId: 'sport-1', name: 'U16 Youth' },
  // Palermo Rugby teams
  { id: 'team-5', sportId: 'sport-2', name: 'Senior Rugby' },
  { id: 'team-6', sportId: 'sport-2', name: 'Junior Rugby' },
  // Palermo Hockey teams
  { id: 'team-7', sportId: 'sport-3', name: "Men's Hockey" },
  { id: 'team-8', sportId: 'sport-3', name: "Women's Hockey" },
  // Lommel Football teams
  { id: 'team-9', sportId: 'sport-4', name: 'First Team' },
  { id: 'team-10', sportId: 'sport-4', name: 'Reserve Team' },
  { id: 'team-11', sportId: 'sport-4', name: 'Youth Academy' },
  // Lommel Basketball teams
  { id: 'team-12', sportId: 'sport-5', name: 'Senior Basketball' },
  { id: 'team-13', sportId: 'sport-5', name: 'Junior Basketball' },
];

export const users: User[] = [
  // Palermo Football users
  {
    id: 'user-1',
    teamId: 'team-1',
    name: 'Marco Rossi',
    email: 'marco.rossi@fcpalermo.it',
    role: 'tenant_admin',
    status: 'active',
  },
  {
    id: 'user-2',
    teamId: 'team-1',
    name: 'Giuseppe Bianchi',
    email: 'giuseppe.bianchi@fcpalermo.it',
    role: 'member',
    status: 'active',
  },
  {
    id: 'user-3',
    teamId: 'team-1',
    name: 'Francesco Verdi',
    email: 'francesco.verdi@fcpalermo.it',
    role: 'member',
    status: 'active',
  },
  {
    id: 'user-4',
    teamId: 'team-2',
    name: 'Sofia Romano',
    email: 'sofia.romano@fcpalermo.it',
    role: 'member',
    status: 'active',
  },
  {
    id: 'user-5',
    teamId: 'team-2',
    name: 'Elena Ferrari',
    email: 'elena.ferrari@fcpalermo.it',
    role: 'member',
    status: 'invited',
  },
  {
    id: 'user-6',
    teamId: 'team-3',
    name: 'Alessandro Conti',
    email: 'alessandro.conti@fcpalermo.it',
    role: 'member',
    status: 'active',
  },
  {
    id: 'user-7',
    teamId: 'team-3',
    name: 'Luca Martini',
    email: 'luca.martini@fcpalermo.it',
    role: 'member',
    status: 'active',
  },
  // Palermo Rugby users
  {
    id: 'user-8',
    teamId: 'team-5',
    name: 'Roberto Lombardi',
    email: 'roberto.lombardi@fcpalermo.it',
    role: 'tenant_admin',
    status: 'active',
  },
  {
    id: 'user-9',
    teamId: 'team-5',
    name: 'Paolo Rizzo',
    email: 'paolo.rizzo@fcpalermo.it',
    role: 'member',
    status: 'active',
  },
  {
    id: 'user-10',
    teamId: 'team-6',
    name: 'Matteo Greco',
    email: 'matteo.greco@fcpalermo.it',
    role: 'member',
    status: 'invited',
  },
  // Palermo Hockey users
  {
    id: 'user-11',
    teamId: 'team-7',
    name: 'Andrea Moretti',
    email: 'andrea.moretti@fcpalermo.it',
    role: 'member',
    status: 'active',
  },
  {
    id: 'user-12',
    teamId: 'team-8',
    name: 'Chiara Santoro',
    email: 'chiara.santoro@fcpalermo.it',
    role: 'member',
    status: 'active',
  },
  // Lommel Football users
  {
    id: 'user-13',
    teamId: 'team-9',
    name: 'Jan Van Der Berg',
    email: 'jan.vanderberg@lommelsk.be',
    role: 'tenant_admin',
    status: 'active',
  },
  {
    id: 'user-14',
    teamId: 'team-9',
    name: 'Tom Janssens',
    email: 'tom.janssens@lommelsk.be',
    role: 'member',
    status: 'active',
  },
  {
    id: 'user-15',
    teamId: 'team-9',
    name: 'Pieter De Vries',
    email: 'pieter.devries@lommelsk.be',
    role: 'member',
    status: 'active',
  },
  {
    id: 'user-16',
    teamId: 'team-10',
    name: 'Lars Van Den Broek',
    email: 'lars.vandenbroek@lommelsk.be',
    role: 'member',
    status: 'active',
  },
  {
    id: 'user-17',
    teamId: 'team-11',
    name: 'Joris Peeters',
    email: 'joris.peeters@lommelsk.be',
    role: 'member',
    status: 'invited',
  },
  // Lommel Basketball users
  {
    id: 'user-18',
    teamId: 'team-12',
    name: 'Wouter Claes',
    email: 'wouter.claes@lommelsk.be',
    role: 'member',
    status: 'active',
  },
  {
    id: 'user-19',
    teamId: 'team-13',
    name: 'Niels Willems',
    email: 'niels.willems@lommelsk.be',
    role: 'member',
    status: 'active',
  },
];

export const pitches: Pitch[] = [
  // Palermo pitches
  { id: 'pitch-1', clubId: 'club-1', name: 'Main Stadium' },
  { id: 'pitch-2', clubId: 'club-1', name: 'Training Ground A' },
  // { id: 'pitch-3', clubId: 'club-1', name: 'Training Ground B' },
  // // Lommel pitches
  // { id: 'pitch-4', clubId: 'club-2', name: 'Stadion Soeverein' },
  // { id: 'pitch-5', clubId: 'club-2', name: 'Training Complex' },
];

export const cameras: Camera[] = [
  // Palermo cameras
  { id: 'camera-1', pitchId: 'pitch-1', sportContext: 'football', name: 'Main Stadium Camera 1' },
  { id: 'camera-2', pitchId: 'pitch-1', sportContext: 'football', name: 'Main Stadium Camera 2' },
  // { id: 'camera-3', pitchId: 'pitch-1', sportContext: 'football' },
  { id: 'camera-4', pitchId: 'pitch-2', sportContext: 'football', name: 'Training A - Overview' },
  { id: 'camera-5', pitchId: 'pitch-2', sportContext: 'rugby' },
  { id: 'camera-6', pitchId: 'pitch-3', sportContext: 'hockey', name: 'Training B - Hockey' },
  // Lommel cameras
  {
    id: 'camera-7',
    pitchId: 'pitch-4',
    sportContext: 'football',
    name: 'Stadion Soeverein - Main',
  },
  { id: 'camera-8', pitchId: 'pitch-4', sportContext: 'football' },
  {
    id: 'camera-9',
    pitchId: 'pitch-5',
    sportContext: 'football',
    name: 'Training Complex - Field 1',
  },
  {
    id: 'camera-10',
    pitchId: 'pitch-5',
    sportContext: 'football',
    name: 'Training Complex - Field 2',
  },
];
