import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardFooter } from '../ui/Card';
import { Button } from '../ui/Button';
import { Scheme } from '../../utils/types';
import { SCHEME_CATEGORIES } from '../../utils/languages';
import { useLanguage } from '../../context/LanguageContext';

interface SchemeCardProps {
  scheme: Scheme;
  onApply: (scheme: Scheme) => void;
}

export const SchemeCard: React.FC<SchemeCardProps> = ({ scheme, onApply }) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const category = SCHEME_CATEGORIES[scheme.category] || { icon: '📄', color: 'bg-gray-500' };

  return (
    <Card hover className="h-full card-hover-shine">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-2xl ${category.color} flex items-center justify-center text-white text-lg`}>
              <span className="text-white">{category.icon}</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                {scheme.title}
              </h3>
              <div className="flex items-center space-x-2 mt-1">
                <div className="w-4 h-4 bg-white rounded-full border border-orange-200 flex items-center justify-center">
                  <MapPin className="h-2 w-2 text-orange-600" />
                </div>
                <span className="text-sm text-gray-600">{scheme.country}</span>
              </div>
            </div>
          </div>
          {scheme.deadline && (
            <div className="flex items-center space-x-1 text-sm text-orange-600 bg-orange-50 px-2 py-1 rounded">
              <div className="w-4 h-4 bg-white rounded-full border border-orange-200 flex items-center justify-center">
                <Calendar className="h-2 w-2 text-orange-600" />
              </div>
              <span>{scheme.deadline === 'Rolling basis' ? 'Rolling basis' : new Date(scheme.deadline).toLocaleDateString()}</span>
            </div>
          )}
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {scheme.description}
        </p>

        <div className="space-y-3">
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-2">Benefits</h4>
            <ul className="space-y-1 max-h-20 overflow-y-auto">
              {scheme.benefits.slice(0, 3).map((benefit, index) => (
                <li key={index} className="text-sm text-gray-600 flex items-start">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 mr-2 flex-shrink-0" />
                  {benefit}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-2">Key Requirements</h4>
            <div className="flex flex-wrap gap-1 max-h-16 overflow-y-auto">
              {scheme.eligibility.slice(0, 2).map((req, index) => (
                <span key={index} className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                  {req}
                </span>
              ))}
              {scheme.eligibility.length > 2 && (
                <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                  +{scheme.eligibility.length - 2} more
                </span>
              )}
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-0">
        <div className="flex space-x-2 w-full">
          <Button
            onClick={() => navigate(`/scheme/${scheme.id}`)}
            variant="outline"
            className="flex-1 rounded-xl"
          >
            View Details
          </Button>
          <Button
            onClick={() => onApply(scheme)}
            variant="primary"
            className="flex-1 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
          >
            Apply Now
          </Button>
          <Button
            onClick={() => window.open(scheme.website, '_blank')}
            variant="outline"
            size="md"
            className="px-3 rounded-xl"
          >
            <div className="w-4 h-4 bg-white rounded-full border border-orange-200 flex items-center justify-center">
              <ExternalLink className="h-3 w-3 text-orange-600" />
            </div>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};