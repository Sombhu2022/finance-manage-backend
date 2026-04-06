import { db } from '../../../core/database/index.js';
import { users } from './users.model.js';
import { eq } from 'drizzle-orm';
import { AppError } from '../../../shared/middlewares/error.js';
import { UpdateUserDTO, UserResponse } from './users.types.js';

export class UsersService {
  getUsers = async (): Promise<UserResponse[]> => {
    const results = await db.query.users.findMany({
      columns: {
        password: false,
      },
    });

    return results as UserResponse[];
  };

  updateUser = async (
    id: string,
    data: UpdateUserDTO,
  ): Promise<UserResponse> => {
    const [updatedUser] = await db
      .update(users)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(users.id, id))
      .returning({
        id: users.id,
        email: users.email,
        role: users.role,
        status: users.status,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      });

    if (!updatedUser) {
      throw new AppError('User not found', 404);
    }

    return updatedUser as UserResponse;
  };
}

export const usersService = new UsersService();
