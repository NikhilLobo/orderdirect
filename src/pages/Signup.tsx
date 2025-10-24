import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkSubdomainAvailability, signupRestaurant } from '../services/restaurantService';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    restaurantName: '',
    ownerName: '',
    email: '',
    phone: '',
    subdomain: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [subdomainAvailable, setSubdomainAvailable] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }

    if (name === 'subdomain') {
      // Only allow lowercase letters and numbers
      const cleanValue = value.toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 20);
      setFormData((prev) => ({ ...prev, subdomain: cleanValue }));

      // Reset availability check when subdomain changes
      setSubdomainAvailable(null);

      // Auto-check availability after user stops typing (debounce)
      if (cleanValue.length >= 3) {
        setTimeout(() => {
          checkSubdomainAvailability(cleanValue).then(isAvailable => {
            setSubdomainAvailable(isAvailable);
          }).catch(() => {
            setSubdomainAvailable(false);
          });
        }, 500);
      }
    } else if (name === 'restaurantName') {
      setFormData((prev) => ({ ...prev, [name]: value }));

      // Auto-suggest subdomain from restaurant name if subdomain is empty
      if (!formData.subdomain) {
        const suggestedSubdomain = value
          .toLowerCase()
          .replace(/[^a-z0-9]/g, '')
          .substring(0, 20);
        setFormData((prev) => ({ ...prev, subdomain: suggestedSubdomain }));
        setSubdomainAvailable(null);

        // Auto-check availability
        if (suggestedSubdomain.length >= 3) {
          setTimeout(() => {
            checkSubdomainAvailability(suggestedSubdomain).then(isAvailable => {
              setSubdomainAvailable(isAvailable);
            }).catch(() => {
              setSubdomainAvailable(false);
            });
          }, 500);
        }
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };


  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.restaurantName.trim()) {
      newErrors.restaurantName = 'Restaurant name is required';
    }
    if (!formData.ownerName.trim()) {
      newErrors.ownerName = 'Owner name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }
    if (!formData.subdomain.trim()) {
      newErrors.subdomain = 'Subdomain is required';
    } else if (formData.subdomain.length < 3) {
      newErrors.subdomain = 'Subdomain must be at least 3 characters';
    } else if (!/^[a-z0-9]+$/.test(formData.subdomain)) {
      newErrors.subdomain = 'Subdomain can only contain lowercase letters and numbers';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const result = await signupRestaurant({
        restaurantName: formData.restaurantName,
        ownerName: formData.ownerName,
        email: formData.email,
        phone: formData.phone,
        subdomain: formData.subdomain,
        password: formData.password,
      });

      // Success! Redirect to the restaurant's page
      const restaurantUrl = `https://orderdirect-eight.vercel.app/${result.subdomain}`;
      alert(`Success! Your restaurant is ready at ${restaurantUrl}`);

      // Redirect to the restaurant's storefront
      navigate(`/${result.subdomain}`);
    } catch (error: any) {
      console.error('Signup error:', error);
      setErrors({
        general: error.message || 'Failed to create account. Please try again.',
      });

      // Scroll to top to show error
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2">Create Your Restaurant Account</h1>
            <p className="text-muted-foreground">
              Get your restaurant online in minutes and start accepting orders
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-card rounded-xl shadow-lg p-8">
            {/* General Error Message */}
            {errors.general && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm font-medium">{errors.general}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Restaurant Name */}
              <div>
                <label htmlFor="restaurantName" className="block text-sm font-medium mb-2">
                  Restaurant Name *
                </label>
                <input
                  type="text"
                  id="restaurantName"
                  name="restaurantName"
                  value={formData.restaurantName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="e.g., Turmeric Kitchen"
                />
                {errors.restaurantName && (
                  <p className="text-red-500 text-sm mt-1">{errors.restaurantName}</p>
                )}
              </div>

              {/* Subdomain - Auto-generated from restaurant name */}
              <div>
                <label htmlFor="subdomain" className="block text-sm font-medium mb-2">
                  Enter Restaurant Name for Subpath *
                </label>
                <div className="flex items-stretch border border-input rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-ring">
                  <span className="flex items-center pl-3 pr-0 py-3 bg-gray-100 text-gray-400 text-sm font-mono whitespace-nowrap">
                    orderdirect-eight.vercel.app/
                  </span>
                  <input
                    type="text"
                    id="subdomain"
                    name="subdomain"
                    value={formData.subdomain}
                    onChange={(e) => {
                      handleChange(e);
                      setSubdomainAvailable(null);
                    }}
                    className="flex-1 pl-0 pr-4 py-3 focus:outline-none font-mono bg-white"
                    placeholder="restaurant_name"
                  />
                </div>
                {subdomainAvailable === true && formData.subdomain && (
                  <p className="text-green-600 text-sm mt-1 flex items-center gap-1">
                    <span className="text-lg">✓</span> This URL is available!
                  </p>
                )}
                {subdomainAvailable === false && formData.subdomain && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <span className="text-lg">✗</span> This URL is already taken. Please try a different name.
                  </p>
                )}
                {errors.subdomain && (
                  <p className="text-red-500 text-sm mt-1">{errors.subdomain}</p>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  💡 Only lowercase letters, numbers, no spaces
                </p>
              </div>

              {/* Owner Name */}
              <div>
                <label htmlFor="ownerName" className="block text-sm font-medium mb-2">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  id="ownerName"
                  name="ownerName"
                  value={formData.ownerName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="John Smith"
                />
                {errors.ownerName && (
                  <p className="text-red-500 text-sm mt-1">{errors.ownerName}</p>
                )}
              </div>

              {/* Email & Phone */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="you@restaurant.com"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="07XXX XXXXXX"
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                  )}
                </div>
              </div>

              {/* Password */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="password" className="block text-sm font-medium mb-2">
                    Password *
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="Min. 8 characters"
                  />
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
                    Confirm Password *
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="Re-enter password"
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                  )}
                </div>
              </div>

              {/* Next Steps Info */}
              <div className="bg-muted/50 border border-border rounded-lg p-4">
                <h3 className="font-semibold mb-2">What happens next?</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>✓ Create your account and choose your subdomain</li>
                  <li>✓ We'll guide you through setting up your menu</li>
                  <li>✓ Connect your Stripe account to accept payments</li>
                  <li>✓ Simple pricing: £49/month, cancel anytime</li>
                </ul>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="relative w-full py-4 bg-gradient-to-r from-primary to-[#a01822] text-white rounded-lg font-bold text-lg overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
              >
                {/* Animated shine effect */}
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white to-transparent opacity-20 group-hover:animate-shine"></span>

                {/* Button text with loading animation */}
                <span className="relative flex items-center justify-center gap-2">
                  {isLoading && (
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  )}
                  {isLoading ? 'Creating Your Account...' : '🚀 Create Account'}
                </span>
              </button>
            </form>
          </div>

          {/* Trust Badges */}
          <div className="mt-8 text-center text-sm text-muted-foreground">
            <p>🔒 Your data is secure and encrypted</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
