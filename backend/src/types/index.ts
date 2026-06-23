import { UserRole } from '../constants';

/** Payload encoded into JWTs. */
export interface JwtPayload {
  sub: string; // user id
  role: UserRole;
  email: string;
}

/** Normalised, parsed resume structure produced by the LLM / fallback parser. */
export interface ParsedResume {
  fullName?: string;
  email?: string;
  phone?: string;
  location?: string;
  summary?: string;
  skills: string[];
  totalExperienceYears?: number;
  education: {
    degree?: string;
    institution?: string;
    field?: string;
    startYear?: string;
    endYear?: string;
  }[];
  experience: {
    title?: string;
    company?: string;
    startDate?: string;
    endDate?: string;
    description?: string;
  }[];
  certifications: string[];
  languages: string[];
  links: string[];
}

/** Generic shape for paginated query options. */
export interface PaginationOptions {
  page: number;
  limit: number;
  sort?: string;
}

/** Generic shape returned by paginated repository methods. */
export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}
