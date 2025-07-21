// CommonJS version of utils for migration script
const mongoose = require('mongoose');

// Generate unique username from name
async function generateUniqueUsername(name, User) {
  // Clean the name and create base username
  const baseUsername = name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '') // Remove special characters
    .substring(0, 20); // Limit to 20 characters
  
  // If base username is too short, add some random characters
  let username = baseUsername;
  if (username.length < 3) {
    username = username + Math.random().toString(36).substring(2, 5);
  }
  
  // Check if username exists, if so, add random numbers
  let counter = 1;
  let finalUsername = username;
  
  while (counter <= 100) { // Limit attempts to prevent infinite loop
    const existingUser = await User.findOne({ username: finalUsername });
    if (!existingUser) {
      break;
    }
    
    // Add random numbers to make it unique
    const randomSuffix = Math.floor(Math.random() * 9999) + 1;
    finalUsername = `${username}${randomSuffix}`;
    counter++;
  }
  
  // If we still can't find a unique username, add timestamp
  if (counter > 100) {
    const timestamp = Date.now().toString().slice(-6);
    finalUsername = `${username}${timestamp}`;
  }
  
  return finalUsername;
}

module.exports = {
  generateUniqueUsername
}; 