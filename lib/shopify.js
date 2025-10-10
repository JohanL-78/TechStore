const domain = process.env.SHOPIFY_STORE_DOMAIN;
const storefrontAccessToken = process.env.SHOPIFY_STOREFRONT_TOKEN;

/**
 * Fonction générique pour interroger l'API Shopify Storefront
 * @param {Object} params
 * @param {string} params.query - La requête GraphQL
 * @param {Object} params.variables - Les variables GraphQL
 * @param {Object} params.cache - Options de cache Next.js
 * @returns {Promise<Object>} - Les données de l'API
 */
async function shopifyFetch({ query, variables = {}, cache = {} }) {
  const endpoint = `https://${domain}/api/2024-10/graphql.json`;

  // Options de cache par défaut : revalidate toutes les heures
  const defaultCache = {
    next: { revalidate: 3600 } // 1 heure
  };

  // Merge des options de cache
  const fetchOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': storefrontAccessToken,
    },
    body: JSON.stringify({ query, variables }),
    ...defaultCache,
    ...cache, // Permet de surcharger le cache par requête
  };

  try {
    const response = await fetch(endpoint, fetchOptions);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const json = await response.json();

    if (json.errors) {
      throw new Error(json.errors[0].message);
    }

    return json.data;
  } catch (error) {
    console.error('Shopify API Error:', error);
    throw error;
  }
}

// Récupérer tous les produits
export async function getProducts(first = 20) {
  const query = `
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
  `;

  // ✅ Cache de 30 minutes pour la liste des produits
  // (permet de voir rapidement les nouveaux produits ajoutés)
  const data = await shopifyFetch({
    query,
    variables: { first },
    cache: { next: { revalidate: 1800 } } // 30 min
  });

  return data.products.edges.map(({ node }) => ({
    id: node.id,
    name: node.title,
    handle: node.handle,
    description: node.description,
    price: parseFloat(node.priceRange.minVariantPrice.amount),
    currency: node.priceRange.minVariantPrice.currencyCode,
    image: node.images.edges[0]?.node.url || '',
    imageAlt: node.images.edges[0]?.node.altText || node.title,
    variantId: node.variants.edges[0]?.node.id,
    tags: node.tags,
    category: node.category?.name || node.productType || 'General',
  }));
}

