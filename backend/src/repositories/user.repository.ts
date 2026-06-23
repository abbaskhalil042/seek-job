import { BaseRepository } from './base.repository';
import { IUser, User } from '../models/user.model';

class UserRepository extends BaseRepository<IUser> {
  constructor() {
    super(User);
  }

  /** Includes the password field (normally `select: false`) for auth checks. */
  findByEmailWithPassword(email: string) {
    return this.model.findOne({ email: email.toLowerCase() }).select('+password').exec();
  }

  findByEmail(email: string) {
    return this.model.findOne({ email: email.toLowerCase() }).exec();
  }

  /** Includes refreshTokens (normally hidden) for rotation logic. */
  findByIdWithTokens(id: string) {
    return this.model.findById(id).select('+refreshTokens').exec();
  }

  pushRefreshToken(id: string, token: string) {
    return this.model.findByIdAndUpdate(id, { $push: { refreshTokens: token } }).exec();
  }

  pullRefreshToken(id: string, token: string) {
    return this.model.findByIdAndUpdate(id, { $pull: { refreshTokens: token } }).exec();
  }

  clearRefreshTokens(id: string) {
    return this.model.findByIdAndUpdate(id, { $set: { refreshTokens: [] } }).exec();
  }
}

export const userRepository = new UserRepository();
