# 📘 Guide de Maîtrise : lib/shopify.js

## 🎯 Vue d'ensemble

Ce fichier est le **cœur de votre intégration Shopify**. Il contient toutes les fonctions pour communiquer avec l'API Shopify via GraphQL.

---

## 🔧 1. Fonction principale : `shopifyFetch()`

### À quoi ça sert ?
C'est la **fonction générique** qui gère toutes les requêtes GraphQL vers Shopify.

### Comment ça marche ?

```javascript
async function shopifyFetch({ query, variables = {}, cache = {} })
```

**Paramètres :**
- `query` : Votre requête GraphQL (string)
- `variables` : Les variables de votre requête (object)
- `cache` : Options de cache Next.js (object)

**Exemple d'utilisation interne :**
```javascript
const data = await shopifyFetch({
  query: `query { products(first: 5) { edges { node { id title } } } }`,
  variables: { first: 5 },
  cache: { next: { revalidate: 3600 } } // 1 heure
});
```

### Le workflow :
1. **Construit l'endpoint** : `https://votrestore.myshopify.com/api/2024-10/graphql.json`
2. **Ajoute le token** : Header `X-Shopify-Storefront-Access-Token`
3. **Envoie la requête** : POST avec query + variables
4. **Gère les erreurs** : HTTP errors ET GraphQL errors
5. **Retourne les données** : `json.data`

---

## 📦 2. Récupérer des produits : `getProducts(first)`

### Signature
```javascript
export async function getProducts(first = 20)
```

### Utilisation
```javascript
// Dans un Server Component
const products = await getProducts(10); // 10 premiers produits

// Résultat
[
  {
    id: "gid://shopify/Product/123",
    name: "iPhone 15 Pro",
    handle: "iphone-15-pro",
    description: "...",
    price: 999.99,
    currency: "EUR",
    image: "https://cdn.shopify.com/...",
    imageAlt: "iPhone 15 Pro",
    variantId: "gid://shopify/ProductVariant/456",
    tags: ["new", "smartphones"],
    category: "Smartphones"
  },
  // ...
]
```

### La requête GraphQL utilisée
```graphql
query GetProducts($first: Int!) {
  products(first: $first) {
    edges {
      node {
        id
        title
        handle
        description
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
        images(first: 1) {
          edges {
            node {
              url
              altText
            }
          }
        }
        variants(first: 1) {
          edges {
            node {
              id
            }
          }
        }
        tags
        productType
        category {
          name
        }
      }
    }
  }
}
```

### Points clés
- **Cache** : 30 minutes (équilibre entre performance et fraîcheur)
- **Transformation** : Convertit le format Shopify complexe en objet simple
- **Handle** : Slug du produit pour les URLs (`/products/iphone-15-pro`)
- **variantId** : ID nécessaire pour ajouter au panier

---

## 🎯 3. Récupérer UN produit : `getProduct(handle)`

### Signature
```javascript
export async function getProduct(handle)
```

### Utilisation
```javascript
// Dans app/products/[handle]/page.js
const product = await getProduct("iphone-15-pro");

if (!product) {
  return <div>Produit introuvable</div>;
}

// Résultat
{
  id: "gid://shopify/Product/123",
  name: "iPhone 15 Pro",
  handle: "iphone-15-pro",
  description: "Texte brut",
  descriptionHtml: "<p>HTML formaté</p>",
  price: 999.99,
  currency: "EUR",
  images: [
    { url: "https://...", alt: "iPhone 15 Pro" },
    { url: "https://...", alt: "iPhone 15 Pro - Vue arrière" }
  ],
  variants: [
    {
      id: "gid://shopify/ProductVariant/456",
      title: "256GB / Titanium Blue",
      price: 999.99,
      currency: "EUR",
      availableForSale: true
    }
  ],
  tags: ["new", "smartphones"],
  category: "Smartphones"
}
```

### Points clés
- **Cache** : 2 heures (les détails changent rarement)
- **Images multiples** : Jusqu'à 5 images
- **Variants multiples** : Jusqu'à 10 variantes (tailles, couleurs, etc.)
- **descriptionHtml** : Pour afficher du contenu riche

### Exemple d'affichage
```jsx
<div>
  <h1>{product.name}</h1>
  <p>${product.price}</p>
  <div dangerouslySetInnerHTML={{ __html: product.descriptionHtml }} />

  {/* Sélecteur de variant */}
  <select>
    {product.variants.map(v => (
      <option key={v.id} disabled={!v.availableForSale}>
        {v.title} - ${v.price}
      </option>
    ))}
  </select>
</div>
```

---

## 🏷️ 4. Récupérer une collection : `getCollection(handle, first)`

### Signature
```javascript
export async function getCollection(handle, first = 50)
```

