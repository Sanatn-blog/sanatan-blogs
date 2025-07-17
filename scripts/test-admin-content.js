import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3000';

// Test data for creating blogs
const sampleBlogs = [
  {
    title: 'The Essence of Dharma in Modern Life',
    excerpt: 'Exploring how ancient wisdom can guide us in contemporary challenges',
    content: `🙏॥ The Essence of Dharma in Modern Life ॥

Dharma, often translated as "righteousness" or "duty," is a fundamental concept in Sanatan Dharma that transcends religious boundaries and offers timeless wisdom for modern living.

🌷 Understanding Dharma

Dharma is not merely a set of rules but a way of life that promotes harmony, balance, and ethical conduct. In today's fast-paced world, understanding and practicing dharma can help us navigate complex moral dilemmas and maintain inner peace.

👉 Key Principles of Dharma:

- **Truthfulness (Satya)**: Speaking truth and living authentically
- **Non-violence (Ahimsa)**: Practicing compassion towards all beings
- **Self-discipline (Tapas)**: Developing willpower and self-control
- **Contentment (Santosha)**: Finding satisfaction in what we have

॥ "Dharma protects those who protect dharma" ॥

This ancient wisdom reminds us that when we uphold ethical principles, we create a protective shield around ourselves and society.`,
    category: 'Philosophy',
    tags: ['dharma', 'ethics', 'modern-life', 'wisdom'],
    status: 'published'
  },
  {
    title: 'Meditation Techniques for Beginners',
    excerpt: 'Simple and effective meditation practices for daily wellness',
    content: `🙏॥ Meditation Techniques for Beginners ॥

Meditation is a powerful tool for mental clarity, emotional balance, and spiritual growth. Here are some beginner-friendly techniques that can be practiced daily.

🌷 Breathing Meditation (Pranayama)

Focus on your breath as it flows in and out naturally. This simple practice helps calm the mind and reduce stress.

👉 Step-by-Step Guide:

- Find a comfortable seated position
- Close your eyes gently
- Focus on your natural breath
- Count breaths from 1 to 10, then start over
- Practice for 10-15 minutes daily

॥ "When the breath wanders, the mind is unsteady, but when the breath is still, so is the mind" ॥

🌷 Mantra Meditation

Choose a sacred sound or phrase and repeat it silently. This helps focus the mind and connect with higher consciousness.

- **Om Namah Shivaya**: For inner peace and transformation
- **Om Mani Padme Hum**: For compassion and wisdom
- **Gayatri Mantra**: For spiritual illumination`,
    category: 'Spirituality',
    tags: ['meditation', 'breathing', 'mantra', 'wellness'],
    status: 'draft'
  },
  {
    title: 'Ayurvedic Principles for Healthy Living',
    excerpt: 'Ancient wisdom for modern health and wellness',
    content: `🙏॥ Ayurvedic Principles for Healthy Living ॥

Ayurveda, the science of life, offers comprehensive guidelines for maintaining health and preventing disease through natural means.

🌷 The Three Doshas

Ayurveda recognizes three fundamental energies or doshas that govern our physical and mental constitution:

- **Vata**: Air and space elements - governs movement
- **Pitta**: Fire and water elements - governs transformation
- **Kapha**: Earth and water elements - governs structure

👉 Daily Routines (Dinacharya):

- Wake up before sunrise
- Drink warm water with lemon
- Practice gentle stretching or yoga
- Eat meals at regular times
- Go to bed early

॥ "Health is wealth, peace of mind is happiness" ॥

🌷 Seasonal Living

Ayurveda emphasizes living in harmony with nature's cycles, adjusting our diet and lifestyle according to the seasons.`,
    category: 'Health',
    tags: ['ayurveda', 'health', 'wellness', 'doshas'],
    status: 'published'
  },
  {
    title: 'The Art of Mindful Cooking',
    excerpt: 'Transform your kitchen into a sacred space for nourishment',
    content: `🙏॥ The Art of Mindful Cooking ॥

Cooking with awareness and intention can transform a daily chore into a spiritual practice that nourishes both body and soul.

🌷 Sacred Kitchen Practices

Treat your kitchen as a temple where you create offerings of love and nourishment for yourself and others.

👉 Mindful Cooking Steps:

- Begin with gratitude for the ingredients
- Wash your hands and clean your workspace
- Cook with love and positive intentions
- Offer the first portion to the divine
- Share meals with family and friends

॥ "Food prepared with love becomes medicine" ॥

🌷 Seasonal Ingredients

Choose fresh, seasonal ingredients that align with nature's rhythms and your body's needs.`,
    category: 'Lifestyle',
    tags: ['cooking', 'mindfulness', 'nourishment', 'sacred'],
    status: 'archived'
  }
];

// Test the blogs API
async function testBlogsAPI() {
  try {
    console.log('🧪 Testing Blogs API...\n');

    // Test 1: Get all blogs (should work without authentication for public endpoint)
    console.log('1. Testing GET /api/blogs (public endpoint)...');
    const response = await fetch(`${BASE_URL}/api/blogs`);
    const data = await response.json();
    
    if (response.ok) {
      console.log(`✅ Success! Found ${data.blogs?.length || 0} blogs`);
      console.log(`   Total blogs: ${data.pagination?.totalBlogs || 0}`);
      console.log(`   Categories: ${data.categories?.join(', ') || 'None'}`);
    } else {
      console.log(`❌ Failed: ${data.error || 'Unknown error'}`);
    }

    // Test 2: Get blogs with status filter
    console.log('\n2. Testing GET /api/blogs with status filter...');
    const statusResponse = await fetch(`${BASE_URL}/api/blogs?status=all`);
    const statusData = await statusResponse.json();
    
    if (statusResponse.ok) {
      console.log(`✅ Success! Found ${statusData.blogs?.length || 0} blogs (all statuses)`);
    } else {
      console.log(`❌ Failed: ${statusData.error || 'Unknown error'}`);
    }

    // Test 3: Get blogs with category filter
    console.log('\n3. Testing GET /api/blogs with category filter...');
    const categoryResponse = await fetch(`${BASE_URL}/api/blogs?category=Philosophy`);
    const categoryData = await categoryResponse.json();
    
    if (categoryResponse.ok) {
      console.log(`✅ Success! Found ${categoryData.blogs?.length || 0} Philosophy blogs`);
    } else {
      console.log(`❌ Failed: ${categoryData.error || 'Unknown error'}`);
    }

    // Test 4: Search blogs
    console.log('\n4. Testing GET /api/blogs with search...');
    const searchResponse = await fetch(`${BASE_URL}/api/blogs?search=dharma`);
    const searchData = await searchResponse.json();
    
    if (searchResponse.ok) {
      console.log(`✅ Success! Found ${searchData.blogs?.length || 0} blogs matching "dharma"`);
    } else {
      console.log(`❌ Failed: ${searchData.error || 'Unknown error'}`);
    }

    console.log('\n🎉 All API tests completed!');
    console.log('\n📝 Next steps:');
    console.log('1. Start the development server: npm run dev');
    console.log('2. Navigate to http://localhost:3000/admin/content');
    console.log('3. Login as admin to test the content management interface');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\n💡 Make sure the development server is running: npm run dev');
  }
}

// Run the tests
testBlogsAPI(); 