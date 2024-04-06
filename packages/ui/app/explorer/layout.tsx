import type { Metadata } from "next";
import "bootstrap/dist/css/bootstrap.css";

export const metadata: Metadata = {
  title: "Explorer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
