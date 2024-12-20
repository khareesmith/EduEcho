import { AnimatePresence, motion } from "framer-motion";
import { X, Copy, Check, BookOpen } from "lucide-react";
import { useState } from "react";
import { Button } from "./button";
import { GroundingFile } from "@/types";

type Properties = {
    groundingFile: GroundingFile | null;
    onClosed: () => void;
};

const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
};

const modalVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: {
            type: "spring",
            stiffness: 300,
            damping: 30
        }
    },
    exit: {
        opacity: 0,
        scale: 0.95,
        y: 20,
        transition: {
            duration: 0.2
        }
    }
};

export default function GroundingFileView({ groundingFile, onClosed }: Properties) {
    const [copied, setCopied] = useState(false);

    const truncateContent = (content: string) => {
        const practiceQuestionsIndex = content.indexOf("Practice Questions:");
        if (practiceQuestionsIndex !== -1) {
            return content.substring(0, practiceQuestionsIndex).trim();
        }
        const MAX_CHARS = 1000;
        return content.length > MAX_CHARS ? content.substring(0, MAX_CHARS).trim() + "..." : content;
    };

    const handleCopy = async () => {
        if (groundingFile) {
            await navigator.clipboard.writeText(groundingFile.content);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <AnimatePresence>
            {groundingFile && (
                <motion.div
                    variants={overlayVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
                    onClick={() => onClosed()}
                >
                    <motion.div
                        variants={modalVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-gradient-to-br from-white/95 to-orange-50/95 p-6 shadow-xl ring-1 ring-black/5 backdrop-blur-sm"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="mb-4 flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="rounded-lg bg-orange-100 p-2">
                                    <BookOpen className="h-5 w-5 text-[#ff914d]" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-[#d51d35]">{groundingFile.name}</h2>
                                    <p className="text-sm text-[#ff914d]">Learning Material</p>
                                </div>
                            </div>
                            <div className="flex space-x-2">
                                <Button variant="ghost" size="sm" className="group relative text-gray-500 hover:text-[#ff914d]" onClick={handleCopy}>
                                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                    <span className="absolute -bottom-8 left-1/2 z-50 -translate-x-1/2 transform whitespace-nowrap text-xs font-medium text-gray-600 opacity-0 transition-opacity group-hover:opacity-100">
                                        {copied ? "Copied!" : "Copy text"}
                                    </span>
                                </Button>
                                <Button variant="ghost" size="sm" className="group relative text-gray-500 hover:text-[#ff914d]" onClick={() => onClosed()}>
                                    <X className="h-5 w-5" />
                                    <span className="absolute -bottom-8 left-1/2 z-50 -translate-x-1/2 transform whitespace-nowrap text-xs font-medium text-gray-600 opacity-0 transition-opacity group-hover:opacity-100">
                                        Close
                                    </span>
                                </Button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-grow overflow-hidden rounded-xl bg-white/50 p-1">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="h-[40vh] overflow-auto rounded-lg bg-gradient-to-br from-white/80 to-orange-50/80 p-6 text-sm shadow-inner"
                            >
                                <div className="prose prose-sm max-w-none">
                                    <div className="whitespace-pre-wrap font-medium text-gray-700">{truncateContent(groundingFile.content)}</div>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
