import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, CheckCircle, Package, Home } from 'lucide-react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../config/firebase';
import type { Order } from '../../services/ordersService';

export const OrderTracking: React.FC = () => {
  const { subdomain, orderId } = useParams<{ subdomain: string; orderId: string }>();
  const navigate = useNavigate();

  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) {
      setError('Order not found');
      setIsLoading(false);
      return;
    }

    // Set up real-time listener
    const unsubscribe = onSnapshot(
      doc(db, 'orders', orderId),
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          setOrder({
            id: docSnapshot.id,
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
          setIsLoading(false);
        } else {
          setError('Order not found');
          setIsLoading(false);
        }
      },
      (err) => {
        console.error('Error fetching order:', err);
        setError('Failed to load order details');
        setIsLoading(false);
      }
    );

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, [orderId]);

  const getStatusInfo = (status: 'open' | 'closed') => {
    if (status === 'open') {
      return {
        label: 'In Progress',
        description: 'Your order is being prepared',
        icon: Clock,
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-200',
      };
    } else {
      return {
        label: 'Completed',
        description: 'Your order has been completed',
        icon: CheckCircle,
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
      };
    }
  };

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
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <button
              onClick={() => navigate(`/${subdomain}/menu`)}
              className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Menu</span>
            </button>
          </div>
        </header>
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
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
      </div>
    );
  }

  const statusInfo = getStatusInfo(order.status);
  const StatusIcon = statusInfo.icon;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate(`/${subdomain}/menu`)}
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Menu</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Track Your Order</h1>
          <p className="text-gray-600">
            Order ID: <span className="font-mono font-medium">#{order.id?.slice(-8).toUpperCase()}</span>
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Status Card */}
          <div className="lg:col-span-2 space-y-6">
            {/* Current Status */}
            <div
              className={`${statusInfo.bgColor} border ${statusInfo.borderColor} rounded-lg p-6`}
            >
              <div className="flex items-center gap-4 mb-4">
                <div
                  className={`p-3 ${statusInfo.bgColor} rounded-full border ${statusInfo.borderColor}`}
                >
                  <StatusIcon className={`w-8 h-8 ${statusInfo.color}`} />
                </div>
                <div>
                  <h2 className={`text-2xl font-bold ${statusInfo.color}`}>
                    {statusInfo.label}
                  </h2>
                  <p className={`${statusInfo.color}`}>{statusInfo.description}</p>
                </div>
              </div>

              {/* Real-time indicator */}
              <div className="flex items-center gap-2 text-sm text-gray-600 mt-4">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Live updates enabled</span>
              </div>
            </div>

            {/* Order Timeline */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Order Timeline</h3>

              <div className="space-y-6">
                {/* Order Placed */}
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <div className={`w-0.5 flex-grow mt-2 ${order.status === 'open' ? 'bg-gray-300' : 'bg-green-600'}`}></div>
                  </div>
                  <div className="flex-grow pb-8">
                    <h4 className="font-bold text-gray-900">Order Placed</h4>
                    <p className="text-sm text-gray-600">
                      {order.createdAt?.toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit',
                      })}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">Your order has been received</p>
                  </div>
                </div>

                {/* Being Prepared */}
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 ${
                        order.status === 'open'
                          ? 'bg-yellow-100'
                          : 'bg-green-100'
                      } rounded-full flex items-center justify-center`}
                    >
                      {order.status === 'open' ? (
                        <Clock className="w-6 h-6 text-yellow-600 animate-pulse" />
                      ) : (
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      )}
                    </div>
                    <div className={`w-0.5 flex-grow mt-2 ${order.status === 'closed' ? 'bg-green-600' : 'bg-gray-300'}`}></div>
                  </div>
                  <div className="flex-grow pb-8">
                    <h4 className="font-bold text-gray-900">Being Prepared</h4>
                    {order.status === 'open' ? (
                      <p className="text-sm text-yellow-600 font-medium">In progress...</p>
                    ) : (
                      <p className="text-sm text-gray-600">Completed</p>
                    )}
                    <p className="text-sm text-gray-500 mt-1">
                      The restaurant is preparing your order
                    </p>
                  </div>
                </div>

                {/* Completed */}
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 ${
                        order.status === 'closed'
                          ? 'bg-green-100'
                          : 'bg-gray-100'
                      } rounded-full flex items-center justify-center`}
                    >
                      {order.status === 'closed' ? (
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      ) : (
                        <Package className="w-6 h-6 text-gray-400" />
                      )}
                    </div>
                  </div>
                  <div className="flex-grow">
                    <h4 className="font-bold text-gray-900">Ready</h4>
                    {order.status === 'closed' ? (
                      <p className="text-sm text-green-600 font-medium">
                        {order.updatedAt?.toLocaleString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: 'numeric',
                          minute: '2-digit',
                        })}
                      </p>
                    ) : (
                      <p className="text-sm text-gray-500">Waiting...</p>
                    )}
                    <p className="text-sm text-gray-500 mt-1">
                      Your order is ready for pickup/delivery
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4 space-y-6">
              {/* Order Items */}
              <div>
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Your Items
                </h3>
                <div className="space-y-2">
                  {order.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between text-sm p-2 bg-gray-50 rounded"
                    >
                      <span className="text-gray-700">
                        {item.quantity}x {item.name}
                      </span>
                      <span className="font-medium text-gray-900">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-900">Total</span>
                  <span className="text-xl font-bold text-blue-600">
                    ${order.total.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Customer Info */}
              <div className="pt-4 border-t border-gray-200">
                <h3 className="font-bold text-gray-900 mb-2">Delivery Info</h3>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>{order.customerName}</p>
                  {order.customerPhone && <p>{order.customerPhone}</p>}
                  {order.customerEmail && <p className="text-xs">{order.customerEmail}</p>}
                </div>
              </div>

              {/* Back to Menu */}
              <button
                onClick={() => navigate(`/${subdomain}/menu`)}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 text-gray-700 font-medium border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Home className="w-5 h-5" />
                Back to Menu
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
