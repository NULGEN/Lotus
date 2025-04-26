import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function PreviousOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user); // redux'tan alıyoruz

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchOrders = async () => {
      try {
        const response = await fetch('http://localhost:5000/order', {
          method: 'GET',
          credentials: 'include', // Cookie taşınması için gerekli
        });

        if (response.ok) {
          const data = await response.json();
          setOrders(data);
        } else {
          console.error('Failed to fetch orders');
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate, user]);

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Previous Orders</h1>

      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <details key={order.orderId} className="border rounded p-4">
              <summary className="cursor-pointer font-semibold">
                Order #{order.orderId} - {new Date(order.orderDate).toLocaleDateString()} - ${order.totalAmount.toFixed(2)}
              </summary>
              <div className="mt-4">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="border px-4 py-2 text-left">Product</th>
                      <th className="border px-4 py-2 text-left">Quantity</th>
                      <th className="border px-4 py-2 text-left">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map(item => (
                      <tr key={item.productId}>
                        <td className="border px-4 py-2">{item.productName}</td>
                        <td className="border px-4 py-2">{item.quantity}</td>
                        <td className="border px-4 py-2">${item.price.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </details>
          ))}
        </div>
      )}
    </div>
  );
}
