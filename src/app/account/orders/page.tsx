import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function AccountOrdersPage() {
  const session = await auth();

  if (!session || !session.user.email) {
    redirect("/login");
  }

  const orders = await prisma.order.findMany({
    where: {
        userId: session.user.id,
    },
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
    <main className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">My Orders</h1>

      {orders.length === 0 ? (
        <p>You have not placed any orders yet.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="border rounded-xl p-4 space-y-4">
              <div>
                <h2 className="font-bold">Order #{order.id}</h2>
                <p>Status: {order.status}</p>
                <p>Total: ${order.total.toFixed(2)}</p>
                <p>Date: {order.createdAt.toLocaleDateString()}</p>
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

              {order.trackingNumber && (
                <p>Tracking: {order.trackingNumber}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}