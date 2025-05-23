import React, { useEffect, useState } from "react";

type Order = {
  id: string;
  total_amount: number;
};

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const deliveryPersonId = localStorage.getItem("deliveryPersonId");

  const fetchUnassignedOrders = async () => {
    try {
      const response = await fetch(
        "https://sosika-backend.onrender.com/api/orders/in-progress/unassigned"
      );
      const data: Order[] = await response.json();
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const acceptOrder = async (orderId: string) => {
    try {
      const response = await fetch(
        `https://sosika-backend.onrender.com/api/orders/${orderId}/accept`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ delivery_person_id: deliveryPersonId }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("orderLocations", JSON.stringify(data));
        alert("Order accepted successfully!");
        window.location.assign("/home");
      } else {
        alert(data.error || "Failed to accept order");
      }
    } catch (error) {
      console.error("Error accepting order:", error);
    }
  };

  useEffect(() => {
    fetchUnassignedOrders();
    const interval = setInterval(fetchUnassignedOrders, 50000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gray-100 flex items-center justify-center min-h-screen">
      <div className="w-full max-w-4xl mx-auto bg-white shadow-xl rounded-2xl p-8 sm:p-10 transition-all duration-300">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center tracking-tight">
          🚚 Available Orders
        </h1>

        <div className="space-y-6">
          {loading ? (
            <p className="text-center text-gray-500">Loading...</p>
          ) : orders.length === 0 ? (
            <p className="text-center text-gray-500">No orders available</p>
          ) : (
            orders.map((order) => (
              <div
                key={order.id}
                className="bg-white p-4 rounded-lg shadow-md border border-gray-200"
              >
                <div className="bg-white rounded-xl shadow-sm p-6 space-y-4 hover:shadow-md transition duration-300">
                  <p className="text-base sm:text-lg font-semibold text-gray-800">
                    <span className="text-gray-500 font-medium">Order ID:</span>{" "}
                    {order.id}
                  </p>
                  <p className="text-base text-gray-700">
                    <span className="text-gray-500 font-medium">
                      Total Amount:
                    </span>{" "}
                    ${order.total_amount}
                  </p>
                  <button
                    onClick={() => acceptOrder(order.id)}
                    className="w-full bg-black hover:bg-gray-900 text-white font-semibold py-2.5 rounded-xl transition-all duration-300 text-sm sm:text-base"
                  >
                    Accept Order
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Orders;
