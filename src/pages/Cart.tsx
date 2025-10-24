import { useAppSelector, useAppDispatch } from '../store';
import { clearCart } from '../store/slices/cartSlice';

const Cart = () => {
  const dispatch = useAppDispatch();
  const { items, subtotal, deliveryFee, taxes, total } = useAppSelector((state) => state.cart);

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🛒</div>
            <p className="text-xl text-muted-foreground">Your cart is empty</p>
            <p className="mt-2 text-muted-foreground">Add some delicious food to get started!</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Your Cart</h1>
          <button
            onClick={handleClearCart}
            className="text-destructive hover:underline"
          >
            Clear Cart
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-card rounded-lg shadow-sm">
              {items.map((item) => (
                <div
                  key={item.menuItem.id}
                  className="flex items-center gap-4 p-4 border-b last:border-0"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.menuItem.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      ₹{item.menuItem.price}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">x{item.quantity}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-lg shadow-sm p-6 sticky top-4">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span>₹{deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Taxes</span>
                  <span>₹{taxes.toFixed(2)}</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              <button className="w-full bg-primary text-primary-foreground py-3 rounded-md font-semibold hover:opacity-90 transition-opacity">
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
