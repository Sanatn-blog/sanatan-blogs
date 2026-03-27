"use client";

import { AuthProvider } from "@/hooks/useAuth";
import { ThemeProvider } from "@/hooks/useTheme";
import { Toaster } from "react-hot-toast";
import ClientLayoutContent from "./ClientLayoutContent";

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <AuthProvider>
      <ThemeProvider>
        <ClientLayoutContent>{children}</ClientLayoutContent>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#ffffff",
              color: "#1f2937",
              border: "1px solid #e5e7eb",
              borderRadius: "12px",
              padding: "16px 20px",
              fontSize: "14px",
              fontWeight: "500",
              boxShadow:
                "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
              maxWidth: "380px",
              minWidth: "320px",
            },
            success: {
              style: {
                background: "#ffffff",
                color: "#065f46",
                border: "1px solid #10b981",
                borderLeft: "4px solid #10b981",
                borderRadius: "12px",
                padding: "16px 20px",
                fontSize: "14px",
                fontWeight: "600",
                boxShadow:
                  "0 10px 15px -3px rgba(16, 185, 129, 0.2), 0 4px 6px -2px rgba(16, 185, 129, 0.1)",
                maxWidth: "380px",
                minWidth: "320px",
              },
              iconTheme: {
                primary: "#10b981",
                secondary: "#ffffff",
              },
            },
            error: {
              style: {
                background: "#ffffff",
                color: "#991b1b",
                border: "1px solid #ef4444",
                borderLeft: "4px solid #ef4444",
                borderRadius: "12px",
                padding: "16px 20px",
                fontSize: "14px",
                fontWeight: "600",
                boxShadow:
                  "0 10px 15px -3px rgba(239, 68, 68, 0.2), 0 4px 6px -2px rgba(239, 68, 68, 0.1)",
                maxWidth: "380px",
                minWidth: "320px",
              },
              iconTheme: {
                primary: "#ef4444",
                secondary: "#ffffff",
              },
            },
          }}
        />
      </ThemeProvider>
    </AuthProvider>
  );
}
