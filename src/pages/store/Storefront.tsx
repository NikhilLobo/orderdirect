import { useEffect } from 'react';
import { useOutletContext, useNavigate, useParams } from 'react-router-dom';
import type { Restaurant } from '../../types/restaurant';

const Storefront = () => {
  const { restaurant } = useOutletContext<{ restaurant: Restaurant }>();
  const navigate = useNavigate();
  const { subdomain } = useParams<{ subdomain: string }>();

  // Redirect to menu page
  useEffect(() => {
    if (subdomain) {
      navigate(`/${subdomain}/menu`, { replace: true });
    }
  }, [subdomain, navigate]);

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Restaurant Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-2">{restaurant.name}</h1>
            <p className="text-muted-foreground">
              Order delicious food for delivery or pickup
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Coming Soon Message */}
          <div className="bg-card rounded-xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-6">👨‍🍳</div>
            <h2 className="text-3xl font-bold mb-4">Menu Coming Soon!</h2>
            <p className="text-muted-foreground mb-8">
              {restaurant.name} is setting up their menu. Check back soon to start ordering!
            </p>

            {/* Restaurant Info */}
            <div className="grid md:grid-cols-2 gap-6 mt-8 text-left">
              <div className="bg-muted/50 rounded-lg p-4">
                <h3 className="font-semibold mb-2">📞 Contact</h3>
                <p className="text-sm text-muted-foreground">{restaurant.phone}</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-4">
                <h3 className="font-semibold mb-2">✉️ Email</h3>
                <p className="text-sm text-muted-foreground">{restaurant.ownerEmail}</p>
              </div>
            </div>

            {/* Admin Link */}
            <div className="mt-8 pt-8 border-t">
              <p className="text-sm text-muted-foreground mb-4">
                Restaurant owner? Manage your menu and orders
              </p>
              <a
                href={`/store/${restaurant.subdomain}/admin`}
                className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-medium"
              >
                Go to Dashboard
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Storefront;