### Utilisation
```javascript
// Dans app/collections/[tag]/page.js
const collection = await getCollection("smartphones", 20);

if (!collection) {
  return <div>Collection introuvable</div>;
}

// Résultat
{
  id: "gid://shopify/Collection/789",
  title: "Smartphones",
  description: "Notre sélection de smartphones",
  handle: "smartphones",
  products: [
    { /* même format que getProducts() */ },
    { /* ... */ }
  ]
}
```

### Points clés
- **Filtrage serveur** : Shopify filtre côté serveur = OPTIMAL
- **Cache** : 30 minutes
- **Handle** : Le "slug" de la collection dans Shopify

### Comment créer des collections dans Shopify ?
1. Admin Shopify → Products → Collections
2. Créer une collection
3. Le **handle** est généré automatiquement depuis le titre
   - "Smartphones" → `smartphones`
   - "Montres Connectées" → `montres-connectees`

---

## 🛒 5. Gestion du panier (4 fonctions)

### 5.1 Créer un panier : `createCart()`

```javascript
export async function createCart()
```

**Utilisation :**
```javascript
const cart = await createCart();

// Résultat
{
  id: "gid://shopify/Cart/abc123",
  checkoutUrl: "https://votrestore.myshopify.com/cart/c/abc123",
  totalQuantity: 0,
  lines: { edges: [] },
  cost: {
    totalAmount: { amount: "0.00", currencyCode: "EUR" },
    subtotalAmount: { amount: "0.00", currencyCode: "EUR" }
  }
}
```

**Quand l'utiliser ?**
- Au premier ajout au panier d'un utilisateur
- Automatiquement appelé par `CartProvider` si pas de panier existant

---

### 5.2 Ajouter au panier : `addToCart(cartId, variantId, quantity)`

```javascript
export async function addToCart(cartId, variantId, quantity = 1)
```

**Utilisation :**
```javascript
const updatedCart = await addToCart(
  "gid://shopify/Cart/abc123",           // ID du panier
  "gid://shopify/ProductVariant/456",    // ID du variant
  2                                       // Quantité
);

// Résultat : même structure que createCart() mais avec les lignes remplies
{
  id: "gid://shopify/Cart/abc123",
  totalQuantity: 2,
  lines: {
    edges: [
      {
        node: {
          id: "gid://shopify/CartLine/xyz",
          quantity: 2,
          merchandise: {
            id: "gid://shopify/ProductVariant/456",
            title: "256GB / Blue",
            priceV2: { amount: "999.99", currencyCode: "EUR" },
            product: {
              title: "iPhone 15 Pro",
              images: [...]
            }
          }
        }
      }
    ]
  },
  cost: {
    totalAmount: { amount: "1999.98", currencyCode: "EUR" }
  }
}
```

**Points clés :**
- Retourne le **panier complet** mis à jour
- Si le variant existe déjà, ajoute à la quantité existante
- `merchandise` : Contient toutes les infos du produit

---

### 5.3 Mettre à jour quantité : `updateCartLines(cartId, lineId, quantity)`

```javascript
export async function updateCartLines(cartId, lineId, quantity)
```

**Utilisation :**
```javascript
// Passer de 2 à 5 unités
const updatedCart = await updateCartLines(
  "gid://shopify/Cart/abc123",
  "gid://shopify/CartLine/xyz",  // ID de la LIGNE (pas du variant!)
  5
);
```

**Attention :**
- `lineId` ≠ `variantId`
- Le `lineId` vient de `cart.lines.edges[i].node.id`
- Si `quantity = 0`, la ligne est supprimée

---

### 5.4 Supprimer du panier : `removeFromCart(cartId, lineId)`

```javascript
export async function removeFromCart(cartId, lineId)
```

**Utilisation :**
```javascript
const updatedCart = await removeFromCart(
  "gid://shopify/Cart/abc123",
  "gid://shopify/CartLine/xyz"
);
```

---

## 📄 6. Récupérer une page : `getPage(handle)`

### Signature
```javascript
export async function getPage(handle)
```

### Utilisation
```javascript
const page = await getPage("about-us");

// Résultat
{
  id: "gid://shopify/Page/123",
  title: "À propos",
  body: "Contenu de la page...",
  handle: "about-us",
  updatedAt: "2025-01-15T10:30:00Z"
}
```

**Cas d'usage :**
- Page "À propos"
- Page "CGV"
- Page "FAQ"
- Toute page statique créée dans Shopify Admin

---

## 🎓 Exercices pratiques

### Exercice 1 : Afficher tous les produits
```javascript
// app/products/page.js
import { getProducts } from '@/lib/shopify';

export default async function ProductsPage() {
  const products = await getProducts(50);

  return (
    <div className="grid grid-cols-3 gap-4">
      {products.map(product => (
        <div key={product.id}>
          <img src={product.image} alt={product.imageAlt} />
          <h3>{product.name}</h3>
          <p>${product.price}</p>
        </div>
      ))}
    </div>
  );
}
```

