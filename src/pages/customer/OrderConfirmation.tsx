import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, Home, Clock, Package } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import type { Order } from '../../services/ordersService';

export const OrderConfirmation: React.FC = () => {
  const { subdomain, orderId } = useParams<{ subdomain: string; orderId: string }>();
  const navigate = useNavigate();

  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        setError('Order not found');
        setIsLoading(false);
        return;
      }

      try {
        const orderDoc = await getDoc(doc(db, 'orders', orderId));

        if (!orderDoc.exists()) {
          setError('Order not found');
          return;
        }

        const data = orderDoc.data();
        setOrder({
          id: orderDoc.id,
          restaurantId: data.restaurantId,
          status: data.status,
          customerName: data.customerName,
          customerEmail: data.customerEmail,
          customerPhone: data.customerPhone,
          items: data.items,
          total: data.total,
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate(),
        });
      } catch (err) {
        console.error('Error fetching order:', err);
        setError('Failed to load order details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-4">{error || 'Order not found'}</p>
          <button
            onClick={() => navigate(`/${subdomain}/menu`)}
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
          <p className="text-lg text-gray-600">
            Thank you for your order, {order.customerName}
          </p>
        </div>

        {/* Order Details Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          {/* Order Number */}
          <div className="text-center pb-6 mb-6 border-b border-gray-200">
            <p className="text-sm text-gray-600 mb-1">Order ID</p>
            <p className="text-2xl font-bold text-gray-900 font-mono">
              #{order.id?.slice(-8).toUpperCase()}
            </p>
          </div>

          {/* Order Status */}
          <div className="flex items-center justify-center gap-3 mb-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <Clock className="w-6 h-6 text-yellow-600" />
            <div>
              <p className="font-medium text-yellow-900">Order is being prepared</p>
              <p className="text-sm text-yellow-700">
                The restaurant will start preparing your order shortly
              </p>
            </div>
          </div>

          {/* Order Items */}
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Package className="w-5 h-5" />
              Your Items
            </h2>
            <div className="space-y-3">
              {order.items.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex-grow">
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                  </div>
                  <p className="font-bold text-gray-900">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="pt-4 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <span className="text-xl font-bold text-gray-900">Total Paid</span>
              <span className="text-2xl font-bold text-green-600">
                ${order.total.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="font-bold text-gray-900 mb-3">Delivery Information</h3>
          <div className="space-y-2 text-sm">
            <p className="text-gray-700">
              <span className="font-medium">Name:</span> {order.customerName}
            </p>
            {order.customerEmail && (
              <p className="text-gray-700">
                <span className="font-medium">Email:</span> {order.customerEmail}
              </p>
            )}
            {order.customerPhone && (
              <p className="text-gray-700">
                <span className="font-medium">Phone:</span> {order.customerPhone}
              </p>
            )}
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <h3 className="font-bold text-blue-900 mb-3">What happens next?</h3>
          <ol className="space-y-2 text-sm text-blue-800">
            <li className="flex items-start gap-2">
              <span className="font-bold">1.</span>
              <span>The restaurant will confirm your order</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold">2.</span>
              <span>Your order will be prepared fresh</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold">3.</span>
              <span>You'll be notified when it's ready for delivery/pickup</span>
            </li>
          </ol>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => navigate(`/${subdomain}/track-order/${order.id}`)}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Clock className="w-5 h-5" />
            Track Order
          </button>
          <button
            onClick={() => navigate(`/${subdomain}/menu`)}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 text-gray-700 font-medium border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Home className="w-5 h-5" />
            Back to Menu
          </button>
        </div>

        {/* Confirmation Email Notice */}
        {order.customerEmail && (
          <p className="text-center text-sm text-gray-600 mt-6">
            A confirmation email has been sent to{' '}
            <span className="font-medium">{order.customerEmail}</span>
          </p>
        )}
      </div>
    </div>
  );
};
