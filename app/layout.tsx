import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import BottomNav from "./components/BottomNav";
import ThemeColor from "./components/ThemeColor";
import { CurrencyProvider } from "./components/CurrencyProvider";
import { getSiteSettings } from "./data/site-store";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/seo";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Casas de veraneo en Punta del Este | Tu Próxima Casa",
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: `${SITE_NAME} - Punta del Este`,
  alternates: { languages: { "es-UY": "/" } },
  openGraph: {
    siteName: `${SITE_NAME} - Punta del Este`,
    title: "Casas de veraneo en Punta del Este | Tu Próxima Casa",
    description: SITE_DESCRIPTION,
    locale: "es_UY",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
  // When added to the home screen on iPhone: real full screen, status bar over the page.
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: SITE_NAME },
};

// Let the page extend under the notch / home indicator (the hero fills the whole screen);
// the browser's own bars are tinted by ThemeColor and the dark color-scheme.
export const viewport: Viewport = {
  viewportFit: "cover",
  colorScheme: "dark light",
  // Server-rendered first paint: black, the home page background. ThemeColor keeps it in
  // sync with the real background (and the light theme) afterwards.
  themeColor: "#000000",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { arsRate } = await getSiteSettings();
  return (
    <html
      lang="es-UY"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {/* Applies the saved theme (dark by default, not the system setting) before first paint to avoid a flash. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem("theme");if(t!=="light"&&t!=="dark"){t="dark"}document.documentElement.dataset.theme=t;var c=t==="light"?"#ffffff":"#000000";var m=document.querySelector('meta[name="theme-color"]');if(m){m.content=c}else{document.addEventListener("DOMContentLoaded",function(){var n=document.querySelector('meta[name="theme-color"]');if(n)n.content=c})}}catch(e){}`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col max-lg:pb-14">
        <ThemeColor />
        <CurrencyProvider arsRate={arsRate}>
          {children}
          <BottomNav />
        </CurrencyProvider>
      </body>
    </html>
  );
}