### Exercice 2 : Page produit avec variants
```javascript
// app/products/[handle]/page.js
import { getProduct } from '@/lib/shopify';

export default async function ProductPage({ params }) {
  const product = await getProduct(params.handle);

  if (!product) return <div>Produit non trouvé</div>;

  return (
    <div>
      <h1>{product.name}</h1>
      <div>
        {product.images.map((img, i) => (
          <img key={i} src={img.url} alt={img.alt} />
        ))}
      </div>

      <select>
        {product.variants.map(variant => (
          <option
            key={variant.id}
            value={variant.id}
            disabled={!variant.availableForSale}
          >
            {variant.title} - ${variant.price}
          </option>
        ))}
      </select>
    </div>
  );
}
```

### Exercice 3 : Utiliser le panier (côté client)
```javascript
'use client';
import { useCart } from '@/app/components/CartProvider';

export default function AddToCartButton({ variantId }) {
  const { addToCart, isLoading } = useCart();

  const handleClick = async () => {
    try {
      await addToCart(variantId, 1);
      alert('Ajouté au panier !');
    } catch (error) {
      alert('Erreur : ' + error.message);
    }
  };

  return (
    <button onClick={handleClick} disabled={isLoading}>
      {isLoading ? 'Ajout...' : 'Ajouter au panier'}
    </button>
  );
}
```

---

## 🔍 Debugging : Comment tester vos requêtes

### Méthode 1 : Console dans le navigateur
```javascript
// Ajouter dans votre composant
const products = await getProducts(5);
console.log('Products:', products);
```

### Méthode 2 : Logs serveur
```javascript
// Dans lib/shopify.js, ligne 39
const json = await response.json();
console.log('Shopify Response:', JSON.stringify(json, null, 2));
```

### Méthode 3 : Tester directement dans Shopify GraphQL Explorer
1. Admin Shopify → Apps → Développer des applications
2. Créer une app (si pas déjà fait)
3. Storefront API → GraphiQL explorer
4. Tester vos requêtes en direct

---

## ⚠️ Erreurs courantes

### Erreur 1 : "Cannot read property 'edges' of undefined"
**Cause :** La requête GraphQL n'a rien retourné
```javascript
// ❌ Mauvais
const products = data.products.edges;

// ✅ Bon
const products = data?.products?.edges || [];
```

### Erreur 2 : "Invalid handle"
**Cause :** Le handle n'existe pas dans Shopify
```javascript
const product = await getProduct("iphone-15-prooo"); // Typo!
// product = null

// Toujours vérifier
if (!product) {
  notFound(); // Next.js 15
}
```

### Erreur 3 : "cartId is required"
**Cause :** Essayer d'ajouter au panier sans créer de cart d'abord
```javascript
// ❌ Mauvais
await addToCart(null, variantId);

// ✅ Bon - CartProvider gère ça automatiquement
const { addToCart } = useCart(); // Crée le cart si besoin
await addToCart(variantId);
```

---

## 🎯 Checklist de maîtrise

- [ ] Je comprends le rôle de `shopifyFetch()`
- [ ] Je sais récupérer des produits avec `getProducts()`
- [ ] Je sais afficher un produit avec `getProduct()`
- [ ] Je comprends la différence entre `variantId` et `lineId`
- [ ] Je sais créer et gérer un panier
- [ ] Je comprends la stratégie de cache (quand/pourquoi)
- [ ] Je peux débugger une requête GraphQL qui ne fonctionne pas
- [ ] Je sais où trouver les handles dans Shopify Admin

---

## 🚀 Pour aller plus loin

### Ajouter une fonction de recherche
```javascript
export async function searchProducts(searchTerm) {
  const query = `
    query SearchProducts($query: String!) {
      products(first: 20, query: $query) {
        edges {
          node {
            id
            title
            handle
            # ... autres champs
          }
        }
      }
    }
  `;

  const data = await shopifyFetch({
    query,
    variables: { query: searchTerm },
    cache: { next: { revalidate: 300 } } // 5 min
  });

  return data.products.edges.map(({ node }) => ({
    id: node.id,
    name: node.title,
    handle: node.handle,
    // ... transformation
  }));
}
```

### Récupérer les collections disponibles
```javascript
export async function getAllCollections() {
  const query = `
    query GetCollections {
      collections(first: 20) {
        edges {
          node {
            id
            title
            handle
            description
            image {
              url
            }
          }
        }
      }
    }
  `;

  const data = await shopifyFetch({
    query,
    cache: { next: { revalidate: 3600 } }
  });

  return data.collections.edges.map(({ node }) => node);
}
```

---

## 📚 Ressources

- [Shopify Storefront API Reference](https://shopify.dev/docs/api/storefront)
- [GraphQL Basics](https://graphql.org/learn/)
- [Next.js Caching](https://nextjs.org/docs/app/building-your-application/caching)

---

**Dernière mise à jour** : 2025
**Version API Shopify** : 2024-10
