import type { Metadata } from "next";
import Footer from "@/components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "Invoice & GST Calculator",
  description: "Create GST and IGST invoices with PDF export.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full flex-col bg-white text-slate-800">
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
