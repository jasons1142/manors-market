import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { shippoRequest } from "@/lib/shippo";
import { sendEmail } from "@/lib/email";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  if (session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  if (!order) {
    return NextResponse.json({ error: "Order not found." }, { status: 404 });
  }

  if (order.labelUrl) {
    return NextResponse.json({
      labelUrl: order.labelUrl,
      trackingNumber: order.trackingNumber,
    });
  }

  const shippingAddress = order.shippingAddress as {
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };

  const shipment = await shippoRequest("/shipments/", {
    address_from: {
      name: process.env.STORE_NAME,
      street1: process.env.STORE_STREET1,
      city: process.env.STORE_CITY,
      state: process.env.STORE_STATE,
      zip: process.env.STORE_ZIP,
      country: process.env.STORE_COUNTRY || "US",
      phone: process.env.STORE_PHONE || "5555555555",
      email: process.env.STORE_EMAIL || "test@example.com",
    },
    address_to: {
      name: order.customerName,
      street1: shippingAddress.addressLine1,
      street2: shippingAddress.addressLine2 || "",
      city: shippingAddress.city,
      state: shippingAddress.state,
      zip: shippingAddress.postalCode,
      country: shippingAddress.country || "US",
      phone: order.customerPhone || "5555555555",
      email: order.customerEmail,
    },
    parcels: [
      {
        length: "8",
        width: "6",
        height: "4",
        distance_unit: "in",
        weight: "1",
        mass_unit: "lb",
      },
    ],
    async: false,
  });

  const rate = shipment.rates?.sort(
    (a: any, b: any) => Number(a.amount) - Number(b.amount)
  )[0];
  
  if (!rate) {
    return NextResponse.json(
      { error: "No shipping rates found." },
      { status: 400 }
    );
  }
  
  if (!rate) {
    return NextResponse.json(
      { error: "No USPS shipping rates found." },
      { status: 400 }
    );
  }

  if (!rate) {
    return NextResponse.json(
      { error: "No shipping rates found." },
      { status: 400 }
    );
  }

  const transaction = await shippoRequest("/transactions/", {
    rate: rate.object_id,
    label_file_type: "PDF",
    async: false,
  });

  if (transaction.status !== "SUCCESS") {
    console.error("SHIPPO_TRANSACTION_FAILED", transaction);

    return NextResponse.json(
      { error: "Could not purchase shipping label." },
      { status: 400 }
    );
  }

  const updatedOrder = await prisma.order.update({
    where: { id },
    data: {
      trackingNumber: transaction.tracking_number,
      labelUrl: transaction.label_url,
      status: "SHIPPED",
    },
  });

  await sendEmail({
    to: updatedOrder.customerEmail,
    subject: "Your Manor's Market Order Has Shipped",
    html: `
      <h1>Your order has shipped!</h1>
  
      <p>Hi ${updatedOrder.customerName},</p>
  
      <p>Your Manor's Market order is on the way.</p>
  
      <p>
        <strong>Tracking Number:</strong>
        ${updatedOrder.trackingNumber}
      </p>
  
      <p>
        Thank you for shopping with Manor's Market!
      </p>
    `,
  });

  return NextResponse.json({
    labelUrl: updatedOrder.labelUrl,
    trackingNumber: updatedOrder.trackingNumber,
  });
}