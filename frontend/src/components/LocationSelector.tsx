import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLocation } from '@/contexts/LocationContext';
import { MapPin } from 'lucide-react';
import { indianStates } from '@/data/indianLocations';

interface LocationSelectorProps {
  className?: string;
  variant?: 'default' | 'compact';
  showDistrict?: boolean;
}

export const LocationSelector: React.FC<LocationSelectorProps> = ({ 
  className = '', 
  variant = 'default',
  showDistrict = true 
}) => {
  const { selectedState, selectedDistrict, setSelectedState, setSelectedDistrict } = useLocation();

  const handleStateChange = (stateCode: string) => {
    setSelectedState(stateCode);
    setSelectedDistrict(''); // Reset district when state changes
  };

  const selectedStateData = indianStates.find(state => state.code === selectedState);
  const districts = selectedStateData?.districts || [];

  return (
    <div className={`flex ${variant === 'compact' ? 'flex-row gap-2' : 'flex-col gap-3'} ${className}`}>
      {/* State Selector */}
      <div className="flex items-center gap-2">
        {variant === 'default' && (
          <MapPin className="h-4 w-4 text-gray-500" />
        )}
        <Select value={selectedState} onValueChange={handleStateChange}>
          <SelectTrigger className={variant === 'compact' ? 'w-[140px]' : 'w-[200px]'}>
            <SelectValue placeholder="Select Location">
              <span className="flex items-center gap-2">
                {variant === 'compact' && <MapPin className="h-3 w-3" />}
                <span>
                  {selectedStateData?.name || 'Select Location'}
                </span>
              </span>
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {/* States Section */}
            <div className="px-2 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wide">
              States
            </div>
            {indianStates.filter(state => !state.type || state.type === 'state').map((state) => (
              <SelectItem key={state.code} value={state.code}>
                <div className="flex flex-col">
                  <span className="font-medium">{state.name}</span>
                  <span className="text-xs text-gray-500">
                    {state.districts.length} districts
                  </span>
                </div>
              </SelectItem>
            ))}
            
            {/* Union Territories Section */}
            <div className="px-2 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wide border-t mt-1 pt-2">
              Union Territories
            </div>
            {indianStates.filter(state => state.type === 'ut').map((state) => (
              <SelectItem key={state.code} value={state.code}>
                <div className="flex flex-col">
                  <span className="font-medium">{state.name}</span>
                  <span className="text-xs text-gray-500">
                    {state.districts.length} areas
                  </span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* District Selector */}
      {showDistrict && selectedState && (
        <div className="flex items-center gap-2">
          <div className={variant === 'default' ? 'w-6' : 'w-0'} /> {/* Spacer for alignment */}
          <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
            <SelectTrigger className={variant === 'compact' ? 'w-[140px]' : 'w-[200px]'}>
              <SelectValue placeholder="Select District">
                {selectedDistrict || 'Select District'}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {districts.map((district) => (
                <SelectItem key={district} value={district}>
                  {district}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Selected Location Display */}
      {selectedState && selectedDistrict && variant === 'default' && (
        <div className="text-xs text-gray-600 bg-gray-50 rounded-md p-2">
          📍 {selectedDistrict}, {selectedStateData?.name}
        </div>
      )}
    </div>
  );
};
