import { Response } from 'express';
import { usersService } from './users.service.js';
import { updateUserSchema } from './users.validation.js';
import { AuthRequest } from '../../../shared/middlewares/auth.js';
import { asyncHandler } from '../../../shared/utils/asyncHandler.js';

export class UsersController {
  getUsers = asyncHandler(async (req: AuthRequest, res: Response) => {
    const allUsers = await usersService.getUsers();

    res.status(200).json({
      status: 'success',
      data: { users: allUsers },
    });
  });

  updateUser = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;

    // Validate request
    const validatedData = updateUserSchema.parse(req.body);

    // Call service
    const updatedUser = await usersService.updateUser(
      id as string,
      validatedData,
    );

    res.status(200).json({
      status: 'success',
      data: { user: updatedUser },
    });
  });
}

export const usersController = new UsersController();
