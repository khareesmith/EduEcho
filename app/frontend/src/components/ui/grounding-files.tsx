import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { FileText } from "lucide-react";
import { LoadingAnimation } from "./loading-animation";

import { GroundingFile as GroundingFileType } from "@/types";
import GroundingFile from "./grounding-file";

type Properties = {
    files: GroundingFileType[];
    onSelected: (file: GroundingFileType) => void;
    isLoading?: boolean;
};

export function GroundingFiles({ files, onSelected, isLoading = false }: Properties) {
    const { t } = useTranslation();

    // Don't render anything if there are no files and we're not loading
    if (files.length === 0) {
        return null;
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
                duration: 0.5
            }}
            className="relative z-50 w-full"
        >
            <div className="mx-auto w-full max-w-4xl rounded-2xl border border-orange-100 bg-white p-6">
                <div className="mb-6 flex items-center space-x-3">
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2 }} className="rounded-lg bg-orange-100 p-2">
                        <FileText className="h-6 w-6 text-[#ff914d]" />
                    </motion.div>
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                        <h2 className="text-2xl font-bold text-[#d51d35]">{t("groundingFiles.title")}</h2>
                        <p className="text-[#ff914d]">{t("groundingFiles.description")}</p>
                    </motion.div>
                </div>

                <motion.div className="relative" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                    {isLoading ? (
                        <div className="flex justify-center py-4">
                            <LoadingAnimation />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {files.map((file, index) => (
                                <motion.div
                                    key={file.id}
                                    className="relative"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 + index * 0.1 }}
                                >
                                    <GroundingFile value={file} onClick={() => onSelected(file)} />
                                </motion.div>
                            ))}
                        </div>
                    )}
                </motion.div>
            </div>
        </motion.div>
    );
}
