import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-gradient-to-r from-primary via-[#a01822] to-primary text-white sticky top-0 z-50 shadow-lg relative overflow-hidden group">
      {/* Animated shine effect */}
      <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white to-transparent opacity-5 group-hover:animate-shine"></span>
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="group/logo flex flex-col items-center">
            <div className="flex items-center gap-1">
              <div className="flex items-center text-2xl font-bold text-white group-hover/logo:opacity-90 transition-opacity">
                <div className="relative w-6 h-6 flex items-center justify-center mr-0.5">
                  <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
                    {/* Outer rim of plate */}
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="rgba(255,255,255,0.2)"/>
                    {/* Inner plate circle */}
                    <circle cx="12" cy="12" r="7" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                    {/* Center detail */}
                    <circle cx="12" cy="12" r="3" fill="currentColor" opacity="0.3"/>
                  </svg>
                </div>
                <span className="-ml-0.5">rder</span>
              </div>
              <span className="text-2xl font-bold text-white">
                Direct
              </span>
            </div>
            <span className="text-[10px] text-white/80 -mt-1">Food Ordering Platform</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-white hover:text-white/80 transition-colors font-medium"
            >
              Home
            </Link>
            <Link
              to="/#features"
              className="text-white hover:text-white/80 transition-colors font-medium"
            >
              Features
            </Link>
            <Link
              to="/#pricing"
              className="text-white hover:text-white/80 transition-colors font-medium"
            >
              Pricing
            </Link>
            <Link
              to="/#how-it-works"
              className="text-white hover:text-white/80 transition-colors font-medium"
            >
              How It Works
            </Link>
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            <Link
              to="/signup"
              className="relative px-6 py-2 bg-white text-primary rounded-md font-medium overflow-hidden group/btn transition-all hover:shadow-xl hover:scale-105"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white to-transparent opacity-30 group-hover/btn:animate-shine"></span>
              <span className="relative">Get Started</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
