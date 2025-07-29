# Like Functionality Implementation

## Overview
This document describes the like functionality implemented for blog posts in the Sanatan Blogs application.

## Features

### 1. User Authentication Required
- Users must be logged in to like/unlike posts
- Non-logged-in users see "(Login)" indicator on like buttons
- Clicking like button redirects to login page for non-authenticated users

### 2. Unique Likes Per User
- Each user can only like a post once
- Users cannot like the same post multiple times
- Users can unlike posts they previously liked

### 3. Real-time Updates
- Like count updates immediately when user likes/unlikes
- Like status is visually indicated (filled heart for liked, outline for not liked)
- Changes persist across page refreshes

### 4. Visual Indicators
- **Liked posts**: Red filled heart icon
- **Not liked posts**: Gray outline heart icon
- **Like count**: Shows total number of likes
- **Login prompt**: Shows "(Login)" for non-authenticated users

## API Endpoints

### POST `/api/blogs/[id]/like`
- **Purpose**: Like or unlike a blog post
- **Authentication**: Required (Bearer token)
- **Request**: No body required
- **Response**:
  ```json
  {
    "message": "Blog liked/unliked successfully",
    "liked": true/false,
    "likesCount": number
  }
  ```

### GET `/api/blogs/[id]/like`
- **Purpose**: Get like status for a blog post
- **Authentication**: Optional
- **Response**:
  ```json
  {
    "liked": true/false,
    "likesCount": number,
    "totalLikes": number
  }
  ```

## Database Schema

### Blog Model
The `likes` field in the Blog model stores an array of user ObjectIds:
```typescript
likes: {
  type: [Schema.Types.ObjectId],
  ref: 'User',
  default: []
}
```

## Frontend Implementation

### Blog Detail Page (`/blogs/[id]`)
- Like button in social actions section
- Shows current like status
- Updates like count in real-time
- Handles authentication redirects

### Blog Listing Page (`/blogs`)
- Like buttons on each blog card
- Shows like count for each post
- Updates like status across all cards
- Handles authentication redirects

## Security Features

1. **Authentication Required**: All like operations require valid JWT token
2. **Duplicate Prevention**: Uses `$addToSet` to prevent duplicate likes
3. **Proper Authorization**: Only authenticated users can like posts
4. **Error Handling**: Graceful error handling with user feedback

## User Experience

### For Logged-in Users
- Click heart icon to like/unlike
- Visual feedback with filled/outline heart
- Real-time count updates
- Smooth animations and transitions

### For Non-logged-in Users
- See "(Login)" indicator on like buttons
- Clicking redirects to login page
- Clear indication that login is required

## Error Handling

1. **401 Unauthorized**: Redirects to login page
2. **404 Not Found**: Shows error message for non-existent blogs
3. **403 Forbidden**: Shows error for unpublished blogs
4. **500 Server Error**: Shows generic error message

## Performance Considerations

1. **Efficient Queries**: Uses MongoDB's `$addToSet` and `$pull` operators
2. **Optimistic Updates**: UI updates immediately, API call in background
3. **Minimal Data Transfer**: Only necessary fields are selected from database
4. **Caching**: Like status is cached in frontend state

## Testing

To test the like functionality:

1. **Without Login**:
   - Visit any blog post
   - Click like button
   - Should redirect to login page

2. **With Login**:
   - Login to the application
   - Visit a blog post
   - Click like button
   - Heart should fill and count should increase
   - Click again to unlike
   - Heart should unfill and count should decrease

3. **Persistence**:
   - Like a post
   - Refresh the page
   - Like status should remain
   - Visit other pages and return
   - Like status should persist

## Future Enhancements

1. **Like Notifications**: Notify authors when their posts are liked
2. **Like Analytics**: Track like patterns and popular content
3. **Like History**: Show user's liked posts in profile
4. **Like Sharing**: Share liked posts on social media
5. **Like Categories**: Different types of reactions (like, love, helpful, etc.) 