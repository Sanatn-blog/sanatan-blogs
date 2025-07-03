module.exports = {

"[project]/.next-internal/server/app/api/blogs/route/actions.js [app-rsc] (server actions loader, ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
}}),
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}}),
"[externals]/mongoose [external] (mongoose, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("mongoose", () => require("mongoose"));

module.exports = mod;
}}),
"[project]/lib/mongodb.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs)");
;
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}
let cached = global.mongoose;
if (!cached) {
    cached = global.mongoose = {
        conn: null,
        promise: null
    };
}
async function connectDB() {
    if (cached.conn) {
        return cached.conn;
    }
    if (!cached.promise) {
        const opts = {
            bufferCommands: false
        };
        cached.promise = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].connect(MONGODB_URI, opts).then((mongoose)=>{
            return mongoose;
        });
    }
    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        throw e;
    }
    return cached.conn;
}
const __TURBOPACK__default__export__ = connectDB;
}}),
"[project]/models/Blog.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs)");
;
const BlogSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"]({
    title: {
        type: String,
        required: [
            true,
            'Title is required'
        ],
        trim: true,
        minLength: [
            3,
            'Title must be at least 3 characters'
        ],
        maxLength: [
            200,
            'Title cannot exceed 200 characters'
        ]
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: [
            /^[a-z0-9-]+$/,
            'Slug can only contain lowercase letters, numbers, and hyphens'
        ]
    },
    excerpt: {
        type: String,
        required: [
            true,
            'Excerpt is required'
        ],
        trim: true,
        minLength: [
            10,
            'Excerpt must be at least 10 characters'
        ],
        maxLength: [
            300,
            'Excerpt cannot exceed 300 characters'
        ]
    },
    content: {
        type: String,
        required: [
            true,
            'Content is required'
        ],
        minLength: [
            50,
            'Content must be at least 50 characters'
        ]
    },
    featuredImage: {
        type: String,
        default: null
    },
    author: {
        type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"].Types.ObjectId,
        ref: 'User',
        required: [
            true,
            'Author is required'
        ]
    },
    category: {
        type: String,
        required: [
            true,
            'Category is required'
        ],
        trim: true,
        enum: [
            'Technology',
            'Spirituality',
            'Culture',
            'Philosophy',
            'Health',
            'Education',
            'Lifestyle',
            'Art',
            'Science',
            'Politics',
            'Environment',
            'Other'
        ]
    },
    tags: [
        {
            type: String,
            trim: true,
            lowercase: true
        }
    ],
    status: {
        type: String,
        enum: [
            'draft',
            'published',
            'archived'
        ],
        default: 'draft'
    },
    isPublished: {
        type: Boolean,
        default: false
    },
    publishedAt: {
        type: Date
    },
    views: {
        type: Number,
        default: 0
    },
    likes: [
        {
            type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"].Types.ObjectId,
            ref: 'User'
        }
    ],
    comments: [
        {
            type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"].Types.ObjectId,
            ref: 'Comment'
        }
    ],
    seo: {
        metaTitle: {
            type: String,
            maxLength: [
                60,
                'Meta title cannot exceed 60 characters'
            ]
        },
        metaDescription: {
            type: String,
            maxLength: [
                160,
                'Meta description cannot exceed 160 characters'
            ]
        },
        metaKeywords: [
            {
                type: String,
                trim: true,
                lowercase: true
            }
        ]
    },
    readingTime: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});
