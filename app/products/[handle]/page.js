import { notFound } from 'next/navigation';
import Image from 'next/image';
import { getProduct, getProducts } from '@/lib/shopify';
import SmoothReveal from '@/app/components/SmoothReveal';
import ScrollProgress from '@/app/components/ScrollProgress';
import Navbar from '@/app/components/Navbar';
import AddToCartButton from '@/app/components/AddToCartButton';
import Link from 'next/link';
import { Truck, RotateCcw, Lock, ArrowLeft } from 'lucide-react';

// Mapper les catégories Shopify (en anglais) vers les noms français
const getCategoryDisplayName = (category) => {
  const categoryMapping = {
    'Mobile & Smart Phones': 'Smartphones',
    'Laptops': 'Ordinateurs portables',
    'Smart Watches': 'Montres Connectées',
    'Over-Ear Headphones': 'Écouteurs & Audio',
    'Accessories': 'Accessoires'
  };

  return categoryMapping[category] || category;
};

// Générer les metadata dynamiques pour le SEO
export async function generateMetadata({ params }) {
  const { handle } = await params;
  const product = await getProduct(handle);

  if (!product) {
    return {
      title: 'Produit non trouvé',
    };
  }

  return {
    title: `${product.name} | TechStore`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [product.images[0]?.url],
    },
  };
}

