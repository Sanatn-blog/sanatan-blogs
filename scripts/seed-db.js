#!/usr/bin/env node

import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

// Import models
import User from '../models/User.js';
import Blog from '../models/Blog.js';

const sampleBlogs = [
  {
    title: 'Introduction to Sanatan Dharma',
    excerpt: 'Discover the ancient wisdom of Sanatan Dharma and its relevance in modern life.',
    content: `Sanatan Dharma, often referred to as Hinduism, is one of the world's oldest spiritual traditions. The term "Sanatan" means eternal, and "Dharma" refers to the natural law or way of life that sustains the universe.

This ancient wisdom tradition offers profound insights into the nature of reality, consciousness, and the purpose of human existence. Unlike many other religions, Sanatan Dharma is not based on a single founder or prophet, but rather on the eternal truths discovered by ancient sages through deep meditation and spiritual practices.

The core principles of Sanatan Dharma include:

1. **Dharma (Righteousness)**: Living in accordance with natural law and moral principles
2. **Artha (Prosperity)**: Pursuing material wealth and success ethically
3. **Kama (Pleasure)**: Enjoying life's pleasures in moderation
4. **Moksha (Liberation)**: Achieving spiritual freedom and self-realization

These four goals, known as the Purusharthas, provide a comprehensive framework for living a balanced and meaningful life.`,
    category: 'Spirituality',
    tags: ['sanatan dharma', 'hinduism', 'spirituality', 'ancient wisdom'],
    status: 'published',
    isPublished: true,
    publishedAt: new Date(),
    views: 150,
    likes: [],
    readingTime: 5
  },
  {
    title: 'The Science of Yoga: Beyond Physical Exercise',
    excerpt: 'Explore the deeper dimensions of yoga as a spiritual science for self-realization.',
    content: `Yoga is much more than physical exercise or stretching. It is a comprehensive spiritual science that has been practiced for thousands of years in India. The word "yoga" comes from the Sanskrit root "yuj," which means to unite or join.

The ultimate goal of yoga is to unite the individual consciousness with the universal consciousness, leading to self-realization and liberation. This ancient science encompasses various paths:

**Raja Yoga (Royal Path)**: The path of meditation and mental control
**Bhakti Yoga (Devotional Path)**: The path of love and devotion
**Karma Yoga (Action Path)**: The path of selfless service
**Jnana Yoga (Wisdom Path)**: The path of knowledge and discrimination

Each path is suited to different temperaments and can be practiced simultaneously. The physical postures (asanas) that are popular in the West are just one aspect of the broader yoga tradition.

The benefits of yoga extend far beyond physical health. Regular practice can lead to:
- Mental clarity and emotional balance
- Increased self-awareness and consciousness
- Spiritual growth and inner peace
- Better relationships and social harmony`,
    category: 'Yoga',
    tags: ['yoga', 'meditation', 'spiritual science', 'self-realization'],
    status: 'published',
    isPublished: true,
    publishedAt: new Date(Date.now() - 86400000), // 1 day ago
    views: 89,
    likes: [],
    readingTime: 4
  },
  {
    title: 'Vedanta Philosophy: The Essence of Indian Thought',
    excerpt: 'Understanding the profound philosophy of Vedanta and its practical applications.',
    content: `Vedanta is one of the six orthodox schools of Indian philosophy and represents the culmination of Vedic wisdom. The term "Vedanta" means "end of the Vedas" and refers to the Upanishads, which contain the philosophical essence of the Vedic texts.

The central teaching of Vedanta is the non-dualistic philosophy of Advaita, which proclaims that there is only one ultimate reality - Brahman, and the individual soul (Atman) is identical to this universal consciousness.

Key concepts in Vedanta include:

**Brahman**: The ultimate reality, pure consciousness, and the source of all existence
**Atman**: The individual soul, which is identical to Brahman
**Maya**: The cosmic illusion that makes us perceive duality where there is unity
**Moksha**: Liberation from the cycle of birth and death through self-realization

Vedanta teaches that the purpose of human life is to realize our true nature as pure consciousness and to transcend the limitations of the ego and mind. This realization leads to lasting peace, joy, and freedom.

The practical application of Vedanta involves:
- Regular meditation and self-inquiry
- Cultivating detachment and equanimity
- Serving others selflessly
- Studying sacred texts under a qualified teacher`,
    category: 'Philosophy',
    tags: ['vedanta', 'advaita', 'indian philosophy', 'consciousness'],
    status: 'published',
    isPublished: true,
    publishedAt: new Date(Date.now() - 172800000), // 2 days ago
    views: 67,
    likes: [],
    readingTime: 6
  }
];

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');

    // Connect to database
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI environment variable is not set');
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to database');

    // Check if we have any users
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('⚠️  No users found. Please create a user first before seeding blogs.');
      console.log('   You can register a user through the application interface.');
      return;
    }

    // Get the first approved user as the author
    const author = await User.findOne({ status: 'approved' });
    if (!author) {
      console.log('⚠️  No approved users found. Please approve a user first.');
      return;
    }

    console.log(`📝 Using author: ${author.name} (${author.email})`);

    // Clear existing blogs (optional - comment out if you want to keep existing blogs)
    const existingBlogs = await Blog.countDocuments();
    if (existingBlogs > 0) {
      console.log(`🗑️  Found ${existingBlogs} existing blogs. Skipping seeding to avoid duplicates.`);
      console.log('   To re-seed, manually delete existing blogs first.');
      return;
    }

    // Create blogs with the author
    const blogsWithAuthor = sampleBlogs.map(blog => ({
      ...blog,
      author: author._id
    }));

    const createdBlogs = await Blog.insertMany(blogsWithAuthor);
    console.log(`✅ Successfully created ${createdBlogs.length} sample blogs`);

    console.log('\n📚 Sample blogs created:');
    createdBlogs.forEach((blog, index) => {
      console.log(`${index + 1}. ${blog.title} (${blog.category})`);
    });

    console.log('\n🎉 Database seeding completed!');
    console.log('🔗 Visit http://localhost:3000/blogs to see your blogs');

  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from database');
  }
}

// Run the seeding
seedDatabase(); 