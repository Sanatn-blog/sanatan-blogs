#!/usr/bin/env node

console.log('🌐 MongoDB Atlas Setup Guide\n');

console.log('📋 Steps to fix the MongoDB connection error:');
console.log('');
console.log('1. Go to MongoDB Atlas (https://cloud.mongodb.com)');
console.log('2. Create a free cluster or use an existing one');
console.log('3. Get your connection string from the cluster');
console.log('4. Update your .env.local file with the Atlas connection string');
console.log('');
console.log('🔧 Quick Fix - Update .env.local:');
console.log('');
console.log('Replace this line:');
console.log('MONGODB_URI=mongodb://localhost:27017/sanatan-blogs');
console.log('');
console.log('With your Atlas connection string:');
console.log('MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/sanatan-blogs');
console.log('');
console.log('⚠️  Make sure to:');
console.log('- Replace username, password, and cluster details');
console.log('- Add your IP address to Atlas IP whitelist');
console.log('- Use the correct database name');
console.log('');
console.log('🔄 After updating .env.local:');
console.log('1. Restart your development server: npm run dev');
console.log('2. Try logging in again');
console.log('');
console.log('💡 Alternative: Install MongoDB locally');
console.log('If you prefer local MongoDB:');
console.log('1. Download MongoDB Community Server');
console.log('2. Install and start the MongoDB service');
console.log('3. Keep the current localhost connection string'); 