// Générer les pages statiques au build time pour de meilleures performances
export async function generateStaticParams() {
  try {
    const products = await getProducts(50);
    return products.map((product) => ({
      handle: product.handle,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

export default async function ProductPage({ params }) {
  const { handle } = await params;
  const product = await getProduct(handle);

  if (!product) {
    notFound();
  }

  // Sélectionner le premier variant disponible par défaut
  const defaultVariant = product.variants.find(v => v.availableForSale) || product.variants[0];

  return (
    <>
      <ScrollProgress color="#F59E0B" height={3} />
      <Navbar />

      <main className="bg-[#0a0a0a] text-white font-[family-name:var(--font-inter)] min-h-screen">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-24">
          {/* Breadcrumb */}
          <SmoothReveal direction="up">
            <nav className="flex items-center gap-2 text-sm text-[#b3b3b3] mb-12">
              <Link href="/" className="hover:text-[#F59E0B] transition-colors">
                Accueil
              </Link>
              <span>/</span>
              <span className="text-white">{product.name}</span>
            </nav>
          </SmoothReveal>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Images Section */}
            <div className="space-y-4">
              <SmoothReveal direction="left">
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-[#0f0f0f]">
                  {product.images[0] ? (
                    <Image
                      src={product.images[0].url}
                      alt={product.images[0].alt}
                      fill
                      className="object-cover"
                      priority
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-[#b3b3b3]">
                      Aucune image disponible
                    </div>
                  )}
                </div>
              </SmoothReveal>

              {/* Thumbnails */}
              {product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-4">
                  {product.images.slice(1, 5).map((image, i) => (
                    <SmoothReveal key={i} direction="up" delay={i * 0.1}>
                      <div className="relative aspect-square rounded-lg overflow-hidden bg-[#0f0f0f] cursor-pointer hover:opacity-80 transition-opacity">
                        <Image
                          src={image.url}
                          alt={image.alt}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 25vw, 12vw"
                        />
                      </div>
                    </SmoothReveal>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info Section */}
            <div className="space-y-8">
              <div>
                <SmoothReveal direction="right">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-sm text-[#F59E0B] font-medium tracking-wide uppercase">
                      {getCategoryDisplayName(product.category)}
                    </span>
                    {product.tags.some(tag => tag.toLowerCase() === 'new') && (
                      <span className="px-3 py-1 text-xs font-bold tracking-wide uppercase rounded bg-[#F59E0B] text-black">
                        Nouveau
                      </span>
                    )}
                  </div>
                </SmoothReveal>

                <SmoothReveal direction="right" delay={0.1}>
                  <h1 className="text-[clamp(2.5rem,5vw,4rem)] font-bold tracking-tighter mb-6">
                    {product.name}
                  </h1>
                </SmoothReveal>

                <SmoothReveal direction="right" delay={0.2}>
                  <div className="flex items-baseline gap-4 mb-8">
                    <span className="text-4xl font-bold text-[#F59E0B]">
                      {product.currency} ${product.price.toFixed(2)}
                    </span>
                  </div>
                </SmoothReveal>
              </div>

              <SmoothReveal direction="right" delay={0.3}>
                <div className="border-t border-white/10 pt-8">
                  <h2 className="text-xl font-bold mb-4">Description</h2>
                  <div
                    className="text-[#ccc] leading-relaxed space-y-4"
                    dangerouslySetInnerHTML={{ __html: product.descriptionHtml || product.description }}
                  />
                </div>
              </SmoothReveal>

              {/* Variants */}
              {product.variants.length > 1 && (
                <SmoothReveal direction="right" delay={0.4}>
                  <div className="border-t border-white/10 pt-8">
                    <h3 className="text-lg font-bold mb-4">Variantes disponibles</h3>
                    <div className="flex flex-wrap gap-3">
                      {product.variants.map((variant, i) => (
                        <button
                          key={i}
                          disabled={!variant.availableForSale}
                          className={`px-4 py-2 rounded-lg border transition-all duration-300 ${
                            variant.availableForSale
                              ? 'border-white/20 hover:border-[#F59E0B] hover:bg-[#F59E0B]/10'
                              : 'border-white/10 text-[#b3b3b3] cursor-not-allowed opacity-50'
                          } ${i === 0 && variant.availableForSale ? 'border-[#F59E0B] bg-[#F59E0B]/10' : ''}`}
                        >
                          <span className="block text-sm font-medium">{variant.title}</span>
                          {variant.title !== 'Default Title' && (
                            <span className="block text-xs text-[#dbd7d7] mt-1">
                              ${variant.price.toFixed(2)}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </SmoothReveal>
              )}

              {/* Add to Cart */}
              <SmoothReveal direction="right" delay={0.5}>
                <div className="border-t border-white/10 pt-8 space-y-4">
                  <AddToCartButton
                    variantId={defaultVariant.id}
                    productName={product.name}
                    variant="default"
                  />

                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="p-4 rounded-lg bg-[#0f0f0f] border border-white/5 hover:border-[#F59E0B]/30 transition-colors">
                      <Truck className="w-8 h-8 mx-auto mb-2 text-[#F59E0B]" />
                      <div className="text-xs text-[#b3b3b3]">Livraison gratuite</div>
                    </div>
                    <div className="p-4 rounded-lg bg-[#0f0f0f] border border-white/5 hover:border-[#F59E0B]/30 transition-colors">
                      <RotateCcw className="w-8 h-8 mx-auto mb-2 text-[#F59E0B]" />
                      <div className="text-xs text-[#b3b3b3]">Retour 30 jours</div>
                    </div>
                    <div className="p-4 rounded-lg bg-[#0f0f0f] border border-white/5 hover:border-[#F59E0B]/30 transition-colors">
                      <Lock className="w-8 h-8 mx-auto mb-2 text-[#F59E0B]" />
                      <div className="text-xs text-[#b3b3b3]">Paiement sécurisé</div>
                    </div>
                  </div>
                </div>
              </SmoothReveal>

              {/* Product Details */}
              <SmoothReveal direction="right" delay={0.6}>
                <div className="border-t border-white/10 pt-8">
                  <h3 className="text-lg font-bold mb-4">Détails du produit</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between py-2 border-b border-white/5">
                      <span className="text-[#b3b3b3]">Catégorie</span>
                      <span className="font-medium">{getCategoryDisplayName(product.category)}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-white/5">
                      <span className="text-[#b3b3b3]">Disponibilité</span>
                      <span className="font-medium text-green-500">En stock</span>
                    </div>
                    {product.tags.length > 0 && (
                      <div className="flex justify-between py-2 border-b border-white/5">
                        <span className="text-[#b3b3b3]">Tags</span>
                        <div className="flex flex-wrap gap-2 justify-end">
                          {product.tags.map((tag, i) => (
                            <span key={i} className="px-2 py-1 text-xs rounded bg-white/5">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </SmoothReveal>
            </div>
          </div>

          {/* Back to Shop Button */}
          <SmoothReveal direction="up" delay={0.7}>
            <div className="mt-16 text-center">
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#F59E0B]/50 text-white text-sm font-medium tracking-wide uppercase transition-all duration-300"
              >
                <ArrowLeft className="w-5 h-5" />
                Retour à la boutique
              </Link>
            </div>
          </SmoothReveal>
        </div>
      </main>
    </>
  );
}
