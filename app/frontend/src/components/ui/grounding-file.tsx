import { File } from "lucide-react";
import { motion } from "framer-motion";
import { GroundingFile as GroundingFileType } from "@/types";

type Properties = {
    value: GroundingFileType;
    onClick: () => void;
};

export default function GroundingFile({ value, onClick }: Properties) {
    return (
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="relative z-10 w-full">
            <div
                onClick={onClick}
                className="flex w-full cursor-pointer items-center gap-3 rounded-full border-2 border-[#ff914d] bg-white px-6 py-4 shadow-md transition-all duration-300 hover:border-[#d51d35] hover:bg-orange-50"
            >
                <File className="h-5 w-5 shrink-0 text-[#ff914d]" />
                <span className="truncate font-medium text-gray-800">{value.name}</span>
            </div>
        </motion.div>
    );
}
