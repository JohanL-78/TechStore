'use client';

import { useState } from 'react';
import { useCart } from './CartProvider';
import { ShoppingCart, Check, Loader2 } from 'lucide-react';

export default function AddToCartButton({
  variantId,
  productName,
  variant = 'overlay', // 'overlay' pour la page principale, 'default' pour la page de détail
  className = ''
}) {
  const { addToCart, isLoading } = useCart();
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!variantId) {
      console.error('No variant ID provided');
      return;
    }

    setAdding(true);
    try {
      await addToCart(variantId, 1);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setAdding(false);
    }
  };

  const baseClasses = "flex items-center justify-center gap-2 px-6 py-3 font-medium tracking-wide uppercase transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed";

  const variantClasses = {
    overlay: "absolute bottom-4 left-4 right-4 bg-white hover:bg-[#F59E0B] text-black opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0",
    default: "w-full bg-[#F59E0B] hover:bg-[#D97706] text-black text-base"
  };

  return (
    <button aria-label="Ajouter au panier"
      onClick={handleAddToCart}
      disabled={adding || isLoading || !variantId}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      {adding ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Ajout...</span>
        </>
      ) : added ? (
        <>
          <Check className="w-5 h-5" />
          <span>Ajouté !</span>
        </>
      ) : (
        <>
          <ShoppingCart className="w-5 h-5" />
          <span>Ajouter au panier</span>
        </>
      )}
    </button>
  );
}
