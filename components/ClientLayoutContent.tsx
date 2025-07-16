'use client';

import { useAuth } from '@/hooks/useAuth';
import Navbar from '@/components/Navbar';
import { usePathname } from 'next/navigation';
import Footer from './Footer';

interface ClientLayoutContentProps {
  children: React.ReactNode;
}

export default function ClientLayoutContent({ children }: ClientLayoutContentProps) {
  const { user, logout, loading, mounted } = useAuth();
  const pathname = usePathname();

  // Pages where navbar should be hidden
  const hideNavbarPages = ['/login', '/register', '/admin', '/admin/users', '/admin/settings', '/admin/content', '/dashboard', '/dashboard/blogs'];
  const shouldHideNavbar = hideNavbarPages.includes(pathname) || pathname.startsWith('/admin/users/');

  // Show loading state until mounted to prevent hydration mismatch
  if (!mounted || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-600"></div>
      </div>
    );
  }



  return (
    <>
      {!shouldHideNavbar && <Navbar user={user} onLogout={logout} />}
      <main className={shouldHideNavbar ? "min-h-screen" : "min-h-screen"}>
        {children}
      </main>
      {!shouldHideNavbar && <Footer />}
    </>
  );
} 