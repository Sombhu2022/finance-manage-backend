import { z } from 'zod';
import { UserRole, UserStatus } from '../../../shared/constants/enums.js';

export const updateUserSchema = z.object({
  role: z.nativeEnum(UserRole).optional(),
  status: z.nativeEnum(UserStatus).optional(),
});
