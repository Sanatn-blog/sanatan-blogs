import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  status: string;
}

export interface SimpleJWTPayload {
  userId: string;
}

export interface SecureJWTPayload {
  userId: string;
  passwordHash: string; // Store password hash for additional verification
}

function getJWTSecret(): string {
  if (!process.env.JWT_SECRET) {
    throw new Error('Please define the JWT_SECRET environment variable');
  }
  return process.env.JWT_SECRET;
}

export function generateToken(payload: JWTPayload): string {
  const JWT_SECRET = getJWTSecret();
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '7d',
    issuer: 'sanatan-blogs',
    audience: 'sanatan-blogs-users'
  });
}

export function generateAccessToken(userId: string): string {
  const JWT_SECRET = getJWTSecret();
  return jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: '7d',
    issuer: 'sanatan-blogs',
    audience: 'sanatan-blogs-users'
  });
}

export function generateSecureAccessToken(userId: string, passwordHash: string): string {
  const JWT_SECRET = getJWTSecret();
  return jwt.sign({ userId, passwordHash }, JWT_SECRET, {
    expiresIn: '7d',
    issuer: 'sanatan-blogs',
    audience: 'sanatan-blogs-users'
  });
}

export function generateRefreshToken(userId: string): string {
  const JWT_SECRET = getJWTSecret();
  return jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: '30d',
    issuer: 'sanatan-blogs',
    audience: 'sanatan-blogs-refresh'
  });
}

export function verifyToken(token: string): SimpleJWTPayload | null {
  try {
    const JWT_SECRET = getJWTSecret();
    const decoded = jwt.verify(token, JWT_SECRET, {
      issuer: 'sanatan-blogs',
      audience: 'sanatan-blogs-users'
    }) as SimpleJWTPayload;
    
    return decoded;
  } catch (error) {
    console.error('JWT verification failed:', error);
    return null;
  }
}

export function verifySecureToken(token: string): SecureJWTPayload | null {
  try {
    const JWT_SECRET = getJWTSecret();
    const decoded = jwt.verify(token, JWT_SECRET, {
      issuer: 'sanatan-blogs',
      audience: 'sanatan-blogs-users'
    }) as SecureJWTPayload;
    
    return decoded;
  } catch (error) {
    console.error('Secure JWT verification failed:', error);
    return null;
  }
}

export function verifyRefreshToken(token: string): SimpleJWTPayload | null {
  try {
    const JWT_SECRET = getJWTSecret();
    const decoded = jwt.verify(token, JWT_SECRET, {
      issuer: 'sanatan-blogs',
      audience: 'sanatan-blogs-refresh'
    }) as SimpleJWTPayload;
    
    return decoded;
  } catch (error) {
    console.error('Refresh token verification failed:', error);
    return null;
  }
}

// Function to verify password against JWT token
export async function verifyPasswordWithToken(token: string, password: string): Promise<boolean> {
  try {
    const decoded = verifySecureToken(token);
    if (!decoded || !decoded.passwordHash) {
      return false;
    }
    
    // Compare the provided password with the hash stored in JWT
    return await bcryptjs.compare(password, decoded.passwordHash);
  } catch (error) {
    console.error('Password verification with token failed:', error);
    return false;
  }
}

// Legacy function for backward compatibility
export function verifyTokenLegacy(token: string): JWTPayload | null {
  try {
    const JWT_SECRET = getJWTSecret();
    const decoded = jwt.verify(token, JWT_SECRET, {
      issuer: 'sanatan-blogs',
      audience: 'sanatan-blogs-users'
    }) as JWTPayload;
    
    return decoded;
  } catch (error) {
    console.error('JWT verification failed:', error);
    return null;
  }
} 