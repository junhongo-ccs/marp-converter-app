import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: 'Marp Converter App',
  description: 'Marpスライドを変換するWebアプリ',
  openGraph: {
    title: 'Marp Converter App',
    description: 'AIがテキストからPPTスライドに変換するWebアプリ',
    url: 'https://md-ppt-converter.up.railway.app/',
    type: 'website',
    images: [
      {
        url: '/images/ogp.png',
        width: 1200,
        height: 630,
        alt: 'OGP Image',
      },
    ],
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
