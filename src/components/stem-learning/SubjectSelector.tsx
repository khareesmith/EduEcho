import React from 'react';
import { Button } from '@/components/ui/button';

interface SubjectSelectorProps {
  subject: string;
  topic: string;
  onSubjectChange: (subject: string) => void;
  onTopicChange: (topic: string) => void;
}

export const SubjectSelector: React.FC<SubjectSelectorProps> = ({
  subject,
  topic,
  onSubjectChange,
  onTopicChange
}) => {
  const subjects = {
    math: ['algebra', 'geometry', 'calculus'],
    physics: ['mechanics', 'electricity', 'thermodynamics'],
    chemistry: ['organic', 'inorganic', 'reactions'],
    biology: ['genetics', 'ecology', 'anatomy']
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {Object.keys(subjects).map((subj) => (
          <Button
            key={subj}
            onClick={() => onSubjectChange(subj)}
            variant={subject === subj ? 'primary' : 'default'}
          >
            {subj.charAt(0).toUpperCase() + subj.slice(1)}
          </Button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {subjects[subject as keyof typeof subjects]?.map((top) => (
          <Button
            key={top}
            onClick={() => onTopicChange(top)}
            variant={topic === top ? 'secondary' : 'default'}
          >
            {top.charAt(0).toUpperCase() + top.slice(1)}
          </Button>
        ))}
      </div>
    </div>
  );
};