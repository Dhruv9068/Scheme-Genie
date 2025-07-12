import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Sparkles, Calendar, MapPin } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card, CardContent, CardHeader } from '../ui/Card';

export interface MatchedScheme {
  id: string;
  title: string;
  description: string;
  summary?: string;
  amount?: string;
  deadline: string;
  country: string;
  category: string;
  govApiSupport?: boolean;
  officialPortal?: string;
  website?: string;
  matchReason?: string;
  priority?: string;
}


interface MatchedSchemesProps {
  schemes: MatchedScheme[];
  onApplyScheme: (scheme: MatchedScheme) => void;
}

export const MatchedSchemes: React.FC<MatchedSchemesProps> = ({ schemes, onApplyScheme }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-orange-600 rounded-lg flex items-center justify-center">
          <Sparkles className="h-4 w-4 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Matched Schemes</h2>
        <span className="bg-orange-100 text-orange-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
          {schemes.length} matches
        </span>
      </div>

      {schemes.length === 0 ? (
        <Card className="card-hover-shine">
          <CardContent className="p-12 text-center">
            <Sparkles className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No schemes found</h3>
            <p className="text-gray-600 mb-4">
              Complete your profile to get personalized scheme recommendations.
            </p>
          </CardContent>
        </Card>
      ) : (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {schemes.map((scheme, index) => (
          <motion.div
            key={scheme.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card hover className="h-full card-hover-shine">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {scheme.title}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <div className="w-4 h-4 bg-white rounded-full border border-orange-200 flex items-center justify-center">
                          <MapPin className="h-2 w-2 text-orange-600" />
                        </div>
                        <span>{scheme.country}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className="w-4 h-4 bg-white rounded-full border border-orange-200 flex items-center justify-center">
                          <Calendar className="h-2 w-2 text-orange-600" />
                        </div>
                        <span>{scheme.deadline === 'Rolling basis' ? 'Rolling basis' : new Date(scheme.deadline).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-600">{scheme.amount || 'Varies'}</div>
                    <div className="text-xs text-gray-500">{scheme.category}</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                  {scheme.summary || scheme.description}
                </p>
                
                {scheme.matchReason && (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4">
                    <p className="text-xs text-orange-800 font-medium">Why you're eligible:</p>
                    <p className="text-sm text-orange-700">{scheme.matchReason}</p>
                  </div>
                )}
                
                <div className="flex items-center space-x-2 mb-4">
                  <div className={`w-2 h-2 rounded-full ${scheme.govApiSupport !== false ? 'bg-green-500' : 'bg-yellow-500'}`} />
                  <span className="text-xs text-gray-600">
                    {scheme.govApiSupport !== false ? 'AI application available' : 'Manual application required'}
                  </span>
                </div>

                <Button
                  onClick={() => onApplyScheme(scheme)}
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 rounded-xl"
                >
                  Apply with AI
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
      )}
    </div>
  );
};