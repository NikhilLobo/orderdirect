import { useState } from 'react';
import { Link } from 'react-router-dom';

const Signup = () => {
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }

    // Auto-generate subdomain from restaurant name
    if (name === 'restaurantName' && !formData.subdomain) {
      const subdomain = value
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '')
        .substring(0, 20);
      setFormData((prev) => ({ ...prev, subdomain }));
    }
  };

  const checkSubdomainAvailability = async () => {
    // TODO: Implement Firebase check
    // For now, simulate availability check
    const reserved = ['admin', 'dashboard', 'www', 'api', 'app'];
    const isAvailable = !reserved.includes(formData.subdomain) && formData.subdomain.length >= 3;
    setSubdomainAvailable(isAvailable);
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

    // TODO: Implement Firebase Auth + Firestore restaurant creation
    console.log('Form submitted:', formData);
    alert('Sign up functionality will be implemented with Firebase');
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

              {/* Subdomain */}
              <div>
                <label htmlFor="subdomain" className="block text-sm font-medium mb-2">
                  Your Storefront URL *
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    id="subdomain"
                    name="subdomain"
                    value={formData.subdomain}
                    onChange={handleChange}
                    onBlur={checkSubdomainAvailability}
                    className="flex-1 px-4 py-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="yourrestaurant"
                  />
                  <span className="text-muted-foreground whitespace-nowrap">
                    .orderdirect.co.uk
                  </span>
                </div>
                {subdomainAvailable === true && (
                  <p className="text-green-600 text-sm mt-1">✓ Subdomain is available!</p>
                )}
                {subdomainAvailable === false && (
                  <p className="text-red-500 text-sm mt-1">✗ Subdomain is not available</p>
                )}
                {errors.subdomain && (
                  <p className="text-red-500 text-sm mt-1">{errors.subdomain}</p>
                )}
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
                className="w-full py-4 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-bold text-lg"
              >
                Create Account
              </button>

              {/* Login Link */}
              <p className="text-center text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link to="/login" className="text-primary font-medium hover:underline">
                  Sign in
                </Link>
              </p>
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
