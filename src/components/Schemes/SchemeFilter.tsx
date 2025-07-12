import React from 'react';
import { Search, Filter } from 'lucide-react';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { COUNTRIES, SCHEME_CATEGORIES } from '../../utils/languages';
import { useLanguage } from '../../context/LanguageContext';

interface SchemeFilterProps {
  searchTerm: string;
  selectedCountry: string;
  selectedCategory: string;
  onSearchChange: (value: string) => void;
  onCountryChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onClearFilters: () => void;
}

export const SchemeFilter: React.FC<SchemeFilterProps> = ({
  searchTerm,
  selectedCountry,
  selectedCategory,
  onSearchChange,
  onCountryChange,
  onCategoryChange,
  onClearFilters,
}) => {
  const { t } = useLanguage();

  const countryOptions = [
    { value: '', label: 'All Countries' },
    ...Object.entries(COUNTRIES).map(([code, name]) => ({
      value: code,
      label: name,
    })),
  ];

  const categoryOptions = [
    { value: '', label: 'All Categories' },
    ...Object.entries(SCHEME_CATEGORIES).map(([key, category]) => ({
      value: key,
      label: key.charAt(0).toUpperCase() + key.slice(1),
    })),
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6 card-hover-shine">
      <div className="flex items-center space-x-2 mb-4">
        <div className="w-5 h-5 bg-white rounded-full border border-orange-200 flex items-center justify-center">
          <Filter className="h-3 w-3 text-orange-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">Filter Schemes</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-2">
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-white rounded-full border border-orange-200 flex items-center justify-center">
              <Search className="h-3 w-3 text-orange-600" />
            </div>
            <Input
              placeholder="Search schemes..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-12"
            />
          </div>
        </div>

        <Select
          label="Filter by Country"
          value={selectedCountry}
          onChange={(e) => onCountryChange(e.target.value)}
          options={countryOptions}
        />

        <Select
          label="Filter by Category"
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          options={categoryOptions}
        />
      </div>

      {(searchTerm || selectedCountry || selectedCategory) && (
        <div className="mt-4 flex justify-end">
          <Button
            onClick={onClearFilters}
            variant="outline"
            size="sm"
            className="rounded-xl"
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
};