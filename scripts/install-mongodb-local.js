#!/usr/bin/env node

console.log('📦 MongoDB Local Installation Guide\n');

console.log('🔧 Option 1: Install MongoDB Community Server');
console.log('');
console.log('1. Go to: https://www.mongodb.com/try/download/community');
console.log('2. Download MongoDB Community Server for Windows');
console.log('3. Run the installer and follow the setup wizard');
console.log('4. Make sure to install MongoDB as a service');
console.log('5. The default port will be 27017');
console.log('');
console.log('🔧 Option 2: Use Docker (if you have Docker installed)');
console.log('');
console.log('Run this command:');
console.log('docker run -d --name mongodb -p 27017:27017 mongo:latest');
console.log('');
console.log('🔧 Option 3: Use MongoDB Atlas (Recommended)');
console.log('');
console.log('1. Go to: https://cloud.mongodb.com');
console.log('2. Create a free account and cluster');
console.log('3. Get your connection string');
console.log('4. Run: node scripts/update-mongodb-uri.js "your-connection-string"');
console.log('');
console.log('🔄 After installation:');
console.log('1. Restart your development server: npm run dev');
console.log('2. Test the connection: http://localhost:3000/api/test');
console.log('3. Try logging in again'); 