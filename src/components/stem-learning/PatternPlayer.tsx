import React, { useEffect } from 'react';
import { Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { STEMPattern } from '@/types/stem-learning';
import { PatternPlayer as AudioPatternPlayer } from '@/lib/audio/patternPlayer';

interface PatternPlayerProps {
  pattern: STEMPattern;
  isPlaying: boolean;
  onTogglePlay: () => void;
}

export const PatternPlayer: React.FC<PatternPlayerProps> = ({
  pattern,
  isPlaying,
  onTogglePlay,
}) => {
  const audioPlayer = React.useMemo(() => new AudioPatternPlayer(), []);

  useEffect(() => {
    if (isPlaying) {
      audioPlayer.playPattern(pattern);
    } else {
      audioPlayer.stop();
    }

    return () => {
      audioPlayer.stop();
    };
  }, [isPlaying, pattern, audioPlayer]);

  return (
    <div className="p-4 bg-gray-50 rounded-md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium">Musical Pattern</h3>
        <Button
          onClick={onTogglePlay}
          variant={isPlaying ? 'primary' : 'default'}
        >
          {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {pattern.pattern.map((note, index) => (
          <div
            key={index}
            className={`px-3 py-1 rounded-full ${
              isPlaying ? 'bg-blue-100 text-blue-700' : 'bg-gray-200 text-gray-700'
            }`}
          >
            {note.lyrics}
          </div>
        ))}
      </div>
    </div>
  );
};