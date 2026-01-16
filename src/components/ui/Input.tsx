'use client';

import React, { forwardRef } from 'react';
import { LucideIcon } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: LucideIcon | React.ReactElement;
  success?: boolean;
  successMessage?: string;
}

// Check if icon is already a rendered React element
function isReactElement(icon: LucideIcon | React.ReactElement): icon is React.ReactElement {
  return React.isValidElement(icon);
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, icon, success, successMessage, className = '', ...props }, ref) => {
    const renderIcon = () => {
      if (!icon) return null;
      if (isReactElement(icon)) {
        return icon;
      }
      const IconComponent = icon as LucideIcon;
      return <IconComponent className="h-5 w-5 text-slate-400" />;
    };

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              {renderIcon()}
            </div>
          )}
          <input
            ref={ref}
            className={`
              block w-full rounded-lg border bg-white
              ${icon ? 'pl-10' : 'pl-4'} pr-4 py-3
              text-slate-900 placeholder-slate-400
              transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-offset-0
              ${error
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
                : success
                  ? 'border-emerald-300 focus:border-emerald-500 focus:ring-emerald-500/20'
                  : 'border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20 hover:border-slate-300'
              }
              disabled:bg-slate-50 disabled:text-slate-500
              ${className}
            `}
            {...props}
          />
        </div>
        {error && (
          <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </p>
        )}
        {success && successMessage && (
          <p className="mt-1.5 text-sm text-emerald-600 flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            {successMessage}
          </p>
        )}
        {hint && !error && !success && (
          <p className="mt-1.5 text-sm text-slate-500">{hint}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
