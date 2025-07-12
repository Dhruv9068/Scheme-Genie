import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, Database } from 'lucide-react';
import { Card, CardContent, CardHeader } from '../components/ui/Card';

export const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-cream-50 bg-grid-pattern bg-grid pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="w-16 h-16 mx-auto mb-4 bg-white rounded-full shadow-lg border-2 border-orange-200 flex items-center justify-center">
            <Shield className="w-8 h-8 text-orange-600" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Privacy Policy
          </h1>
          <p className="text-xl text-gray-600">
            How we protect and handle your personal information
          </p>
        </motion.div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-3">
                <Lock className="h-6 w-6 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900">Data Collection</h2>
              </div>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <p>
                SchemeGenie collects information you provide directly to us, such as when you create an account, 
                use our AI assistant, or apply for benefit schemes. This includes:
              </p>
              <ul>
                <li>Personal information (name, email, phone number)</li>
                <li>Profile information (age, income, education, employment status)</li>
                <li>Application data and documents</li>
                <li>Communication preferences and language settings</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center space-x-3">
                <Eye className="h-6 w-6 text-green-600" />
                <h2 className="text-xl font-semibold text-gray-900">How We Use Your Information</h2>
              </div>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <p>We use the information we collect to:</p>
              <ul>
                <li>Provide personalized scheme recommendations</li>
                <li>Automatically fill government application forms</li>
                <li>Send reminders and notifications about deadlines</li>
                <li>Improve our AI assistant and services</li>
                <li>Comply with legal obligations</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center space-x-3">
                <Database className="h-6 w-6 text-purple-600" />
                <h2 className="text-xl font-semibold text-gray-900">Data Security</h2>
              </div>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <p>
                We implement appropriate technical and organizational measures to protect your personal information:
              </p>
              <ul>
                <li>End-to-end encryption for sensitive data</li>
                <li>Secure cloud storage with Firebase</li>
                <li>Regular security audits and updates</li>
                <li>Limited access to personal information</li>
                <li>Compliance with international data protection standards</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold text-gray-900">Your Rights</h2>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <p>You have the right to:</p>
              <ul>
                <li>Access your personal information</li>
                <li>Correct inaccurate data</li>
                <li>Delete your account and data</li>
                <li>Export your data</li>
                <li>Opt-out of communications</li>
              </ul>
              <p>
                To exercise these rights, contact us at <strong>privacy@schemegenie.com</strong>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold text-gray-900">Contact Us</h2>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                If you have any questions about this Privacy Policy, please contact us at:
              </p>
              <div className="mt-4 space-y-2">
                <p><strong>Email:</strong> privacy@schemegenie.com</p>
                <p><strong>Address:</strong> SchemeGenie Privacy Team, Global Support</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Last updated: January 2024</p>
        </div>
      </div>
    </div>
  );
};