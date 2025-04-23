import { ShoppingBag, X, Plus, Minus } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { removeFromCart, updateCartItem, toggleCart } from '../store/actions/cartActions';

export default function CartDropdown() {
  const dispatch = useDispatch();
  const { cart, isOpen } = useSelector((state) => state.cart);

  const totalItems = cart.reduce((sum, item) => sum + item.count, 0);
  const subtotal = cart.reduce((sum, item) => sum + (item.product.price * item.count), 0);

  const handleRemoveItem = (productId) => {
    dispatch(removeFromCart(productId));
  };

  const handleUpdateQuantity = (productId, currentCount, delta) => {
    const newCount = currentCount + delta;
    if (newCount < 1) return;
    
    dispatch(updateCartItem(productId, { count: newCount }));
  };

  if (!isOpen) return null;

  return (
    <div className="absolute top-full right-0 mt-2 w-screen max-w-sm bg-white shadow-lg rounded-lg z-50">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Shopping Cart</h3>
          <button
            onClick={() => dispatch(toggleCart(false))}
            className="text-gray-400 hover:text-gray-500"
          >
            <X size={20} />
          </button>
        </div>

        {cart.length === 0 ? (
          <div className="text-center py-8">
            <ShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-4 text-gray-500">Your cart is empty</p>
          </div>
        ) : (
          <>
            <div className="divide-y divide-gray-200">
              {cart.map((item) => (
                <div key={item.product.id} className="py-4 flex items-center">
                  <img
                    src={item.product.images?.[0]?.url || 'https://via.placeholder.com/80'}
                    alt={item.product.name}
                    className="h-20 w-20 object-cover rounded"
                  />
                  <div className="ml-4 flex-1">
                    <h4 className="text-sm font-medium text-gray-900">{item.product.name}</h4>
                    <p className="text-sm text-gray-500">${item.product.price.toFixed(2)}</p>
                    <div className="flex items-center mt-2">
                      <button
                        onClick={() => handleUpdateQuantity(item.product.id, item.count, -1)}
                        className="text-gray-500 hover:text-gray-600"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="mx-2 text-gray-600">{item.count}</span>
                      <button
                        onClick={() => handleUpdateQuantity(item.product.id, item.count, 1)}
                        className="text-gray-500 hover:text-gray-600"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveItem(item.product.id)}
                    className="ml-4 text-gray-400 hover:text-gray-500"
                  >
                    <X size={20} />
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex justify-between text-base font-medium text-gray-900">
                <p>Subtotal</p>
                <p>${subtotal.toFixed(2)}</p>
              </div>
              <p className="mt-0.5 text-sm text-gray-500">Shipping and taxes calculated at checkout.</p>
              <div className="mt-6">
                <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                  Checkout
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}