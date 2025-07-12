import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3,
  Sparkles,
  FileText,
  Bell,
  TrendingUp
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { MatchedSchemes, MatchedScheme } from '../components/dashboard/MatchedSchemes';
import { MyApplications } from '../components/dashboard/MyApplications';
import { ApplicationModal } from '../components/dashboard/ApplicationModal';
import { firebaseService } from '../services/firebase';

export const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [eligibleSchemes, setEligibleSchemes] = useState<MatchedScheme[]>([]);
  const [userApplications, setUserApplications] = useState<any[]>([]);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [selectedScheme, setSelectedScheme] = useState<MatchedScheme | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load eligible schemes and user applications in parallel
      const [schemes, applications] = await Promise.all([
        firebaseService.getEligibleSchemes('demo-user'),
        firebaseService.getUserApplications('demo-user')
      ]);
      
      setEligibleSchemes(schemes.map(scheme => ({
        ...scheme,
        govApiSupport: Math.random() > 0.5, // Randomly assign for demo
        officialPortal: scheme.website
      })));
      
      setUserApplications(applications);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyScheme = (scheme: MatchedScheme) => {
    setSelectedScheme(scheme);
    setShowApplicationModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-50 bg-grid-pattern bg-grid pt-20 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading dashboard..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-50 bg-grid-pattern bg-grid grid-hover-effect pt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-white rounded-2xl shadow-lg border-2 border-orange-200 flex items-center justify-center">
              <img src="/Logo.png" alt="SchemeGenie" className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
                Welcome to Your Dashboard!
              </h1>
              <p className="text-xl text-gray-600">
                Here are your personalized scheme matches and application status
              </p>
            </div>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-orange-50 to-orange-100 card-hover-shine">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-orange-500 text-white rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Sparkles className="h-6 w-6" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{eligibleSchemes.length}</div>
              <div className="text-sm text-gray-600">Matched Schemes</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-blue-50 to-blue-100 card-hover-shine">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-blue-500 text-white rounded-2xl flex items-center justify-center mx-auto mb-3">
                <FileText className="h-6 w-6" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{userApplications.length}</div>
              <div className="text-sm text-gray-600">Applications</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-green-50 to-green-100 card-hover-shine">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-green-500 text-white rounded-2xl flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="h-6 w-6" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{userApplications.filter(app => app.status === 'approved').length > 0 ? '100%' : '0%'}</div>
              <div className="text-sm text-gray-600">Success Rate</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-purple-50 to-purple-100 card-hover-shine">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-purple-500 text-white rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Bell className="h-6 w-6" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{userApplications.filter(app => app.status === 'pending').length}</div>
              <div className="text-sm text-gray-600">Pending Deadlines</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          {/* Matched Schemes */}
          <MatchedSchemes 
            schemes={eligibleSchemes} 
            onApplyScheme={handleApplyScheme} 
          />
          
          {/* My Applications */}
          <MyApplications 
            applications={userApplications} 
            onApplicationUpdate={loadDashboardData}
          />
        </div>

        {/* Application Modal */}
        <ApplicationModal
          isOpen={showApplicationModal}
          onClose={() => setShowApplicationModal(false)}
          scheme={selectedScheme}
        />
      </div>
    </div>
  );
};