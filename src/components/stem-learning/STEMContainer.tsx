import React, { useState, useEffect } from "react";
import { Music, Volume2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { SubjectSelector } from "./SubjectSelector";
import { VoiceInput } from "./VoiceInput";
import { ExamplesList } from "./ExamplesList";
import { ProgressTracker } from "./ProgressTracker";
import { VoiceRecognition } from "@/lib/audio/voiceRecognition";
import { AzureOpenAIService } from "@/lib/azure/openai";

export const STEMContainer: React.FC = () => {
  const [isListening, setIsListening] = useState(false);
  const [subject, setSubject] = useState("math");
  const [topic, setTopic] = useState("algebra");
  const [selectedExample, setSelectedExample] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState<string | null>(null);

  const voiceRecognition = React.useMemo(() => new VoiceRecognition(), []);
  const openAI = React.useMemo(() => new AzureOpenAIService(), []);

  useEffect(() => {
    return () => {
      voiceRecognition.stop();
    };
  }, [voiceRecognition]);

  const handleVoiceToggle = () => {
    if (isListening) {
      voiceRecognition.stop();
      setIsListening(false);
    } else {
      voiceRecognition.start((text) => {
        setTranscript(text);
        processVoiceInput(text);
      });
      setIsListening(true);
    }
  };

  const processVoiceInput = async (input: string) => {
    try {
      const response = await openAI.generateResponse(input);
      if (!response.explanation) {
        setError("No response received from AI");
        return;
      }
      setProgress((prev) => Math.min(100, prev + response.confidence * 20));
    } catch (err) {
      console.error("Error processing voice input:", err);
      setError(
        `Failed to process voice input: ${
          err instanceof Error ? err.message : "Unknown error"
        }`
      );
    }
  };

  const handleSubjectChange = (newSubject: string) => {
    setSubject(newSubject);
    setTopic("");
    setSelectedExample(null);
    setProgress(0);
  };

  const handleTopicChange = (newTopic: string) => {
    setTopic(newTopic);
    setSelectedExample(null);
    setProgress(0);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Music className="h-6 w-6 text-blue-500" />
            <h2 className="text-xl font-semibold">Echo Tutor AI</h2>
          </div>
          <Volume2 className="h-6 w-6 text-gray-500" />
        </div>

        <div className="space-y-6">
          <SubjectSelector
            subject={subject}
            topic={topic}
            onSubjectChange={handleSubjectChange}
            onTopicChange={handleTopicChange}
          />

          <VoiceInput
            isListening={isListening}
            onToggleVoice={handleVoiceToggle}
            transcript={transcript}
          />

          <ProgressTracker progress={progress} topic={topic} />

          <ExamplesList
            examples={[]}
            selectedExample={selectedExample}
            onSelectExample={setSelectedExample}
          />

          {error && (
            <Alert variant="error">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
};
