import { Mail, Facebook, Instagram, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-blue-500 text-white">
      {/* Main Footer Content */}
      <div className="container mx-auto px-6 py-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8">

        {/* E-commerce Support */}
        <div>
          <h3 className="font-semibold mb-3">E-commerce support</h3>
          <p>PhoneStore</p>
          <p>Malang 123</p>
          <p>Pendem</p>
          <p>Jawa Timur</p>
          <p className="mt-2">Phone: +31 20 123 4567</p>
          <p>Email: support@phonestore.com</p>
        </div>

        {/* Working Hours */}
        <div>
          <h3 className="font-semibold mb-3">Working hours</h3>
          <p>Monday to Friday: 09:00 - 18:00</p>
          <p>Saturday: 10:00 - 16:00</p>
          <p>Sunday: Closed</p>
        </div>

        {/* About Us */}
        <div>
          <h3 className="font-semibold mb-3">About us</h3>
          <ul className="space-y-1">
            <li><a href="#" className="hover:underline">Stores</a></li>
            <li><a href="#" className="hover:underline">Corporate website</a></li>
            <li><a href="#" className="hover:underline">Exclusive Offers</a></li>
            <li><a href="#" className="hover:underline">Career</a></li>
          </ul>
        </div>

        {/* Help & Support */}
        <div>
          <h3 className="font-semibold mb-3">Help & Support</h3>
          <ul className="space-y-1">
            <li><a href="#" className="hover:underline">Help center</a></li>
            <li><a href="#" className="hover:underline">Payments</a></li>
            <li><a href="#" className="hover:underline">Product returns</a></li>
            <li><a href="#" className="hover:underline">FAQ</a></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="font-semibold mb-3">Sign up for exclusive offers and the latest news!</h3>
          <div className="flex items-center border border-white rounded-lg overflow-hidden mb-4">
            <span className="px-2">
              <Mail className="w-5 h-5" />
            </span>
            <input
              type="email"
              placeholder="Your email..."
              className="bg-transparent px-2 py-1 flex-1 outline-none text-white placeholder-white"
            />
          </div>
          <div className="flex space-x-3">
            <a href="#" className="p-2 bg-black rounded-full hover:bg-gray-800">
              <Facebook className="w-4 h-4" />
            </a>
            <a href="#" className="p-2 bg-black rounded-full hover:bg-gray-800">
              <Instagram className="w-4 h-4" />
            </a>
            <a href="#" className="p-2 bg-black rounded-full hover:bg-gray-800">
              <Twitter className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="bg-white text-blue-500 text-sm py-4">
        <div className="container mx-auto px-6 flex flex-col sm:flex-row items-center justify-between">
          <p>© 2024 SmartPhone. All Rights Reserved.</p>
          <div className="flex space-x-4 mt-2 sm:mt-0">
            <a href="#" className="hover:underline">Privacy policy</a>
            <a href="#" className="hover:underline">Cookie settings</a>
            <a href="#" className="hover:underline">Terms and conditions</a>
            <a href="#" className="hover:underline">Imprint</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
