import React from 'react';
import { Button } from '@/components/ui/button';

interface ExamplesListProps {
  examples: string[];
  selectedExample: string | null;
  onSelectExample: (example: string) => void;
}

export const ExamplesList: React.FC<ExamplesListProps> = ({
  examples,
  selectedExample,
  onSelectExample
}) => {
  return (
    <div className="space-y-4">
      <h3 className="font-medium">Practice Examples</h3>
      <div className="grid grid-cols-2 gap-2">
        {examples.map((example) => (
          <Button
            key={example}
            onClick={() => onSelectExample(example)}
            variant={selectedExample === example ? 'primary' : 'default'}
            className="text-left"
          >
            {example}
          </Button>
        ))}
      </div>
    </div>
  );
};