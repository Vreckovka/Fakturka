import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import React from 'react';
import { Inter as FontSans } from "next/font/google"
import Navbar from "./components/navbar/nav-bar";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Fakturka",
};

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.cdnfonts.com/css/come-unto-me" rel="stylesheet" ></link>
      </head>


      <body className={inter.className}>
        <Navbar></Navbar>
        {children}
      </body>

    </html>
  );
}

