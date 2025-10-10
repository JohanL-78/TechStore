import { getProducts } from '@/lib/shopify';
import Link from 'next/link';
import Navbar from '@/app/components/Navbar';
import SmoothReveal from '@/app/components/SmoothReveal';
import ImageParallaxZoom from '@/app/components/ImageParallaxZoom';
import AddToCartButton from '@/app/components/AddToCartButton';
import { ArrowLeft, Smartphone, Laptop, Watch, Headphones, Package } from 'lucide-react';

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
  title: 'Tous les produits - TechStore',
  description: 'Découvrez tout notre catalogue de produits tech : smartphones, laptops, montres connectées et accessoires',
};

export default async function AllProductsPage() {
  let products = [];

  try {
    // Récupérer tous les produits (max 100)
    products = await getProducts(100);
  } catch (error) {
    console.error('Error fetching products:', error);
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
      <Navbar />

      <main className="bg-[#0a0a0a] text-white font-[family-name:var(--font-inter)] min-h-screen pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-6 md:px-12">

          {/* Fil d'ariane & Retour */}
          <SmoothReveal direction="up">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-[#dbd7d7] hover:text-[#F59E0B] transition-colors mb-8 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>Retour à l&apos;accueil</span>
            </Link>
          </SmoothReveal>

          {/* En-tête */}
          <SmoothReveal direction="up" delay={0.1}>
            <div className="mb-16 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full mb-6">
                <span className="text-sm font-medium text-[#dbd7d7] tracking-wide uppercase">
                  Catalogue complet
                </span>
              </div>

              <h1 className="text-[clamp(3rem,8vw,6rem)] font-black tracking-tighter mb-4">
                Tous nos <span className="text-[#F59E0B]">Produits</span>
              </h1>

              <p className="text-xl text-[#dbd7d7] mb-6">
                Découvrez l&apos;ensemble de notre sélection tech
              </p>

              <p className="text-lg text-[#b3b3b3]">
                {products.length} produit{products.length > 1 ? 's' : ''} disponible{products.length > 1 ? 's' : ''}
              </p>
            </div>
          </SmoothReveal>

          {/* Filtres rapides */}
          <SmoothReveal direction="up" delay={0.2}>
            <div className="flex flex-wrap gap-3 justify-center mb-12">
              <Link href="/collections/smartphones">
                <button className="px-6 py-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#F59E0B]/50 text-white text-sm font-medium tracking-wide rounded-full transition-all duration-300">
                  Smartphones
                </button>
              </Link>
              <Link href="/collections/ordinateurs-portables">
                <button className="px-6 py-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#F59E0B]/50 text-white text-sm font-medium tracking-wide rounded-full transition-all duration-300">
                  Ordinateurs portables
                </button>
              </Link>
              <Link href="/collections/montres-connectees">
                <button className="px-6 py-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#F59E0B]/50 text-white text-sm font-medium tracking-wide rounded-full transition-all duration-300">
                  Montres Connectées
                </button>
              </Link>
              <Link href="/collections/ecouteurs-audio">
                <button className="px-6 py-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#F59E0B]/50 text-white text-sm font-medium tracking-wide rounded-full transition-all duration-300">
                  Écouteurs & Audio
                </button>
              </Link>
            </div>
          </SmoothReveal>

          {/* Grille de produits */}
          {products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {enhancedProducts.map((product, i) => (
                <SmoothReveal key={product.id} direction="up" delay={i * 0.03}>
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

                      <h3 className="text-xl font-bold group-hover:text-[#F59E0B] transition-colors duration-300 line-clamp-2">
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
          ) : (
            <SmoothReveal direction="up">
              <div className="text-center py-20">
                <div className="text-6xl mb-4">📦</div>
                <h2 className="text-2xl font-bold mb-2">Aucun produit disponible</h2>
                <p className="text-[#dbd7d7] mb-8">
                  Aucun produit n&apos;a été trouvé pour le moment.
                </p>
                <Link
                  href="/"
                  className="inline-block px-8 py-4 bg-[#F59E0B] hover:bg-[#D97706] text-black font-medium tracking-wide uppercase transition-all duration-300"
                >
                  Retour à l&apos;accueil
                </Link>
              </div>
            </SmoothReveal>
          )}

        </div>
      </main>
    </>
  );
}
