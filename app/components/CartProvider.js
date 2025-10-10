'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Charger le cart depuis localStorage au démarrage
  useEffect(() => {
    const savedCart = localStorage.getItem('shopify_cart');
    if (savedCart) {
      const cartData = JSON.parse(savedCart);
      setCart(cartData);
      updateCartCount(cartData);
    }
  }, []);

  // Sauvegarder le cart dans localStorage
  const saveCart = (cartData) => {
    localStorage.setItem('shopify_cart', JSON.stringify(cartData));
    setCart(cartData);
    updateCartCount(cartData);
  };

  // Calculer le nombre total d'articles
  const updateCartCount = (cartData) => {
    if (!cartData || !cartData.lines) {
      setCartCount(0);
      return;
    }
    const total = cartData.lines.edges.reduce(
      (sum, { node }) => sum + node.quantity,
      0
    );
    setCartCount(total);
  };

  // Créer un nouveau cart
  const createCart = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'create' }),
      });

      if (!response.ok) throw new Error('Failed to create cart');

      const { cart } = await response.json();
      saveCart(cart);
      return cart;
    } catch (error) {
      console.error('Error creating cart:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Ajouter un produit au cart
  const addToCart = async (variantId, quantity = 1) => {
    setIsLoading(true);
    try {
      // Si pas de cart, en créer un d'abord
      let currentCart = cart;
      if (!currentCart) {
        currentCart = await createCart();
      }

      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'add',
          cartId: currentCart.id,
          variantId,
          quantity,
        }),
      });

      if (!response.ok) throw new Error('Failed to add to cart');

      const { cart: updatedCart } = await response.json();
      saveCart(updatedCart);
      return updatedCart;
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Ouvrir le drawer
  const openDrawer = () => {
    setIsDrawerOpen(true);
  };

  // Fermer le drawer
  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

  // Mettre à jour la quantité d'un produit
  const updateQuantity = async (lineId, quantity) => {
    if (!cart) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update',
          cartId: cart.id,
          lineId,
          quantity,
        }),
      });

      if (!response.ok) throw new Error('Failed to update cart');

      const { cart: updatedCart } = await response.json();
      saveCart(updatedCart);
    } catch (error) {
      console.error('Error updating cart:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Supprimer un produit du cart
  const removeItem = async (lineId) => {
    if (!cart) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'remove',
          cartId: cart.id,
          lineId,
        }),
      });

      if (!response.ok) throw new Error('Failed to remove item');

      const { cart: updatedCart } = await response.json();
      saveCart(updatedCart);
    } catch (error) {
      console.error('Error removing item:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Aller au checkout
  const goToCheckout = () => {
    if (cart && cart.checkoutUrl) {
      // Vider le panier local avant la redirection
      // (car Shopify ne notifie pas automatiquement qu'un checkout est complété)
      localStorage.removeItem('shopify_cart');
      setCart(null);
      setCartCount(0);

      // Rediriger vers Shopify checkout
      window.location.href = cart.checkoutUrl;
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        isLoading,
        isDrawerOpen,
        addToCart,
        openDrawer,
        closeDrawer,
        updateQuantity,
        removeItem,
        goToCheckout,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}