// Créer un cart Shopify
export async function createCart() {
  const query = `
    mutation {
      cartCreate {
        cart {
          id
          checkoutUrl
          totalQuantity
          lines(first: 100) {
            edges {
              node {
                id
                quantity
              }
            }
          }
          cost {
            totalAmount {
              amount
              currencyCode
            }
            subtotalAmount {
              amount
              currencyCode
            }
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  // ❌ PAS de cache pour les opérations de panier (données personnelles)
  const data = await shopifyFetch({
    query,
    cache: { cache: 'no-store' } // Toujours récupérer la dernière version
  });

  if (data.cartCreate.userErrors.length > 0) {
    throw new Error(data.cartCreate.userErrors[0].message);
  }

  return data.cartCreate.cart;
}

// Ajouter un produit au cart
export async function addToCart(cartId, variantId, quantity = 1) {
  const query = `
    mutation AddToCart($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart {
          id
          checkoutUrl
          totalQuantity
          lines(first: 100) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    priceV2 {
                      amount
                      currencyCode
                    }
                    product {
                      title
                      images(first: 1) {
                        edges {
                          node {
                            url
                            altText
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
          cost {
            totalAmount {
              amount
              currencyCode
            }
            subtotalAmount {
              amount
              currencyCode
            }
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const variables = {
    cartId,
    lines: [
      {
        merchandiseId: variantId,
        quantity,
      },
    ],
  };

  // ❌ PAS de cache pour les opérations de panier
  const data = await shopifyFetch({
    query,
    variables,
    cache: { cache: 'no-store' }
  });

  if (data.cartLinesAdd.userErrors.length > 0) {
    throw new Error(data.cartLinesAdd.userErrors[0].message);
  }

  return data.cartLinesAdd.cart;
}


// Mettre à jour la quantité d'un produit dans le cart
export async function updateCartLines(cartId, lineId, quantity) {
  const query = `
    mutation UpdateCartLines($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
      cartLinesUpdate(cartId: $cartId, lines: $lines) {
        cart {
          id
          checkoutUrl
          totalQuantity
          lines(first: 100) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    priceV2 {
                      amount
                      currencyCode
                    }
                    product {
                      title
                      images(first: 1) {
                        edges {
                          node {
                            url
                            altText
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
          cost {
            totalAmount {
              amount
              currencyCode
            }
            subtotalAmount {
              amount
              currencyCode
            }
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const variables = {
    cartId,
    lines: [
      {
        id: lineId,
        quantity,
      },
    ],
  };

  // ❌ PAS de cache pour les opérations de panier
  const data = await shopifyFetch({
    query,
    variables,
    cache: { cache: 'no-store' }
  });

  if (data.cartLinesUpdate.userErrors.length > 0) {
    throw new Error(data.cartLinesUpdate.userErrors[0].message);
  }

  return data.cartLinesUpdate.cart;
}

// Supprimer un produit du cart
export async function removeFromCart(cartId, lineId) {
  const query = `
    mutation RemoveFromCart($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
        cart {
          id
          checkoutUrl
          totalQuantity
          lines(first: 100) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    priceV2 {
                      amount
                      currencyCode
                    }
                    product {
                      title
                      images(first: 1) {
                        edges {
                          node {
                            url
                            altText
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
          cost {
            totalAmount {
              amount
              currencyCode
            }
            subtotalAmount {
              amount
              currencyCode
            }
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const variables = {
    cartId,
    lineIds: [lineId],
  };

  // ❌ PAS de cache pour les opérations de panier
  const data = await shopifyFetch({
    query,
    variables,
    cache: { cache: 'no-store' }
  });

  if (data.cartLinesRemove.userErrors.length > 0) {
    throw new Error(data.cartLinesRemove.userErrors[0].message);
  }

  return data.cartLinesRemove.cart;
}



// Récupérer une collection Shopify par handle (avec filtrage serveur optimal)
export async function getCollection(handle, first = 50) {
  const query = `
    query GetCollection($handle: String!, $first: Int!) {
      collectionByHandle(handle: $handle) {
        id
        title
        description
        handle
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
    }
  `;

  // ✅ Cache de 30 minutes pour les collections
  // Performance optimale : Shopify filtre les produits côté serveur
  const data = await shopifyFetch({
    query,
    variables: { handle, first },
    cache: { next: { revalidate: 1800 } } // 30 min
  });

  if (!data.collectionByHandle) return null;

  const collection = data.collectionByHandle;

  return {
    id: collection.id,
    title: collection.title,
    description: collection.description,
    handle: collection.handle,
    products: collection.products.edges.map(({ node }) => ({
      id: node.id,
      name: node.title,
      handle: node.handle,
      description: node.description,
      price: parseFloat(node.priceRange.minVariantPrice.amount),
      currency: node.priceRange.minVariantPrice.currencyCode,
      image: node.images.edges[0]?.node.url || '',
      imageAlt: node.images.edges[0]?.node.altText || node.title,
      variantId: node.variants.edges[0]?.node.id,
      tags: node.tags,
      category: node.category?.name || node.productType || 'General',
    }))
  };
}

// Récupérer un produit spécifique par handle
export async function getProduct(handle) {
  const query = `
    query GetProduct($handle: String!) {
      productByHandle(handle: $handle) {
        id
        title
        handle
        description
        descriptionHtml
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
        images(first: 5) {
          edges {
            node {
              url
              altText
            }
          }
        }
        variants(first: 10) {
          edges {
            node {
              id
              title
              priceV2 {
                amount
                currencyCode
              }
              availableForSale
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
  `;

  // ✅ Cache de 2 heures pour un produit spécifique
  // (les détails d'un produit changent rarement)
  const data = await shopifyFetch({
    query,
    variables: { handle },
    cache: { next: { revalidate: 7200 } } // 2 heures
  });

  const product = data.productByHandle;

  if (!product) return null;

  return {
    id: product.id,
    name: product.title,
    handle: product.handle,
    description: product.description,
    descriptionHtml: product.descriptionHtml,
    price: parseFloat(product.priceRange.minVariantPrice.amount),
    currency: product.priceRange.minVariantPrice.currencyCode,
    images: product.images.edges.map(({ node }) => ({
      url: node.url,
      alt: node.altText || product.title,
    })),
    variants: product.variants.edges.map(({ node }) => ({
      id: node.id,
      title: node.title,
      price: parseFloat(node.priceV2.amount),
      currency: node.priceV2.currencyCode,
      availableForSale: node.availableForSale,
    })),
    tags: product.tags,
    category: product.category?.name || product.productType || 'General',
  };
}
