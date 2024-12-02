import ClientContainer from "@/app/ClientContainer";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import { Inter } from "next/font/google";
import "./_scss/application.scss";
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
      </head>
      <body className={inter.className}>
        <AppRouterCacheProvider>
          <ClientContainer>{children}</ClientContainer>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
