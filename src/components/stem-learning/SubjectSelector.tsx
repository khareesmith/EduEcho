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
  const subjects = ['math', 'physics', 'chemistry', 'biology'];
  const topics = {
    math: ['algebra', 'geometry', 'calculus'],
    physics: ['mechanics', 'thermodynamics', 'electricity'],
    chemistry: ['organic', 'inorganic', 'physical'],
    biology: ['genetics', 'ecology', 'anatomy']
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {subjects.map((s) => (
          <Button
            key={s}
            onClick={() => onSubjectChange(s)}
            variant={subject === s ? 'primary' : 'default'}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </Button>
        ))}
      </div>
      <div className="flex gap-2">
        {topics[subject as keyof typeof topics]?.map((t) => (
          <Button
            key={t}
            onClick={() => onTopicChange(t)}
            variant={topic === t ? 'secondary' : 'default'}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </Button>
        ))}
      </div>
    </div>
  );
};