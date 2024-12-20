import { useState } from "react";
import { Mic, MicOff } from "lucide-react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { GroundingFiles } from "@/components/ui/grounding-files";
import GroundingFileView from "@/components/ui/grounding-file-view";
import StatusMessage from "@/components/ui/status-message";

import useRealTime from "@/hooks/useRealtime";
import useAudioRecorder from "@/hooks/useAudioRecorder";
import useAudioPlayer from "@/hooks/useAudioPlayer";

import { GroundingFile, ToolResult, TranscriptMessage, TextDeltaMessage } from "./types";

import logo from "./assets/logo.svg";

function App() {
    const [isRecording, setIsRecording] = useState(false);
    const [groundingFiles, setGroundingFiles] = useState<GroundingFile[]>([]);
    const [selectedFile, setSelectedFile] = useState<GroundingFile | null>(null);
    const [currentTranscript, setCurrentTranscript] = useState<string>("");

    const { startSession, addUserAudio, inputAudioBufferClear } = useRealTime({
        onWebSocketOpen: () => console.log("WebSocket connection opened"),
        onWebSocketClose: () => console.log("WebSocket connection closed"),
        onWebSocketError: event => console.error("WebSocket error:", event),
        onReceivedError: message => console.error("error", message),
        onReceivedResponseAudioDelta: message => {
            isRecording && playAudio(message.delta);
        },
        onReceivedInputAudioBufferSpeechStarted: () => {
            stopAudioPlayer();
        },
        onReceivedExtensionMiddleTierToolResponse: message => {
            const result: ToolResult = JSON.parse(message.tool_result);

            const files: GroundingFile[] = result.sources.map(x => {
                return { id: x.chunk_id, name: x.title, content: x.chunk };
            });

            setGroundingFiles(prev => [...prev, ...files]);
        },
        onReceivedInputAudioBufferTranscript: (message: TranscriptMessage) => {
            setCurrentTranscript(message.transcript);
        },
        onReceivedResponseTextDelta: (message: TextDeltaMessage) => {
            setCurrentTranscript(prev => prev + message.delta);
        },
        onReceivedInputAudioBufferSpeechEnded: () => {
            setCurrentTranscript("");
        }
    });

    const { reset: resetAudioPlayer, play: playAudio, stop: stopAudioPlayer } = useAudioPlayer();
    const { start: startAudioRecording, stop: stopAudioRecording } = useAudioRecorder({ onAudioRecorded: addUserAudio });

    const onToggleListening = async () => {
        if (!isRecording) {
            startSession();
            await startAudioRecording();
            resetAudioPlayer();
            setSelectedFile(null);
            setIsRecording(true);
        } else {
            await stopAudioRecording();
            stopAudioPlayer();
            inputAudioBufferClear();
            setIsRecording(false);
        }
    };

    const { t } = useTranslation();

    return (
        <div className="relative min-h-screen overflow-hidden bg-[#ffeadb] text-gray-800">
            <div className="pointer-events-none fixed inset-0">
                <div className="bg-gradient-radial absolute inset-0 from-[#ff914d]/20 via-transparent to-transparent"></div>
                <div className="absolute inset-0">
                    <div className="animate-wave-slow h-[100vh] w-[100vw] bg-[linear-gradient(45deg,transparent_25%,rgba(255,145,77,0.1)_50%,transparent_75%,transparent_100%)] bg-[length:300%_300%] opacity-60"></div>
                </div>
                <div className="absolute inset-0">
                    <div className="animate-wave-fast h-[100vh] w-[100vw] bg-[linear-gradient(135deg,transparent_25%,rgba(213,29,53,0.1)_50%,transparent_75%,transparent_100%)] bg-[length:300%_300%] opacity-60"></div>
                </div>
            </div>

            <div className="relative flex min-h-screen flex-col">
                <header className="w-full px-6 pt-6">
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-gradient-to-r from-[#ff914d] to-[#d51d35] bg-clip-text text-3xl font-bold text-transparent md:text-4xl"
                            style={{ fontFamily: "More Sugar, sans-serif" }}
                        >
                            {t("app.title")}
                        </motion.h1>
                    </motion.div>
                </header>

                <main className="flex flex-grow flex-col items-center justify-center gap-2 px-4 py-6">
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="mb-2">
                        <img
                            src={logo}
                            alt="Edu Echo logo"
                            className="h-40 w-40 drop-shadow-lg sm:h-48 sm:w-48 md:h-64 md:w-64 lg:h-72 lg:w-72 xl:h-80 xl:w-80"
                        />
                    </motion.div>

                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center">
                        <div className="relative">
                            <Button
                                onClick={onToggleListening}
                                className={`group relative h-16 w-16 rounded-full transition-all duration-300 ${
                                    isRecording ? "bg-red-600 hover:bg-red-700" : "bg-gradient-to-r from-[#d51d35] to-[#ff914d] hover:scale-110"
                                }`}
                                aria-label={isRecording ? t("app.stopRecording") : t("app.startRecording")}
                            >
                                {isRecording ? <MicOff className="h-6 w-6 text-white" /> : <Mic className="h-6 w-6 text-white" />}
                                <span className="absolute -bottom-6 left-1/2 z-50 -translate-x-1/2 transform whitespace-nowrap text-sm font-medium text-gray-800/90 opacity-0 transition-opacity group-hover:opacity-100">
                                    {isRecording ? t("app.stopConversation") : t("app.startRecording")}
                                </span>
                            </Button>
                        </div>

                        <div className="mt-12">
                            <StatusMessage isRecording={isRecording} transcript={currentTranscript} />
                        </div>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="w-full max-w-4xl">
                        <GroundingFiles files={groundingFiles} onSelected={setSelectedFile} isLoading={false} />
                    </motion.div>
                </main>

                <footer className="relative py-6 text-center">
                    <p className="text-sm font-medium text-gray-600">{t("app.footer")}</p>
                </footer>

                <GroundingFileView groundingFile={selectedFile} onClosed={() => setSelectedFile(null)} />
            </div>
        </div>
    );
}

export default App;
