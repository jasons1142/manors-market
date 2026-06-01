import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { items, customer, shippingAddress } = body;

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: "Cart is empty." },
        { status: 400 }
      );
    }

    const productIds = items.map((item: { id: string }) => item.id);

    const products = await prisma.product.findMany({
      where: {
        id: {
          in: productIds,
        },
      },
    });

    const lineItems = items.map(
      (cartItem: { id: string; quantity: number }) => {
        const product = products.find((p) => p.id === cartItem.id);

        if (!product) {
          throw new Error("Product not found.");
        }

        if (product.stock < cartItem.quantity) {
          throw new Error(`${product.name} does not have enough stock.`);
        }

        return {
          price_data: {
            currency: "usd",
            product_data: {
              name: product.name,
              description: product.description,
            },
            unit_amount: Math.round(product.price * 100),
          },
          quantity: cartItem.quantity,
        };
      }
    );

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      customer_email: customer.email,
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cart`,
      metadata: {
        customerName: customer.name,
        customerEmail: customer.email,
        phone: customer.phone || "",
        shippingAddress: JSON.stringify(shippingAddress),
        cartItems: JSON.stringify(
          items.map((item: { id: string; quantity: number }) => ({
            id: item.id,
            quantity: item.quantity,
          }))
        ),
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("CHECKOUT_ERROR", error);

    return NextResponse.json(
      { error: "Could not create checkout session." },
      { status: 500 }
    );
  }
}