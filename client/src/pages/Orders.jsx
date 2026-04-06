import { useEffect, useState, useContext } from "react";
import api from "../utils/axiosSetup";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Orders() {
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    } else {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get("/orders/my-orders");
      if (res.data.orders) {
        setOrders(res.data.orders);
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto p-10">
        <div className="text-center text-[#0f172a] opacity-70">
          Loading orders...
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-10 bg-[#eff6ff] min-h-screen">
      <h1 className="text-3xl mb-6 font-heading text-[#0f172a]">
        My <span className="text-blue-400">Orders</span>
      </h1>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      {orders.length === 0 ? (
        <div className="bg-white p-10 rounded-xl shadow-md text-center">
          <p className="text-[#0f172a] opacity-70 text-lg mb-4">
            No orders yet.
          </p>
          <button
            onClick={() => navigate("/menu")}
            className="bg-blue-400 text-white px-6 py-2 rounded-lg font-semibold hover:opacity-90"
          >
            Browse Menu
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map(order => (
            <div
              key={order._id}
              className="bg-white p-6 rounded-xl shadow-md"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-sm text-[#0f172a] opacity-70">
                    Order #{order._id.slice(-6).toUpperCase()}
                  </p>
                  <p className="text-sm text-[#0f172a] opacity-70">
                    {new Date(order.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  order.status === 'Delivered'
                    ? 'bg-green-100 text-green-700'
                    : order.status === 'Preparing'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-blue-100 text-blue-700'
                }`}>
                  {order.status}
                </span>
              </div>

              <div className="flex justify-between items-center mb-4">
                <p className="font-heading text-xl text-[#0f172a]">
                  Total: <span className="text-blue-400 font-bold">₹{order.totalAmount}</span>
                </p>
                <p className="text-sm text-[#0f172a] opacity-70">
                  Address: {order.address}
                </p>
              </div>

              <div className="border-t pt-4">
                <p className="font-semibold text-[#0f172a] mb-2">Items:</p>
                <ul className="space-y-2">
                  {order.items.map((item, index) => (
                    <li key={index} className="flex justify-between items-center">
                      <span className="text-[#0f172a]">
                        {item.foodId?.name || 'Item'}
                      </span>
                      <span className="text-[#0f172a] opacity-70">
                        × {item.quantity} - ₹{(item.price * item.quantity).toFixed(2)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Orders;