"use client";
import { Inter, Josefin_Sans, Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import store from "@/features/redux/store";
import RoutePaths from "@/components/RoutePaths";
import { ThemeProvider } from "@/utils/theme-provider";

const inter = Inter({ subsets: ["latin"] });

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-Poppins",
});

const josefin = Josefin_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-Josefin",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {


  return (
    <html lang="en">
      <body className={`${poppins.variable} ${josefin.variable} ${inter.className}`} suppressHydrationWarning>
        <Provider store={store}>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
            <Toaster position="top-right" toastOptions={{ duration: 2000 }} />
            <RoutePaths />
            {children}
          </ThemeProvider>
        </Provider>
      </body>
    </html>
  );
}
