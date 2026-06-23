import { userRepository } from '../repositories/user.repository';
import { ApiError } from '../utils/ApiError';
import { UserRole } from '../constants';
import { ISeekerProfile, IEmployerProfile } from '../models/user.model';

class UserService {
  async getById(userId: string) {
    const user = await userRepository.findById(userId);
    if (!user) throw ApiError.notFound('User not found');
    return user.toJSON();
  }

  async updateProfile(
    userId: string,
    role: UserRole,
    data: { name?: string; avatar?: string; seekerProfile?: Partial<ISeekerProfile>; employerProfile?: Partial<IEmployerProfile> },
  ) {
    const user = await userRepository.findById(userId);
    if (!user) throw ApiError.notFound('User not found');

    if (data.name !== undefined) user.name = data.name;
    if (data.avatar !== undefined) user.avatar = data.avatar;

    if (role === UserRole.JOB_SEEKER && data.seekerProfile) {
      user.seekerProfile = { ...(user.seekerProfile ?? { skills: [] }), ...data.seekerProfile };
    }
    if (role === UserRole.EMPLOYER && data.employerProfile) {
      user.employerProfile = { ...(user.employerProfile ?? {}), ...data.employerProfile };
    }

    await user.save();
    return user.toJSON();
  }

  async deactivate(userId: string) {
    const user = await userRepository.updateById(userId, { isActive: false, refreshTokens: [] });
    if (!user) throw ApiError.notFound('User not found');
    return user.toJSON();
  }
}

export const userService = new UserService();
