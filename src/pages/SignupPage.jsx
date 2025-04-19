import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../api/axios';
import { Loader2 } from 'lucide-react';

export default function SignupPage() {
  const [isStore, setIsStore] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      role_id: 'customer', // Default to Customer role
    },
  });

  const password = watch('password');
  const selectedRole = watch('role_id');

  useEffect(() => {
    setIsStore(selectedRole === 'store');
  }, [selectedRole]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const formData = {
        name: data.name,
        email: data.email,
        password: data.password,
        role_id: data.role_id,
      };

      if (isStore) {
        formData.store = {
          name: data.store_name,
          phone: data.store_phone,
          tax_no: data.tax_no,
          bank_account: data.bank_account,
        };
      }

      await api.post('/signup', formData);
      toast.success('Account created successfully! Please sign in.');
      navigate('/login');
    } catch (error) {
      console.error('Signup error:', error);
      toast.error(error.response?.data?.message || 'Failed to sign up');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6">Sign Up</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            id="name"
            {...register('name', {
              required: 'Name is required',
              minLength: { value: 3, message: 'Name must be at least 3 characters' },
            })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address',
              },
            })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            id="password"
            {...register('password', {
              required: 'Password is required',
              minLength: { value: 8, message: 'Password must be at least 8 characters' },
              pattern: {
                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                message: 'Password must include uppercase, lowercase, number and special character',
              },
            })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            {...register('confirmPassword', {
              required: 'Please confirm your password',
              validate: value => value === password || 'Passwords do not match',
            })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-700">
            Account Type
          </label>
          <select
            id="role"
            {...register('role_id')}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="customer">Customer</option>
            <option value="admin">Admin</option>
            <option value="store">Store Owner</option>
          </select>
        </div>

        {isStore && (
          <div className="space-y-4 border-t pt-4 mt-4">
            <h3 className="text-lg font-medium text-gray-900">Store Details</h3>
            
            <div>
              <label htmlFor="store_name" className="block text-sm font-medium text-gray-700">
                Store Name
              </label>
              <input
                type="text"
                id="store_name"
                {...register('store_name', {
                  required: isStore && 'Store name is required',
                  minLength: { value: 3, message: 'Store name must be at least 3 characters' },
                })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              {errors.store_name && (
                <p className="mt-1 text-sm text-red-600">{errors.store_name.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="store_phone" className="block text-sm font-medium text-gray-700">
                Store Phone
              </label>
              <input
                type="tel"
                id="store_phone"
                {...register('store_phone', {
                  required: isStore && 'Store phone is required',
                  pattern: {
                    value: /^(\+90|0)?[1-9][0-9]{9}$/,
                    message: 'Please enter a valid phone number',
                  },
                })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="+90XXXXXXXXXX"
              />
              {errors.store_phone && (
                <p className="mt-1 text-sm text-red-600">{errors.store_phone.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="tax_no" className="block text-sm font-medium text-gray-700">
                Tax ID
              </label>
              <input
                type="text"
                id="tax_no"
                {...register('tax_no', {
                  required: isStore && 'Tax ID is required',
                  pattern: {
                    value: /^T\d{3}V\d{6}$/,
                    message: 'Please enter a valid Tax ID (Format: TXXXVXXXXXX)',
                  },
                })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="TXXXVXXXXXX"
              />
              {errors.tax_no && (
                <p className="mt-1 text-sm text-red-600">{errors.tax_no.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="bank_account" className="block text-sm font-medium text-gray-700">
                IBAN
              </label>
              <input
                type="text"
                id="bank_account"
                {...register('bank_account', {
                  required: isStore && 'IBAN is required',
                  pattern: {
                    value: /^TR\d{2}\d{4}\d{4}\d{4}\d{4}\d{4}\d{2}$/,
                    message: 'Please enter a valid IBAN',
                  },
                })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="TRXX XXXX XXXX XXXX XXXX XXXX XX"
              />
              {errors.bank_account && (
                <p className="mt-1 text-sm text-red-600">{errors.bank_account.message}</p>
              )}
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
              Creating Account...
            </>
          ) : (
            'Create Account'
          )}
        </button>
      </form>
    </div>
  );
}