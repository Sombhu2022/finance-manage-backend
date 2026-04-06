import { UserRole, UserStatus } from '../../../shared/constants/enums.js';

export interface UpdateUserDTO {
  role?: UserRole;
  status?: UserStatus;
}

export interface UserResponse {
  id: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  otp?: string;
  otpExpiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
