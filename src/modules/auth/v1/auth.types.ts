import { UserRole } from '../../../shared/constants/enums.js';

export interface RegisterDTO {
  email: string;
  password: string;
  role?: UserRole;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface AuthResponse {
  user?: {
    id: string;
    email: string;
    role: UserRole;
  };
  token?: string;
  message?: string;
}

export interface VerifyOtpDTO {
  email: string;
  otp: string;
}

export interface ResendOtpDTO {
  email: string;
}
