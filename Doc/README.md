# Sanatan Blogs - सनातन ब्लॉग्स

A secure, scalable, and feature-rich blog website built with Next.js, MongoDB, and modern technologies. This platform includes user registration with admin approval, role-based access control, image uploads via Cloudinary, and comprehensive blog management.

## 🚀 Features

### User Management
- **User Registration & Authentication** with JWT tokens
- **Admin Approval System** - Users need admin approval before accessing blog creation
- **Role-based Access Control** (User, Admin, Super Admin)
- **Secure Password Hashing** with bcryptjs
- **Profile Management** with bio and social links

### Blog Management
- **Rich Blog Creation** with title, content, categories, and tags
- **Image Upload** integration with Cloudinary
- **SEO Optimization** with meta tags and descriptions
- **Auto Slug Generation** from blog titles
- **Reading Time Calculation**
- **Draft and Published States**
- **Blog Categories and Tags**

### Security Features
- **JWT-based Authentication** with refresh tokens
- **Rate Limiting** for API endpoints
- **Input Validation** and sanitization
- **CORS Protection**
- **HTTP-only Cookies** for secure token storage
- **Password Strength Validation**

### Admin Features
- **User Approval/Rejection System**
- **User Management Dashboard**
- **Content Moderation**
- **Analytics and Statistics**

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Node.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Cloudinary
- **UI Components**: Lucide React Icons, Custom Components
- **Form Handling**: React Hook Form with Zod validation
- **Notifications**: React Hot Toast

## 📋 Prerequisites

Before running this project, make sure you have:

- Node.js (v18 or higher)
- npm or yarn package manager
- MongoDB database (local or cloud)
- Cloudinary account for image uploads

## ⚙️ Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd sanatan-blogs
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   
   Create a `.env.local` file in the root directory with the following variables:
   
   ```env
   # Database
   MONGODB_URI=mongodb://localhost:27017/sanatan-blogs
   # For production: mongodb+srv://username:password@cluster.mongodb.net/sanatan-blogs

   # JWT Secret (use a strong random string)
   JWT_SECRET=your-super-secret-jwt-key-here-change-this-in-production

   # NextAuth (if using NextAuth in future)
   NEXTAUTH_SECRET=your-nextauth-secret-key-here
   NEXTAUTH_URL=http://localhost:3000

   # Cloudinary Configuration
   CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
   CLOUDINARY_API_KEY=your-cloudinary-api-key
   CLOUDINARY_API_SECRET=your-cloudinary-api-secret

   # App Configuration
   ADMIN_EMAIL=admin@sanatanblogs.com
   DEFAULT_ADMIN_PASSWORD=admin123
   ```

4. **Database Setup**
   
   Make sure MongoDB is running and accessible via the connection string in your `.env.local` file.

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   
   Navigate to `http://localhost:3000` to see the application.

## 🏗️ Project Structure

```
sanatan-blogs/
├── app/
│   ├── api/                    # API routes
│   │   ├── auth/              # Authentication endpoints
│   │   ├── blogs/             # Blog management endpoints
│   │   └── admin/             # Admin-only endpoints
│   ├── globals.css            # Global styles
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Homepage
├── lib/
│   ├── mongodb.ts             # Database connection
│   ├── jwt.ts                 # JWT utilities
│   ├── cloudinary.ts          # Cloudinary configuration
│   └── utils.ts               # Utility functions
├── models/
│   ├── User.ts                # User model
│   ├── Blog.ts                # Blog model
│   └── Comment.ts             # Comment model
├── middleware/
│   └── auth.ts                # Authentication middleware
├── components/                # React components (to be added)
└── public/                    # Static assets
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Refresh access token

### Blogs
- `GET /api/blogs` - Get published blogs (public)
- `POST /api/blogs` - Create new blog (authenticated)
- `GET /api/blogs/[slug]` - Get specific blog
- `PUT /api/blogs/[id]` - Update blog (author only)
- `DELETE /api/blogs/[id]` - Delete blog (author/admin)

### Admin
- `GET /api/admin/users` - List all users (admin only)
- `PATCH /api/admin/users` - Update user status (admin only)
- `DELETE /api/admin/users` - Delete user (super admin only)

## 👥 User Roles

### User (Default)
- Create and manage own blogs
- Comment on blogs
- Update profile

### Admin
- All user permissions
- Approve/reject user registrations
- Moderate content
- View user analytics

### Super Admin
- All admin permissions
- Delete users
- Manage other admins
- System configuration

## 🚀 Deployment

### Production Build
```bash
npm run build
npm start
```

### Environment Variables for Production
Make sure to update the following for production:
- Use a strong `JWT_SECRET`
- Set `MONGODB_URI` to your production database
- Configure Cloudinary with production credentials
- Set `NEXTAUTH_URL` to your domain

### Recommended Hosting
- **Frontend & API**: Vercel, Netlify, or any Node.js hosting
- **Database**: MongoDB Atlas
- **CDN**: Cloudinary for images

## 🔒 Security Considerations

1. **Environment Variables**: Never commit `.env.local` to version control
2. **JWT Secret**: Use a strong, random secret for JWT signing
3. **Database**: Use connection strings with authentication
4. **CORS**: Configure appropriate CORS settings for production
5. **Rate Limiting**: Monitor and adjust rate limits based on usage
6. **Input Validation**: All inputs are validated on both client and server
7. **SQL Injection**: MongoDB queries are parameterized to prevent injection

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📧 Support

For support and questions:
- Create an issue in the GitHub repository
- Contact: admin@sanatanblogs.com

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- MongoDB for the flexible database
- Cloudinary for image management
- Tailwind CSS for styling utilities
- All open-source contributors

---

Built with ❤️ for the community by the Sanatan Blogs team.
