import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GlobalSearch from "@/components/GlobalSearch";
import LayoutWrapper from "@/components/LayoutWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
 title: "NSS Unit | VIT Bhopal University",
 description: "Official Digital Platform of NSS Unit, VIT Bhopal University. Not Me But You.",
};

export default function RootLayout({
 children,
}: Readonly<{
 children: React.ReactNode;
}>) {
 return (
 <html lang="en">
 <body className={inter.className}>
 <GlobalSearch />
 <LayoutWrapper>
 {children}
 </LayoutWrapper>
 </body>
 </html>
 );
}
