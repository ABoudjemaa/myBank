import { Toaster } from "@/components/ui/sonner";
import "./globals.css";
import NavBar from "@/components/nav-bar";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body >
          {children}
        <Toaster />
      </body>
    </html>
  );
}
