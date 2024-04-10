import type { Metadata, Viewport } from "next";
import clsx from "clsx";
import { Inter } from "next/font/google";
import "bootstrap/dist/css/bootstrap.css";
import "./scss/application.scss";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, shrink-to-fit=no, user-scalable=no"
        />
        <meta charSet="utf-8" />
        <meta property="og:title" content="Climbing App" />
        <script
          src="https://cdn.polyfill.io/v2/polyfill.min.js?features=Intl.~locale.en"
          async
        />
        {/** TODO: Replace fontawesome? */}
        <script src="https://use.fontawesome.com/470e7e519a.js" async />
        <link
          rel="stylesheet"
          href="https://use.fontawesome.com/releases/v5.2.0/css/all.css"
          integrity="sha384-hWVjflwFxL6sNzntih27bfxkr27PmbbK/iSvJ+a4+0owXq79v+lsFkW54bOGbiDQ"
          crossOrigin="anonymous"
        />
      </head>
      <body className={clsx(inter.className, "body--sidebar")}>
        <div id="app">{children}</div>
      </body>
    </html>
  );
}
