import { useState } from 'react';
import { useForm } from 'react-hook-form';

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm();

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSubmitSuccess(true);
      reset();
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Contact Us</h1>
      
      {/* Desktop Layout */}
      <div className="hidden md:grid md:grid-cols-2 gap-12">
        <div>
          <h2 className="text-xl font-semibold mb-4">Get in Touch</h2>
          <p className="text-gray-600 mb-6">
            Have questions about our products or services? We're here to help!
          </p>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-900">Address</h3>
              <p className="text-gray-600">123 Fashion Street</p>
              <p className="text-gray-600">New York, NY 10001</p>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900">Email</h3>
              <p className="text-gray-600">support@lotus.com</p>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900">Phone</h3>
              <p className="text-gray-600">+1 (555) 123-4567</p>
            </div>
          </div>
        </div>

        <div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                id="name"
                {...register('name', { required: 'Name is required' })}
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
              <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                Message
              </label>
              <textarea
                id="message"
                rows={4}
                {...register('message', { required: 'Message is required' })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              {errors.message && (
                <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>

            {submitSuccess && (
              <p className="text-green-600 text-center">
                Thank you for your message. We'll get back to you soon!
              </p>
            )}
          </form>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden space-y-8">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Get in Touch</h2>
          <p className="text-gray-600">
            Have questions about our products or services? We're here to help!
          </p>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-900">Address</h3>
              <p className="text-gray-600">123 Fashion Street</p>
              <p className="text-gray-600">New York, NY 10001</p>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900">Email</h3>
              <p className="text-gray-600">support@lotus.com</p>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900">Phone</h3>
              <p className="text-gray-600">+1 (555) 123-4567</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="name-mobile" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              id="name-mobile"
              {...register('name', { required: 'Name is required' })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="email-mobile" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email-mobile"
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
            <label htmlFor="message-mobile" className="block text-sm font-medium text-gray-700">
              Message
            </label>
            <textarea
              id="message-mobile"
              rows={4}
              {...register('message', { required: 'Message is required' })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            {errors.message && (
              <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </button>

          {submitSuccess && (
            <p className="text-green-600 text-center">
              Thank you for your message. We'll get back to you soon!
            </p>
          )}
        </form>
      </div>
    </div>
  );
}