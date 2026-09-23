import { Fraunces, Nunito } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  display: "swap",
});

export const metadata = {
  title: "Tasha’s Little Savings",
  description: "Diari nabung kecil-kecil milik Tasha: dua impian, satu halaman setiap hari.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#FCF7F0",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" className={`${fraunces.variable} ${nunito.variable}`}>
      <head>
        <link
          rel="icon"
          href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M12 20.5c-4.8-3.4-8.4-6.5-8.4-10.2A4.6 4.6 0 0 1 12 7.4a4.6 4.6 0 0 1 8.4 2.9c0 3.7-3.6 6.8-8.4 10.2Z' fill='%23C4767E'/%3E%3C/svg%3E"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
