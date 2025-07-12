import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Clock, CheckCircle, XCircle, Eye, Shield } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { firebaseService } from '../../services/firebase';
import { emailService } from '../../services/emailjs';
import toast from 'react-hot-toast';

interface MyApplicationsProps {
  applications: any[];
  onApplicationUpdate?: () => void;
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'approved':
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    case 'rejected':
      return <XCircle className="h-4 w-4 text-red-600" />;
    case 'pending':
      return <Clock className="h-4 w-4 text-yellow-600" />;
    case 'under_review':
      return <Eye className="h-4 w-4 text-blue-600" />;
    default:
      return <FileText className="h-4 w-4 text-gray-600" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'approved':
      return 'bg-green-50 text-green-700 border-green-200';
    case 'rejected':
      return 'bg-red-50 text-red-700 border-red-200';
    case 'pending':
      return 'bg-yellow-50 text-yellow-700 border-yellow-200';
    case 'under_review':
      return 'bg-blue-50 text-blue-700 border-blue-200';
    default:
      return 'bg-gray-50 text-gray-700 border-gray-200';
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'approved':
      return 'Approved';
    case 'rejected':
      return 'Rejected';
    case 'pending':
      return 'Pending';
    case 'under_review':
      return 'Under Review';
    default:
      return 'Unknown';
  }
};

export const MyApplications: React.FC<MyApplicationsProps> = ({ 
  applications, 
  onApplicationUpdate 
}) => {
  const [showRecaptcha, setShowRecaptcha] = React.useState(false);
  const [pendingApproval, setPendingApproval] = React.useState<string | null>(null);
  const [recaptchaToken, setRecaptchaToken] = React.useState<string | null>(null);

  const handleApproveApplication = async (applicationId: string, application: any) => {
    // Show reCAPTCHA for verification
    setPendingApproval(applicationId);
    setShowRecaptcha(true);
  };

  const handleRecaptchaVerify = async (token: string) => {
    setRecaptchaToken(token);
    setShowRecaptcha(false);
    
    if (pendingApproval) {
      await processApproval(pendingApproval);
    }
  };

  const processApproval = async (applicationId: string) => {
    if (!recaptchaToken) return;
    
    try {
      const application = applications.find(app => app.id === applicationId);
      if (!application) return;

      // For demo purposes, just update local storage
      const storedApplications = JSON.parse(localStorage.getItem('demo_applications') || '[]');
      const updatedApplications = storedApplications.map((app: any) => 
        app.id === applicationId ? { ...app, status: 'approved', approvedAt: new Date() } : app
      );
      localStorage.setItem('demo_applications', JSON.stringify(updatedApplications));
      
      // Send demo email notification
      const emailSent = await emailService.sendReminderEmail(
        'demo@schemegenie.com',
        'Demo User',
        `${application.schemeTitle} - Application Approved`,
        'Your form has been approved and is ready for auto-fill',
        `Your application for "${application.schemeTitle}" has been approved and is now available in your Chrome Extension for one-click form filling on government websites.`
      );
      
      if (emailSent) {
        toast.success('✅ Application approved! Email confirmation sent.');
      } else {
        toast.success('✅ Application approved! (Email sending failed)');
      }
      
      onApplicationUpdate?.();
    } catch (error) {
      console.error('Failed to approve application:', error);
      toast.error('Failed to approve application');
    } finally {
      setPendingApproval(null);
      setRecaptchaToken(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
          <FileText className="h-4 w-4 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">My Applications</h2>
        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
          {applications.length} applications
        </span>
      </div>

      {applications.length === 0 ? (
        <Card className="card-hover-shine">
          <CardContent className="p-12 text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No applications yet</h3>
            <p className="text-gray-600 mb-4">
              Apply to schemes above to track your applications here.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card className="card-hover-shine">
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">Application Status</h3>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Scheme Name</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Submitted Date</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Amount</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((application, index) => (
                    <motion.tr
                      key={application.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="py-4 px-4">
                        <div className="font-medium text-gray-900">{application.schemeTitle || application.title}</div>
                      </td>
                      <td className="py-4 px-4">
                        <div className={`inline-flex items-center space-x-2 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(application.status)}`}>
                          {getStatusIcon(application.status)}
                          <span>{getStatusText(application.status)}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-gray-600">
                        {new Date(application.createdAt?.toDate?.() || application.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-medium text-green-600">{application.amount || 'Varies'}</span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center space-x-1 rounded-xl"
                          >
                            <div className="w-3 h-3 bg-white rounded-full border border-orange-200 flex items-center justify-center">
                              <Eye className="h-2 w-2 text-orange-600" />
                            </div>
                            <span>View</span>
                          </Button>
                          {application.status === 'draft' && (
                            <Button
                              onClick={() => handleApproveApplication(application.id, application)}
                              size="sm"
                              className="bg-green-600 hover:bg-green-700 text-white rounded-xl flex items-center space-x-1"
                            >
                              <Shield className="h-3 w-3" />
                              Approve
                            </Button>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* reCAPTCHA Modal */}
      {showRecaptcha && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl p-6 max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Verify to Approve</h3>
            <p className="text-gray-600 mb-6">
              Please verify that you want to approve this application for auto-fill.
            </p>
            <div className="flex space-x-3">
              <Button
                onClick={() => handleRecaptchaVerify('verified-token-' + Date.now())}
                className="bg-green-600 hover:bg-green-700 text-white rounded-xl flex-1"
              >
                <Shield className="h-4 w-4 mr-2" />
                Verify & Approve
              </Button>
              <Button
                onClick={() => {
                  setShowRecaptcha(false);
                  setPendingApproval(null);
                }}
                variant="outline"
                className="rounded-xl flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};