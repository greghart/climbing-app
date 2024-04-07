import type { Metadata } from "next";
import "bootstrap/dist/css/bootstrap.css";
import "../scss/application.scss";

export const metadata: Metadata = {
  title: "Explorer",
};

// Top level layout just includes some CSS
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
