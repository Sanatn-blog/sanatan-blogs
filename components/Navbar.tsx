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
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('[data-dropdown="profile"]')) {
        setShowProfileMenu(false);
      }
    };

    if (showProfileMenu) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [showProfileMenu]);

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
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-gray-900">सनातन Blogs</h1>
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
          <div className="flex items-center space-x-3">
            {/* Donate Button */}
            <Link
              href="/donate"
              className="hidden sm:flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors"
            >
              <Heart className="h-4 w-4" />
              <span className="hidden md:inline">Donate</span>
            </Link>

            {/* User Section */}
            {user ? (
              <>
                {/* Notifications Button */}
                <button
                  className="hidden md:flex relative p-2 rounded-lg hover:bg-gray-100 text-gray-700 transition-colors"
                  aria-label="Notifications"
                >
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

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
              <div className="flex items-center space-x-3">
                <Link
                  href="/login"
                  className="px-4 py-2 text-gray-700 hover:text-orange-600 font-medium text-sm transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium text-sm transition-colors"
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

              {/* Mobile Action Buttons */}
              <div className="pt-3 space-y-2">
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
