import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/header";

export const metadata: Metadata = {
  title: "Personal OS",
  description: "Personal OS dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <Header />
        <div className="mx-auto w-full max-w-7xl flex-1">{children}</div>
      </body>
    </html>
  );
}
