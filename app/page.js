import ImageParallaxZoom from './components/ImageParallaxZoom';
import SmoothReveal from './components/SmoothReveal';
import SplitText from './components/SplitText';
import ScrollProgress from './components/ScrollProgress';
import Navbar from './components/Navbar';
import AddToCartButton from './components/AddToCartButton';
import { getProducts } from '@/lib/shopify';
import Link from 'next/link';
import { Truck, Lock, RotateCcw, MessageCircle, Smartphone, Laptop, Watch, Headphones, Package } from 'lucide-react';

// Mapper les catégories Shopify aux icônes Lucide
const getCategoryIcon = (category) => {
  const categoryLower = (category || '').toLowerCase();

  if (categoryLower.includes('phone') || categoryLower.includes('mobile')) return Smartphone;
  if (categoryLower.includes('laptop') || categoryLower.includes('computer')) return Laptop;
  if (categoryLower.includes('watch')) return Watch;
  if (categoryLower.includes('headphone') || categoryLower.includes('audio') || categoryLower.includes('écouteur')) return Headphones;

  return Package; // Icône par défaut pour accessoires/autres
};

export const metadata = {
  title: 'TechStore - Tablettes, Montres Connectées & Laptops Premium',
  description: 'Découvrez notre sélection premium de produits tech : smartphones, ordinateurs portables, montres connectées et accessoires. Livraison gratuite dès 100€. Support 24/7.',
  openGraph: {
    title: 'TechStore - Votre destination tech premium',
    description: 'Découvrez notre sélection premium de produits tech : smartphones, ordinateurs portables, montres connectées et accessoires.',
    type: 'website',
    locale: 'fr_FR',
  },
};

