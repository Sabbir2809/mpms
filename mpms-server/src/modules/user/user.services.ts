import { FilterQuery } from "mongoose";
import { PaginationResult, UserRole } from "../../types";
import { AppError } from "../../utils/appError";
import { IUser } from "./user.interface";
import { User } from "./user.model";
import {
  UpdatePasswordInput,
  UpdateUserInput,
  UpdateUserRoleInput,
  UserQueryInput,
} from "./user.validations";

interface UsersResult {
  users: IUser[];
  pagination: PaginationResult;
}

const getAllUsers = async (query: UserQueryInput): Promise<UsersResult> => {
  const page = parseInt(query.page || "1", 10);
  const limit = parseInt(query.limit || "10", 10);
  const skip = (page - 1) * limit;

  const filter: FilterQuery<IUser> = {};

  if (query.search) {
    filter.$or = [
      { name: { $regex: query.search, $options: "i" } },
      { email: { $regex: query.search, $options: "i" } },
      { department: { $regex: query.search, $options: "i" } },
    ];
  }

  if (query.role) filter.role = query.role;
  if (query.department)
    filter.department = { $regex: query.department, $options: "i" };
  if (query.isActive !== undefined) filter.isActive = query.isActive === "true";

  const sortField = query.sort || "createdAt";
  const sortOrder = query.order === "asc" ? 1 : -1;

  const [users, total] = await Promise.all([
    User.find(filter)
      .sort({ [sortField]: sortOrder })
      .skip(skip)
      .limit(limit)
      .lean(),
    User.countDocuments(filter),
  ]);

  return {
    users: users as unknown as IUser[],
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const getUserById = async (id: string): Promise<IUser> => {
  const user = await User.findById(id);
  if (!user) throw new AppError("User not found", 404);
  return user;
};

const updateUser = async (
  id: string,
  input: UpdateUserInput,
  requesterId: string,
): Promise<IUser> => {
  if (id !== requesterId) {
    const requester = await User.findById(requesterId);
    if (!requester || requester.role !== UserRole.ADMIN) {
      throw new AppError("You can only update your own profile", 403);
    }
  }

  const user = await User.findByIdAndUpdate(id, input, {
    new: true,
    runValidators: true,
  });

  if (!user) throw new AppError("User not found", 404);

  return user;
};

const updateUserRole = async (
  id: string,
  input: UpdateUserRoleInput,
): Promise<IUser> => {
  const user = await User.findByIdAndUpdate(
    id,
    { role: input.role as UserRole },
    { new: true, runValidators: true },
  );

  if (!user) throw new AppError("User not found", 404);

  return user;
};

const updatePassword = async (
  userId: string,
  input: UpdatePasswordInput,
): Promise<void> => {
  const user = await User.findById(userId).select("+password");
  if (!user) throw new AppError("User not found", 404);

  const isMatch = await user.comparePassword(input.currentPassword);
  if (!isMatch) throw new AppError("Current password is incorrect", 401);

  user.password = input.newPassword;
  await user.save();
};

const deactivateUser = async (id: string): Promise<IUser> => {
  const user = await User.findByIdAndUpdate(
    id,
    { isActive: false },
    { new: true },
  );

  if (!user) throw new AppError("User not found", 404);

  return user;
};

const activateUser = async (id: string): Promise<IUser> => {
  const user = await User.findByIdAndUpdate(
    id,
    { isActive: true },
    { new: true },
  );

  if (!user) throw new AppError("User not found", 404);

  return user;
};

const deleteUser = async (id: string): Promise<void> => {
  const user = await User.findByIdAndDelete(id);
  if (!user) throw new AppError("User not found", 404);
};

export const userServices = {
  getAllUsers,
  getUserById,
  updateUser,
  updateUserRole,
  updatePassword,
  deactivateUser,
  activateUser,
  deleteUser,
};
