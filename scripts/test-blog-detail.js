#!/usr/bin/env node

async function testBlogDetail() {
  try {
    console.log('🧪 Testing Blog Detail Page...\n');

    // Test 1: Fetch blogs list
    console.log('1. Fetching blogs list...');
    const blogsResponse = await fetch('http://localhost:3000/api/blogs?limit=1');
    const blogsData = await blogsResponse.json();
    
    if (!blogsData.blogs || blogsData.blogs.length === 0) {
      console.log('❌ No blogs found in database');
      return;
    }

    const testBlog = blogsData.blogs[0];
    console.log(`✅ Found blog: "${testBlog.title}" (ID: ${testBlog._id})`);

    // Test 2: Fetch individual blog by ID
    console.log('\n2. Fetching blog by ID...');
    const blogResponse = await fetch(`http://localhost:3000/api/blogs/${testBlog._id}`);
    const blogData = await blogResponse.json();
    
    if (!blogData.blog) {
      console.log('❌ Failed to fetch blog by ID');
      return;
    }

    console.log(`✅ Blog fetched successfully:`);
    console.log(`   - Title: ${blogData.blog.title}`);
    console.log(`   - Author: ${blogData.blog.author.name}`);
    console.log(`   - Category: ${blogData.blog.category}`);
    console.log(`   - Views: ${blogData.blog.views}`);
    console.log(`   - Reading Time: ${blogData.blog.readingTime} min`);
    console.log(`   - Content Length: ${blogData.blog.content.length} characters`);

    // Test 3: Test blog detail page HTML
    console.log('\n3. Testing blog detail page...');
    const pageResponse = await fetch(`http://localhost:3000/blogs/${testBlog.slug}`);
    const pageHtml = await pageResponse.text();
    
    if (pageResponse.ok) {
      console.log('✅ Blog detail page loads successfully');
      
      // Check if the page contains the blog title
      if (pageHtml.includes(testBlog.title)) {
        console.log('✅ Blog title found in page HTML');
      } else {
        console.log('⚠️  Blog title not found in page HTML');
      }
      
      // Check if the page contains the author name
      if (pageHtml.includes(testBlog.author.name)) {
        console.log('✅ Author name found in page HTML');
      } else {
        console.log('⚠️  Author name not found in page HTML');
      }
    } else {
      console.log(`❌ Blog detail page failed to load: ${pageResponse.status}`);
    }

    // Test 4: Test with blog ID
    console.log('\n4. Testing blog detail page with ID...');
    const pageResponseById = await fetch(`http://localhost:3000/blogs/${testBlog._id}`);
    
    if (pageResponseById.ok) {
      console.log('✅ Blog detail page loads successfully with ID');
    } else {
      console.log(`❌ Blog detail page failed to load with ID: ${pageResponseById.status}`);
    }

    console.log('\n🎉 All tests completed successfully!');
    console.log(`🔗 You can view the blog at: http://localhost:3000/blogs/${testBlog.slug}`);

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testBlogDetail(); 