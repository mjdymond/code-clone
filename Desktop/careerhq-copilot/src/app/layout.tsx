import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Navigation } from '@/components/common/Navigation';
import { StateProvider } from '@/lib/StateProvider';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { ClientLayout } from '@/components/common/ClientLayout';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'CareerHQ Copilot',
  description: 'CareerHQ Agent System with CopilotKit Integration',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ErrorBoundary>
          <StateProvider>
            <ClientLayout>
              <div className="min-h-screen flex flex-col">
                <Navigation />
                <main className="flex-grow bg-gray-50">
                  {children}
                </main>
              </div>
            </ClientLayout>
          </StateProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
