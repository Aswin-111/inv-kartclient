"use client";
import React from "react";
import { usePathname } from "next/navigation";
import { Preahvihear } from "next/font/google";
import "./globals.css";
import Sidebar from "./components/Sidebar";

const preahvihear = Preahvihear({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const hideSidebar = pathname === "/login" || pathname === "/signup";

  return (
    <html lang="en" data-theme="light">
      <body
        className={`${preahvihear.variable} antialiased flex overflow-hidden`}
      >
        {!hideSidebar && <Sidebar />}
        <main className={`${hideSidebar ? "w-full" : "w-3/4"} p-8`}>
          {children}
        </main>
      </body>
    </html>
  );
}
