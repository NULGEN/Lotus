import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import api from '../api/axios';
import { toast } from 'react-toastify';

const CITIES = [
  'Adana', 'Ankara', 'Antalya', 'Bursa', 'Denizli', 'Diyarbakır', 'Erzurum', 
  'Eskişehir', 'Gaziantep', 'Istanbul', 'Izmir', 'Kayseri', 'Konya', 'Malatya', 
  'Mersin', 'Samsun', 'Trabzon', 'Van'
];

export default function OrderAddressPage() {
  const [addresses, setAddresses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [selectedShippingAddress, setSelectedShippingAddress] = useState(null);
  const [selectedBillingAddress, setSelectedBillingAddress] = useState(null);
  const [sameAsShipping, setSameAsShipping] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm();

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const response = await api.get('/user/address');
      setAddresses(response.data);
    } catch (error) {
      toast.error('Failed to fetch addresses');
    }
  };

  const onSubmit = async (data) => {
    try {
      if (editingAddress) {
        await api.put('/user/address', { ...data, id: editingAddress.id });
        toast.success('Address updated successfully');
      } else {
        await api.post('/user/address', data);
        toast.success('Address added successfully');
      }
      
      fetchAddresses();
      setShowForm(false);
      setEditingAddress(null);
      reset();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save address');
    }
  };

  const handleEdit = (address) => {
    setEditingAddress(address);
    setShowForm(true);
    Object.keys(address).forEach(key => {
      setValue(key, address[key]);
    });
  };

  const handleDelete = async (addressId) => {
    try {
      await api.delete(`/user/address/${addressId}`);
      toast.success('Address deleted successfully');
      fetchAddresses();
    } catch (error) {
      toast.error('Failed to delete address');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Shipping & Billing Address</h1>

      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Your Addresses</h2>
          <button
            onClick={() => {
              setShowForm(true);
              setEditingAddress(null);
              reset();
            }}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Plus size={20} className="mr-2" />
            Add New Address
          </button>
        </div>

        {showForm && (
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <h3 className="text-lg font-semibold mb-4">
              {editingAddress ? 'Edit Address' : 'Add New Address'}
            </h3>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Address Title
                  </label>
                  <input
                    type="text"
                    {...register('title', { required: 'Address title is required' })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Name & Surname
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      {...register('name', { required: 'Name is required' })}
                      placeholder="Name"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      {...register('surname', { required: 'Surname is required' })}
                      placeholder="Surname"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  {(errors.name || errors.surname) && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.name?.message || errors.surname?.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Phone
                  </label>
                  <input
                    type="tel"
                    {...register('phone', {
                      required: 'Phone is required',
                      pattern: {
                        value: /^(\+90|0)?[1-9][0-9]{9}$/,
                        message: 'Please enter a valid phone number'
                      }
                    })}
                    placeholder="05XX XXX XX XX"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    City
                  </label>
                  <select
                    {...register('city', { required: 'City is required' })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="">Select a city</option>
                    {CITIES.map(city => (
                      <option key={city} value={city.toLowerCase()}>
                        {city}
                      </option>
                    ))}
                  </select>
                  {errors.city && (
                    <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    District
                  </label>
                  <input
                    type="text"
                    {...register('district', { required: 'District is required' })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  {errors.district && (
                    <p className="mt-1 text-sm text-red-600">{errors.district.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Neighborhood
                  </label>
                  <input
                    type="text"
                    {...register('neighborhood', { required: 'Neighborhood is required' })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  {errors.neighborhood && (
                    <p className="mt-1 text-sm text-red-600">{errors.neighborhood.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Address Details
                </label>
                <textarea
                  {...register('address', { required: 'Address details are required' })}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Street, building number, door number..."
                />
                {errors.address && (
                  <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
                )}
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingAddress(null);
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
                  {isSubmitting ? 'Saving...' : editingAddress ? 'Update Address' : 'Add Address'}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="space-y-4">
          {addresses.map((address) => (
            <div key={address.id} className="bg-white p-6 rounded-lg shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">{address.title}</h3>
                  <p className="text-gray-600">{address.name} {address.surname}</p>
                  <p className="text-gray-600">{address.phone}</p>
                  <p className="text-gray-600">
                    {address.neighborhood}, {address.district}, {address.city}
                  </p>
                  <p className="text-gray-600">{address.address}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(address)}
                    className="p-2 text-gray-600 hover:text-blue-600"
                  >
                    <Pencil size={20} />
                  </button>
                  <button
                    onClick={() => handleDelete(address.id)}
                    className="p-2 text-gray-600 hover:text-red-600"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>

              <div className="mt-4 flex gap-4">
                <button
                  onClick={() => setSelectedShippingAddress(address.id)}
                  className={`px-4 py-2 rounded-md ${
                    selectedShippingAddress === address.id
                      ? 'bg-blue-600 text-white'
                      : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Use as Shipping Address
                </button>
                {!sameAsShipping && (
                  <button
                    onClick={() => setSelectedBillingAddress(address.id)}
                    className={`px-4 py-2 rounded-md ${
                      selectedBillingAddress === address.id
                        ? 'bg-blue-600 text-white'
                        : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Use as Billing Address
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center mb-4">
        <input
          type="checkbox"
          id="sameAsShipping"
          checked={sameAsShipping}
          onChange={(e) => setSameAsShipping(e.target.checked)}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="sameAsShipping" className="ml-2 text-sm text-gray-700">
          Billing address same as shipping address
        </label>
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => {/* Handle continue to payment */}}
          disabled={!selectedShippingAddress || (!sameAsShipping && !selectedBillingAddress)}
          className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          Continue to Payment
        </button>
      </div>
    </div>
  );
}