export default async function ShopPage() {
  // Récupérer les données depuis Shopify
  let products = [];
  let collections = [];

  try {
    // Récupérer les 10 derniers produits pour la section "Nos Produits"
    products = await getProducts(10);
    // Collections Shopify (correspondent aux handles exacts)
    collections = [
      {
        name: 'Smartphones',
        slug: 'smartphones',
        image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=2070'
      },
      {
        name: 'Ordinateurs portables',
        slug: 'ordinateurs-portables',
        image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=2071'
      },
      {
        name: 'Montres Connectées',
        slug: 'montres-connectees',
        image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?q=80&w=2041'
      },
      {
        name: 'Écouteurs & Audio',
        slug: 'ecouteurs-audio',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2070'
      }
    ];
  } catch (error) {
    console.error('Error fetching Shopify data:', error);
    products = [];
  }

  // Ajouter des tags dynamiques basés sur les tags Shopify
  const enhancedProducts = products.map((product) => {
    let tag = null;
    if (product.tags) {
      if (product.tags.includes('new') || product.tags.includes('New') || product.tags.includes('nouveautés')) tag = 'New';
      else if (product.tags.includes('bestseller') || product.tags.includes('Bestseller')) tag = 'Bestseller';
      else if (product.tags.includes('limited') || product.tags.includes('Limited')) tag = 'Limited';
      else if (product.tags.includes('promo') || product.tags.includes('Promo')) tag = 'Promo';
    }
    return { ...product, tag };
  });

  return (
    <>
      <ScrollProgress color="#F59E0B" height={3} />
      <Navbar />

      <main className="bg-[#0a0a0a] text-white font-[family-name:var(--font-inter)]">
        {/* Hero Section */}
        <section className="relative h-screen overflow-hidden">
          <ImageParallaxZoom
            src="https://images.unsplash.com/photo-1591711584791-455de896b1e9?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            height="100vh"
            zoomIntensity={1.2}
          />

          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a]/95 via-[#0a0a0a]/60 to-transparent" />

          {/* Animated gradient orbs */}
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-[#F59E0B]/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-[#D97706]/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

          <div className="absolute inset-0 flex items-center px-6 md:px-12">
            <div className="relative z-10 max-w-7xl mx-auto w-full translate-y-10 md:translate-y-16">
           

              <SmoothReveal direction="up" delay={0.2}>
                <h1 className="text-[clamp(4rem,12vw,12rem)] font-black leading-[0.85] tracking-tighter mb-8 max-w-5xl">
                  <SplitText
                    type="chars"
                    animation="fadeUp"
                    stagger={0.015}
                    className="inline-block"
                  >
                    Produits
                  </SplitText>
                  <br />
                  <SplitText
                    type="chars"
                    animation="fadeUp"
                    stagger={0.015}
                    className="inline-block text-[#F59E0B]"
                  >
                    Tech
                  </SplitText>
                </h1>
              </SmoothReveal>

              <SmoothReveal direction="up" delay={0.4}>
                <p className="text-[clamp(1.1rem,2vw,1.5rem)] text-[#e5e5e5] max-w-2xl leading-relaxed font-light tracking-tight mb-12">
                  Découvrez notre sélection de tablettes, montres connectées
                  et laptops. La technologie accessible en un clic.
                </p>
              </SmoothReveal>

              <SmoothReveal direction="up" delay={0.6} animateOnMount>
                <div className="flex gap-6 items-center flex-wrap">
                  <Link href="/products">
                    <button className="px-8 py-4 bg-[#F59E0B] hover:bg-[#D97706] text-black text-sm font-medium tracking-wide uppercase transition-all duration-300">
                      Découvrir
                    </button>
                  </Link>
                  <Link href="/collections/nouveautes">
                    <button className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#F59E0B]/50 text-white text-sm font-medium tracking-wide uppercase transition-all duration-300">
                      Nouveautés
                    </button>
                  </Link>
                </div>
              </SmoothReveal>

              <SmoothReveal direction="up" delay={0.8} animateOnMount>
                <div className="mt-20 flex gap-12 items-center">
                  <div>
                    <div className="text-4xl font-bold text-[#F59E0B] mb-1">300+</div>
                    <div className="text-sm text-[#d6d6d6] uppercase tracking-wide">Produits Tech</div>
                  </div>
                  <div className="h-12 w-[1px] bg-white/30" />
                  <div>
                    <div className="text-4xl font-bold text-[#F59E0B] mb-1">25k+</div>
                    <div className="text-sm text-[#d6d6d6] uppercase tracking-wide">Clients Satisfaits</div>
                  </div>
                  <div className="h-12 w-[1px] bg-white/30" />
                  <div>
                    <div className="text-4xl font-bold text-[#F59E0B] mb-1">24/7</div>
                    <div className="text-sm text-[#d6d6d6] uppercase tracking-wide">Support</div>
                  </div>
                </div>
              </SmoothReveal>
            </div>
          </div>
        </section>

        {/* Collections Section */}
        <section className="py-20 px-6 md:px-12">
          <div className="max-w-7xl mx-auto">
            <SmoothReveal direction="up">
              <h2 className="text-[clamp(2.5rem,6vw,5rem)] font-bold tracking-tighter mb-16 text-center">
                Nos <span className="text-[#F59E0B]">Catégories</span>
              </h2>
            </SmoothReveal>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {collections.map((collection, i) => (
                <SmoothReveal key={i} direction="up" delay={i * 0.1}>
                  <Link href={`/collections/${collection.slug}`} className="block">
                    <div className="relative h-96 rounded-2xl overflow-hidden group cursor-pointer">
                      <ImageParallaxZoom
                        src={collection.image}
                        alt={collection.name}
                        height="100%"
                        zoomIntensity={1.12}
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                      <div className="absolute bottom-0 left-0 right-0 p-8">
                        <h3 className="text-2xl font-bold mb-2 group-hover:text-[#F59E0B] transition-colors duration-300">
                          {collection.name}
                        </h3>
                        <p className="text-[#dbd7d7] flex items-center gap-2">
                          Découvrir
                          <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </p>
                        <div className="h-[2px] w-0 group-hover:w-20 bg-[#F59E0B] mt-4 transition-all duration-500" />
                      </div>
                    </div>
                  </Link>
                </SmoothReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="py-20 px-6 md:px-12 bg-[#0f0f0f]">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-16">
              <SmoothReveal direction="left">
                <h2 className="text-[clamp(2.5rem,6vw,5rem)] font-bold tracking-tighter">
                  Nos <span className="text-[#F59E0B]">Produits</span>
                </h2>
              </SmoothReveal>

              <SmoothReveal direction="right">
                <Link href="/products">
                  <button className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#F59E0B]/50 text-white text-sm font-medium tracking-wide uppercase transition-all duration-300">
                    Voir Tout
                  </button>
                </Link>
              </SmoothReveal>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {enhancedProducts.map((product, i) => (
                <SmoothReveal key={i} direction="up" delay={i * 0.1}>
                  <Link href={`/products/${product.handle}`} className="block group">
                    <div className="relative h-80 rounded-2xl overflow-hidden mb-4">
                      <ImageParallaxZoom
                        src={product.image}
                        alt={product.name}
                        height="100%"
                        zoomIntensity={1.1}
                      />

                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-500" />

                      {product.tag && (
                        <div className="absolute top-4 right-4">
                          <span className={`px-3 py-1.5 text-xs font-bold tracking-wide uppercase rounded ${
                            product.tag === 'New' ? 'bg-[#F59E0B] text-black' :
                            product.tag === 'Bestseller' ? 'bg-green-500 text-black' :
                            product.tag === 'Promo' ? 'bg-red-500 text-white' :
                            'bg-purple-500 text-white'
                          }`}>
                            {product.tag}
                          </span>
                        </div>
                      )}

                      {/* Bouton Add to Cart en overlay */}
                      <AddToCartButton
                        variantId={product.variantId}
                        productName={product.name}
                        variant="overlay"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-[#F59E0B] font-medium tracking-wide uppercase">
                          {product.category}
                        </span>
                      </div>

                      <h3 className="text-xl font-bold group-hover:text-[#F59E0B] transition-colors duration-300">
                        {product.name}
                      </h3>

                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold">${product.price}</span>
                        {(() => {
                          const Icon = getCategoryIcon(product.category);
                          return <Icon className="w-6 h-6 text-[#F59E0B]" />;
                        })()}
                      </div>
                    </div>
                  </Link>
                </SmoothReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Promo Banner with Parallax */}
        <section className="relative h-[60vh]">
          <ImageParallaxZoom
            src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=2070"
            alt="Special offer"
            height="100%"
            zoomIntensity={1.2}
          />

          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a]/95 via-[#0a0a0a]/70 to-transparent" />

          <div className="absolute inset-0 flex items-center px-6 md:px-12">
            <div className="max-w-7xl mx-auto w-full">
              <SmoothReveal direction="left">
                <div className="max-w-2xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#F59E0B] text-black rounded-full mb-6">
                    <span className="text-xs font-bold tracking-wide uppercase">
                      Offre Limitée
                    </span>
                  </div>

                  <h2 className="text-[clamp(3rem,8vw,6rem)] font-black leading-tight tracking-tighter mb-6">
                    Jusqu&apos;à -30%
                    <br />
                    <span className="text-[#F59E0B]">Tech Week</span>
                  </h2>

                  <p className="text-xl text-[#ccc] font-light mb-8 leading-relaxed">
                    Profitez de réductions exceptionnelles sur une sélection de produits.
                    Technologie premium à prix imbattables. Stock limité.
                  </p>

                  <Link href="/collections/promotions">
                    <button className="px-8 py-4 bg-[#F59E0B] hover:bg-[#D97706] text-black font-medium tracking-wide uppercase transition-all duration-300">
                      Profiter
                    </button>
                  </Link>
                </div>
              </SmoothReveal>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-20 px-6 md:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                { Icon: Truck, title: 'Livraison Gratuite', desc: 'Dès 100€ d\'achat' },
                { Icon: Lock, title: 'Paiement Sécurisé', desc: 'Transactions 100% sécurisées' },
                { Icon: RotateCcw, title: 'Retours Faciles', desc: 'Politique de retour 30 jours' },
                { Icon: MessageCircle, title: 'Support 24/7', desc: 'Service client dédié' }
              ].map((feature, i) => (
                <SmoothReveal key={i} direction="up" delay={i * 0.1}>
                  <div className="text-center p-6 rounded-2xl bg-[#0f0f0f] border border-white/5 hover:border-[#F59E0B]/30 transition-all duration-500 group">
                    <feature.Icon className="w-12 h-12 mx-auto mb-4 text-[#F59E0B] group-hover:scale-110 transition-transform duration-300" />
                    <h3 className="text-lg font-bold mb-2 group-hover:text-[#F59E0B] transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-[#b3b3b3]">{feature.desc}</p>
                  </div>
                </SmoothReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-20 px-6 md:px-12 border-t border-white/5">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
              <div className="md:col-span-2">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-10 w-10 bg-gradient-to-br from-[#F59E0B] to-[#D97706] rounded-full" />
                  <span className="text-2xl font-bold tracking-tight text-white">
                    Tech<span className="text-[#F59E0B]">Store</span>
                  </span>
                </div>
                <p className="text-[#dbd7d7] leading-relaxed max-w-md font-light">
                  Votre destination premium pour la technologie de pointe.
                  Qualité et innovation à portée de clic.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-4 text-white">Boutique</h4>
                <div className="space-y-3">
                  <Link href="/collections/nouveautes" className="block text-sm text-[#dbd7d7] hover:text-[#F59E0B] transition-colors">
                    Nouveautés
                  </Link>
                  <Link href="/collections" className="block text-sm text-[#dbd7d7] hover:text-[#F59E0B] transition-colors">
                    Catégories
                  </Link>
                  <Link href="/collections/promotions" className="block text-sm text-[#dbd7d7] hover:text-[#F59E0B] transition-colors">
                    Promotions
                  </Link>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-4 text-white">Support</h4>
                <div className="space-y-3">
                  <Link href="/contact" className="block text-sm text-[#dbd7d7] hover:text-[#F59E0B] transition-colors">
                    Contact
                  </Link>
                  <Link href="/livraison" className="block text-sm text-[#dbd7d7] hover:text-[#F59E0B] transition-colors">
                    Livraison
                  </Link>
                  <Link href="/retours" className="block text-sm text-[#dbd7d7] hover:text-[#F59E0B] transition-colors">
                    Retours
                  </Link>
                  <Link href="/faq" className="block text-sm text-[#dbd7d7] hover:text-[#F59E0B] transition-colors">
                    FAQ
                  </Link>
                </div>
              </div>
            </div>

            <div className="h-[1px] w-full bg-white/5 mb-8" />

            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-sm text-[#b3b3b3] font-light">
                © 2025 TechStore. All rights reserved.
              </div>
              <div className="flex gap-6">
                {['Privacy', 'Terms', 'Cookies'].map((link) => (
                  <a
                    key={link}
                    href="#"
                    className="text-sm text-[#b3b3b3] hover:text-white transition-colors"
                  >
                    {link}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
