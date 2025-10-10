import { getProducts, getCollection } from '@/lib/shopify';

export default async function sitemap() {
  // En production (Vercel), utilisez la variable d'environnement
  // En local, fallback non important (le sitemap n'est pas utilisé en dev)
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  // Pages statiques
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
  ];

  // Récupérer tous les produits
  let productPages = [];
  try {
    const products = await getProducts(100);
    productPages = products.map((product) => ({
      url: `${baseUrl}/products/${product.handle}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    }));
  } catch (error) {
    console.error('Error generating product sitemap:', error);
  }

  // Collections
  const collectionHandles = [
    'nouveautes',
    'promotions',
    'smartphones',
    'ordinateurs-portables',
    'montres-connectees',
    'ecouteurs-audio',
  ];

  const collectionPages = collectionHandles.map((handle) => ({
    url: `${baseUrl}/collections/${handle}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  return [...staticPages, ...collectionPages, ...productPages];
}
