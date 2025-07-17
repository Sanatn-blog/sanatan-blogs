'use client';

import { AuthProvider } from '@/hooks/useAuth';
import { ThemeProvider } from '@/hooks/useTheme';
import { Toaster } from 'react-hot-toast';
import ClientLayoutContent from './ClientLayoutContent';

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <AuthProvider>
      <ThemeProvider>
        <ClientLayoutContent>
          {children}
        </ClientLayoutContent>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
              marginTop: '80px', // Add margin to position below navbar
            },
            success: {
              style: {
                background: '#22c55e',
                marginTop: '80px', // Add margin to position below navbar
              },
            },
            error: {
              style: {
                background: '#ef4444',
                marginTop: '80px', // Add margin to position below navbar
              },
            },
          }}
        />
      </ThemeProvider>
    </AuthProvider>
  );
} 