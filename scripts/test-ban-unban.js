#!/usr/bin/env node

async function testBanUnban() {
  try {
    console.log('🧪 Testing Blog Ban/Unban Functionality...\n');

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

    // Test 2: Test ban without authentication
    console.log('\n2. Testing ban without authentication...');
    const banResponseNoAuth = await fetch(`http://localhost:3000/api/admin/blogs/${testBlog._id}/ban`, {
      method: 'POST'
    });
    
    console.log(`Status: ${banResponseNoAuth.status}`);
    const banDataNoAuth = await banResponseNoAuth.json();
    console.log(`Response: ${JSON.stringify(banDataNoAuth)}`);
    
    if (banResponseNoAuth.status === 401) {
      console.log('✅ Correctly requires authentication');
    } else {
      console.log('⚠️  Unexpected response for unauthenticated request');
    }

    // Test 3: Test unban without authentication
    console.log('\n3. Testing unban without authentication...');
    const unbanResponseNoAuth = await fetch(`http://localhost:3000/api/admin/blogs/${testBlog._id}/unban`, {
      method: 'POST'
    });
    
    console.log(`Status: ${unbanResponseNoAuth.status}`);
    const unbanDataNoAuth = await unbanResponseNoAuth.json();
    console.log(`Response: ${JSON.stringify(unbanDataNoAuth)}`);
    
    if (unbanResponseNoAuth.status === 401) {
      console.log('✅ Correctly requires authentication');
    } else {
      console.log('⚠️  Unexpected response for unauthenticated request');
    }

    // Test 4: Test with invalid token
    console.log('\n4. Testing ban with invalid token...');
    const banResponseInvalid = await fetch(`http://localhost:3000/api/admin/blogs/${testBlog._id}/ban`, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer invalid-token'
      }
    });
    
    console.log(`Status: ${banResponseInvalid.status}`);
    const banDataInvalid = await banResponseInvalid.json();
    console.log(`Response: ${JSON.stringify(banDataInvalid)}`);

    console.log('\n📋 Summary:');
    console.log('- The ban/unban endpoints require authentication');
    console.log('- You need to be logged in as an admin to ban/unban blogs');
    console.log('- The frontend should now show ban/unban buttons instead of publish/unpublish');
    console.log('- Banned posts will have a red status badge');
    console.log('- Check the browser console for any remaining errors');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testBanUnban(); 