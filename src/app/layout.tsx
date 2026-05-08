import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/src/contexts/AuthContext";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SP Costelão | Dashboard de Estoque",
  description: "Gerenciamento estratégico de retaguarda - SP Costelão",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          {children}
          <Toaster 
            position="top-right" 
            toastOptions={{
              className: 'rounded-xl font-bold bg-slate-900 text-white shadow-xl px-4 py-3',
              success: { style: { background: '#10b981', color: 'white' }, iconTheme: { primary: '#fff', secondary: '#10b981' } },
              error: { style: { background: '#ef4444', color: 'white' }, iconTheme: { primary: '#fff', secondary: '#ef4444' } },
            }} 
          />
        </AuthProvider>
      </body>
    </html>
  );
}
