import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

import GenerateLabelButton from "@/components/orders/generate-label-button";
import UpdateOrderStatusButton from "@/components/orders/update-order-status-button";

export default async function DashboardOrdersPage() {
  const session = await auth();

  if (!session) redirect("/login");
  if (session.user.role !== "ADMIN") redirect("/");

  const orders = await prisma.order.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  return (
    <main className="p-6 space-y-6 bg-[#f5e6c8]">
      <h1 className="text-3xl font-bold text-green-800">Orders</h1>

      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="border rounded-xl p-4 space-y-4 text-green-800">
              <div>
                <h2 className="font-bold">Order #{order.id}</h2>
                <p>Status: {order.status}</p>
                <p>Total: ${order.total.toFixed(2)}</p>
                <p>Customer: {order.customerName}</p>
                <p>Email: {order.customerEmail}</p>
              </div>

              <div>
                <h3 className="font-semibold">Items</h3>

                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <span>
                      {item.product.name} × {item.quantity}
                    </span>

                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div>
                <h3 className="font-semibold">Shipping Address</h3>
                <pre className="bg-white-100 p-3 rounded text-sm overflow-auto">
                  {JSON.stringify(order.shippingAddress, null, 2)}
                </pre>
              </div>

            <div className="flex gap-3 flex-wrap">
            {order.status === "PAID" && (
                <UpdateOrderStatusButton
                orderId={order.id}
                nextStatus="PROCESSING"
                label="Mark Processing"
                />
            )}

            {order.status === "PROCESSING" && (
                <GenerateLabelButton
                orderId={order.id}
                existingLabelUrl={order.labelUrl}
                existingTrackingNumber={order.trackingNumber}
                />
            )}

            {order.status === "SHIPPED" && (
                <UpdateOrderStatusButton
                orderId={order.id}
                nextStatus="DELIVERED"
                label="Mark Delivered"
                />
            )}

            {order.status === "DELIVERED" && (
                <p className="font-semibold text-green-600">Delivered ✓</p>
            )}
            </div>

            </div>
          ))}
        </div>
      )}
    </main>
  );
}