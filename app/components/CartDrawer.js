'use client';

import { useCart } from './CartProvider';
import Image from 'next/image';

export default function CartDrawer() {
  const {
    isDrawerOpen,
    closeDrawer,
    cart,
    cartCount,
    isLoading,
    updateQuantity,
    removeItem,
    goToCheckout,
  } = useCart();

  if (!isDrawerOpen) return null;

  const cartLines = cart?.lines?.edges || [];
  const total = cart?.cost?.totalAmount?.amount || 0;
  const currency = cart?.cost?.totalAmount?.currencyCode || 'EUR';

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] transition-opacity opacity-100"
        onClick={closeDrawer}
        style={{ animation: 'fadeIn 0.3s ease-out' }}
      />

      {/* Drawer */}
      <div
        className="fixed right-0 top-0 h-full w-full max-w-md bg-[#0a0a0a] z-[101] shadow-2xl flex flex-col border-l border-white/10 transition-transform duration-300 ease-out"
        style={{ animation: 'slideInRight 0.3s ease-out' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-2xl font-bold text-white">
            Panier ({cartCount})
          </h2>
          <button
            onClick={closeDrawer}
            className="text-white/60 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {cartLines.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <svg className="w-16 h-16 text-white/20 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <p className="text-white/40 text-lg">Votre panier est vide</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cartLines.map(({ node }) => {
                const merchandise = node.merchandise;
                const product = merchandise.product;
                const image = product.images.edges[0]?.node;

                return (
                  <div key={node.id} className="flex gap-4 bg-white/5 rounded-lg p-4 border border-white/10">
                    {/* Image */}
                    <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-white/10">
                      {image ? (
                        <Image
                          src={image.url}
                          alt={image.altText || product.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white/20">
                          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-medium text-sm mb-1 truncate">
                        {product.title}
                      </h3>
                      {merchandise.title !== 'Default Title' && (
                        <p className="text-white/40 text-xs mb-2">{merchandise.title}</p>
                      )}
                      <p className="text-[#F59E0B] font-semibold">
                        {parseFloat(merchandise.priceV2.amount).toFixed(2)} {merchandise.priceV2.currencyCode}
                      </p>

                      {/* Quantity controls */}
                      <div className="flex items-center gap-2 mt-3">
                        <button
                          onClick={() => updateQuantity(node.id, Math.max(1, node.quantity - 1))}
                          disabled={isLoading || node.quantity <= 1}
                          className="w-7 h-7 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                          -
                        </button>
                        <span className="text-white w-8 text-center">{node.quantity}</span>
                        <button
                          onClick={() => updateQuantity(node.id, node.quantity + 1)}
                          disabled={isLoading}
                          className="w-7 h-7 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Remove button */}
                    <button
                      onClick={() => removeItem(node.id)}
                      disabled={isLoading}
                      className="text-white/40 hover:text-red-400 transition-colors disabled:opacity-30"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer - Total & Checkout */}
        {cartLines.length > 0 && (
          <div className="border-t border-white/10 p-6 space-y-4">
            <div className="flex items-center justify-between text-lg">
              <span className="text-white/60">Total</span>
              <span className="text-white font-bold text-2xl">
                {parseFloat(total).toFixed(2)} {currency}
              </span>
            </div>
            <button
              onClick={goToCheckout}
              disabled={isLoading}
              className="w-full py-4 bg-[#F59E0B] hover:bg-[#D97706] text-black font-bold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed tracking-wide uppercase"
            >
              {isLoading ? 'Chargement...' : 'Procéder au paiement'}
            </button>
            <button
              onClick={closeDrawer}
              className="w-full py-3 text-white/60 hover:text-white transition-colors text-sm"
            >
              Continuer mes achats
            </button>
          </div>
        )}
      </div>
    </>
  );
}
