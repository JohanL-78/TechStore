import { NextResponse } from 'next/server';
import { createCart, addToCart, updateCartLines, removeFromCart } from '@/lib/shopify';

// POST /api/cart - Créer un nouveau cart
export async function POST(request) {
  try {
    const body = await request.json();

    if (body.action === 'create') {
      const cart = await createCart();
      return NextResponse.json({ cart });
    }

    if (body.action === 'add') {
      const { cartId, variantId, quantity } = body;

      if (!cartId || !variantId) {
        return NextResponse.json(
          { error: 'cartId and variantId are required' },
          { status: 400 }
        );
      }

      const cart = await addToCart(cartId, variantId, quantity || 1);
      return NextResponse.json({ cart });
    }

    if (body.action === 'update') {
      const { cartId, lineId, quantity } = body;

      if (!cartId || !lineId || quantity === undefined) {
        return NextResponse.json(
          { error: 'cartId, lineId, and quantity are required' },
          { status: 400 }
        );
      }

      const cart = await updateCartLines(cartId, lineId, quantity);
      return NextResponse.json({ cart });
    }

    if (body.action === 'remove') {
      const { cartId, lineId } = body;

      if (!cartId || !lineId) {
        return NextResponse.json(
          { error: 'cartId and lineId are required' },
          { status: 400 }
        );
      }

      const cart = await removeFromCart(cartId, lineId);
      return NextResponse.json({ cart });
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Cart API Error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
