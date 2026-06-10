# 🚀 Shopify Cheatsheet - Référence Rapide

## 📦 Importer les fonctions

```javascript
import {
  getProducts,
  getProduct,
  getCollection,
  createCart,
  addToCart,
  updateCartLines,
  removeFromCart,
  getPage
} from '@/lib/shopify';
```

---

## 🔥 Les 5 commandes essentielles

### 1. Liste de produits
```javascript
const products = await getProducts(20);
// → Retourne un array de 20 produits
```

### 2. Un produit spécifique
```javascript
const product = await getProduct("iphone-15-pro");
// → Retourne 1 produit ou null
```

### 3. Collection de produits
```javascript
const collection = await getCollection("smartphones", 50);
// → Retourne une collection avec ses produits
```

### 4. Créer un panier (automatique via CartProvider)
```javascript
'use client';
const { addToCart } = useCart();
await addToCart(variantId, quantity);
// → Crée le cart si nécessaire, ajoute le produit
```

### 5. Aller au checkout
```javascript
'use client';
const { goToCheckout } = useCart();
goToCheckout();
// → Redirige vers Shopify checkout
```

---

## 🎯 Patterns d'utilisation

### Server Component (données initiales)
```javascript
// app/products/page.js
export default async function Page() {
  const products = await getProducts();
  return <ProductList products={products} />;
}
```

### Client Component (interactions panier)
```javascript
'use client';
import { useCart } from '@/app/components/CartProvider';

export default function AddToCart({ variantId }) {
  const { addToCart, isLoading } = useCart();

  return (
    <button onClick={() => addToCart(variantId)}>
      Ajouter
    </button>
  );
}
```

---

## 📊 Structure des données retournées

### Produit (getProducts / getProduct)
```javascript
{
  id: "gid://shopify/Product/123",
  name: "iPhone 15 Pro",
  handle: "iphone-15-pro",        // Pour l'URL
  description: "Description...",
  price: 999.99,
  currency: "EUR",
  image: "https://...",
  imageAlt: "...",
  variantId: "gid://...",          // Pour addToCart()
  tags: ["new", "smartphones"],
  category: "Smartphones"
}
```

### Collection (getCollection)
```javascript
{
  id: "gid://shopify/Collection/789",
  title: "Smartphones",
  description: "...",
  handle: "smartphones",
  products: [ /* array de produits */ ]
}
```

### Panier (createCart / addToCart / etc.)
```javascript
{
  id: "gid://shopify/Cart/abc",
  checkoutUrl: "https://...",       // Pour goToCheckout()
  totalQuantity: 3,
  lines: {
    edges: [
      {
        node: {
          id: "gid://shopify/CartLine/xyz",  // Pour updateCartLines()
          quantity: 2,
          merchandise: {
            id: "gid://shopify/ProductVariant/456",
            title: "256GB / Blue",
            priceV2: { amount: "999.99" },
            product: { title: "iPhone 15 Pro" }
          }
        }
      }
    ]
  },
  cost: {
    totalAmount: { amount: "2999.97", currencyCode: "EUR" }
  }
}
```

---

## ⚡ Actions rapides

### Afficher tous les produits
```javascript
const products = await getProducts(100);
```

### Filtrer par collection
```javascript
const smartphones = await getCollection("smartphones");
```

### Page produit dynamique
```javascript
// app/products/[handle]/page.js
export default async function ProductPage({ params }) {
  const product = await getProduct(params.handle);
  // ...
}
```

### Ajouter au panier
```javascript
const { addToCart } = useCart();
await addToCart(variantId, 2);
```

### Modifier quantité
```javascript
const { updateQuantity } = useCart();
await updateQuantity(lineId, 5);
```

### Supprimer du panier
```javascript
const { removeItem } = useCart();
await removeItem(lineId);
```

### Aller au checkout
```javascript
const { goToCheckout } = useCart();
goToCheckout(); // Redirige vers Shopify
```

---

## 🔧 Gestion des erreurs

