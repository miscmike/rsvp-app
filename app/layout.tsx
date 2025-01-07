import type { Metadata } from "next";
import { Poppins, Geist, Geist_Mono, Signika } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
const signika = Signika({
  variable: "--font-signika",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RSVP for mikes",
  description: "and draw something",
};

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-poppins",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${poppins.variable} ${signika.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
