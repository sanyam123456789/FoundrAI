import React from 'react';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import { ClerkProvider } from '@clerk/nextjs';

export const metadata = {
  title: 'FoundrAI - AI Founder Assistant SaaS',
  description: 'Connect Gmail, Calendar, and GitHub using MCP servers to coordinate startup tasks.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" className="dark" style={{ colorScheme: 'dark' }}>
        <body className="antialiased min-h-screen font-sans bg-background text-foreground">
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
