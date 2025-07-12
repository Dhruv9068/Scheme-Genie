import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  ExternalLink, 
  FileText, 
  CheckCircle, 
  AlertCircle,
  Download,
  Bot
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { geminiService } from '../services/gemini';
import { firebaseService } from '../services/firebase';
import { SCHEME_CATEGORIES } from '../utils/languages';
import toast from 'react-hot-toast';

export const SchemeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [scheme, setScheme] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    if (id) {
      loadSchemeDetails(id);
    }
  }, [id]);

  const loadSchemeDetails = async (schemeId: string) => {
    try {
      setLoading(true);
      // Try Firebase service first (which includes real Indian schemes)
      let details = await firebaseService.getSchemeById(schemeId);
      
      // If not found, try Gemini
      if (!details) {
        details = await geminiService.getSchemeDetails(schemeId);
      }
      
      setScheme(details);
    } catch (error) {
      console.error('Failed to load scheme details:', error);
      toast.error('Failed to load scheme details');
    } finally {
      setLoading(false);
    }
  };

  const handleApplyWithAI = async () => {
    if (!scheme) return;
    
    try {
      setApplying(true);
      
      // Navigate to AI Assistant with scheme context
      navigate(`/assistant?scheme=${scheme.id}`);
      toast.success('Opening AI Assistant to help with your application!');
    } catch (error) {
      console.error('Failed to apply with AI:', error);
      toast.error('Failed to process application');
    } finally {
      setApplying(false);
    }
  };

  const handleOpenOfficialSite = () => {
    if (scheme?.website) {
      window.open(scheme.website, '_blank');
      toast.success('💡 Use our Chrome Extension to auto-fill forms on the government portal!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-50 bg-grid-pattern bg-grid pt-20 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading scheme details..." />
      </div>
    );
  }

  if (!scheme) {
    return (
      <div className="min-h-screen bg-cream-50 bg-grid-pattern bg-grid pt-20 flex items-center justify-center">
        <Card className="max-w-md mx-4">
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-4">Scheme Not Found</h2>
            <p className="text-gray-600 mb-6">The scheme you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => navigate('/schemes')} className="rounded-xl">
              Browse All Schemes
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const category = SCHEME_CATEGORIES[scheme.category] || { icon: '📄', color: 'bg-gray-500' };

  return (
    <div className="min-h-screen bg-cream-50 bg-grid-pattern bg-grid grid-hover-effect pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Button
          onClick={() => navigate(-1)}
          variant="outline"
          className="mb-6 rounded-xl"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card className="card-hover-shine">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`w-16 h-16 rounded-2xl ${category.color} flex items-center justify-center text-white text-2xl`}>
                    {category.icon}
                  </div>
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                      {scheme.title}
                    </h1>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-4 w-4" />
                        <span>{scheme.country}</span>
                      </div>
                      {scheme.deadline && (
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{scheme.deadline === 'Rolling basis' ? 'Rolling basis' : new Date(scheme.deadline).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600">{scheme.amount}</div>
                  <div className="text-sm text-gray-500">{scheme.category}</div>
                </div>
              </div>
            </CardHeader>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <Card className="card-hover-shine">
              <CardHeader>
                <h2 className="text-xl font-semibold text-gray-900">Description</h2>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  {scheme.detailedDescription || scheme.description}
                </p>
              </CardContent>
            </Card>

            {/* Eligibility */}
            <Card className="card-hover-shine">
              <CardHeader>
                <h2 className="text-xl font-semibold text-gray-900">Eligibility Criteria</h2>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {scheme.eligibility.map((criteria: string, index: number) => (
                    <li key={index} className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{criteria}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Benefits */}
            <Card className="card-hover-shine">
              <CardHeader>
                <h2 className="text-xl font-semibold text-gray-900">Benefits</h2>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {scheme.benefits.map((benefit: string, index: number) => (
                    <li key={index} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-gray-700">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Application Process */}
            {scheme.applicationSteps && (
              <Card className="card-hover-shine">
                <CardHeader>
                  <h2 className="text-xl font-semibold text-gray-900">Application Process</h2>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-3">
                    {scheme.applicationSteps.map((step: string, index: number) => (
                      <li key={index} className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                          {index + 1}
                        </div>
                        <span className="text-gray-700">{step}</span>
                      </li>
                    ))}
                  </ol>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="card-hover-shine">
              <CardHeader>
                <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  onClick={handleApplyWithAI}
                  loading={applying}
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 rounded-xl"
                >
                  <Bot className="h-4 w-4 mr-2" />
                  Apply with AI Assistant
                </Button>
                
                <Button
                  onClick={handleOpenOfficialSite}
                  variant="outline"
                  className="w-full rounded-xl"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Official Website
                </Button>
                
                <Button
                  onClick={() => window.open('https://your-site.com/schemegenie_extension.zip', '_blank')}
                  variant="outline"
                  className="w-full border-blue-300 text-blue-600 hover:bg-blue-50 rounded-xl"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Extension
                </Button>
              </CardContent>
            </Card>

            {/* Required Documents */}
            <Card className="card-hover-shine">
              <CardHeader>
                <h3 className="text-lg font-semibold text-gray-900">Required Documents</h3>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {scheme.documents.map((doc: string, index: number) => (
                    <li key={index} className="flex items-center space-x-3">
                      <FileText className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-700">{doc}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Tips */}
            {scheme.tips && (
              <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 card-hover-shine">
                <CardHeader>
                  <h3 className="text-lg font-semibold text-gray-900">💡 Application Tips</h3>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {scheme.tips.map((tip: string, index: number) => (
                      <li key={index} className="text-sm text-gray-700">
                        • {tip}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Extension Reminder */}
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 card-hover-shine">
              <CardContent className="p-4">
                <h4 className="font-semibold text-gray-900 mb-2">🚀 Pro Tip</h4>
                <p className="text-sm text-gray-700 mb-3">
                  Download our Chrome Extension to automatically fill government forms with your saved data!
                </p>
                <p className="text-xs text-gray-600">
                  <strong>Steps:</strong> Download file → Unzip it → Upload to your extension
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};