import type { Metadata } from "next";
import { StoreProvider } from "@/store/StoreProvider";
import "./globals.css";
import { Recursive } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import { SiteHeader } from "@/components/SiteHeader";
const recursive = Recursive({ subsets: ["latin-ext"] });
export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={recursive.className}>
      <StoreProvider>
      <main className="w-full bg-gray-100">
      <SiteHeader />
        {children}
        <Toaster/>
      </main>
      </StoreProvider>
      </body>
    </html>
  );
}
