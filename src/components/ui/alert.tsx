import React from 'react';

interface AlertProps {
  children: React.ReactNode;
  variant?: 'default' | 'error' | 'success';
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({
  children,
  variant = 'default',
  className = ''
}) => {
  const variantStyles = {
    default: 'bg-gray-100 border-gray-200',
    error: 'bg-red-50 border-red-200',
    success: 'bg-green-50 border-green-200'
  };

  return (
    <div className={`p-4 rounded-lg border ${variantStyles[variant]} ${className}`}>
      {children}
    </div>
  );
};

export const AlertDescription: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div className="text-sm mt-1">{children}</div>;
};