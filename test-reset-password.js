// Simple test script for reset password API
const testResetPassword = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/auth/reset-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        otp: '123456',
        newPassword: 'TestPassword123'
      }),
    });

    const data = await response.json();
    console.log('Response status:', response.status);
    console.log('Response data:', data);
  } catch (error) {
    console.error('Test error:', error);
  }
};

// Run test if this file is executed directly
if (typeof window === 'undefined') {
  testResetPassword();
} 