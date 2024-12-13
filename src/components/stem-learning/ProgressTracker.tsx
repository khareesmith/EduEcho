import React from 'react';
import { BrainCircuit } from 'lucide-react';

interface ProgressTrackerProps {
  progress: number;
  topic: string;
}

export const ProgressTracker: React.FC<ProgressTrackerProps> = ({
  progress,
  topic
}) => {
  return (
    <div className="p-4 bg-gray-50 rounded-md">
      <div className="flex items-center gap-2 mb-2">
        <BrainCircuit className="h-5 w-5 text-blue-500" />
        <h3 className="font-medium">Learning Progress: {topic}</h3>
      </div>
      <div className="relative w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="absolute left-0 top-0 h-full bg-blue-500 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="mt-2 text-sm text-gray-600">
        {progress}% Complete
      </div>
    </div>
  );
};