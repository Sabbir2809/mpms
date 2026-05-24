import { UserRole } from "../../types";
import { AppError } from "../../utils/appError";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../../utils/jwt";
import { IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import {
  LoginInput,
  RefreshTokenInput,
  RegisterInput,
} from "./auth.validation";

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

interface AuthResponse {
  user: Record<string, unknown>;
  tokens: AuthTokens;
}

const generateTokens = (user: IUser): AuthTokens => ({
  accessToken: signAccessToken({
    userId: user._id.toString(),
    email: user.email,
    role: user.role,
  }),
  refreshToken: signRefreshToken({
    userId: user._id.toString(),
    email: user.email,
    role: user.role,
  }),
});

const registerUser = async (input: RegisterInput): Promise<AuthResponse> => {
  const existingUser = await User.findOne({ email: input.email.toLowerCase() });
  if (existingUser) throw new AppError("Email already registered", 409);

  const user = await User.create({
    name: input.name,
    email: input.email.toLowerCase(),
    password: input.password,
    role: (input.role as UserRole) || UserRole.MEMBER,
    department: input.department || "",
    skills: input.skills || [],
  });

  const tokens = generateTokens(user);

  await User.findByIdAndUpdate(user._id, {
    refreshToken: tokens.refreshToken,
    lastLogin: new Date(),
  });

  return {
    user: user.toJSON() as Record<string, unknown>,
    tokens,
  };
};

const loginUser = async (input: LoginInput): Promise<AuthResponse> => {
  const user = await (
    User as unknown as { findByEmail(e: string): Promise<IUser | null> }
  ).findByEmail(input.email);

  if (!user) throw new AppError("Invalid email or password", 401);
  if (!user.isActive)
    throw new AppError(
      "Your account has been deactivated. Contact an administrator.",
      403,
    );

  const isPasswordValid = await user.comparePassword(input.password);
  if (!isPasswordValid) throw new AppError("Invalid email or password", 401);

  const tokens = generateTokens(user);

  await User.findByIdAndUpdate(user._id, {
    refreshToken: tokens.refreshToken,
    lastLogin: new Date(),
  });

  return {
    user: user.toJSON() as Record<string, unknown>,
    tokens,
  };
};

const refreshAccessToken = async (
  input: RefreshTokenInput,
): Promise<AuthTokens> => {
  const decoded = verifyRefreshToken(input.refreshToken);
  const user = await User.findById(decoded.userId).select("+refreshToken");

  if (!user) throw new AppError("User not found", 404);
  if (!user.isActive) throw new AppError("Account deactivated", 403);
  if (user.refreshToken !== input.refreshToken)
    throw new AppError("Invalid refresh token", 401);

  const tokens = generateTokens(user);

  await User.findByIdAndUpdate(user._id, {
    refreshToken: tokens.refreshToken,
  });

  return tokens;
};

const logoutUser = async (userId: string): Promise<void> => {
  await User.findByIdAndUpdate(userId, { refreshToken: null });
};

const getMe = async (userId: string): Promise<IUser> => {
  const user = await User.findById(userId);
  if (!user) throw new AppError("User not found", 404);
  return user;
};

export const authService = {
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
  getMe,
};
