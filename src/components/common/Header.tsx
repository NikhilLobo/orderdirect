import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-white border-b sticky top-0 z-50 shadow-sm backdrop-blur-sm bg-opacity-95">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="group flex flex-col items-center">
            <div className="flex items-center gap-1">
              <div className="flex items-center text-2xl font-bold text-gray-600 group-hover:text-primary transition-colors">
                <div className="relative w-6 h-6 flex items-center justify-center mr-0.5">
                  <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
                    {/* Outer rim of plate */}
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="white"/>
                    {/* Inner plate circle */}
                    <circle cx="12" cy="12" r="7" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                    {/* Center detail */}
                    <circle cx="12" cy="12" r="3" fill="currentColor" opacity="0.15"/>
                  </svg>
                </div>
                <span className="-ml-0.5">rder</span>
              </div>
              <span className="text-2xl font-bold text-[#cb202d]">
                Direct
              </span>
            </div>
            <span className="text-[10px] text-gray-500 -mt-1">Food Ordering Platform</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              Home
            </Link>
            <Link
              to="/#features"
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              Features
            </Link>
            <Link
              to="/#pricing"
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              Pricing
            </Link>
            <Link
              to="/#how-it-works"
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              How It Works
            </Link>
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            <Link
              to="/signup"
              className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity font-medium"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
