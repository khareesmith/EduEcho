import React from 'react';
import { Mic, MicOff } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VoiceInputProps {
  isListening: boolean;
  onToggleVoice: () => void;
  transcript: string;
}

export const VoiceInput: React.FC<VoiceInputProps> = ({
  isListening,
  onToggleVoice,
  transcript
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Voice Input</h3>
        <Button
          onClick={onToggleVoice}
          variant={isListening ? 'primary' : 'default'}
          className="relative"
        >
          {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          {isListening && (
            <span className="absolute -top-1 -right-1">
              <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
            </span>
          )}
        </Button>
      </div>
      
      {transcript && (
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-gray-700">{transcript}</p>
        </div>
      )}

      {isListening && (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <div className="animate-pulse h-2 w-2 rounded-full bg-red-500" />
          Listening...
        </div>
      )}
    </div>
  );
};