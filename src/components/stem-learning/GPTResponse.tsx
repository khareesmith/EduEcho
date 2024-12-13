import React from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { Alert } from '@/components/ui/alert';

interface GPTResponseProps {
  response: string;
  confidence: number;
  isLoading: boolean;
}

export const GPTResponse: React.FC<GPTResponseProps> = ({
  response,
  confidence,
  isLoading
}) => {
  if (isLoading) {
    return (
      <div className="p-4 bg-gray-50 rounded-lg animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    );
  }

  if (!response) {
    return null;
  }

  return (
    <div className="space-y-2">
      <div className={`p-4 rounded-lg ${confidence > 0.8 ? 'bg-green-50' : 'bg-yellow-50'}`}>
        <div className="flex gap-2 items-start">
          {confidence > 0.8 ? (
            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
          ) : (
            <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
          )}
          <div className="flex-1">{response}</div>
        </div>
      </div>
    </div>
  );
};

export default GPTResponse;