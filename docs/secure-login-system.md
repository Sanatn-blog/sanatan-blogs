# Secure Login System with JWT Password Verification

## Overview

This system implements a secure authentication mechanism that stores password hashes in JWT tokens for additional verification during login, while maintaining security best practices.

## How It Works

### 1. Registration Process
- User registers with email, password, and other details
- Password is hashed using bcryptjs (salt rounds: 12)
- JWT token is generated containing the user ID and password hash
- Token is returned to the client for storage

### 2. Login Process
- User provides email/userID and password
- System verifies password against database hash
- **Enhanced verification**: If a JWT token is provided, system also verifies password against the hash stored in the token
- New JWT token is generated with updated password hash

### 3. Security Features

#### Password Storage
- **Database**: Passwords are hashed with bcryptjs before storage
- **JWT Token**: Contains password hash (not plain password) for additional verification
- **No plain text**: Passwords are never stored or transmitted in plain text

#### JWT Token Security
- Tokens contain user ID and password hash
- Tokens are signed with a secret key
- Tokens have expiration times (7 days for access, 30 days for refresh)
- Tokens include issuer and audience claims

#### Dual Verification
- **Primary**: Database password verification
- **Secondary**: JWT token password verification (optional)
- Both must pass for enhanced security login

## API Endpoints

### Standard Login
```
POST /api/auth/login
{
  "emailOrUsername": "user@example.com",
  "password": "userpassword"
}
```

### Enhanced Login (with JWT verification)
```
POST /api/auth/login-with-token
{
  "emailOrUsername": "user@example.com", 
  "password": "userpassword",
  "token": "jwt_token_here" // Optional
}
```

### Registration
```
POST /api/auth/register
{
  "name": "User Name",
  "username": "username",
  "email": "user@example.com",
  "password": "userpassword",
  "phoneNumber": "1234567890"
}
```

## Testing

Visit `/test-login` to test the login system:

1. **Create Test User**: Creates a test account
2. **Standard Login**: Tests basic login functionality
3. **Enhanced Login**: Tests login with JWT token verification

## Security Benefits

1. **No Plain Passwords**: Passwords are never stored or transmitted in plain text
2. **Dual Verification**: Optional second layer of password verification
3. **Token Integrity**: JWT tokens are signed and verified
4. **Hash Comparison**: Uses bcryptjs for secure password comparison
5. **Rate Limiting**: Prevents brute force attacks

## Implementation Details

### JWT Token Structure
```json
{
  "userId": "user_id_here",
  "passwordHash": "bcrypt_hash_here",
  "iat": 1234567890,
  "exp": 1234567890,
  "iss": "sanatan-blogs",
  "aud": "sanatan-blogs-users"
}
```

### Password Verification Flow
1. User submits login credentials
2. System finds user by email/userID
3. System verifies password against database hash
4. If JWT token provided, system verifies password against token hash
5. If both verifications pass, new token is generated
6. User is authenticated and logged in

## Best Practices

1. **Never store plain passwords** in JWT tokens
2. **Use strong password hashing** (bcryptjs with 12+ salt rounds)
3. **Implement rate limiting** to prevent brute force attacks
4. **Use HTTPS** in production
5. **Set appropriate token expiration** times
6. **Validate all inputs** before processing
7. **Log security events** for monitoring

## Error Handling

The system provides specific error messages for different failure scenarios:
- User not found
- Invalid password
- Account status issues (pending, rejected, suspended)
- Token verification failures
- Rate limiting exceeded 