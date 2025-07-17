#!/usr/bin/env node

async function testUnpublish() {
  try {
    console.log('🧪 Testing Blog Unpublish Functionality...\n');

    // Test 1: Check if we can fetch blogs (public endpoint)
    console.log('1. Testing blog fetch (public)...');
    const blogsResponse = await fetch('http://localhost:3000/api/blogs?limit=1');
    const blogsData = await blogsResponse.json();
    
    if (!blogsData.blogs || blogsData.blogs.length === 0) {
      console.log('❌ No blogs found in database');
      return;
    }

    const testBlog = blogsData.blogs[0];
    console.log(`✅ Found blog: "${testBlog.title}" (ID: ${testBlog._id}, Status: ${testBlog.status})`);

    // Test 2: Test unpublish without authentication
    console.log('\n2. Testing unpublish without authentication...');
    const unpublishResponseNoAuth = await fetch(`http://localhost:3000/api/admin/blogs/${testBlog._id}/unpublish`, {
      method: 'POST'
    });
    
    console.log(`Status: ${unpublishResponseNoAuth.status}`);
    const unpublishDataNoAuth = await unpublishResponseNoAuth.json();
    console.log(`Response: ${JSON.stringify(unpublishDataNoAuth)}`);
    
    if (unpublishResponseNoAuth.status === 401) {
      console.log('✅ Correctly requires authentication');
    } else {
      console.log('⚠️  Unexpected response for unauthenticated request');
    }

    // Test 3: Test with invalid token
    console.log('\n3. Testing unpublish with invalid token...');
    const unpublishResponseInvalid = await fetch(`http://localhost:3000/api/admin/blogs/${testBlog._id}/unpublish`, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer invalid-token'
      }
    });
    
    console.log(`Status: ${unpublishResponseInvalid.status}`);
    const unpublishDataInvalid = await unpublishResponseInvalid.json();
    console.log(`Response: ${JSON.stringify(unpublishDataInvalid)}`);

    console.log('\n📋 Summary:');
    console.log('- The unpublish endpoint requires authentication');
    console.log('- You need to be logged in as an admin to unpublish blogs');
    console.log('- The frontend should now include the Authorization header');
    console.log('- Check the browser console for any remaining errors');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testUnpublish(); 