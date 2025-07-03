'use client';

import { useAuth } from '@/hooks/useAuth';
import { ThemeProvider } from '@/hooks/useTheme';
import Navbar from '@/components/Navbar';
import { Toaster } from 'react-hot-toast';
import { usePathname } from 'next/navigation';
import Footer from './Footer';

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const { user, logout, loading } = useAuth();
  const pathname = usePathname();

  // Pages where navbar should be hidden
  const hideNavbarPages = ['/login', '/register', '/admin', '/admin/users', '/admin/settings', '/admin/content', '/dashboard', '/dashboard/blogs'];
  const shouldHideNavbar = hideNavbarPages.includes(pathname);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <ThemeProvider>
      {!shouldHideNavbar && <Navbar user={user} onLogout={logout} />}
      <main className={shouldHideNavbar ? "min-h-screen" : "min-h-screen"}>
        {children}
      </main>
      {!shouldHideNavbar && <Footer />}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            style: {
              background: '#22c55e',
            },
          },
          error: {
            style: {
              background: '#ef4444',
            },
          },
        }}
      />
    </ThemeProvider>
  );
} 