import React from 'react';
import { 
  Gavel, 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube,
  Shield,
  CreditCard,
  Truck,
  Clock
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-secondary-900 text-white ">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center">
              <Gavel className="h-8 w-8 text-primary-400 mr-3" />
              <span className="text-2xl font-bold">BidTreasure</span>
            </div>
            <p className="text-secondary-300 leading-relaxed">
              The world's leading online auction platform where treasures meet their perfect owners. 
              Discover, bid, and win unique items from around the globe.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-secondary-400 hover:text-primary-400 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-secondary-400 hover:text-primary-400 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-secondary-400 hover:text-primary-400 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-secondary-400 hover:text-primary-400 transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-secondary-300 hover:text-white transition-colors">
                  Browse Auctions
                </a>
              </li>
              <li>
                <a href="#" className="text-secondary-300 hover:text-white transition-colors">
                  Sell Your Items
                </a>
              </li>
              <li>
                <a href="#" className="text-secondary-300 hover:text-white transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#" className="text-secondary-300 hover:text-white transition-colors">
                  Success Stories
                </a>
              </li>
              <li>
                <a href="#" className="text-secondary-300 hover:text-white transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-secondary-300 hover:text-white transition-colors">
                  Contact Support
                </a>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Popular Categories</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-secondary-300 hover:text-white transition-colors">
                  Electronics
                </a>
              </li>
              <li>
                <a href="#" className="text-secondary-300 hover:text-white transition-colors">
                  Art & Collectibles
                </a>
              </li>
              <li>
                <a href="#" className="text-secondary-300 hover:text-white transition-colors">
                  Jewelry & Watches
                </a>
              </li>
              <li>
                <a href="#" className="text-secondary-300 hover:text-white transition-colors">
                  Vehicles
                </a>
              </li>
              <li>
                <a href="#" className="text-secondary-300 hover:text-white transition-colors">
                  Fashion
                </a>
              </li>
              <li>
                <a href="#" className="text-secondary-300 hover:text-white transition-colors">
                  Home & Garden
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <MapPin className="h-5 w-5 text-primary-400 mr-3 flex-shrink-0" />
                <span className="text-secondary-300">
                  123 Auction Street<br />
                  New York, NY 10001
                </span>
              </div>
              <div className="flex items-center">
                <Phone className="h-5 w-5 text-primary-400 mr-3 flex-shrink-0" />
                <span className="text-secondary-300">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-primary-400 mr-3 flex-shrink-0" />
                <span className="text-secondary-300">support@bidtreasure.com</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-primary-400 mr-3 flex-shrink-0" />
                <span className="text-secondary-300">24/7 Customer Support</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="border-t border-secondary-800">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center mb-6">
            <h4 className="text-lg font-semibold mb-4">Trusted & Secure</h4>
            <div className="flex flex-wrap justify-center items-center gap-8">
              <div className="flex items-center text-secondary-300">
                <Shield className="h-6 w-6 text-green-400 mr-2" />
                <span>SSL Secured</span>
              </div>
              <div className="flex items-center text-secondary-300">
                <CreditCard className="h-6 w-6 text-blue-400 mr-2" />
                <span>Secure Payments</span>
              </div>
              <div className="flex items-center text-secondary-300">
                <Truck className="h-6 w-6 text-orange-400 mr-2" />
                <span>Insured Shipping</span>
              </div>
              <div className="flex items-center text-secondary-300">
                <Clock className="h-6 w-6 text-purple-400 mr-2" />
                <span>24/7 Support</span>
              </div>
            </div>
          </div>
          
          {/* Payment Methods */}
          <div className="text-center">
            <p className="text-secondary-400 mb-4">Accepted Payment Methods</p>
            <div className="flex justify-center items-center space-x-4">
              <div className="bg-white rounded p-2">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/200px-Visa_Inc._logo.svg.png" alt="Visa" className="h-6 w-auto" />
              </div>
              <div className="bg-white rounded p-2">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/200px-Mastercard-logo.svg.png" alt="Mastercard" className="h-6 w-auto" />
              </div>
              <div className="bg-white rounded p-2">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/American_Express_logo_%282018%29.svg/200px-American_Express_logo_%282018%29.svg.png" alt="American Express" className="h-6 w-auto" />
              </div>
              <div className="bg-white rounded p-2">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/PayPal.svg/200px-PayPal.svg.png" alt="PayPal" className="h-6 w-auto" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-secondary-800">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-secondary-400 text-sm">
              © {currentYear} BidTreasure. All rights reserved.
            </div>
            <div className="flex flex-wrap justify-center md:justify-end space-x-6 text-sm">
              <a href="#" className="text-secondary-400 hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-secondary-400 hover:text-white transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-secondary-400 hover:text-white transition-colors">
                Cookie Policy
              </a>
              <a href="#" className="text-secondary-400 hover:text-white transition-colors">
                Accessibility
              </a>
              <a href="#" className="text-secondary-400 hover:text-white transition-colors">
                Sitemap
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
