import "@ui/styles/globals.css";
import { Inter } from "next/font/google";
import { Provider } from "../components/provider";
import { Metadata } from "next";
import { Toaster } from "@ui/components/toaster"

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Coding Labs",
  description: "An online coding platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Provider>
          <Toaster />
          {children}
        </Provider>
      </body>
    </html>
  );
}
