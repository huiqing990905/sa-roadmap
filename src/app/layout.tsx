import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Solution Architect Roadmap | Hui Qing",
  description:
    "A structured, hands-on roadmap to becoming a Solution Architect — 245 tasks across 9 phases with interactive progress tracking.",
  metadataBase: new URL("https://sa.hqinglab.tech"),
  alternates: {
    canonical: "https://sa.hqinglab.tech",
  },
  openGraph: {
    title: "Solution Architect Roadmap | Hui Qing",
    description:
      "Full Stack Engineer → Solution Architect. 245 actionable tasks, 9 phases, real-time progress tracking.",
    type: "website",
    siteName: "SA Roadmap",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Solution Architect Roadmap | Hui Qing",
    description:
      "Full Stack Engineer → Solution Architect. 245 actionable tasks, 9 phases, real-time progress tracking.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="antialiased">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
