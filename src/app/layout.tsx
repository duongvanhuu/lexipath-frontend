import "@/styles/globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils/cn";
import { AppProviders } from "@/providers/app-providers";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

export const metadata = {
  title: "LexiPath",
  description: "Vocabulary and exam learning platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className={cn("font-sans", geist.variable)}>
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
