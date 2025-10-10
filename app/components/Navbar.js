'use client';

import { useState, useEffect } from 'react';
import { useCart } from './CartProvider';
import Link from 'next/link';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showCategoriesMenu, setShowCategoriesMenu] = useState(false);
  const { cartCount, openDrawer } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-white/10'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="h-8 w-8 bg-gradient-to-br from-[#F59E0B] to-[#D97706] rounded-full" />
          <span className="text-xl font-bold tracking-tight text-white">
            Tech<span className="text-[#F59E0B]">Store</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link
            href="/products"
            className="text-sm font-medium text-[#dbd7d7] hover:text-white transition-colors tracking-wide uppercase"
          >
            Tous les produits
          </Link>

          <div
            className="relative"
            onMouseEnter={() => setShowCategoriesMenu(true)}
            onMouseLeave={() => setShowCategoriesMenu(false)}
          >
            <button className="text-sm font-medium text-[#dbd7d7] hover:text-white transition-colors tracking-wide uppercase">
              Collections
            </button>

            {showCategoriesMenu && (
              <div className="absolute top-full left-0 pt-2">
                <div className="w-56 bg-[#0a0a0a]/95 backdrop-blur-xl border border-white/10 rounded-lg overflow-hidden shadow-xl">
                  <Link
                    href="/collections/smartphones"
                    className="block px-4 py-3 text-sm text-[#dbd7d7] hover:text-white hover:bg-white/5 transition-colors"
                  >
                    Smartphones
                  </Link>
                  <Link
                    href="/collections/ordinateurs-portables"
                    className="block px-4 py-3 text-sm text-[#dbd7d7] hover:text-white hover:bg-white/5 transition-colors"
                  >
                    Ordinateurs portables
                  </Link>
                  <Link
                    href="/collections/montres-connectees"
                    className="block px-4 py-3 text-sm text-[#dbd7d7] hover:text-white hover:bg-white/5 transition-colors"
                  >
                    Montres Connectées
                  </Link>
                  <Link
                    href="/collections/ecouteurs-audio"
                    className="block px-4 py-3 text-sm text-[#dbd7d7] hover:text-white hover:bg-white/5 transition-colors"
                  >
                    Écouteurs & Audio
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="text-white hover:text-[#F59E0B] transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
          <button
            onClick={openDrawer}
            className="relative text-white hover:text-[#F59E0B] transition-colors"
            title="Ouvrir le panier"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 h-5 w-5 bg-[#F59E0B] text-black text-xs font-bold rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}
