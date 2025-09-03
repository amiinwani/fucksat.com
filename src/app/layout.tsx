import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SAT Speedrun - AI-Powered SAT Prep Platform | CurioLearn",
  description: "Speedrun your SAT prep in days with AI that transforms any content into targeted practice. Join students who've achieved their dream scores in just days with our speedrun methodology.",
  keywords: "SAT prep, SAT practice, AI learning, SAT speedrun, CurioLearn, SAT questions, SAT study, college prep, SAT score improvement",
  authors: [{ name: "CurioLearn" }],
  creator: "CurioLearn",
  publisher: "CurioLearn",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://sat.curiolearn.co'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "SAT Speedrun - AI-Powered SAT Prep Platform",
    description: "Speedrun your SAT prep in days with AI that transforms any content into targeted practice. Join students who've achieved their dream scores in just days.",
    url: 'https://sat.curiolearn.co',
    siteName: 'SAT Speedrun by CurioLearn',
    images: [
      {
        url: '/white bg black inner.png',
        width: 1200,
        height: 630,
        alt: 'SAT Speedrun - AI-Powered SAT Prep Platform by CurioLearn',
      },
      {
        url: '/black bg.png',
        width: 1200,
        height: 630,
        alt: 'SAT Speedrun - AI-Powered SAT Prep Platform by CurioLearn',
      },
      {
        url: '/white bg yellow inner.png',
        width: 1200,
        height: 630,
        alt: 'SAT Speedrun - AI-Powered SAT Prep Platform by CurioLearn',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "SAT Speedrun - AI-Powered SAT Prep Platform",
    description: "Speedrun your SAT prep in days with AI that transforms any content into targeted practice.",
    images: ['/white bg black inner.png', '/black bg.png', '/white bg yellow inner.png'],
    creator: '@curiolearn',
    site: '@curiolearn',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
  category: 'education',
  classification: 'SAT Preparation Platform',
  other: {
    'application-name': 'SAT Speedrun',
    'apple-mobile-web-app-title': 'SAT Speedrun',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'mobile-web-app-capable': 'yes',
    'msapplication-TileColor': '#2563eb',
    'theme-color': '#2563eb',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "EducationalApplication",
              "name": "SAT Speedrun",
              "description": "AI-powered SAT prep platform that helps students speedrun their way to their target scores",
              "url": "https://sat.curiolearn.co",
              "applicationCategory": "EducationalApplication",
              "operatingSystem": "Web Browser",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD",
                "description": "Free access to AI-powered SAT practice questions"
              },
              "provider": {
                "@type": "Organization",
                "name": "CurioLearn",
                "url": "https://curiolearn.co"
              },
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.9",
                "ratingCount": "15000"
              }
            })
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
