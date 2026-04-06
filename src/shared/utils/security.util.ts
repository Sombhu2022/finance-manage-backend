import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../../core/config/index.js';

export class SecurityUtil {
  /**
   * Hashes a plain text password.
   * @param password Plain text password
   * @returns Hashed password
   */
  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  /**
   * Compares a plain text password with a hash.
   * @param password Plain text password
   * @param hash Hashed password to compare against
   * @returns Boolean indicating match
   */
  async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  /**
   * Generates a JWT token for a given payload.
   * @param payload Data to include in the token
   * @param expiresIn Token expiration string (e.g. '1d')
   * @returns Signed JWT token
   */
  generateToken(
    payload: object,
    expiresIn: jwt.SignOptions['expiresIn'] = '1d',
  ): string {
    return jwt.sign(payload, config.jwtSecret, {
      expiresIn: expiresIn,
    });
  }

  /**
   * Verifies a JWT token.
   * @param token Token to verify
   * @returns Decoded payload or throws error
   */
  verifyToken(token: string): unknown {
    return jwt.verify(token, config.jwtSecret);
  }
}

export const securityUtil = new SecurityUtil();
