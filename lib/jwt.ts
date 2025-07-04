import jwt from 'jsonwebtoken';

if (!process.env.JWT_SECRET) {
  throw new Error('Please define the JWT_SECRET environment variable');
}

const JWT_SECRET: string = process.env.JWT_SECRET;

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  status: string;
}

export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '7d',
    issuer: 'sanatan-blogs',
    audience: 'sanatan-blogs-users'
  });
}

export function verifyToken(token: string): JWTPayload | null {
  try {
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

export function generateRefreshToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '30d',
    issuer: 'sanatan-blogs',
    audience: 'sanatan-blogs-refresh'
  });
}

export function verifyRefreshToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET, {
      issuer: 'sanatan-blogs',
      audience: 'sanatan-blogs-refresh'
    }) as JWTPayload;
    
    return decoded;
  } catch (error) {
    console.error('Refresh token verification failed:', error);
    return null;
  }
} 