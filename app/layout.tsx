import type { Metadata } from "next";
import Nav from "@/components/Nav";
import SignupModal from "@/components/SignupModal";
import "./globals.css";

export const metadata: Metadata = {
  title: "Designer Residence | Tribeca",
  description: "A curated fashion experience. 147 Reade St, Tribeca, New York.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col bg-dr-black text-dr-cream antialiased">
        <Nav />
        <SignupModal />
        {children}
      </body>
    </html>
  );
}
