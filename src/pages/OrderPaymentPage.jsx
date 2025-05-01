import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { CreditCard, Plus, Trash2, Shield } from 'lucide-react';
import api from '../api/axios';
import { toast } from 'react-toastify';
import { setCart } from '../store/actions/cartActions';

export default function OrderPaymentPage() {
  const [savedCards, setSavedCards] = useState([]);
  const [showNewCardForm, setShowNewCardForm] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [use3DSecure, setUse3DSecure] = useState(false);
  const [selectedInstallment, setSelectedInstallment] = useState('single');
  const [isProcessing, setIsProcessing] = useState(false);
  const { cart } = useSelector(state => state.cart);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm();

  // Calculate installment options
  const getInstallmentOptions = (total) => {
    const options = [
      { months: 1, label: 'Single Payment', interestRate: 0 },
      { months: 3, label: '3 Installments', interestRate: 0.05 },
      { months: 6, label: '6 Installments', interestRate: 0.08 },
      { months: 9, label: '9 Installments', interestRate: 0.12 },
      { months: 12, label: '12 Installments', interestRate: 0.15 }
    ];

    return options.map(option => {
      const totalWithInterest = total * (1 + option.interestRate);
      const monthlyPayment = totalWithInterest / option.months;
      
      return {
        ...option,
        totalAmount: totalWithInterest,
        monthlyAmount: monthlyPayment
      };
    });
  };

  useEffect(() => {
    fetchSavedCards();
  }, []);

  const fetchSavedCards = async () => {
    try {
      const response = await api.get('/user/card');
      setSavedCards(response.data);
    } catch (error) {
      toast.error('Failed to fetch saved cards');
    }
  };

  const calculateTotal = () => {
    const subtotal = cart.reduce((sum, item) => sum + (item.product.price * item.count), 0);
    const shippingCost = 29.99;
    const discount = subtotal > 150 ? shippingCost : 0;
    return {
      subtotal,
      shippingCost,
      discount,
      total: subtotal + shippingCost - discount
    };
  };

  const handleCreateOrder = async () => {
    if (!selectedCard) {
      toast.error('Please select a payment method');
      return;
    }

    setIsProcessing(true);

    try {
      const orderData = {
        address_id: 1, // This should come from the previous step
        order_date: new Date().toISOString(),
        card_no: selectedCard.card_no,
        card_name: selectedCard.name_on_card,
        card_expire_month: selectedCard.expire_month,
        card_expire_year: selectedCard.expire_year,
        card_ccv: "000", // This should come from the form for new cards
        price: calculateTotal().total,
        products: cart.map(item => ({
          product_id: item.product.id,
          count: item.count,
          detail: "" // Add product details if needed
        }))
      };

      const response = await api.post('/order', orderData);
      
      // Clear cart and show success message
      dispatch(setCart([]));
      toast.success('Order placed successfully! Thank you for your purchase.');
      
      // Navigate to order confirmation or home page
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create order');
    } finally {
      setIsProcessing(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      await api.post('/user/card', {
        card_no: data.card_no.replace(/\s/g, ''),
        expire_month: parseInt(data.expire_month),
        expire_year: parseInt(data.expire_year),
        name_on_card: data.name_on_card
      });
      
      toast.success('Card added successfully');
      setShowNewCardForm(false);
      reset();
      fetchSavedCards();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add card');
    }
  };

  const handleDeleteCard = async (cardId) => {
    try {
      await api.delete(`/user/card/${cardId}`);
      toast.success('Card deleted successfully');
      fetchSavedCards();
      if (selectedCard?.id === cardId) {
        setSelectedCard(null);
      }
    } catch (error) {
      toast.error('Failed to delete card');
    }
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  const { subtotal, shippingCost, discount, total } = calculateTotal();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Payment Method</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Payment Options */}
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <h2 className="text-xl font-semibold mb-4">Payment Options</h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="card"
                  name="paymentMethod"
                  value="card"
                  checked
                  className="h-4 w-4 text-blue-600"
                />
                <label htmlFor="card" className="ml-2 text-gray-700">
                  Credit/Debit Card
                </label>
              </div>
            </div>
          </div>

          {/* Card Selection */}
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Saved Cards</h2>
              <button
                onClick={() => setShowNewCardForm(true)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <Plus size={20} className="mr-2" />
                Add New Card
              </button>
            </div>

            {/* New Card Form */}
            {showNewCardForm && (
              <div className="border rounded-lg p-4 mb-6">
                <h3 className="text-lg font-semibold mb-4">Add New Card</h3>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Card Number
                    </label>
                    <input
                      type="text"
                      maxLength="19"
                      {...register('card_no', {
                        required: 'Card number is required',
                        pattern: {
                          value: /^[\d\s]{16,19}$/,
                          message: 'Please enter a valid card number'
                        },
                        onChange: (e) => {
                          e.target.value = formatCardNumber(e.target.value);
                        }
                      })}
                      placeholder="1234 5678 9012 3456"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    {errors.card_no && (
                      <p className="mt-1 text-sm text-red-600">{errors.card_no.message}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Expiry Date
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <select
                          {...register('expire_month', { required: 'Required' })}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        >
                          <option value="">Month</option>
                          {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                            <option key={month} value={month}>
                              {month.toString().padStart(2, '0')}
                            </option>
                          ))}
                        </select>
                        <select
                          {...register('expire_year', { required: 'Required' })}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        >
                          <option value="">Year</option>
                          {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i).map(year => (
                            <option key={year} value={year}>
                              {year}
                            </option>
                          ))}
                        </select>
                      </div>
                      {(errors.expire_month || errors.expire_year) && (
                        <p className="mt-1 text-sm text-red-600">Please select expiry date</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        CVV
                      </label>
                      <input
                        type="text"
                        maxLength="4"
                        {...register('cvv', {
                          required: 'CVV is required',
                          pattern: {
                            value: /^\d{3,4}$/,
                            message: 'Invalid CVV'
                          }
                        })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                      {errors.cvv && (
                        <p className="mt-1 text-sm text-red-600">{errors.cvv.message}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Name on Card
                    </label>
                    <input
                      type="text"
                      {...register('name_on_card', { required: 'Name is required' })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    {errors.name_on_card && (
                      <p className="mt-1 text-sm text-red-600">{errors.name_on_card.message}</p>
                    )}
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => {
                        setShowNewCardForm(false);
                        reset();
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                    >
                      {isSubmitting ? 'Saving...' : 'Save Card'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Saved Cards List */}
            <div className="space-y-4">
              {savedCards.map((card) => (
                <div
                  key={card.id}
                  className={`border rounded-lg p-4 cursor-pointer ${
                    selectedCard?.id === card.id ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedCard(card)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        checked={selectedCard?.id === card.id}
                        onChange={() => setSelectedCard(card)}
                        className="h-4 w-4 text-blue-600"
                      />
                      <div className="ml-4">
                        <div className="flex items-center">
                          <CreditCard size={20} className="text-gray-400 mr-2" />
                          <span className="font-medium">
                            •••• {card.card_no.slice(-4)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">
                          Expires: {card.expire_month}/{card.expire_year}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteCard(card.id);
                      }}
                      className="text-gray-400 hover:text-red-600"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Installment Options */}
          {selectedCard && (
            <div className="bg-white p-6 rounded-lg shadow mb-6">
              <h2 className="text-xl font-semibold mb-4">Installment Options</h2>
              <div className="space-y-4">
                {getInstallmentOptions(total).map((option) => (
                  <div
                    key={option.months}
                    className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer ${
                      selectedInstallment === option.months
                        ? 'bg-blue-50 border-blue-500'
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedInstallment(option.months)}
                  >
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id={`installment-${option.months}`}
                        checked={selectedInstallment === option.months}
                        onChange={() => setSelectedInstallment(option.months)}
                        className="h-4 w-4 text-blue-600"
                      />
                      <label htmlFor={`installment-${option.months}`} className="ml-2">
                        <span className="font-medium">{option.label}</span>
                        {option.months > 1 && (
                          <div className="text-sm text-gray-500">
                            ${option.monthlyAmount.toFixed(2)} per month
                          </div>
                        )}
                      </label>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">
                        ${option.totalAmount.toFixed(2)}
                      </div>
                      {option.interestRate > 0 && (
                        <div className="text-sm text-gray-500">
                          {(option.interestRate * 100).toFixed(0)}% interest
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3D Secure Option */}
          {selectedCard && (
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="3dsecure"
                  checked={use3DSecure}
                  onChange={(e) => setUse3DSecure(e.target.checked)}
                  className="h-4 w-4 text-blue-600 rounded"
                />
                <label htmlFor="3dsecure" className="flex items-center text-gray-700">
                  <Shield size={20} className="mr-2 text-blue-600" />
                  Pay with 3D Secure
                </label>
              </div>
              {use3DSecure && (
                <p className="mt-2 text-sm text-gray-600">
                  Your payment will be processed securely using 3D Secure authentication.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow sticky top-24">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="space-y-4">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>${shippingCost.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}
              <div className="pt-4 border-t border-gray-200">
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
              <button
                onClick={handleCreateOrder}
                disabled={!selectedCard || isProcessing}
                className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {isProcessing ? 'Processing...' : 'Complete Payment'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
