import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface PhoneInputProps {
  id?: string;
  name?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  label?: string;
  showHint?: boolean;
  className?: string;
}

export const PhoneInput: React.FC<PhoneInputProps> = ({
  id = 'phone',
  name = 'phone',
  value,
  onChange,
  placeholder = '+91 9876543210',
  required = false,
  disabled = false,
  label = 'Phone Number',
  showHint = true,
  className = '',
}) => {
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let phoneValue = e.target.value;
    
    // Always ensure phone starts with +91
    if (!phoneValue.startsWith('+91')) {
      // Remove any existing country code and add +91
      phoneValue = '+91 ' + phoneValue.replace(/^(\+\d{1,3}\s*)/, '').replace(/^\d{0,2}\s*/, '');
    }
    
    // Clean the number part (after +91) - keep only digits
    phoneValue = phoneValue.replace(/^(\+91\s*)(.*)$/, (match, prefix, number) => {
      return prefix + number.replace(/[^\d]/g, '');
    });
    
    // Limit to exactly 10 digits after +91
    const maxLength = 14; // +91 + space + 10 digits
    if (phoneValue.length > maxLength) {
      phoneValue = phoneValue.substring(0, maxLength);
    }
    
    onChange(phoneValue);
  };

  return (
    <div className="space-y-2">
      {label && (
        <Label htmlFor={id}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}
      <Input
        id={id}
        name={name}
        type="tel"
        value={value}
        onChange={handlePhoneChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={`font-mono ${className}`}
      />
      {showHint && (
        <p className="text-xs text-gray-500">
          Indian mobile number (+91 format)
        </p>
      )}
    </div>
  );
};

// Hook for phone number validation
export const usePhoneValidation = () => {
  const validatePhoneNumber = (phone: string): { isValid: boolean; error?: string } => {
    // Remove +91 prefix for validation
    const cleanPhone = phone.replace(/^\+91\s*/, '');
    
    if (!cleanPhone) {
      return { isValid: false, error: 'Phone number is required' };
    }
    
    if (cleanPhone.length !== 10) {
      return { isValid: false, error: 'Phone number must be 10 digits' };
    }
    
    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      return { isValid: false, error: 'Please enter a valid Indian mobile number' };
    }
    
    return { isValid: true };
  };

  const formatPhoneNumber = (phone: string): string => {
    const cleanPhone = phone.replace(/^\+91\s*/, '');
    if (cleanPhone.length === 10) {
      return `+91 ${cleanPhone}`;
    }
    return phone;
  };

  return { validatePhoneNumber, formatPhoneNumber };
};