```javascript
// Produit introuvable
const product = await getProduct("invalid-handle");
if (!product) {
  notFound(); // Next.js 15
}

// Erreur panier
try {
  await addToCart(variantId);
} catch (error) {
  console.error('Erreur:', error.message);
}
```

---

## 🎨 Exemples de composants

### Card produit
```jsx
function ProductCard({ product }) {
  return (
    <div>
      <img src={product.image} alt={product.imageAlt} />
      <h3>{product.name}</h3>
      <p>${product.price}</p>
      <span>{product.category}</span>
    </div>
  );
}
```

### Bouton ajout panier
```jsx
'use client';
function AddToCartBtn({ variantId }) {
  const { addToCart, isLoading } = useCart();

  return (
    <button
      onClick={() => addToCart(variantId)}
      disabled={isLoading}
    >
      {isLoading ? 'Ajout...' : 'Ajouter au panier'}
    </button>
  );
}
```

### Liste du panier
```jsx
'use client';
function CartList() {
  const { cart, removeItem, updateQuantity } = useCart();

  if (!cart?.lines?.edges?.length) {
    return <p>Panier vide</p>;
  }

  return (
    <div>
      {cart.lines.edges.map(({ node }) => (
        <div key={node.id}>
          <h4>{node.merchandise.product.title}</h4>
          <p>Quantité: {node.quantity}</p>
          <button onClick={() => updateQuantity(node.id, node.quantity + 1)}>
            +
          </button>
          <button onClick={() => removeItem(node.id)}>
            Supprimer
          </button>
        </div>
      ))}
      <p>Total: ${cart.cost.totalAmount.amount}</p>
    </div>
  );
}
```

---

## 🐛 Debugging

### Logs serveur
```javascript
const products = await getProducts();
console.log('Products:', products);
```

### Logs client
```javascript
'use client';
const { cart } = useCart();
console.log('Cart:', cart);
```

### Tester dans GraphiQL
1. Admin Shopify
2. Apps → Développer des applications
3. Storefront API → Explorer

---

## 📝 Cache Next.js

| Fonction | Cache | Raison |
|----------|-------|--------|
| `getProducts()` | 30 min | Équilibre perf/fraîcheur |
| `getProduct()` | 2 heures | Détails changent rarement |
| `getCollection()` | 30 min | Collections mises à jour |
| `createCart()` | `no-store` | Données personnelles |
| `addToCart()` | `no-store` | Données personnelles |

---

## 🔑 IDs importants

### variantId
- **Utilisation** : Ajouter au panier
- **Source** : `product.variantId` ou `product.variants[i].id`
- **Format** : `"gid://shopify/ProductVariant/123"`

### lineId
- **Utilisation** : Modifier/supprimer du panier
- **Source** : `cart.lines.edges[i].node.id`
- **Format** : `"gid://shopify/CartLine/abc"`

### handle
- **Utilisation** : URL du produit/collection
- **Source** : `product.handle` ou `collection.handle`
- **Format** : `"iphone-15-pro"` (slug)

---

## 🎯 Checklist rapide

**Pour afficher des produits :**
- [ ] `getProducts()` ou `getCollection()`
- [ ] Map sur l'array
- [ ] Afficher `name`, `price`, `image`

**Pour une page produit :**
- [ ] `getProduct(params.handle)`
- [ ] Vérifier `if (!product) notFound()`
- [ ] Afficher détails + variants

**Pour le panier :**
- [ ] Utiliser `useCart()` (client component)
- [ ] `addToCart(variantId)`
- [ ] `goToCheckout()` pour payer

---

## 🚨 Erreurs fréquentes

❌ Utiliser `addToCart()` sans `'use client'`
✅ Toujours dans un Client Component

❌ Utiliser `product.id` pour ajouter au panier
✅ Utiliser `product.variantId`

❌ Utiliser `variantId` pour modifier le panier
✅ Utiliser `lineId` (de `cart.lines.edges[i].node.id`)

❌ Oublier de vérifier `if (!product)`
✅ Toujours gérer le cas null

---

**Imprime ce cheatsheet et garde-le à portée de main ! 📌**
