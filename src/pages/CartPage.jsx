import { useDispatch, useSelector } from 'react-redux';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { removeFromCart, updateCartItem } from '../store/actions/cartActions';

export default function CartPage() {
  const dispatch = useDispatch();
  const { cart } = useSelector((state) => state.cart);

  const handleRemoveItem = (productId) => {
    dispatch(removeFromCart(productId));
  };

  const handleUpdateQuantity = (productId, currentCount, delta) => {
    const newCount = currentCount + delta;
    if (newCount < 1) return;
    dispatch(updateCartItem(productId, { count: newCount }));
  };

  const handleToggleCheck = (productId, currentChecked) => {
    dispatch(updateCartItem(productId, { checked: !currentChecked }));
  };

  const calculateTotal = () => {
    return cart
      .filter(item => item.checked)
      .reduce((sum, item) => sum + (item.product.price * item.count), 0);
  };

  if (cart.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your Cart is Empty</h2>
        <p className="text-gray-600">Add some items to your cart to get started!</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Shopping Cart</h1>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Select
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Quantity
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {cart.map((item) => (
              <tr key={item.product.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={() => handleToggleCheck(item.product.id, item.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <img
                      src={item.product.images?.[0]?.url || 'https://via.placeholder.com/80'}
                      alt={item.product.name}
                      className="h-16 w-16 object-cover rounded"
                    />
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {item.product.name}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    ${item.product.price.toFixed(2)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleUpdateQuantity(item.product.id, item.count, -1)}
                      className="p-1 rounded-full hover:bg-gray-100"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="text-sm text-gray-900 w-8 text-center">{item.count}</span>
                    <button
                      onClick={() => handleUpdateQuantity(item.product.id, item.count, 1)}
                      className="p-1 rounded-full hover:bg-gray-100"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    ${(item.product.price * item.count).toFixed(2)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleRemoveItem(item.product.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8 flex justify-end">
        <div className="bg-gray-50 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Total (Selected Items):</span>
            <span className="text-xl font-bold text-gray-900">
              ${calculateTotal().toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}