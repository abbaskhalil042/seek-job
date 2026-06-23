import { userRepository } from '../repositories/user.repository';
import { ApiError } from '../utils/ApiError';
import { issueTokenPair, verifyRefreshToken } from '../utils/jwt';
import { JwtPayload } from '../types';
import { UserRole } from '../constants';
import { IUser } from '../models/user.model';

interface RegisterInput {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
  companyName?: string;
}

class AuthService {
  private toPayload(user: IUser): JwtPayload {
    return { sub: user._id.toString(), role: user.role, email: user.email };
  }

  async register(input: RegisterInput) {
    const existing = await userRepository.findByEmail(input.email);
    if (existing) throw ApiError.conflict('An account with this email already exists');

    const role = input.role ?? UserRole.JOB_SEEKER;
    if (role === UserRole.ADMIN) {
      throw ApiError.forbidden('Admin accounts cannot be self-registered');
    }

    const user = await userRepository.create({
      name: input.name,
      email: input.email,
      password: input.password,
      role,
      ...(role === UserRole.EMPLOYER
        ? { employerProfile: { companyName: input.companyName } }
        : { seekerProfile: { skills: [] } }),
    });

    const tokens = issueTokenPair(this.toPayload(user));
    await userRepository.pushRefreshToken(user._id.toString(), tokens.refreshToken);

    return { user: user.toJSON(), ...tokens };
  }

  async login(email: string, password: string) {
    const user = await userRepository.findByEmailWithPassword(email);
    if (!user) throw ApiError.unauthorized('Invalid email or password');
    if (!user.isActive) throw ApiError.forbidden('Account is deactivated');

    const valid = await user.comparePassword(password);
    if (!valid) throw ApiError.unauthorized('Invalid email or password');

    const tokens = issueTokenPair(this.toPayload(user));
    await userRepository.pushRefreshToken(user._id.toString(), tokens.refreshToken);

    return { user: user.toJSON(), ...tokens };
  }

  /** Rotate refresh tokens: validate, revoke the old one, issue a fresh pair. */
  async refresh(oldRefreshToken: string) {
    const payload = verifyRefreshToken(oldRefreshToken);
    const user = await userRepository.findByIdWithTokens(payload.sub);
    if (!user || !user.isActive) throw ApiError.unauthorized('Account not found or inactive');

    if (!user.refreshTokens.includes(oldRefreshToken)) {
      // Token reuse / theft → revoke everything for safety.
      await userRepository.clearRefreshTokens(user._id.toString());
      throw ApiError.unauthorized('Refresh token has been revoked');
    }

    await userRepository.pullRefreshToken(user._id.toString(), oldRefreshToken);
    const tokens = issueTokenPair(this.toPayload(user));
    await userRepository.pushRefreshToken(user._id.toString(), tokens.refreshToken);

    return tokens;
  }

  async logout(userId: string, refreshToken?: string) {
    if (refreshToken) {
      await userRepository.pullRefreshToken(userId, refreshToken);
    } else {
      await userRepository.clearRefreshTokens(userId);
    }
  }

  async getMe(userId: string) {
    const user = await userRepository.findById(userId);
    if (!user) throw ApiError.notFound('User not found');
    return user.toJSON();
  }
}

export const authService = new AuthService();
