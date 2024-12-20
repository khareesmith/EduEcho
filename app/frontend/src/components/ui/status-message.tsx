import "./status-message.css";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";

type Properties = {
    isRecording: boolean;
    transcript?: string;
};

export default function StatusMessage({ isRecording, transcript }: Properties) {
    const { t } = useTranslation();
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto scroll to bottom when transcript updates
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [transcript]);

    return (
        <div className="flex flex-col items-center">
            <AnimatePresence mode="wait">
                {isRecording ? (
                    <motion.div
                        key="recording"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="flex items-center"
                    >
                        <div className="relative h-6 w-6 overflow-hidden">
                            <div className="absolute inset-0 flex items-end justify-around">
                                {[...Array(4)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="w-1 rounded-full bg-gradient-to-t from-[#d51d35] to-[#ff914d] opacity-80"
                                        style={{
                                            animation: `barHeight${(i % 3) + 1} 1s ease-in-out infinite`,
                                            animationDelay: `${i * 0.1}s`
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                        <p className="ml-2 text-gray-700">{t("status.conversationInProgress")}</p>
                    </motion.div>
                ) : (
                    <motion.p
                        key="not-recording"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="text-gray-500"
                    >
                        {t("status.notRecordingMessage")}
                    </motion.p>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {transcript && transcript.trim() !== "" && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        className="mt-4 w-full max-w-xl"
                    >
                        <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-white/95 to-white/75 p-1 shadow-lg backdrop-blur-sm">
                            <div className="absolute inset-0 bg-gradient-to-br from-[#ff914d]/10 to-[#d51d35]/10" />
                            <div ref={scrollRef} className="relative h-[300px] overflow-y-auto rounded-md bg-white/40 p-4 shadow-inner">
                                <div className="mb-2 flex items-center space-x-2">
                                    <div className="h-2 w-2 rounded-full bg-[#ff914d]" />
                                    <div className="h-2 w-2 rounded-full bg-[#d51d35]" />
                                    <div className="h-2 w-2 rounded-full bg-[#ff914d]" />
                                </div>
                                <div className="prose prose-sm max-w-none whitespace-pre-wrap break-words text-sm leading-relaxed text-gray-700">
                                    <ReactMarkdown
                                        components={{
                                            // Customize how different elements are rendered
                                            p: ({ children }) => <p className="mb-4 last:mb-0">{children}</p>,
                                            strong: ({ children }) => <strong className="font-bold text-gray-900">{children}</strong>,
                                            em: ({ children }) => <em className="italic text-gray-800">{children}</em>,
                                            ul: ({ children }) => <ul className="ml-4 list-disc">{children}</ul>,
                                            ol: ({ children }) => <ol className="ml-4 list-decimal">{children}</ol>,
                                            li: ({ children }) => <li className="mb-1">{children}</li>
                                        }}
                                    >
                                        {transcript.trim()}
                                    </ReactMarkdown>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
