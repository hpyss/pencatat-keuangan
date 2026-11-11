import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-plus-jakarta',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'KeuanganKu - Pencatat Keuangan Pribadi',
  description: 'Aplikasi pencatat keuangan modern, rapi, dan mudah digunakan.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={plusJakartaSans.variable}>
      <body className="min-h-screen bg-[#F8FAFC] text-[#1E293B] font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
