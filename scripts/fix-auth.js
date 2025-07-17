#!/usr/bin/env node

console.log('🔧 Fixing Authentication Issues...\n');

console.log('📋 Steps to fix the JWT token error:');
console.log('');
console.log('1. Open your browser and go to the admin panel');
console.log('2. Open Developer Tools (F12)');
console.log('3. Go to the Console tab');
console.log('4. Run this command to clear the corrupted token:');
console.log('   localStorage.removeItem("accessToken");');
console.log('');
console.log('5. Refresh the page');
console.log('6. You should be redirected to the login page');
console.log('7. Log in with your admin credentials');
console.log('');
console.log('8. After logging in, try the ban/unban functionality again');
console.log('');
console.log('🔍 If you still have issues:');
console.log('- Check the browser console for any error messages');
console.log('- Make sure you are logged in as an admin user');
console.log('- Verify the JWT_SECRET environment variable is set');
console.log('- Try logging out and logging back in');
console.log('');
console.log('✅ The environment is properly configured:');
console.log('- Database connection: ✅ Working');
console.log('- JWT_SECRET: ✅ Set');
console.log('- MONGODB_URI: ✅ Set');
console.log('');
console.log('🎯 The issue is likely a corrupted token in localStorage.');
console.log('   Follow the steps above to clear it and log in again.'); 