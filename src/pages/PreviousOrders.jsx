import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import api from '../api/axios'; 

export default function PreviousOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchOrders = async () => {
      try {
        const response = await api.get('/order');
        console.log('Fetched orders:', response.data);
        if (Array.isArray(response.data)) {
          setOrders(response.data);
        } else {
          console.error('Unexpected response format:', response.data);
          setOrders([]);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate, user]);

  if (loading) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Previous Orders</h1>

      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="space-y-6">
          {orders.map(order => (
            <details key={order.id || Math.random()} className="border rounded p-4">
              <summary className="cursor-pointer font-semibold">
                Order #{order.id ?? 'Unknown'} - {order.order_date ? new Date(order.order_date).toLocaleDateString() : 'No Date'} - ${order.price != null ? order.price.toFixed(2) : '0.00'}
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
                    {order.products?.length > 0 ? (
                      order.products.map(item => (
                        <tr key={item.id || Math.random()}>
                          <td className="border px-4 py-2">{item.name || 'Unnamed Product'}</td>
                          <td className="border px-4 py-2">{item.count ?? 1}</td>
                          <td className="border px-4 py-2">${item.price != null ? item.price.toFixed(2) : '0.00'}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="3" className="border px-4 py-2 text-center">No items</td>
                      </tr>
                    )}
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
