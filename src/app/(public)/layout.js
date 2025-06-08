
// app/(public)/layout.js

import '../globals.css';
import { Inter } from 'next/font/google';
import Toaster from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { Providers } from "@/store/providers";

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export const metadata = {
  title: 'BluePrint - Professional Project Management',
  description: 'Manage your projects, clients and team efficiently',
};

export default function PublicLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <Providers>
            {children}
            <Toaster />
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
