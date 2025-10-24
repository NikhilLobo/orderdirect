import { useEffect, useState } from 'react';
import { useParams, Outlet } from 'react-router-dom';
import { getRestaurantBySubdomain } from '../../services/restaurantService';
import type { Restaurant } from '../../types/restaurant';

const StorefrontLayout = () => {
  const { subdomain } = useParams<{ subdomain: string }>();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadRestaurant = async () => {
      console.log('[StorefrontLayout] Starting to load restaurant, subdomain:', subdomain);

      if (!subdomain) {
        console.log('[StorefrontLayout] No subdomain provided');
        setError('No restaurant specified');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log('[StorefrontLayout] Calling getRestaurantBySubdomain with:', subdomain);
        const restaurantData = await getRestaurantBySubdomain(subdomain);
        console.log('[StorefrontLayout] Restaurant data received:', restaurantData);

        if (!restaurantData) {
          console.log('[StorefrontLayout] Restaurant not found');
          setError('Restaurant not found');
        } else {
          console.log('[StorefrontLayout] Setting restaurant data');
          setRestaurant(restaurantData as Restaurant);
        }
      } catch (err) {
        console.error('[StorefrontLayout] Error loading restaurant:', err);
        setError('Failed to load restaurant');
      } finally {
        setLoading(false);
        console.log('[StorefrontLayout] Loading complete');
      }
    };

    loadRestaurant();
  }, [subdomain]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading restaurant...</p>
        </div>
      </div>
    );
  }

  if (error || !restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-6xl mb-4">🍽️</div>
          <h1 className="text-3xl font-bold mb-2">Restaurant Not Found</h1>
          <p className="text-muted-foreground mb-6">
            {error || 'The restaurant you are looking for does not exist.'}
          </p>
          <a
            href="/"
            className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-medium"
          >
            Go to Homepage
          </a>
        </div>
      </div>
    );
  }

  // Pass restaurant data to child routes via Outlet context
  return <Outlet context={{ restaurant }} />;
};

export default StorefrontLayout;
