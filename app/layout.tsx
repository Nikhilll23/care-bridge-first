import type { Metadata } from "next";
import "./globals.css";
import NavBar from "./components/NavBar";
import SessionProviderWrapper from "@/lib/provider";
import { getServerSession } from "next-auth";
import { ThemeProvider } from "@/lib/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import ConditionalNavBar from "./components/ConditionalNavBar";

export const metadata: Metadata = {
  title: "CareBridge",
  description: "Hospital Managment Systems",
  icons: {
    icon: "/logo.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession();
  return (
    <html lang="en" suppressHydrationWarning>
    <body suppressHydrationWarning>
        <ThemeProvider>
          <SessionProviderWrapper session={session}>
            <ConditionalNavBar />
            <main className="p-5">{children}</main>
          </SessionProviderWrapper>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
