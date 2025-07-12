import React from 'react';
import { motion } from 'framer-motion';
import { FileText, AlertTriangle, Users, Gavel } from 'lucide-react';
import { Card, CardContent, CardHeader } from '../components/ui/Card';

export const TermsOfUse: React.FC = () => {
  return (
    <div className="min-h-screen bg-cream-50 bg-grid-pattern bg-grid pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="w-16 h-16 mx-auto mb-4 bg-white rounded-full shadow-lg border-2 border-orange-200 flex items-center justify-center">
            <FileText className="w-8 h-8 text-orange-600" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Terms of Use
          </h1>
          <p className="text-xl text-gray-600">
            Terms and conditions for using SchemeGenie services
          </p>
        </motion.div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-3">
                <Users className="h-6 w-6 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900">Acceptance of Terms</h2>
              </div>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <p>
                By accessing and using SchemeGenie, you accept and agree to be bound by the terms and 
                provision of this agreement. If you do not agree to abide by the above, please do not 
                use this service.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center space-x-3">
                <Gavel className="h-6 w-6 text-green-600" />
                <h2 className="text-xl font-semibold text-gray-900">Use License</h2>
              </div>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <p>
                Permission is granted to temporarily use SchemeGenie for personal, non-commercial 
                transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
              </p>
              <ul>
                <li>Modify or copy the materials</li>
                <li>Use the materials for any commercial purpose or for any public display</li>
                <li>Attempt to reverse engineer any software contained on the website</li>
                <li>Remove any copyright or other proprietary notations from the materials</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center space-x-3">
                <AlertTriangle className="h-6 w-6 text-yellow-600" />
                <h2 className="text-xl font-semibold text-gray-900">Disclaimer</h2>
              </div>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <p>
                The materials on SchemeGenie are provided on an 'as is' basis. SchemeGenie makes no warranties, 
                expressed or implied, and hereby disclaims and negates all other warranties including without 
                limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, 
                or non-infringement of intellectual property or other violation of rights.
              </p>
              <p>
                <strong>Important:</strong> SchemeGenie is an assistance platform and does not guarantee approval 
                of any government benefit applications. Users are responsible for ensuring accuracy of information 
                and compliance with government requirements.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold text-gray-900">User Responsibilities</h2>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <p>As a user of SchemeGenie, you agree to:</p>
              <ul>
                <li>Provide accurate and truthful information</li>
                <li>Keep your account credentials secure</li>
                <li>Use the service only for legitimate purposes</li>
                <li>Comply with all applicable laws and regulations</li>
                <li>Not attempt to circumvent security measures</li>
                <li>Report any bugs or security vulnerabilities</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold text-gray-900">Service Availability</h2>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <p>
                SchemeGenie strives to maintain service availability but does not guarantee uninterrupted access. 
                We may temporarily suspend service for maintenance, updates, or due to circumstances beyond our control.
              </p>
              <p>
                Government scheme information is updated regularly but may not always reflect the most current status. 
                Users should verify information with official government sources.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold text-gray-900">Modifications</h2>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <p>
                SchemeGenie may revise these terms of service at any time without notice. By using this service, 
                you are agreeing to be bound by the then current version of these terms of service.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold text-gray-900">Contact Information</h2>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                If you have any questions about these Terms of Use, please contact us at:
              </p>
              <div className="mt-4 space-y-2">
                <p><strong>Email:</strong> legal@schemegenie.com</p>
                <p><strong>Address:</strong> SchemeGenie Legal Team, Global Support</p>
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