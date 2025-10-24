import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-card border-t mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="mb-3">
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-1">
                  <div className="flex items-center text-2xl font-bold text-gray-600">
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
                  <h3 className="text-2xl font-bold text-[#cb202d]">Direct</h3>
                </div>
                <p className="text-[10px] text-gray-500 -mt-1">Food Ordering Platform</p>
              </div>
            </div>
            <p className="text-muted-foreground text-sm">
              Zero commission online ordering platform for restaurants. Keep 100% of your revenue.
            </p>
          </div>

          {/* Company */}
          <div className="text-center">
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/careers" className="text-muted-foreground hover:text-foreground transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="text-center">
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/refund" className="text-muted-foreground hover:text-foreground transition-colors">
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-6 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} OrderDirect. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
