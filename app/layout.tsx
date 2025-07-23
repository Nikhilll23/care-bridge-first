import type { Metadata } from "next";
import "./globals.css";
import NavBar from "./components/NavBar";
import SessionProviderWrapper from "@/lib/provider";
import { getServerSession } from "next-auth";
import { ThemeProvider } from "@/lib/theme-provider";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "Automed",
  description: "Hospital Managment Systems",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession();
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <SessionProviderWrapper session={session}>
            <NavBar />
            <main className="p-5">{children}</main>
          </SessionProviderWrapper>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