// Indexes for better query performance
BlogSchema.index({
    slug: 1
});
BlogSchema.index({
    author: 1
});
BlogSchema.index({
    status: 1
});
BlogSchema.index({
    isPublished: 1
});
BlogSchema.index({
    category: 1
});
BlogSchema.index({
    tags: 1
});
BlogSchema.index({
    publishedAt: -1
});
BlogSchema.index({
    views: -1
});
BlogSchema.index({
    createdAt: -1
});
// Text search index
BlogSchema.index({
    title: 'text',
    excerpt: 'text',
    content: 'text',
    tags: 'text'
});
// Calculate reading time before saving
BlogSchema.pre('save', function(next) {
    if (this.isModified('content')) {
        const wordsPerMinute = 200;
        const wordCount = this.content.split(/\s+/).length;
        this.readingTime = Math.ceil(wordCount / wordsPerMinute);
    }
    // Set published date if status changes to published
    if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
        this.publishedAt = new Date();
        this.isPublished = true;
    }
    next();
});
// Generate slug from title
BlogSchema.pre('save', function(next) {
    if (this.isModified('title') && !this.slug) {
        this.slug = this.title.toLowerCase().replace(/[^a-z0-9 ]/g, '').replace(/\s+/g, '-').substring(0, 100);
    }
    next();
});
const Blog = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].models.Blog || __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].model('Blog', BlogSchema);
const __TURBOPACK__default__export__ = Blog;
}}),
"[externals]/crypto [external] (crypto, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}}),
"[project]/models/User.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/bcryptjs/index.js [app-route] (ecmascript)");
;
;
const UserSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"]({
    name: {
        type: String,
        required: [
            true,
            'Name is required'
        ],
        trim: true,
        minLength: [
            2,
            'Name must be at least 2 characters'
        ],
        maxLength: [
            50,
            'Name cannot exceed 50 characters'
        ]
    },
    email: {
        type: String,
        unique: true,
        sparse: true,
        lowercase: true,
        trim: true,
        match: [
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
            'Please enter a valid email'
        ]
    },
    phoneNumber: {
        type: String,
        unique: true,
        sparse: true,
        trim: true
    },
    password: {
        type: String,
        minLength: [
            6,
            'Password must be at least 6 characters'
        ],
        select: false // Don't include password in queries by default
    },
    avatar: {
        type: String,
        default: null
    },
    role: {
        type: String,
        enum: [
            'user',
            'admin',
            'super_admin'
        ],
        default: 'user'
    },
    status: {
        type: String,
        enum: [
            'pending',
            'approved',
            'rejected',
            'suspended'
        ],
        default: 'pending'
    },
    bio: {
        type: String,
        maxLength: [
            500,
            'Bio cannot exceed 500 characters'
        ]
    },
    socialLinks: {
        twitter: String,
        linkedin: String,
        website: String
    },
    lastLogin: Date,
    emailVerified: {
        type: Boolean,
        default: false
    },
    emailVerificationToken: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    isVerified: {
        type: Boolean,
        default: false
    },
    verifiedAt: Date,
    isActive: {
        type: Boolean,
        default: false
    },
    isTemporary: {
        type: Boolean,
        default: false
    },
    otp: String,
    otpExpiry: Date,
    googleId: String,
    facebookId: String,
    instagramId: String,
    twitterId: String,
    authProvider: {
        type: String,
        enum: [
            'email',
            'phone',
            'google',
            'facebook',
            'instagram',
            'twitter'
        ],
        default: 'email'
    }
}, {
    timestamps: true
});
// Index for better query performance
UserSchema.index({
    status: 1
});
UserSchema.index({
    role: 1
});
// Hash password before saving
UserSchema.pre('save', async function(next) {
    if (!this.isModified('password') || !this.password) return next();
    try {
        const salt = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].genSalt(12);
        this.password = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});
// Compare password method
UserSchema.methods.comparePassword = async function(candidatePassword) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].compare(candidatePassword, this.password);
};
// Remove password from JSON output
UserSchema.methods.toJSON = function() {
    const userObject = this.toObject();
    delete userObject.password;
    delete userObject.emailVerificationToken;
    delete userObject.resetPasswordToken;
    delete userObject.resetPasswordExpires;
    return userObject;
};
const User = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].models.User || __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].model('User', UserSchema);
const __TURBOPACK__default__export__ = User;
}}),
"[externals]/buffer [external] (buffer, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("buffer", () => require("buffer"));

module.exports = mod;
}}),
"[externals]/stream [external] (stream, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}}),
"[externals]/util [external] (util, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("util", () => require("util"));

module.exports = mod;
}}),
"[project]/lib/jwt.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "generateRefreshToken": (()=>generateRefreshToken),
    "generateToken": (()=>generateToken),
    "verifyRefreshToken": (()=>verifyRefreshToken),
    "verifyToken": (()=>verifyToken)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jsonwebtoken$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jsonwebtoken/index.js [app-route] (ecmascript)");
