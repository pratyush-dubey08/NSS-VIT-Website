import { Analytics } from '@vercel/analytics/next';
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GlobalSearch from "@/components/GlobalSearch";
import LayoutWrapper from "@/components/LayoutWrapper";
import AppBackButtonHandler from "@/components/AppBackButtonHandler";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL('https://nssunitvit.vercel.app'),
  title: {
    default: "NSS Unit | VIT Bhopal University",
    template: "%s | NSS Unit VIT Bhopal"
  },
  description: "Official Digital Platform of the National Service Scheme (NSS) Unit, VIT Bhopal University. Dedicated to community development, rural immersion camps, blood donation drives, and youth leadership under the motto 'Not Me But You'.",
  keywords: ["NSS", "VIT Bhopal", "National Service Scheme", "Community Service", "Annual Camp", "Blood Donation", "Plantation", "Youth Leadership"],
  authors: [{ name: "NSS Unit VIT Bhopal" }],
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://nssunitvit.vercel.app',
    title: 'NSS Unit | VIT Bhopal University',
    description: "Official Digital Platform of NSS Unit, VIT Bhopal University. Not Me But You.",
    siteName: 'NSS Unit VIT Bhopal',
    images: [
      {
        url: '/images/nss-logo.png',
        width: 800,
        height: 800,
        alt: 'NSS Unit VIT Bhopal University Logo',
      },
    ],
  },
  twitter: {
    card: 'summary',
    title: 'NSS Unit | VIT Bhopal University',
    description: "Official Digital Platform of NSS Unit, VIT Bhopal University. Not Me But You.",
    images: ['/images/nss-logo.png'],
  },
  icons: {
    icon: '/images/nss-logo.png',
    apple: '/images/nss-logo.png',
  },
};

export default function RootLayout({
 children,
}: Readonly<{
 children: React.ReactNode;
}>) {
 return (
 <html lang="en">
 <body className={inter.className}>
 <AppBackButtonHandler />
 <GlobalSearch />
 <LayoutWrapper>
 {children}
 </LayoutWrapper>
 <Analytics />
 </body>
 </html>
 );
}
