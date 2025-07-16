#!/usr/bin/env node

async function testLoginAndDelete() {
  try {
    console.log('🧪 Testing Login and Delete Functionality...\n');

    // Test 1: Try to login (you'll need to provide valid credentials)
    console.log('1. Testing login...');
    console.log('⚠️  You need to provide valid login credentials');
    console.log('   Please check your database for a valid user account');
    
    // For now, let's just check what users exist
    console.log('\n2. Checking available blogs...');
    const blogsResponse = await fetch('http://localhost:3000/api/blogs?limit=5');
    const blogsData = await blogsResponse.json();
    
    if (blogsData.blogs && blogsData.blogs.length > 0) {
      console.log('📚 Available blogs:');
      blogsData.blogs.forEach((blog, index) => {
        console.log(`   ${index + 1}. "${blog.title}" by ${blog.author.name} (ID: ${blog._id})`);
      });
    }

    console.log('\n📋 To fix the delete issue:');
    console.log('1. Go to http://localhost:3000/login');
    console.log('2. Log in with valid credentials');
    console.log('3. Check browser console (F12) for detailed logs when clicking delete');
    console.log('4. Make sure you\'re trying to delete your own blog');
    console.log('\n🔍 Debug steps:');
    console.log('- Open browser developer tools (F12)');
    console.log('- Go to Console tab');
    console.log('- Click the delete button on a blog');
    console.log('- Check the console logs for detailed information');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testLoginAndDelete(); 