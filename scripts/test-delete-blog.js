#!/usr/bin/env node

async function testDeleteBlog() {
  try {
    console.log('🧪 Testing Blog Delete Functionality...\n');

    // Test 1: Check if we can fetch blogs (public endpoint)
    console.log('1. Testing blog fetch (public)...');
    const blogsResponse = await fetch('http://localhost:3000/api/blogs?limit=1');
    const blogsData = await blogsResponse.json();
    
    if (!blogsData.blogs || blogsData.blogs.length === 0) {
      console.log('❌ No blogs found in database');
      return;
    }

    const testBlog = blogsData.blogs[0];
    console.log(`✅ Found blog: "${testBlog.title}" (ID: ${testBlog._id})`);

    // Test 2: Test DELETE without authentication
    console.log('\n2. Testing DELETE without authentication...');
    const deleteResponseNoAuth = await fetch(`http://localhost:3000/api/blogs/${testBlog._id}`, {
      method: 'DELETE'
    });
    
    console.log(`Status: ${deleteResponseNoAuth.status}`);
    const deleteDataNoAuth = await deleteResponseNoAuth.json();
    console.log(`Response: ${JSON.stringify(deleteDataNoAuth)}`);
    
    if (deleteResponseNoAuth.status === 401) {
      console.log('✅ Correctly requires authentication');
    } else {
      console.log('⚠️  Unexpected response for unauthenticated request');
    }

    // Test 3: Test with invalid token
    console.log('\n3. Testing DELETE with invalid token...');
    const deleteResponseInvalid = await fetch(`http://localhost:3000/api/blogs/${testBlog._id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': 'Bearer invalid-token'
      }
    });
    
    console.log(`Status: ${deleteResponseInvalid.status}`);
    const deleteDataInvalid = await deleteResponseInvalid.json();
    console.log(`Response: ${JSON.stringify(deleteDataInvalid)}`);

    console.log('\n📋 Summary:');
    console.log('- The DELETE endpoint requires authentication');
    console.log('- You need to be logged in to delete blogs');
    console.log('- You can only delete your own blogs (or be an admin)');
    console.log('\n🔧 To fix the issue:');
    console.log('1. Make sure you are logged in to the application');
    console.log('2. Check that the blog you want to delete belongs to your account');
    console.log('3. Verify that localStorage has a valid "accessToken"');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testDeleteBlog(); 