'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
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
  Mail
} from 'lucide-react';

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
  const router = useRouter();



  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('[data-dropdown="profile"]')) {
        setShowProfileMenu(false);
      }
    };

    if (showProfileMenu) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showProfileMenu]);

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
    localStorage.removeItem('accessToken');
    document.cookie = 'refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    router.push('/');
  };

  const navLinks = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/blogs', label: 'Blogs', icon: BookOpen },
    { href: '/about', label: 'About', icon: Info },
    { href: '/contact', label: 'Contact', icon: Mail },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/20 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo Section */}
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-pink-500 rounded-xl flex items-center justify-center text-white font-bold text-lg transform group-hover:scale-105 transition-all duration-300 shadow-lg group-hover:shadow-xl">
                  SB
                </div>
                <div className="absolute -inset-1 bg-gradient-to-br from-orange-500 to-pink-500 rounded-xl opacity-20 group-hover:opacity-40 transition-opacity duration-300 blur"></div>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
                सनातन Blogs
                </h1>
                <p className="text-xs text-gray-500 -mt-1">Spiritual Wisdom</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {navLinks.map((link) => {
                const IconComponent = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="group flex items-center space-x-2 px-4 py-2 rounded-xl text-gray-700 hover:text-orange-600 hover:bg-orange-50 transition-all duration-300 font-medium"
                  >
                    <IconComponent className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
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
              className="hidden sm:flex items-center space-x-2 bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white px-4 py-2 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <Heart className="h-4 w-4" />
              <span className="hidden md:inline">Donate</span>
            </Link>

            {/* User Section */}
            {user ? (
              <>
                {/* Write Blog Button - Only for logged in users */}
                <Link
                  href="/write-blog"
                  className="hidden md:flex items-center space-x-2 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <PenTool className="h-4 w-4" />
                  <span>Write</span>
                </Link>

                {/* User Profile Menu */}
                <div className="relative" data-dropdown="profile">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log('Profile button clicked, current state:', showProfileMenu);
                      setShowProfileMenu(!showProfileMenu);
                    }}
                    className={`flex items-center space-x-3 p-2 rounded-xl transition-all duration-300 group ${
                      showProfileMenu 
                        ? 'bg-orange-50 ring-2 ring-orange-500/20' 
                        : 'hover:bg-gray-100'
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
                          className="w-9 h-9 rounded-xl object-cover"
                        />
                      ) : (
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-bold shadow-lg ${
                          user.role === 'super_admin' 
                            ? 'bg-gradient-to-r from-purple-600 to-orange-600' 
                            : user.role === 'admin' 
                            ? 'bg-gradient-to-r from-blue-600 to-orange-600'
                            : 'bg-gradient-to-r from-orange-600 to-orange-700'
                        }`}>
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      
                      {/* Role Badge */}
                      {user.role === 'super_admin' && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-500 rounded-full border-2 border-white flex items-center justify-center">
                          <Crown className="h-2 w-2 text-white" />
                        </div>
                      )}
                      {user.role === 'admin' && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center">
                          <Shield className="h-2 w-2 text-white" />
                        </div>
                      )}
                      
                      {/* Online Indicator */}
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    </div>
                    
                    <div className="hidden lg:block text-left">
                      <div className="font-semibold text-gray-900 text-sm">{user.name.split(' ')[0]}</div>
                      <div className={`text-xs ${
                        user.role === 'super_admin' 
                          ? 'text-purple-600' 
                          : user.role === 'admin' 
                          ? 'text-blue-600'
                          : 'text-gray-500'
                      }`}>
                        {user.role === 'super_admin' ? 'Super Admin' : 
                         user.role === 'admin' ? 'Admin' : 'User'}
                      </div>
                    </div>
                    
                    <ChevronDown className={`h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-all duration-300 ${
                      showProfileMenu ? 'rotate-180 text-orange-500' : ''
                    }`} />
                  </button>

                  {/* Profile Dropdown */}
                  {showProfileMenu && (
                    <div 
                      className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-200 py-2 z-50 transform opacity-0 scale-95 animate-in fade-in slide-in-from-top-2 duration-200"
                      style={{ 
                        opacity: 1, 
                        transform: 'scale(1) translateY(0)' 
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      
                      {/* User Info Header */}
                      <div className="px-4 py-3 border-b border-gray-100">
                        <div className="flex items-center space-x-3">
                          <div className={`w-12 h-12 rounded-xl overflow-hidden flex items-center justify-center text-white font-bold shadow-lg ${
                            user.role === 'super_admin' 
                              ? 'bg-gradient-to-r from-purple-600 to-orange-600' 
                              : user.role === 'admin' 
                              ? 'bg-gradient-to-r from-blue-600 to-orange-600'
                              : 'bg-gradient-to-r from-orange-600 to-orange-700'
                          }`}>
                            {user.avatar ? (
                              <Image
                                src={user.avatar}
                                alt={user.name}
                                width={48}
                                height={48}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span>{user.name.charAt(0).toUpperCase()}</span>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 truncate">{user.name.split(' ')[0]}</h3>
                            <p className="text-sm text-gray-500 truncate">{user.email}</p>
                            <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full mt-1 ${
                              user.role === 'super_admin' 
                                ? 'bg-purple-100 text-purple-800' 
                                : user.role === 'admin' 
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {user.role === 'super_admin' ? '👑 Super Admin' : 
                               user.role === 'admin' ? '🛡️ Admin' : '👤 User'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="py-2">
                        <Link
                          href="/dashboard"
                          className="group flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-all duration-200"
                          onClick={() => setShowProfileMenu(false)}
                        >
                          <div className="w-8 h-8 bg-gray-100 group-hover:bg-orange-100 rounded-lg flex items-center justify-center mr-3 transition-colors">
                            <User className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-medium">Profile</p>
                            <p className="text-xs text-gray-500">Manage your account</p>
                          </div>
                        </Link>

                        <Link
                          href="/dashboard/blogs"
                          className="group flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-all duration-200"
                          onClick={() => setShowProfileMenu(false)}
                        >
                          <div className="w-8 h-8 bg-gray-100 group-hover:bg-orange-100 rounded-lg flex items-center justify-center mr-3 transition-colors">
                            <BookOpen className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-medium">My Blogs</p>
                            <p className="text-xs text-gray-500">View your articles</p>
                          </div>
                        </Link>

                        <Link
                          href="/write-blog"
                          className="group flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-all duration-200"
                          onClick={() => setShowProfileMenu(false)}
                        >
                          <div className="w-8 h-8 bg-gray-100 group-hover:bg-orange-100 rounded-lg flex items-center justify-center mr-3 transition-colors">
                            <PenTool className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-medium">Write Blog</p>
                            <p className="text-xs text-gray-500">Create new content</p>
                          </div>
                        </Link>

                        {/* Admin Links */}
                        {(user.role === 'admin' || user.role === 'super_admin') && (
                          <>
                            <div className="border-t border-gray-100 my-2"></div>
                            <Link
                              href="/admin"
                              className="group flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200"
                              onClick={() => setShowProfileMenu(false)}
                            >
                              <div className="w-8 h-8 bg-blue-100 group-hover:bg-blue-200 rounded-lg flex items-center justify-center mr-3 transition-colors">
                                <BarChart3 className="h-4 w-4" />
                              </div>
                              <div>
                                <p className="font-medium">Admin Dashboard</p>
                                <p className="text-xs text-gray-500">Overview & analytics</p>
                              </div>
                            </Link>
                            <Link
                              href="/admin/users"
                              className="group flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200"
                              onClick={() => setShowProfileMenu(false)}
                            >
                              <div className="w-8 h-8 bg-blue-100 group-hover:bg-blue-200 rounded-lg flex items-center justify-center mr-3 transition-colors">
                                <Users className="h-4 w-4" />
                              </div>
                              <div>
                                <p className="font-medium">Manage Users</p>
                                <p className="text-xs text-gray-500">User management</p>
                              </div>
                            </Link>
                          </>
                        )}

                        {user.role === 'super_admin' && (
                          <Link
                            href="/admin/settings"
                            className="group flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-all duration-200"
                            onClick={() => setShowProfileMenu(false)}
                          >
                            <div className="w-8 h-8 bg-purple-100 group-hover:bg-purple-200 rounded-lg flex items-center justify-center mr-3 transition-colors">
                              <Settings className="h-4 w-4" />
                            </div>
                            <div>
                              <p className="font-medium">Site Settings</p>
                              <p className="text-xs text-gray-500">Super admin only</p>
                            </div>
                          </Link>
                        )}
                      </div>

                      {/* Logout Section */}
                      <div className="border-t border-gray-100 mt-2 pt-2">
                        <button
                          onClick={() => {
                            handleLogout();
                            setShowProfileMenu(false);
                          }}
                          className="group w-full flex items-center px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-all duration-200"
                        >
                          <div className="w-8 h-8 bg-red-100 group-hover:bg-red-200 rounded-lg flex items-center justify-center mr-3 transition-colors">
                            <LogOut className="h-4 w-4" />
                          </div>
                          <div className="text-left">
                            <p className="font-medium">Logout</p>
                            <p className="text-xs text-gray-500">Sign out of your account</p>
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
                  className="px-4 py-2 text-gray-700 hover:text-orange-600 font-medium transition-colors duration-300"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition-all duration-300"
              aria-label="Toggle mobile menu"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={`lg:hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
        }`}>
          <div className="py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-2">
              
              {/* Mobile Navigation Links */}
              {navLinks.map((link) => {
                const IconComponent = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all duration-300 font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    <IconComponent className="h-5 w-5" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}

              {/* Mobile Action Buttons */}
              <div className="pt-4 space-y-3">
                <Link
                  href="/donate"
                  className="flex items-center justify-center space-x-2 bg-gradient-to-r from-pink-500 to-red-500 text-white px-4 py-3 rounded-xl font-semibold"
                  onClick={() => setIsOpen(false)}
                >
                  <Heart className="h-5 w-5" />
                  <span>Support Our Work</span>
                </Link>

                {user && (
                  <Link
                    href="/write-blog"
                    className="flex items-center justify-center space-x-2 bg-orange-600 text-white px-4 py-3 rounded-xl font-semibold"
                    onClick={() => setIsOpen(false)}
                  >
                    <PenTool className="h-5 w-5" />
                    <span>Write Blog</span>
                  </Link>
                )}
              </div>

                            {/* Mobile Admin Section */}
              {user && (user.role === 'admin' || user.role === 'super_admin') && (
                <div className="pt-4 border-t border-gray-200">
                  <div className="space-y-1">
                    <Link
                      href="/admin/users"
                      className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
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