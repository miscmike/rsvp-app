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
  title: "RSVP for mike’s bday",
  description: "RSVP for mike’s bday",
  icons: {
    icon: [
      {
        url: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🌅</text></svg>",
        type: "image/svg+xml",
      },
    ],
  },
  openGraph: {
    title: "RSVP for mike’s bday ",
    description: "lowkey music and drinks at mike's",
    type: "website",
  },
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
