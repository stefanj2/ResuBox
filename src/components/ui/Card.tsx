'use client';

import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
}

export function Card({ children, className = '', padding = 'md', hover = false }: CardProps) {
  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div
      className={`
        bg-white rounded-xl border border-slate-200 shadow-sm
        ${paddings[padding]}
        ${hover ? 'hover:shadow-md hover:border-slate-300 transition-all duration-200' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
