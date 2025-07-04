import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Linkedin, Twitter } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-ocean-700 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <img 
                src="/logo.png" 
                alt="Arab ShipBroker Logo" 
                className="h-8 w-8 object-contain"
              />
              <span className="font-poppins font-bold text-lg">Arab ShipBroker</span>
            </div>
            <p className="text-ocean-200 text-sm leading-relaxed">
              Premier maritime brokerage serving the MENA region with specialized expertise in dry-bulk chartering, vessel sales & purchase, and comprehensive shipping solutions.
            </p>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="text-ocean-200 hover:text-foam-300 transition-colors focus-ring rounded-md p-1"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="text-ocean-200 hover:text-foam-300 transition-colors focus-ring rounded-md p-1"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-poppins font-semibold text-lg">Quick Links</h3>
            <div className="space-y-2">
              <Link to="/services" className="block text-ocean-200 hover:text-foam-300 transition-colors text-sm focus-ring rounded-md">
                Our Services
              </Link>
              <Link to="/list-cargo" className="block text-ocean-200 hover:text-foam-300 transition-colors text-sm focus-ring rounded-md">
                List Your Cargo
              </Link>
              <Link to="/list-vessel" className="block text-ocean-200 hover:text-foam-300 transition-colors text-sm focus-ring rounded-md">
                List Your Vessel
              </Link>
              <Link to="/contact" className="block text-ocean-200 hover:text-foam-300 transition-colors text-sm focus-ring rounded-md">
                Contact Us
              </Link>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="font-poppins font-semibold text-lg">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-foam-300" />
                <a 
                  href="tel:+201010329231" 
                  className="text-ocean-200 text-sm hover:text-foam-300 transition-colors focus-ring rounded-md"
                >
                  +20 101 032 9231
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-foam-300" />
                <a 
                  href="mailto:info@arabshipbroker.com" 
                  className="text-ocean-200 text-sm hover:text-foam-300 transition-colors focus-ring rounded-md"
                >
                  info@arabshipbroker.com
                </a>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 text-foam-300 mt-0.5" />
                <span className="text-ocean-200 text-sm">
                  5th Settlement, New Cairo, Egypt<br />
                  (Office under set up)
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-ocean-600 mt-8 pt-8 text-center">
          <p className="text-ocean-200 text-sm">
            © {new Date().getFullYear()} Arab ShipBroker. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}