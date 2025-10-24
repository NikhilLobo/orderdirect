import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Top Promotional Banner */}
      <div className="relative bg-gradient-to-r from-primary via-[#a01822] to-primary text-white py-3 overflow-hidden group">
        {/* Animated shine effect */}
        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white to-transparent opacity-10 group-hover:animate-shine"></span>

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4 text-center">
            <span className="text-2xl">🎉</span>
            <p className="text-sm md:text-base font-semibold">
              <span className="font-bold">Launch Offer:</span> Get your first month at <span className="bg-white text-primary px-2 py-0.5 rounded font-bold">50% OFF</span> — Only £24.50!
            </p>
            <Link
              to="/signup"
              className="text-xs md:text-sm bg-white text-primary px-4 py-1.5 rounded-full font-bold hover:bg-gray-100 transition-all hover:scale-105"
            >
              Claim Now →
            </Link>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary via-primary to-primary/90 text-primary-foreground py-20 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="1"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            {/* Left Content */}
            <div className="text-center md:text-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Your Restaurant. Your Brand. Zero Commission.
              </h1>
              <p className="text-xl md:text-2xl mb-8 opacity-90">
                Accept online orders with your own branded storefront — keep 100% of your revenue for just £49/month.
              </p>

              {/* CTA Button */}
              <div className="flex justify-center md:justify-start">
                <Link
                  to="/signup"
                  className="relative px-8 py-4 bg-gradient-to-r from-white to-gray-50 text-primary rounded-lg font-bold text-lg shadow-lg overflow-hidden group transition-all duration-300 hover:shadow-2xl hover:scale-105 active:scale-95"
                >
                  {/* Animated shine effect */}
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white to-transparent opacity-30 group-hover:animate-shine"></span>
                  <span className="relative">Get Started →</span>
                </Link>
              </div>

              {/* Trust Badge */}
              <p className="mt-6 text-sm opacity-80">
                ✓ Simple setup • ✓ No long-term contracts • ✓ Cancel anytime
              </p>

              {/* Stats Banner */}
              <div className="mt-10 grid grid-cols-3 gap-4 max-w-lg mx-auto md:mx-0">
                <div className="relative bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center overflow-hidden group hover:bg-white/20 transition-all">
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white to-transparent opacity-10 group-hover:animate-shine"></span>
                  <div className="relative">
                    <p className="text-3xl font-bold">0%</p>
                    <p className="text-xs opacity-80">Commission</p>
                  </div>
                </div>
                <div className="relative bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center overflow-hidden group hover:bg-white/20 transition-all">
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white to-transparent opacity-10 group-hover:animate-shine"></span>
                  <div className="relative">
                    <p className="text-3xl font-bold">£49</p>
                    <p className="text-xs opacity-80">Per Month</p>
                  </div>
                </div>
                <div className="relative bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center overflow-hidden group hover:bg-white/20 transition-all">
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white to-transparent opacity-10 group-hover:animate-shine"></span>
                  <div className="relative">
                    <p className="text-3xl font-bold">100%</p>
                    <p className="text-xs opacity-80">Yours</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Image */}
            <div className="hidden md:block">
              <div className="relative">
                <div className="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-2xl transform rotate-3"></div>
                <img
                  src="https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=600&h=600&fit=crop&q=80"
                  alt="Restaurant owner managing orders"
                  className="relative rounded-2xl shadow-2xl w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem/Solution Section */}
      <section className="py-20 bg-gradient-to-b from-muted/30 to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Left - Image */}
              <div className="order-2 md:order-1">
                <img
                  src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&h=400&fit=crop&q=80"
                  alt="Restaurant profits"
                  className="rounded-2xl shadow-xl w-full h-auto"
                />
              </div>

              {/* Right - Content */}
              <div className="order-1 md:order-2">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Tired of Paying 15-30% Commission?
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Third-party platforms take a huge cut of your hard-earned revenue.
                  With OrderDirect, you pay a simple flat fee — no commissions, no hidden costs.
                </p>
                <div className="bg-primary/10 border-2 border-primary rounded-xl p-6 mb-6">
                  <p className="text-4xl md:text-5xl font-bold text-primary mb-2">£49/month</p>
                  <p className="text-xl font-semibold mb-2">That's it. No commission. Ever.</p>
                  <p className="text-muted-foreground text-sm">
                    Payments go directly to your Stripe account with free next-day payouts
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-card border rounded-lg p-4">
                    <p className="text-2xl font-bold text-primary">100%</p>
                    <p className="text-sm text-muted-foreground">Revenue Kept</p>
                  </div>
                  <div className="bg-card border rounded-lg p-4">
                    <p className="text-2xl font-bold text-primary">0%</p>
                    <p className="text-sm text-muted-foreground">Commission</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Visual Showcase */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-16 items-center mb-20">
              <div>
                <span className="inline-block px-4 py-1 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-4">
                  🏪 Your Storefront
                </span>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Beautiful, Branded Online Ordering
                </h2>
                <p className="text-lg text-muted-foreground mb-6">
                  Your own custom subdomain with your colors and branding
                </p>
                <div className="flex gap-4 flex-wrap">
                  <div className="flex items-center gap-2 px-4 py-2 bg-primary/5 rounded-lg">
                    <span className="text-primary">✓</span>
                    <span className="text-sm font-medium">Mobile Ready</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-primary/5 rounded-lg">
                    <span className="text-primary">✓</span>
                    <span className="text-sm font-medium">Fast Loading</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-primary/5 rounded-lg">
                    <span className="text-primary">✓</span>
                    <span className="text-sm font-medium">SEO Optimized</span>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl transform rotate-3"></div>
                <img
                  src="https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=700&h=500&fit=crop&q=90"
                  alt="Fresh healthy food ingredients"
                  className="relative rounded-2xl shadow-2xl w-full h-auto"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div className="order-2 md:order-1 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl transform -rotate-3"></div>
                <img
                  src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop&q=80"
                  alt="Restaurant dashboard and order management"
                  className="relative rounded-2xl shadow-2xl"
                />
              </div>
              <div className="order-1 md:order-2">
                <span className="inline-block px-4 py-1 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-4">
                  📊 Dashboard
                </span>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Manage Everything in One Place
                </h2>
                <p className="text-lg text-muted-foreground mb-6">
                  Real-time orders and customer insights
                </p>
                <div className="flex gap-4 flex-wrap">
                  <div className="flex items-center gap-2 px-4 py-2 bg-primary/5 rounded-lg">
                    <span className="text-primary">✓</span>
                    <span className="text-sm font-medium">Live Updates</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-primary/5 rounded-lg">
                    <span className="text-primary">✓</span>
                    <span className="text-sm font-medium">Easy to Use</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-primary/5 rounded-lg">
                    <span className="text-primary">✓</span>
                    <span className="text-sm font-medium">Menu Management</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Complete platform for online ordering
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="group text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg mx-auto">
                <span className="text-4xl">💳</span>
              </div>
              <h3 className="text-lg font-bold mb-1">Direct Payments</h3>
              <p className="text-sm text-muted-foreground">Stripe integration</p>
            </div>
            <div className="group text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg mx-auto">
                <span className="text-4xl">📊</span>
              </div>
              <h3 className="text-lg font-bold mb-1">Real-Time Orders</h3>
              <p className="text-sm text-muted-foreground">Live dashboard</p>
            </div>
            <div className="group text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg mx-auto">
                <span className="text-4xl">📱</span>
              </div>
              <h3 className="text-lg font-bold mb-1">Mobile Ready</h3>
              <p className="text-sm text-muted-foreground">Works anywhere</p>
            </div>
            <div className="group text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg mx-auto">
                <span className="text-4xl">🔔</span>
              </div>
              <h3 className="text-lg font-bold mb-1">Notifications</h3>
              <p className="text-sm text-muted-foreground">Instant alerts</p>
            </div>
            <div className="group text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg mx-auto">
                <span className="text-4xl">⚙️</span>
              </div>
              <h3 className="text-lg font-bold mb-1">Easy Setup</h3>
              <p className="text-sm text-muted-foreground">No tech skills</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Get Started in Minutes
            </h2>
            <p className="text-lg text-muted-foreground">
              Three simple steps to launch
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-center gap-8">
              <div className="flex flex-col items-center text-center flex-1">
                <div className="w-24 h-24 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground rounded-full flex items-center justify-center text-4xl font-bold mb-4 shadow-xl">
                  1
                </div>
                <h3 className="text-xl font-bold mb-2">Sign Up</h3>
                <p className="text-muted-foreground text-sm">Choose your subdomain</p>
              </div>
              <div className="hidden md:block text-4xl text-primary">→</div>
              <div className="flex flex-col items-center text-center flex-1">
                <div className="w-24 h-24 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground rounded-full flex items-center justify-center text-4xl font-bold mb-4 shadow-xl">
                  2
                </div>
                <h3 className="text-xl font-bold mb-2">Add Menu</h3>
                <p className="text-muted-foreground text-sm">Upload your items</p>
              </div>
              <div className="hidden md:block text-4xl text-primary">→</div>
              <div className="flex flex-col items-center text-center flex-1">
                <div className="w-24 h-24 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground rounded-full flex items-center justify-center text-4xl font-bold mb-4 shadow-xl">
                  3
                </div>
                <h3 className="text-xl font-bold mb-2">Start Selling</h3>
                <p className="text-muted-foreground text-sm">Accept orders instantly</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Simple Pricing
            </h2>
            <p className="text-lg text-muted-foreground">
              No commissions. No hidden fees.
            </p>
          </div>

          <div className="max-w-md mx-auto">
            <div className="bg-white border-4 border-primary rounded-3xl p-10 shadow-2xl relative overflow-hidden">
              {/* Decorative corner */}
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/5 rounded-full blur-3xl"></div>

              <div className="text-center mb-8 relative">
                <div className="inline-block px-4 py-1 bg-primary text-primary-foreground rounded-full text-xs font-bold mb-6">
                  BEST VALUE
                </div>
                <div className="mb-6">
                  <div className="text-7xl font-bold text-primary mb-2">
                    £49
                  </div>
                  <p className="text-muted-foreground text-lg">per month</p>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3 text-lg">
                  <span className="text-green-600 text-2xl">✓</span>
                  <span>Unlimited orders</span>
                </div>
                <div className="flex items-center gap-3 text-lg">
                  <span className="text-green-600 text-2xl">✓</span>
                  <span>0% commission</span>
                </div>
                <div className="flex items-center gap-3 text-lg">
                  <span className="text-green-600 text-2xl">✓</span>
                  <span>Email notifications</span>
                </div>
                <div className="flex items-center gap-3 text-lg">
                  <span className="text-green-600 text-2xl">✓</span>
                  <span>Direct payments</span>
                </div>
              </div>

              <Link
                to="/signup"
                className="relative block w-full py-5 bg-gradient-to-r from-primary to-[#a01822] text-white text-center rounded-xl font-bold text-xl overflow-hidden group transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98]"
              >
                {/* Animated shine effect */}
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white to-transparent opacity-20 group-hover:animate-shine"></span>
                <span className="relative">Get Started →</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative py-20 bg-gradient-to-br from-primary via-primary to-primary/90 text-primary-foreground overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="1"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}></div>
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Ready to Keep 100% of Your Revenue?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join restaurants already saving thousands on commission fees
          </p>
          <Link
            to="/signup"
            className="relative inline-block px-10 py-4 bg-gradient-to-r from-white to-gray-50 text-primary rounded-lg font-bold text-lg shadow-lg overflow-hidden group transition-all duration-300 hover:shadow-2xl hover:scale-105 active:scale-95"
          >
            {/* Animated shine effect */}
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white to-transparent opacity-30 group-hover:animate-shine"></span>
            <span className="relative">Get Started Today →</span>
          </Link>
          <p className="mt-6 text-sm opacity-80">
            No setup fees • Cancel anytime • Full support included
          </p>
        </div>
      </section>
    </div>
  );
};

export default Home;
