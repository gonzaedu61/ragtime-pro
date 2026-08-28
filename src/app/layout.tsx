import type { Metadata } from "next";
import { Inter, Open_Sans } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ChatWidgetProvider } from "@/components/chat/ChatWidgetContext";
import ChatWidget from "@/components/chat/ChatWidget";
import "../../styles/globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const openSans = Open_Sans({ subsets: ["latin"], variable: "--font-open-sans" });

export const metadata: Metadata = {
  title: "RAGnify",
  description: "AI-driven modernization for legacy software products.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${openSans.variable}`}>
      <body className="flex min-h-screen flex-col font-body text-navy">
        <ChatWidgetProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <ChatWidget />
        </ChatWidgetProvider>
      </body>
    </html>
  );
}
