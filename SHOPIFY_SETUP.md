# Configuration Shopify Storefront API

## 🎉 Intégration terminée !

Votre application Next.js est maintenant connectée à Shopify via l'API Storefront.

## 📁 Fichiers créés/modifiés

### Nouveaux fichiers :
- **`lib/shopify.js`** - Client Shopify avec fetch natif et requêtes GraphQL
- **`app/components/Navbar.js`** - Composant client pour la navigation
- **`.env.local`** - Variables d'environnement (non commitées)

### Fichiers modifiés :
- **`next.config.mjs`** - Ajout de cdn.shopify.com aux images autorisées
- **`app/page.js`** - Conversion en Server Component avec données Shopify

## 🔧 Configuration actuelle

```env
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN="portfoliostorenext.myshopify.com"
NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN="votre-storefront-token"
```

**Important** : Le domaine doit être juste le nom du store (ex: `portfoliostorenext.myshopify.com`) sans `https://`

## 🚀 Utilisation

### Récupérer des produits
```js
import { getProducts } from '@/lib/shopify';

const products = await getProducts(10); // 10 premiers produits
```

### Récupérer des collections
```js
import { getCollections } from '@/lib/shopify';

const collections = await getCollections(5); // 5 premières collections
```

### Récupérer un produit spécifique
```js
import { getProduct } from '@/lib/shopify';

const product = await getProduct('product-handle');
```

## 📊 Structure des données retournées

### Produit
```js
{
  id: "gid://shopify/Product/123",
  name: "Nom du produit",
  handle: "product-handle",
  description: "Description...",
  price: 99.99,
  currency: "USD",
  image: "https://cdn.shopify.com/...",
  imageAlt: "Alt text",
  tags: ["new", "bestseller"],
  category: "Accessories"
}
```

### Collection
```js
{
  id: "gid://shopify/Collection/123",
  name: "Nom de la collection",
  handle: "collection-handle",
  description: "Description...",
  image: "https://cdn.shopify.com/...",
  imageAlt: "Alt text",
  items: 24 // nombre de produits
}
```

## 🏷️ Tags Shopify

L'application détecte automatiquement les tags suivants dans vos produits Shopify :
- `new` ou `New` → Badge "New" (orange)
- `bestseller` ou `Bestseller` → Badge "Bestseller" (vert)
- `limited` ou `Limited` → Badge "Limited" (violet)

Ajoutez ces tags à vos produits dans l'admin Shopify pour les afficher.

## 🎨 Images

Les images Shopify CDN sont automatiquement optimisées par Next.js Image.
Domaines autorisés :
- `cdn.shopify.com`
- `images.unsplash.com` (fallback)
- `plus.unsplash.com` (fallback)

## 🔄 Mode Développement

Pour tester :
```bash
npm run dev
```

Puis ouvrez http://localhost:3000

## ⚠️ Fallback

Si l'API Shopify échoue, l'application affiche automatiquement des produits mockés pour éviter un écran blanc.

## 📝 Prochaines étapes

1. **Ajouter des produits à votre store Shopify** en mode dev
2. **Tester l'intégration** - Vérifiez que les produits s'affichent
3. **Ajouter un système de panier** (Context API ou Zustand)
4. **Créer des pages produit dynamiques** avec `/products/[handle]`
5. **Implémenter le Checkout API** de Shopify pour les paiements

## 🐛 Debug

Si les produits ne s'affichent pas :
1. Vérifiez que les credentials dans `.env.local` sont corrects
2. Vérifiez que votre app Shopify a les permissions Storefront API
3. Ouvrez la console du navigateur pour voir les erreurs
4. Vérifiez que vous avez au moins quelques produits publiés dans votre store

## 📚 Ressources

- [Shopify Storefront API Docs](https://shopify.dev/docs/api/storefront)
- [GraphiQL Explorer](https://shopify.dev/docs/api/storefront/reference) pour tester vos requêtes
