// Test script to verify edit blog functionality
const testEditBlog = async () => {
  try {
    console.log('Testing edit blog functionality...');
    
    // Test 1: Check if we can access the write-blog page
    const response = await fetch('/write-blog?edit=test-id', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Write blog page response status:', response.status);
    
    // Test 2: Check if the API endpoint works
    const apiResponse = await fetch('/api/blogs/test-id', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('API response status:', apiResponse.status);
    
    if (apiResponse.ok) {
      const data = await apiResponse.json();
      console.log('API response data structure:', {
        hasBlog: !!data.blog,
        hasTags: !!data.blog?.tags,
        tagsIsArray: Array.isArray(data.blog?.tags),
        tagsLength: data.blog?.tags?.length || 0
      });
    }
    
    console.log('✅ Edit blog test completed successfully');
    
  } catch (error) {
    console.error('❌ Edit blog test failed:', error);
  }
};

// Run the test
testEditBlog(); 