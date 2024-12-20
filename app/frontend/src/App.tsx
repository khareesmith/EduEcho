import { useState } from "react";
import { Mic, MicOff } from "lucide-react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { GroundingFiles } from "@/components/ui/grounding-files";
import GroundingFileView from "@/components/ui/grounding-file-view";
import StatusMessage from "@/components/ui/status-message";
import { LanguageSelector } from "@/components/ui/language-selector";

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
                <div className="absolute inset-0 bg-gradient-radial from-[#ff914d]/20 via-transparent to-transparent"></div>
                <div className="absolute inset-0">
                    <div className="h-[100vh] w-[100vw] animate-wave-slow bg-[linear-gradient(45deg,transparent_25%,rgba(255,145,77,0.1)_50%,transparent_75%,transparent_100%)] bg-[length:300%_300%] opacity-60"></div>
                </div>
                <div className="absolute inset-0">
                    <div className="h-[100vh] w-[100vw] animate-wave-fast bg-[linear-gradient(135deg,transparent_25%,rgba(213,29,53,0.1)_50%,transparent_75%,transparent_100%)] bg-[length:300%_300%] opacity-60"></div>
                </div>
            </div>

            <div className="relative flex min-h-screen flex-col">
                <header className="w-full px-6 pt-8">
                    <div className="flex items-center justify-between">
                        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-gradient-to-r from-[#ff914d] to-[#d51d35] bg-clip-text text-4xl font-bold text-transparent md:text-5xl lg:text-6xl"
                                style={{ fontFamily: "More Sugar, sans-serif" }}
                            >
                                {t("app.title")}
                            </motion.h1>
                        </motion.div>

                        <LanguageSelector />
                    </div>
                </header>

                <main className="flex flex-grow flex-col items-center justify-center gap-4 px-4 py-8">
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="mb-4">
                        <img
                            src={logo}
                            alt="Edu Echo logo"
                            className="h-48 w-48 drop-shadow-lg sm:h-56 sm:w-56 md:h-72 md:w-72 lg:h-80 lg:w-80 xl:h-96 xl:w-96"
                        />
                    </motion.div>

                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center">
                        <div className="relative">
                            <Button
                                onClick={onToggleListening}
                                className={`group relative h-20 w-20 rounded-full transition-all duration-300 ${
                                    isRecording ? "bg-red-600 hover:bg-red-700" : "bg-gradient-to-r from-[#d51d35] to-[#ff914d] hover:scale-110"
                                }`}
                                aria-label={isRecording ? t("app.stopRecording") : t("app.startRecording")}
                            >
                                {isRecording ? <MicOff className="h-8 w-8 text-white" /> : <Mic className="h-8 w-8 text-white" />}
                                <span className="absolute -bottom-8 left-1/2 z-50 -translate-x-1/2 transform whitespace-nowrap text-base font-medium text-gray-800/90 opacity-0 transition-opacity group-hover:opacity-100">
                                    {isRecording ? t("app.stopConversation") : t("app.startRecording")}
                                </span>
                            </Button>
                        </div>

                        <div className="mt-16">
                            <StatusMessage isRecording={isRecording} transcript={currentTranscript} />
                        </div>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="w-full max-w-5xl px-4">
                        <GroundingFiles files={groundingFiles} onSelected={setSelectedFile} isLoading={false} />
                    </motion.div>
                </main>

                <footer className="relative py-8 text-center">
                    <p className="text-base font-medium text-gray-600 md:text-lg">{t("app.footer")}</p>
                </footer>

                <GroundingFileView groundingFile={selectedFile} onClosed={() => setSelectedFile(null)} />
            </div>
        </div>
    );
}

export default App;
