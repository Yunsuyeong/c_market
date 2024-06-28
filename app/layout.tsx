import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: "%s | C_market",
    default: "C_market",
  },
  description: "Sell&Buy all things",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} max-w-screen-sm bg-neutral-900 text-white mx-auto`}
      >
        {children}
      </body>
    </html>
  );
}
