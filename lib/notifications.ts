import Notification from "@/models/Notification";
import User from "@/models/User";
import Blog from "@/models/Blog";
import mongoose from "mongoose";

interface NotificationData {
  recipientId: string;
  senderId?: string;
  type:
    | "comment"
    | "like"
    | "follow"
    | "blog_published"
    | "blog_approved"
    | "system"
    | "reply";
  title: string;
  message: string;
  link?: string;
  blogId?: string;
  commentId?: string;
}

export async function createNotification(data: NotificationData) {
  try {
    const notification = await Notification.create({
      recipient: data.recipientId,
      sender: data.senderId || null,
      type: data.type,
      title: data.title,
      message: data.message,
      read: false,
      link: data.link,
      blog: data.blogId || null,
      comment: data.commentId || null,
    });

    return notification;
  } catch (error) {
    console.error("Error creating notification:", error);
    throw error;
  }
}

export async function createCommentNotification(
  blogId: string,
  commentAuthorId: string,
  commentContent: string,
) {
  try {
    const blog = await Blog.findById(blogId).populate("author", "name _id");
    if (!blog || !blog.author) return;

    // Don't notify if the comment author is the blog author
    if (blog.author._id.toString() === commentAuthorId) return;

    const commentAuthor = await User.findById(commentAuthorId).select("name");
    if (!commentAuthor) return;

    await createNotification({
      recipientId: blog.author._id.toString(),
      senderId: commentAuthorId,
      type: "comment",
      title: "New Comment",
      message: `${commentAuthor.name} commented on your blog post "${blog.title}"`,
      link: `/blogs/${blog.slug}`,
      blogId: blog._id.toString(),
    });
  } catch (error) {
    console.error("Error creating comment notification:", error);
  }
}

export async function createLikeNotification(blogId: string, likerId: string) {
  try {
    const blog = await Blog.findById(blogId).populate("author", "name _id");
    if (!blog || !blog.author) return;

    // Don't notify if the liker is the blog author
    if (blog.author._id.toString() === likerId) return;

    const liker = await User.findById(likerId).select("name");
    if (!liker) return;

    await createNotification({
      recipientId: blog.author._id.toString(),
      senderId: likerId,
      type: "like",
      title: "New Like",
      message: `${liker.name} liked your article "${blog.title}"`,
      link: `/blogs/${blog.slug}`,
      blogId: blog._id.toString(),
    });
  } catch (error) {
    console.error("Error creating like notification:", error);
  }
}

export async function createFollowNotification(
  followedUserId: string,
  followerId: string,
) {
  try {
    const follower = await User.findById(followerId).select("name");
    if (!follower) return;

    await createNotification({
      recipientId: followedUserId,
      senderId: followerId,
      type: "follow",
      title: "New Follower",
      message: `${follower.name} started following you`,
      link: `/profile/${follower._id}`,
    });
  } catch (error) {
    console.error("Error creating follow notification:", error);
  }
}

export async function createBlogPublishedNotification(
  blogId: string,
  authorId: string,
) {
  try {
    const blog = await Blog.findById(blogId).select("title slug");
    if (!blog) return;

    await createNotification({
      recipientId: authorId,
      type: "blog_published",
      title: "Blog Published",
      message: `Your blog post "${blog.title}" has been published successfully`,
      link: `/blogs/${blog.slug}`,
      blogId: blog._id.toString(),
    });
  } catch (error) {
    console.error("Error creating blog published notification:", error);
  }
}

export async function createBlogApprovedNotification(
  blogId: string,
  authorId: string,
) {
  try {
    const blog = await Blog.findById(blogId).select("title slug");
    if (!blog) return;

    await createNotification({
      recipientId: authorId,
      type: "blog_approved",
      title: "Blog Approved",
      message: `Your blog post "${blog.title}" has been approved by admin`,
      link: `/blogs/${blog.slug}`,
      blogId: blog._id.toString(),
    });
  } catch (error) {
    console.error("Error creating blog approved notification:", error);
  }
}

export async function createReplyNotification(
  commentId: string,
  replyAuthorId: string,
  replyContent: string,
) {
  try {
    const Comment = (await import("@/models/Comment")).default;
    const comment = await Comment.findById(commentId)
      .populate("author", "name _id")
      .populate("blog", "title slug");

    if (!comment || !comment.author || !comment.blog) return;

    // Don't notify if the reply author is the comment author
    if (comment.author._id.toString() === replyAuthorId) return;

    const replyAuthor = await User.findById(replyAuthorId).select("name");
    if (!replyAuthor) return;

    await createNotification({
      recipientId: comment.author._id.toString(),
      senderId: replyAuthorId,
      type: "reply",
      title: "New Reply",
      message: `${replyAuthor.name} replied to your comment`,
      link: `/blogs/${comment.blog.slug}#comment-${commentId}`,
      commentId: comment._id.toString(),
    });
  } catch (error) {
    console.error("Error creating reply notification:", error);
  }
}

export async function getUnreadNotificationCount(userId: string) {
  try {
    const count = await Notification.countDocuments({
      recipient: userId,
      read: false,
    });
    return count;
  } catch (error) {
    console.error("Error getting unread notification count:", error);
    return 0;
  }
}
