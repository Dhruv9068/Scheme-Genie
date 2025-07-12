import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Download, Shield, FileText, Mail, MapPin, Phone } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white rounded-full shadow-md border border-orange-100 flex items-center justify-center">
                <img src="/Logo.png" alt="SchemeGenie" className="w-7 h-7" />
              </div>
              <span className="text-xl font-bold">SchemeGenie</span>
            </div>
            <p className="text-gray-400 text-sm">
              AI-powered platform helping citizens discover and apply for government benefit schemes worldwide.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">Twitter</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">LinkedIn</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/assistant" className="text-gray-400 hover:text-white transition-colors text-sm">
                  AI Assistant
                </Link>
              </li>
              <li>
                <Link to="/schemes" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Browse Schemes
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Tools & Resources */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Tools & Resources</h3>
            <ul className="space-y-2">
              <li>
                <a 
                  href="https://your-site.com/schemegenie_extension.zip" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors text-sm flex items-center space-x-2"
                >
                  <Download className="h-4 w-4" />
                  <span>Download Extension</span>
                </a>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-400 hover:text-white transition-colors text-sm flex items-center space-x-2">
                  <Shield className="h-4 w-4" />
                  <span>Privacy Policy</span>
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-400 hover:text-white transition-colors text-sm flex items-center space-x-2">
                  <FileText className="h-4 w-4" />
                  <span>Terms of Use</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="text-gray-400 text-sm flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>support@schemegenie.com</span>
              </li>
              <li className="text-gray-400 text-sm flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="text-gray-400 text-sm flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>Global Support</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 SchemeGenie. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="/privacy" className="text-gray-400 hover:text-white transition-colors text-sm">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-gray-400 hover:text-white transition-colors text-sm">
                Terms of Use
              </Link>
              <a 
                href="https://your-site.com/schemegenie_extension.zip" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors text-sm"
              >
                Download Extension
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};