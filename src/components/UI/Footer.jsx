import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaLinkedin, FaTwitter } from "react-icons/fa";
import { FaSquareInstagram } from "react-icons/fa6";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-gray-300">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
        
        {/* Brand/About Section */}
        <div className="space-y-4">
          <h2 className="text-white text-2xl font-bold tracking-tight">
            Tool<span className="text-green-500">Rent</span>
          </h2>
          <p className="text-sm leading-relaxed text-gray-400">
            The world's leading community-driven tool sharing platform. Rent what you need, earn from what you own.
          </p>
        </div>

        {/* Important Links */}
        <div>
          <h3 className="text-white font-semibold mb-4 uppercase tracking-wider text-sm">Quick Links</h3>
          <ul className="space-y-3">
            <li>
              <Link to="/" className="hover:text-green-500 transition-colors duration-200">Home</Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-green-500 transition-colors duration-200">About Us</Link>
            </li>
            <li>
              <Link to="/rent-tools" className="hover:text-green-500 transition-colors duration-200">Rent Tools</Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-green-500 transition-colors duration-200">Contact Support</Link>
            </li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-white font-semibold mb-4 uppercase tracking-wider text-sm">Connect With Us</h3>
          <div className="flex justify-center md:justify-start gap-4">
            <a href="#" className="p-2 bg-slate-800 rounded-full hover:bg-blue-600 hover:text-white transition-all duration-300">
              <FaFacebook size={20} />
            </a>
            <a href="#" className="p-2 bg-slate-800 rounded-full hover:bg-blue-400 hover:text-white transition-all duration-300">
              <FaLinkedin size={20} />
            </a>
            <a href="#" className="p-2 bg-slate-800 rounded-full hover:bg-pink-600 hover:text-white transition-all duration-300">
              <FaSquareInstagram size={20} />
            </a>
            <a href="#" className="p-2 bg-slate-800 rounded-full hover:bg-sky-500 hover:text-white transition-all duration-300">
              <FaTwitter size={20} />
            </a>
          </div>
          <div className="mt-6">
            <p className="text-xs text-gray-500 italic">Trusted by over 50,000+ users worldwide.</p>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800 py-6">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <p>© {currentYear} ToolRent. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="/privacy" className="hover:underline">Privacy Policy</Link>
            <Link to="/terms" className="hover:underline">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
