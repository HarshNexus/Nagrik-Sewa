import React from 'react';
import { Shield, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VerifiedBadgeProps {
  variant?: 'small' | 'medium' | 'large';
  showText?: boolean;
  className?: string;
  isVerified?: boolean;
}

export default function VerifiedBadge({ 
  variant = 'medium', 
  showText = false, 
  className,
  isVerified = true 
}: VerifiedBadgeProps) {
  if (!isVerified) return null;

  const sizes = {
    small: {
      container: 'h-4 w-4',
      icon: 'w-3 h-3',
      text: 'text-xs'
    },
    medium: {
      container: 'h-5 w-5',
      icon: 'w-4 h-4',
      text: 'text-sm'
    },
    large: {
      container: 'h-6 w-6',
      icon: 'w-5 h-5',
      text: 'text-base'
    }
  };

  const size = sizes[variant];

  return (
    <div className={cn('inline-flex items-center gap-1', className)}>
      <div className={cn(
        'rounded-full bg-blue-500 flex items-center justify-center',
        size.container
      )}>
        <CheckCircle className={cn('text-white', size.icon)} />
      </div>
      {showText && (
        <span className={cn('text-blue-600 font-medium', size.text)}>
          Verified
        </span>
      )}
    </div>
  );
}

// Government verification badge variant
export function GovVerifiedBadge({ 
  variant = 'medium', 
  showText = true, 
  className,
  isVerified = true 
}: VerifiedBadgeProps) {
  if (!isVerified) return null;

  const sizes = {
    small: {
      container: 'h-4 w-4',
      icon: 'w-3 h-3',
      text: 'text-xs'
    },
    medium: {
      container: 'h-5 w-5',
      icon: 'w-4 h-4',
      text: 'text-sm'
    },
    large: {
      container: 'h-6 w-6',
      icon: 'w-5 h-5',
      text: 'text-base'
    }
  };

  const size = sizes[variant];

  return (
    <div className={cn('inline-flex items-center gap-1.5', className)}>
      <div className={cn(
        'rounded-full bg-gradient-to-r from-blue-600 to-blue-700 flex items-center justify-center shadow-sm',
        size.container
      )}>
        <Shield className={cn('text-white', size.icon)} />
      </div>
      {showText && (
        <span className={cn('text-blue-700 font-semibold', size.text)}>
          Gov. Verified
        </span>
      )}
    </div>
  );
}

// Tooltip wrapper for verification details
export function VerifiedBadgeWithTooltip({ 
  variant = 'medium',
  className,
  isVerified = true,
  verificationDate,
  verificationType = 'DigiLocker'
}: VerifiedBadgeProps & {
  verificationDate?: string;
  verificationType?: string;
}) {
  if (!isVerified) return null;

  return (
    <div className={cn('group relative inline-flex', className)}>
      <GovVerifiedBadge variant={variant} isVerified={isVerified} />
      
      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
        <div className="bg-gray-900 text-white text-xs rounded-lg py-2 px-3 whitespace-nowrap">
          <div className="font-semibold">Government Verified</div>
          <div className="text-gray-300">Via {verificationType}</div>
          {verificationDate && (
            <div className="text-gray-400">
              Verified: {new Date(verificationDate).toLocaleDateString()}
            </div>
          )}
          {/* Arrow */}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
        </div>
      </div>
    </div>
  );
}