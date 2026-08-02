export const INDUSTRIES = [
  'CONCERTS',
  'FLIGHTS',
  'SPORTS',
  'FESTIVALS',
  'CONFERENCES',
  'BUS',
  'MOVIE_THEATERS',
  'MUSEUMS',
  'TOURIST_ATTRACTIONS',
  'PUBLIC_TRANSPORT',
  'UNIVERSITIES',
  'CORPORATE_EVENTS',
] as const;

export type Industry = (typeof INDUSTRIES)[number];

export const INDUSTRY_LABELS: Record<Industry, string> = {
  CONCERTS: 'Concerts',
  FLIGHTS: 'Flights',
  SPORTS: 'Sports',
  FESTIVALS: 'Festivals',
  CONFERENCES: 'Conferences',
  BUS: 'Bus companies',
  MOVIE_THEATERS: 'Movie theaters',
  MUSEUMS: 'Museums',
  TOURIST_ATTRACTIONS: 'Tourist attractions',
  PUBLIC_TRANSPORT: 'Public transport',
  UNIVERSITIES: 'Universities',
  CORPORATE_EVENTS: 'Corporate events',
};

export type UserRole = 'PLATFORM_ADMIN' | 'ORGANIZER' | 'ATTENDEE';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export interface Me extends AuthUser {
  stellarPublicKey: string | null;
  createdAt: string;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  industry: Industry;
  stellarAccount: string;
  createdAt: string;
}

export type EventStatus = 'DRAFT' | 'PUBLISHED' | 'CANCELLED';

export interface TicketType {
  id: string;
  eventId: string;
  name: string;
  price: string;
  quantityTotal: number;
  quantityIssued: number;
}

export interface EventRecord {
  id: string;
  organizationId: string;
  name: string;
  category: Industry;
  venue: string;
  startsAt: string;
  endsAt: string | null;
  chainEventId: string | null;
  maxResaleMultiplierBps: number;
  royaltyBps: number;
  status: EventStatus;
  ticketTypes?: TicketType[];
  organization?: { name: string; slug: string };
}

export type TicketStatus = 'VALID' | 'USED' | 'REVOKED' | 'RESALE';

export interface Ticket {
  id: string;
  eventId: string;
  ticketTypeId: string;
  ownerId: string;
  chainTicketId: string;
  seat: string;
  status: TicketStatus;
  qrSecret: string;
  event?: EventRecord;
  ticketType?: TicketType;
  createdAt: string;
}

export interface ResaleListing {
  id: string;
  ticketId: string;
  sellerId: string;
  price: string;
  status: 'ACTIVE' | 'SOLD' | 'CANCELLED';
  ticket: {
    event: { name: string; venue: string; startsAt: string };
    ticketType: { name: string };
  };
  seller: { name: string };
}
