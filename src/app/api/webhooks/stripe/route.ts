import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { sendEmail } from "@/lib/email";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing Stripe signature." },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    console.error("WEBHOOK_SIGNATURE_ERROR", error);

    return NextResponse.json(
      { error: "Invalid webhook signature." },
      { status: 400 }
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    try {
      const existingOrder = await prisma.order.findUnique({
        where: {
          stripeSessionId: session.id,
        },
      });

      if (existingOrder) {
        return NextResponse.json({
          received: true,
          message: "Order already exists.",
        });
      }

      const metadata = session.metadata;

      if (!metadata?.cartItems || !metadata?.shippingAddress) {
        throw new Error("Missing checkout metadata.");
      }

      const cartItems = JSON.parse(metadata.cartItems) as {
        id: string;
        quantity: number;
      }[];

      const shippingAddress = JSON.parse(metadata.shippingAddress);

      const products = await prisma.product.findMany({
        where: {
          id: {
            in: cartItems.map((item) => item.id),
          },
        },
      });

      const total = cartItems.reduce((sum, item) => {
        const product = products.find((p) => p.id === item.id);

        if (!product) {
          throw new Error("Product not found while creating order.");
        }

        return (sum + product.price * item.quantity) + 5.99;
      }, 0);

      const order = await prisma.$transaction(async (tx) => {
        const createdOrder = await tx.order.create({
          data: {
            userId: metadata.userId || null,
            stripeSessionId: session.id,
            total,
            customerName: metadata.customerName || "",
            customerEmail:
              metadata.customerEmail || session.customer_email || "",
            customerPhone: metadata.phone || null,
            shippingAddress,
            items: {
              create: cartItems.map((item) => {
                const product = products.find((p) => p.id === item.id);

                if (!product) {
                  throw new Error("Product not found.");
                }

                return {
                  productId: product.id,
                  quantity: item.quantity,
                  price: product.price,
                };
              }),
            },
          },
        });

        for (const item of cartItems) {
          await tx.product.update({
            where: {
              id: item.id,
            },
            data: {
              stock: {
                decrement: item.quantity,
              },
            },
          });
        }

        return createdOrder;
      });

      await sendEmail({
        to: order.customerEmail,
        subject: "Your Manor's Market Order Confirmation",
        html: `
          <h1>Thank you for your order!</h1>

          <p>Hi ${order.customerName},</p>

          <p>We have successfully received your order.</p>

          <p>
            <strong>Order Total:</strong>
            $${order.total.toFixed(2)}
          </p>

          <p>
            You can view your order history in your account anytime.
          </p>

          <p>
            Thank you for shopping with Manor's Market!
          </p>
        `,
      });
      
      await sendEmail({
        to: process.env.ADMIN_EMAIL!,
        subject: "New Manor's Market Order Received",
        html: `
          <h1>New Order Received</h1>
      
          <p><strong>Customer:</strong> ${order.customerName}</p>
          <p><strong>Email:</strong> ${order.customerEmail}</p>
          <p><strong>Total:</strong> $${order.total.toFixed(2)}</p>
      
          <p>Log in to the admin dashboard to process the order.</p>
        `,
      });
    } catch (error) {
      console.error("ORDER_CREATE_ERROR", error);

      return NextResponse.json(
        { error: "Failed to create order." },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ received: true });
}