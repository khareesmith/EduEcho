import { AnimatePresence, motion } from "framer-motion";
import { X, FileText, Copy, Check } from "lucide-react";
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
        // First try to find "Practice Questions:" and truncate there
        const practiceQuestionsIndex = content.indexOf("Practice Questions:");

        // If "Practice Questions:" is found, truncate there
        if (practiceQuestionsIndex !== -1) {
            return content.substring(0, practiceQuestionsIndex).trim();
        }

        // If not found, limit to 1000 characters as a fallback
        const MAX_CHARS = 1000;
        if (content.length > MAX_CHARS) {
            return content.substring(0, MAX_CHARS).trim() + "...";
        }

        return content;
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
                        className="flex max-h-[90vh] w-full max-w-2xl flex-col rounded-lg bg-white/95 p-6 shadow-xl ring-1 ring-black/5 backdrop-blur-sm"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="mb-4 flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <FileText className="h-5 w-5 text-[#ff914d]" />
                                <h2 className="text-xl font-bold text-[#d51d35]">{groundingFile.name}</h2>
                            </div>
                            <div className="flex space-x-2">
                                <Button variant="ghost" size="sm" className="text-gray-500 hover:text-[#ff914d]" onClick={handleCopy}>
                                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                </Button>
                                <Button variant="ghost" size="sm" className="text-gray-500 hover:text-[#ff914d]" onClick={() => onClosed()}>
                                    <X className="h-5 w-5" />
                                </Button>
                            </div>
                        </div>
                        <div className="flex-grow overflow-hidden">
                            <motion.pre
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="h-[40vh] overflow-auto rounded-md bg-gray-50/80 p-4 text-sm shadow-inner"
                            >
                                <code className="block text-gray-700">{truncateContent(groundingFile.content)}</code>
                            </motion.pre>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
