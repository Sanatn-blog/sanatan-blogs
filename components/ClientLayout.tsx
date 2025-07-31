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
          position="top-center"
          toastOptions={{
            duration: 4000,
            style: {
              background: 'linear-gradient(135deg, #1f2937 0%, #374151 100%)',
              color: '#ffffff',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '16px',
              padding: '16px 20px',
              fontSize: '14px',
              fontWeight: '500',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.1)',
              backdropFilter: 'blur(10px)',
              marginTop: '100px', // Position below navbar
              maxWidth: '420px',
              minWidth: '300px',
            },
            success: {
              style: {
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '16px',
                padding: '16px 20px',
                fontSize: '14px',
                fontWeight: '600',
                boxShadow: '0 20px 25px -5px rgba(16, 185, 129, 0.4), 0 10px 10px -5px rgba(16, 185, 129, 0.2)',
                backdropFilter: 'blur(10px)',
                marginTop: '100px',
                maxWidth: '420px',
                minWidth: '300px',
              },
            },
            error: {
              style: {
                background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '16px',
                padding: '16px 20px',
                fontSize: '14px',
                fontWeight: '600',
                boxShadow: '0 20px 25px -5px rgba(239, 68, 68, 0.4), 0 10px 10px -5px rgba(239, 68, 68, 0.2)',
                backdropFilter: 'blur(10px)',
                marginTop: '100px',
                maxWidth: '420px',
                minWidth: '300px',
              },
            },
          }}
        />
      </ThemeProvider>
    </AuthProvider>
  );
} 