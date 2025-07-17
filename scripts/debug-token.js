#!/usr/bin/env node

async function debugToken() {
  try {
    console.log('🔍 Debugging JWT Token Issues...\n');

    // Test 1: Check if we can fetch blogs (public endpoint)
    console.log('1. Testing public blog fetch...');
    const blogsResponse = await fetch('http://localhost:3000/api/blogs?limit=1');
    const blogsData = await blogsResponse.json();
    
    if (!blogsData.blogs || blogsData.blogs.length === 0) {
      console.log('❌ No blogs found in database');
      return;
    }

    const testBlog = blogsData.blogs[0];
    console.log(`✅ Found blog: "${testBlog.title}" (ID: ${testBlog._id})`);

    // Test 2: Test authentication endpoint
    console.log('\n2. Testing authentication endpoint...');
    const authResponse = await fetch('http://localhost:3000/api/auth/me', {
      headers: {
        'Authorization': 'Bearer test-token'
      }
    });
    
    console.log(`Auth endpoint status: ${authResponse.status}`);
    const authData = await authResponse.json();
    console.log(`Auth response: ${JSON.stringify(authData)}`);

    // Test 3: Test with a properly formatted but invalid JWT
    console.log('\n3. Testing with malformed JWT...');
    const malformedResponse = await fetch('http://localhost:3000/api/auth/me', {
      headers: {
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.invalid.signature'
      }
    });
    
    console.log(`Malformed JWT status: ${malformedResponse.status}`);
    const malformedData = await malformedResponse.json();
    console.log(`Malformed JWT response: ${JSON.stringify(malformedData)}`);

    console.log('\n📋 Debug Summary:');
    console.log('- Check if you are logged in to the admin panel');
    console.log('- Check browser console for token format errors');
    console.log('- Try logging out and logging back in');
    console.log('- Check if JWT_SECRET environment variable is set');
    console.log('- Verify the token in localStorage is a valid JWT');

  } catch (error) {
    console.error('❌ Debug failed:', error.message);
  }
}

// Run the debug
debugToken(); 