"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import {
  Menu,
  X,
  User,
  LogOut,
  PenTool,
  Users,
  Heart,
  Settings,
  ChevronDown,
  BookOpen,
  Home,
  Info,
  Crown,
  Shield,
  BarChart3,
  Mail,
  BookmarkPlus,
  Bell,
  MessageCircle,
} from "lucide-react";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  avatar?: string;
}

interface NavbarProps {
  user: User | null;
  onLogout?: () => void;
}

export default function Navbar({ user, onLogout }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch notifications when user is logged in
  useEffect(() => {
    if (user) {
      fetchNotifications();
      // Poll for new notifications every 30 seconds
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const fetchNotifications = async () => {
    if (!user) return;

    try {
      setLoadingNotifications(true);
      const token = localStorage.getItem("accessToken");
      const response = await fetch("/api/notifications?limit=5", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoadingNotifications(false);
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch("/api/notifications", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ markAll: true }),
      });

      if (response.ok) {
        const data = await response.json();
        setUnreadCount(data.unreadCount || 0);
        // Update local state to mark all as read
        setNotifications(notifications.map((n) => ({ ...n, read: true })));
      }
    } catch (error) {
      console.error("Error marking notifications as read:", error);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch("/api/notifications", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ notificationIds: [notificationId] }),
      });

      if (response.ok) {
        const data = await response.json();
        setUnreadCount(data.unreadCount || 0);
        // Update local state
        setNotifications(
          notifications.map((n) =>
            n._id === notificationId ? { ...n, read: true } : n,
          ),
        );
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return "just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "comment":
      case "reply":
        return MessageCircle;
      case "like":
        return Heart;
      case "follow":
        return Users;
      case "blog_published":
      case "blog_approved":
        return BookOpen;
      default:
        return Bell;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "comment":
      case "reply":
        return "bg-blue-100 text-blue-600";
      case "like":
        return "bg-green-100 text-green-600";
      case "follow":
        return "bg-orange-100 text-orange-600";
      case "blog_published":
      case "blog_approved":
        return "bg-purple-100 text-purple-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('[data-dropdown="profile"]')) {
        setShowProfileMenu(false);
      }
      if (!target.closest('[data-dropdown="notifications"]')) {
        setShowNotifications(false);
      }
    };

    if (showProfileMenu || showNotifications) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [showProfileMenu, showNotifications]);

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
    localStorage.removeItem("accessToken");
    document.cookie =
      "refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    router.push("/");
  };

  const navLinks = [
    { href: "/", label: "Home", icon: Home },
    { href: "/blogs", label: "Blogs", icon: BookOpen },
    { href: "/about", label: "About", icon: Info },
    { href: "/contact", label: "Contact", icon: Mail },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-200 ${
        scrolled
          ? "bg-white shadow-md border-b border-gray-200"
          : "bg-white border-b border-gray-100"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <div className="flex items-center space-x-4 sm:space-x-8">
            <Link
              href="/"
              className="flex items-center space-x-2 sm:space-x-3 group"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-orange-600 rounded-lg flex items-center justify-center">
                <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg sm:text-xl font-bold text-gray-900">
                  सनातन Blogs
                </h1>
                <p className="text-xs text-gray-600 -mt-1">Spiritual Wisdom</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {navLinks.map((link) => {
                const IconComponent = link.icon;
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                      active
                        ? "text-orange-600 bg-orange-50"
                        : "text-gray-700 hover:text-orange-600 hover:bg-gray-50"
                    }`}
                  >
                    <IconComponent className="h-4 w-4" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Donate Button */}
            <Link
              href="/donate"
              className="hidden sm:flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-3 sm:px-4 py-2 rounded-lg font-medium text-sm transition-colors"
            >
              <Heart className="h-4 w-4" />
              <span className="hidden md:inline">Donate</span>
            </Link>

            {/* User Section */}
            {user ? (
              <>
                {/* Notifications Dropdown */}
                <div className="relative" data-dropdown="notifications">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowNotifications(!showNotifications);
                    }}
                    className={`hidden md:flex relative p-2 rounded-lg transition-colors ${
                      showNotifications ? "bg-gray-100" : "hover:bg-gray-100"
                    } text-gray-700`}
                    aria-label="Notifications"
                    aria-expanded={showNotifications}
                    aria-haspopup="true"
                  >
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                    )}
                  </button>

                  {/* Notifications Dropdown Menu */}
                  {showNotifications && (
                    <div
                      className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-[60]"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {/* Header */}
                      <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900">
                          Notifications
                        </h3>
                        {unreadCount > 0 && (
                          <button
                            onClick={markAllAsRead}
                            className="text-xs text-orange-600 hover:text-orange-700 font-medium"
                          >
                            Mark all as read
                          </button>
                        )}
                      </div>

                      {/* Notifications List */}
                      <div className="max-h-96 overflow-y-auto">
                        {loadingNotifications ? (
                          <div className="px-4 py-12 text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
                            <p className="text-sm text-gray-500 mt-2">
                              Loading...
                            </p>
                          </div>
                        ) : notifications.length === 0 ? (
                          <div className="px-4 py-12 text-center">
                            <Bell className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-sm text-gray-500">
                              No notifications yet
                            </p>
                          </div>
                        ) : (
                          notifications.map((notification) => {
                            const IconComponent = getNotificationIcon(
                              notification.type,
                            );
                            return (
                              <div
                                key={notification._id}
                                className={`px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 cursor-pointer ${
                                  !notification.read ? "bg-orange-50/30" : ""
                                }`}
                                onClick={() => {
                                  if (!notification.read) {
                                    markAsRead(notification._id);
                                  }
                                  if (notification.link) {
                                    router.push(notification.link);
                                    setShowNotifications(false);
                                  }
                                }}
                              >
                                <div className="flex items-start space-x-3">
                                  <div
                                    className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${getNotificationColor(
                                      notification.type,
                                    )}`}
                                  >
                                    <IconComponent className="h-5 w-5" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm text-gray-900">
                                      {notification.message}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                      {getTimeAgo(notification.createdAt)}
                                    </p>
                                  </div>
                                  {!notification.read && (
                                    <div className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0 mt-2"></div>
                                  )}
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>

                      {/* Footer */}
                      <div className="px-4 py-3 border-t border-gray-200">
                        <Link
                          href="/dashboard/notifications"
                          className="block text-center text-sm text-orange-600 hover:text-orange-700 font-medium"
                          onClick={() => setShowNotifications(false)}
                        >
                          View all notifications
                        </Link>
                      </div>
                    </div>
                  )}
                </div>

                {/* Write Blog Button - Only for logged in users */}
                <Link
                  href="/write-blog"
                  className="hidden md:flex items-center space-x-2 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors"
                >
                  <PenTool className="h-4 w-4" />
                  <span>Write</span>
                </Link>

                {/* User Profile Menu */}
                <div className="relative" data-dropdown="profile">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log(
                        "Profile button clicked, current state:",
                        showProfileMenu,
                      );
                      setShowProfileMenu(!showProfileMenu);
                    }}
                    className={`flex items-center space-x-2 p-1.5 rounded-lg transition-colors ${
                      showProfileMenu ? "bg-gray-100" : "hover:bg-gray-100"
                    }`}
                    aria-expanded={showProfileMenu}
                    aria-haspopup="true"
                  >
                    <div className="relative">
                      {user.avatar ? (
                        <Image
                          src={user.avatar}
                          alt={user.name}
                          width={36}
                          height={36}
                          className="w-9 h-9 rounded-lg object-cover"
                        />
                      ) : (
                        <div
                          className={`w-9 h-9 rounded-lg flex items-center justify-center text-white text-sm font-semibold ${
                            user.role === "super_admin"
                              ? "bg-purple-600"
                              : user.role === "admin"
                                ? "bg-blue-600"
                                : "bg-orange-600"
                          }`}
                        >
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                      )}

                      {/* Role Badge */}
                      {user.role === "super_admin" && (
                        <div className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-purple-600 rounded-full border-2 border-white flex items-center justify-center">
                          <Crown className="h-2 w-2 text-white" />
                        </div>
                      )}
                      {user.role === "admin" && (
                        <div className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-blue-600 rounded-full border-2 border-white flex items-center justify-center">
                          <Shield className="h-2 w-2 text-white" />
                        </div>
                      )}

                      {/* Online Indicator */}
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    </div>

                    <div className="hidden lg:block text-left">
                      <div className="font-semibold text-gray-900 text-sm">
                        {user.name.split(" ")[0]}
                      </div>
                      <div className="text-xs text-gray-500">
                        {user.role === "super_admin"
                          ? "Super Admin"
                          : user.role === "admin"
                            ? "Admin"
                            : "Member"}
                      </div>
                    </div>

                    <ChevronDown
                      className={`h-4 w-4 text-gray-400 transition-transform ${
                        showProfileMenu ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Profile Dropdown */}
                  {showProfileMenu && (
                    <div
                      className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-[60]"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {/* User Info Header */}
                      <div className="px-4 py-3 border-b border-gray-100">
                        <div className="flex items-center space-x-3">
                          <div className="relative">
                            <div
                              className={`w-12 h-12 rounded-lg flex items-center justify-center text-white font-semibold ${
                                user.role === "super_admin"
                                  ? "bg-purple-600"
                                  : user.role === "admin"
                                    ? "bg-blue-600"
                                    : "bg-orange-600"
                              }`}
                            >
                              {user.avatar ? (
                                <Image
                                  src={user.avatar}
                                  alt={user.name}
                                  width={48}
                                  height={48}
                                  className="w-full h-full object-cover rounded-lg"
                                />
                              ) : (
                                <span className="text-lg">
                                  {user.name.charAt(0).toUpperCase()}
                                </span>
                              )}
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white"></div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 truncate">
                              {user.name}
                            </h3>
                            <p className="text-xs text-gray-600 truncate">
                              {user.email}
                            </p>
                            <span
                              className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded mt-1 ${
                                user.role === "super_admin"
                                  ? "bg-purple-100 text-purple-700"
                                  : user.role === "admin"
                                    ? "bg-blue-100 text-blue-700"
                                    : "bg-gray-100 text-gray-700"
                              }`}
                            >
                              {user.role === "super_admin" ? (
                                <>
                                  <Crown className="h-3 w-3 inline mr-1" />
                                  Super Admin
                                </>
                              ) : user.role === "admin" ? (
                                <>
                                  <Shield className="h-3 w-3 inline mr-1" />
                                  Admin
                                </>
                              ) : (
                                <>
                                  <User className="h-3 w-3 inline mr-1" />
                                  Member
                                </>
                              )}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="py-1">
                        <Link
                          href="/dashboard"
                          className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          onClick={() => setShowProfileMenu(false)}
                        >
                          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                            <User className="h-4 w-4 text-gray-600" />
                          </div>
                          <div>
                            <p className="font-medium">Profile</p>
                            <p className="text-xs text-gray-500">
                              Manage your account
                            </p>
                          </div>
                        </Link>

                        <Link
                          href="/dashboard/blogs"
                          className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          onClick={() => setShowProfileMenu(false)}
                        >
                          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                            <BookOpen className="h-4 w-4 text-gray-600" />
                          </div>
                          <div>
                            <p className="font-medium">My Blogs</p>
                            <p className="text-xs text-gray-500">
                              View your articles
                            </p>
                          </div>
                        </Link>

                        <Link
                          href="/dashboard/bookmarks"
                          className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          onClick={() => setShowProfileMenu(false)}
                        >
                          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                            <BookmarkPlus className="h-4 w-4 text-gray-600" />
                          </div>
                          <div>
                            <p className="font-medium">My Bookmarks</p>
                            <p className="text-xs text-gray-500">
                              Saved articles
                            </p>
                          </div>
                        </Link>

                        <Link
                          href="/write-blog"
                          className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          onClick={() => setShowProfileMenu(false)}
                        >
                          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                            <PenTool className="h-4 w-4 text-gray-600" />
                          </div>
                          <div>
                            <p className="font-medium">Write Blog</p>
                            <p className="text-xs text-gray-500">
                              Create new content
                            </p>
                          </div>
                        </Link>

                        {/* Admin Links */}
                        {(user.role === "admin" ||
                          user.role === "super_admin") && (
                          <>
                            <div className="border-t border-gray-100 my-1"></div>
                            <Link
                              href="/admin"
                              className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                              onClick={() => setShowProfileMenu(false)}
                            >
                              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                                <BarChart3 className="h-4 w-4 text-blue-600" />
                              </div>
                              <div>
                                <p className="font-medium">Admin Dashboard</p>
                                <p className="text-xs text-gray-500">
                                  Overview & analytics
                                </p>
                              </div>
                            </Link>
                            <Link
                              href="/admin/users"
                              className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                              onClick={() => setShowProfileMenu(false)}
                            >
                              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                                <Users className="h-4 w-4 text-blue-600" />
                              </div>
                              <div>
                                <p className="font-medium">Manage Users</p>
                                <p className="text-xs text-gray-500">
                                  User management
                                </p>
                              </div>
                            </Link>
                          </>
                        )}

                        {user.role === "super_admin" && (
                          <Link
                            href="/admin/settings"
                            className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            onClick={() => setShowProfileMenu(false)}
                          >
                            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                              <Settings className="h-4 w-4 text-purple-600" />
                            </div>
                            <div>
                              <p className="font-medium">Site Settings</p>
                              <p className="text-xs text-gray-500">
                                Super admin only
                              </p>
                            </div>
                          </Link>
                        )}
                      </div>

                      {/* Logout Section */}
                      <div className="border-t border-gray-100 pt-1">
                        <button
                          onClick={() => {
                            handleLogout();
                            setShowProfileMenu(false);
                          }}
                          className="w-full flex items-center px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                            <LogOut className="h-4 w-4 text-red-600" />
                          </div>
                          <div className="text-left">
                            <p className="font-medium">Logout</p>
                            <p className="text-xs text-gray-500">
                              Sign out of your account
                            </p>
                          </div>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="hidden sm:flex items-center space-x-2 sm:space-x-3">
                <Link
                  href="/login"
                  className="px-3 sm:px-4 py-2 text-gray-700 hover:text-orange-600 font-medium text-sm transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-3 sm:px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium text-sm transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-700 transition-colors"
              aria-label="Toggle mobile menu"
            >
              {isOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`lg:hidden transition-all duration-200 ${
            isOpen
              ? "max-h-screen opacity-100"
              : "max-h-0 opacity-0 overflow-hidden"
          }`}
        >
          <div className="py-3 border-t border-gray-200">
            <div className="flex flex-col space-y-1">
              {/* Mobile Navigation Links */}
              {navLinks.map((link) => {
                const IconComponent = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center space-x-3 px-4 py-2.5 text-gray-700 hover:text-orange-600 hover:bg-gray-50 rounded-lg transition-colors font-medium text-sm"
                    onClick={() => setIsOpen(false)}
                  >
                    <IconComponent className="h-5 w-5" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}

              {/* Mobile Login/Signup for non-logged in users */}
              {!user && (
                <div className="pt-3 space-y-2 border-t border-gray-200">
                  <Link
                    href="/login"
                    className="flex items-center justify-center space-x-2 bg-white border-2 border-orange-600 text-orange-600 hover:bg-orange-50 px-4 py-2.5 rounded-lg font-medium text-sm transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <User className="h-5 w-5" />
                    <span>Login</span>
                  </Link>
                  <Link
                    href="/register"
                    className="flex items-center justify-center space-x-2 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2.5 rounded-lg font-medium text-sm transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <User className="h-5 w-5" />
                    <span>Sign Up</span>
                  </Link>
                </div>
              )}

              {/* Mobile Action Buttons */}
              <div className="pt-3 space-y-2 border-t border-gray-200">
                <Link
                  href="/donate"
                  className="flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-lg font-medium text-sm transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <Heart className="h-5 w-5" />
                  <span>Support Our Work</span>
                </Link>

                {user && (
                  <Link
                    href="/write-blog"
                    className="flex items-center justify-center space-x-2 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2.5 rounded-lg font-medium text-sm transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <PenTool className="h-5 w-5" />
                    <span>Write Blog</span>
                  </Link>
                )}
              </div>

              {/* Mobile Admin Section */}
              {user &&
                (user.role === "admin" || user.role === "super_admin") && (
                  <div className="pt-3 border-t border-gray-200">
                    <div className="space-y-1">
                      <Link
                        href="/admin/users"
                        className="flex items-center space-x-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors text-sm"
                        onClick={() => setIsOpen(false)}
                      >
                        <Users className="h-5 w-5" />
                        <span>Manage Users</span>
                      </Link>
                    </div>
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
