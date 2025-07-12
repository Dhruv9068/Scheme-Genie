import React from 'react';
import { motion } from 'framer-motion';
import { Download, Chrome, Zap } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

export const ExtensionBanner: React.FC = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-orange-50 to-cream-100 grid-hover-effect">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg card-hover-shine">
                <Chrome className="h-8 w-8 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-xl flex items-center justify-center">
                <Zap className="h-3 w-3 text-white" />
              </div>
            </div>
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Speed Up Your Applications
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Now fill government forms automatically using our Chrome Extension
          </p>

          <div className="flex flex-col items-center space-y-4">
            <Button
              onClick={() => window.open('https://drive.google.com/file/d/1qLCgN9Rg37bj0SH63SfSYxw17bLzRQXQ/view', '_blank')}
              size="lg"
              className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 text-lg shadow-lg flex items-center space-x-3 rounded-xl"
            >
              <Download className="h-5 w-5" />
              <span>Download Extension (.zip)</span>
            </Button>
            <p className="text-sm text-gray-500 flex items-center space-x-2">
              <Chrome className="h-4 w-4" />
              <span>Coming soon to Chrome Web Store!</span>
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 bg-white/80 backdrop-blur-sm card-hover-shine">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Auto-Fill Forms</h3>
              <p className="text-sm text-gray-600">Automatically fills government forms with your saved profile data</p>
            </Card>

            <Card className="p-6 bg-white/80 backdrop-blur-sm card-hover-shine">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Chrome className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Browser Integration</h3>
              <p className="text-sm text-gray-600">Works seamlessly with any government website in your browser</p>
            </Card>

            <Card className="p-6 bg-white/80 backdrop-blur-sm card-hover-shine">
              <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Download className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">One-Click Install</h3>
              <p className="text-sm text-gray-600">Easy installation and setup in under 2 minutes</p>
            </Card>
          </div>
        </motion.div>
      </div>
    </section>
  );
};