;
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error('Please define the JWT_SECRET environment variable');
}
function generateToken(payload) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jsonwebtoken$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].sign(payload, JWT_SECRET, {
        expiresIn: '7d',
        issuer: 'sanatan-blogs',
        audience: 'sanatan-blogs-users'
    });
}
function verifyToken(token) {
    try {
        const decoded = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jsonwebtoken$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].verify(token, JWT_SECRET, {
            issuer: 'sanatan-blogs',
            audience: 'sanatan-blogs-users'
        });
        return decoded;
    } catch (error) {
        console.error('JWT verification failed:', error);
        return null;
    }
}
function generateRefreshToken(payload) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jsonwebtoken$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].sign(payload, JWT_SECRET, {
        expiresIn: '30d',
        issuer: 'sanatan-blogs',
        audience: 'sanatan-blogs-refresh'
    });
}
function verifyRefreshToken(token) {
    try {
        const decoded = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jsonwebtoken$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].verify(token, JWT_SECRET, {
            issuer: 'sanatan-blogs',
            audience: 'sanatan-blogs-refresh'
        });
        return decoded;
    } catch (error) {
        console.error('Refresh token verification failed:', error);
        return null;
    }
}
}}),
"[project]/middleware/auth.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "authenticateUser": (()=>authenticateUser),
    "isUserApproved": (()=>isUserApproved),
    "rateLimit": (()=>rateLimit),
    "requireAdmin": (()=>requireAdmin),
    "requireAuth": (()=>requireAuth),
    "requireRole": (()=>requireRole),
    "requireSuperAdmin": (()=>requireSuperAdmin)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$jwt$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/jwt.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/mongodb.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$User$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/models/User.ts [app-route] (ecmascript)");
;
;
;
;
async function authenticateUser(request) {
    try {
        const authHeader = request.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return {
                success: false,
                error: 'No token provided'
            };
        }
        const token = authHeader.substring(7);
        const decoded = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$jwt$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["verifyToken"])(token);
        if (!decoded) {
            return {
                success: false,
                error: 'Invalid token'
            };
        }
        // Connect to database and verify user exists and is approved
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])();
        const user = await __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$User$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].findById(decoded.userId);
        if (!user) {
            return {
                success: false,
                error: 'User not found'
            };
        }
        if (user.status !== 'approved') {
            return {
                success: false,
                error: 'User not approved'
            };
        }
        const userWithId = {
            ...decoded,
            _id: user._id.toString()
        };
        return {
            success: true,
            user: userWithId
        };
    } catch (error) {
        console.error('Authentication error:', error);
        return {
            success: false,
            error: 'Authentication failed'
        };
    }
}
function requireAuth(handler) {
    return async (request)=>{
        const authResult = await authenticateUser(request);
        if (!authResult.success) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: authResult.error
            }, {
                status: 401
            });
        }
        request.user = authResult.user;
        return handler(request);
    };
}
function requireRole(roles) {
    return function(handler) {
        return async (request)=>{
            const authResult = await authenticateUser(request);
            if (!authResult.success) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    error: authResult.error
                }, {
                    status: 401
                });
            }
            if (!roles.includes(authResult.user.role)) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    error: 'Insufficient permissions'
                }, {
                    status: 403
                });
            }
            request.user = authResult.user;
            return handler(request);
        };
    };
}
function requireAdmin(handler) {
    return requireRole([
        'admin',
        'super_admin'
    ])(handler);
}
function requireSuperAdmin(handler) {
    return requireRole([
        'super_admin'
    ])(handler);
}
async function isUserApproved(userId) {
    try {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])();
        const user = await __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$User$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].findById(userId);
        return user?.status === 'approved';
    } catch (error) {
        console.error('Error checking user approval:', error);
        return false;
    }
}
// Rate limiting helper (basic implementation)
const rateLimitMap = new Map();
function rateLimit(maxRequests = 100, windowMs = 15 * 60 * 1000) {
    return function(handler) {
        return async (request)=>{
            const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || request.headers.get('x-client-ip') || 'unknown';
            const now = Date.now();
            const windowStart = now - windowMs;
            if (!rateLimitMap.has(ip)) {
                rateLimitMap.set(ip, []);
            }
            const requests = rateLimitMap.get(ip);
            const validRequests = requests.filter((time)=>time > windowStart);
            if (validRequests.length >= maxRequests) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    error: 'Too many requests'
                }, {
                    status: 429
                });
            }
            validRequests.push(now);
            rateLimitMap.set(ip, validRequests);
            return handler(request);
        };
    };
}
}}),
"[project]/app/api/blogs/route.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "GET": (()=>GET),
    "POST": (()=>POST)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/mongodb.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$Blog$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/models/Blog.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$User$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/models/User.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$middleware$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/middleware/auth.ts [app-route] (ecmascript)");
