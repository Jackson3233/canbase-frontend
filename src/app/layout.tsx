import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { StoreProvider } from "@/store/store-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { CommandDialogProvider } from "@/components/providers/command-dialog-provider";

import "@/style/globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Canbase Dashboard",
  description: "SAAS Clubverwaltung für Cannabis Clubs",
  icons: [
    {
      rel: "apple-touch-icon",
      url: "/apple-touch-icon.png?v=2",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "32x32",
      url: "/favicon-32x32.png?v=2",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "16x16",
      url: "/favicon-16x16.png?v=2",
    },
    {
      rel: "icon",
      url: "/favicon.ico?v=2",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" suppressHydrationWarning>
      <body className={inter.className}>
        <StoreProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <CommandDialogProvider>
              {children}
              <Toaster />
            </CommandDialogProvider>
          </ThemeProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
