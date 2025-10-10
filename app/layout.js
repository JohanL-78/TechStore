import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import SmoothScrollProvider from "./components/SmoothScrollProvider";
import { CartProvider } from "./components/CartProvider";
import CartDrawer from "./components/CartDrawer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
});

export const metadata = {
  title: "TechStore - Tablettes, Montres Connectées & Laptops",
  description: "Découvrez notre sélection premium d'électronique : tablettes, montres connectées, laptops et accessoires tech de dernière génération",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} antialiased`}
      >
        <CartProvider>
          <SmoothScrollProvider>
            {children}
          </SmoothScrollProvider>
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
