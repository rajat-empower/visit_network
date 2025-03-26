import type { Metadata } from "next";
// import MyApp from "./app_";
import "./globals.css";
import App from "./app_";
import { Lato, Inter } from 'next/font/google';

// Load Lato font
const lato = Lato({
  weight: ['100', '300', '400', '700', '900'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-lato'
});

// Load Inter font
const inter = Inter({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
});

export const metadata: Metadata = {
  title: 'Visit Slovenia - Discover the Hidden Gems of Europe',
  description: "Discover Slovenia - Your gateway to the hidden gems of Europe",
  metadataBase: new URL('https://visitslovenia.com'),
  openGraph: {
    title: 'Visit Slovenia - Discover the Hidden Gems of Europe',
    description: 'Discover Slovenia - Your gateway to the hidden gems of Europe',
    images: '/images/og-image.jpg',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Visit Slovenia - Discover the Hidden Gems of Europe',
    description: 'Discover Slovenia - Your gateway to the hidden gems of Europe',
    images: '/images/twitter-image.jpg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${lato.variable} ${inter.variable}`}>
      <body>
        <App>
           {children}
           </App>
      </body>
    </html>
  );
}
