import type { Metadata } from "next";
import localFont from "next/font/local";
import { Roboto, Rubik_Scribble } from "next/font/google";
import "./globals.css";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal"],
  variable: "--roboto-text",
});

const rubick = Rubik_Scribble({
  weight: "400",
  style: "normal",
  subsets: ["latin"],
  variable: "--rubick-text",
});

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
        className={`${roboto.variable} ${rubick.variable} max-w-screen-sm bg-neutral-900 text-white mx-auto`}
      >
        {children}
      </body>
    </html>
  );
}
