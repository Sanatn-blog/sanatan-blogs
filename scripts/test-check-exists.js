async function testCheckExists() {
  const baseUrl = 'http://localhost:3000';
  
  console.log('Testing check-exists API endpoint...\n');
  
  // Test 1: Check with email only
  try {
    console.log('Test 1: Checking email existence...');
    const response1 = await fetch(`${baseUrl}/api/auth/check-exists?email=test@example.com`);
    const data1 = await response1.json();
    console.log('Response:', data1);
    console.log('Status:', response1.status);
  } catch (error) {
    console.error('Error testing email check:', error.message);
  }
  
  console.log('\n' + '='.repeat(50) + '\n');
  
  // Test 2: Check with phone number only
  try {
    console.log('Test 2: Checking phone number existence...');
    const response2 = await fetch(`${baseUrl}/api/auth/check-exists?phoneNumber=+919876543210`);
    const data2 = await response2.json();
    console.log('Response:', data2);
    console.log('Status:', response2.status);
  } catch (error) {
    console.error('Error testing phone check:', error.message);
  }
  
  console.log('\n' + '='.repeat(50) + '\n');
  
  // Test 3: Check with both email and phone
  try {
    console.log('Test 3: Checking both email and phone...');
    const response3 = await fetch(`${baseUrl}/api/auth/check-exists?email=test@example.com&phoneNumber=+919876543210`);
    const data3 = await response3.json();
    console.log('Response:', data3);
    console.log('Status:', response3.status);
  } catch (error) {
    console.error('Error testing both check:', error.message);
  }
}

testCheckExists().catch(console.error); 