;
;
;
;
;
// GET - List all published blogs with pagination and filtering (public endpoint)
async function getBlogsHandler(request) {
    try {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])();
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const category = searchParams.get('category');
        const search = searchParams.get('search');
        const author = searchParams.get('author');
        const tag = searchParams.get('tag');
        const status = searchParams.get('status'); // New parameter for admin panel
        // Build query - allow all statuses if status parameter is provided (for admin)
        const query = {};
        if (!status) {
            // Public endpoint - only show published blogs
            query.status = 'published';
            query.isPublished = true;
        } else if (status !== 'all') {
            // Filter by specific status
            query.status = status;
        }
        if (category) query.category = category;
        if (author) query.author = author;
        if (tag) query.tags = {
            $in: [
                tag
            ]
        };
        if (search) {
            query.$text = {
                $search: search
            };
        }
        // Calculate pagination
        const skip = (page - 1) * limit;
        // Get blogs with author information
        const blogs = await __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$Blog$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].find(query).populate('author', 'name avatar bio').select('-content') // Exclude full content for list view
        .sort({
            publishedAt: -1,
            createdAt: -1
        }).skip(skip).limit(limit).lean();
        // Get total count for pagination
        const totalBlogs = await __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$Blog$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].countDocuments(query);
        const totalPages = Math.ceil(totalBlogs / limit);
        // Get categories for filtering
        const categories = await __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$Blog$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].distinct('category', query);
        // Get popular tags
        const tagStats = await __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$Blog$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].aggregate([
            {
                $match: query
            },
            {
                $unwind: '$tags'
            },
            {
                $group: {
                    _id: '$tags',
                    count: {
                        $sum: 1
                    }
                }
            },
            {
                $sort: {
                    count: -1
                }
            },
            {
                $limit: 20
            }
        ]);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            blogs,
            pagination: {
                currentPage: page,
                totalPages,
                totalBlogs,
                hasNext: page < totalPages,
                hasPrev: page > 1
            },
            categories,
            popularTags: tagStats.map((tag)=>({
                    name: tag._id,
                    count: tag.count
                }))
        });
    } catch (error) {
        console.error('Get blogs error:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Failed to fetch blogs'
        }, {
            status: 500
        });
    }
}
// POST - Create new blog (authenticated users only)
async function createBlogHandler(request) {
    try {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])();
        const body = await request.json();
        const { title, excerpt, content, category, tags, featuredImage, status = 'draft', seo } = body;
        // Basic validation
        if (!title || !excerpt || !content || !category) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Title, excerpt, content, and category are required'
            }, {
                status: 400
            });
        }
        // Verify user exists and is approved
        const user = await __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$User$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].findById(request.user?._id);
        if (!user || user.status !== 'approved') {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'User not found or not approved'
            }, {
                status: 403
            });
        }
        // Generate slug from title
        const baseSlug = title.toLowerCase().replace(/[^a-z0-9 ]/g, '').replace(/\s+/g, '-').substring(0, 100);
        // Ensure slug is unique
        let slug = baseSlug;
        let counter = 1;
        while(await __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$Blog$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].findOne({
            slug
        })){
            slug = `${baseSlug}-${counter}`;
            counter++;
        }
        // Create new blog
        const newBlog = new __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$Blog$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"]({
            title: title.trim(),
            slug,
            excerpt: excerpt.trim(),
            content: content.trim(),
            author: request.user?._id,
            category,
            tags: Array.isArray(tags) ? tags.map((tag)=>tag.trim().toLowerCase()) : [],
            featuredImage,
            status,
            seo: seo || {}
        });
        // If status is published, set publication date
        if (status === 'published') {
            newBlog.publishedAt = new Date();
            newBlog.isPublished = true;
        }
        await newBlog.save();
        // Populate author information for response
        await newBlog.populate('author', 'name avatar bio email');
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            message: 'Blog created successfully',
            blog: newBlog
        }, {
            status: 201
        });
    } catch (error) {
        console.error('Create blog error:', error);
        // Handle mongoose validation errors
        if (error instanceof Error && error.name === 'ValidationError') {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Validation failed',
                details: error.message
            }, {
                status: 400
            });
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Failed to create blog'
        }, {
            status: 500
        });
    }
}
const GET = getBlogsHandler;
const POST = (0, __TURBOPACK__imported__module__$5b$project$5d2f$middleware$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["requireAuth"])(createBlogHandler);
}}),

};

//# sourceMappingURL=%5Broot-of-the-server%5D__38eb3f39._.js.map