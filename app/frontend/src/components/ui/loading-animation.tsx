import { motion } from "framer-motion";

export function LoadingAnimation() {
    return (
        <motion.div className="flex items-center justify-center space-x-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {[...Array(3)].map((_, i) => (
                <motion.div
                    key={i}
                    className="h-2 w-2 rounded-full bg-[#ff914d]"
                    animate={{
                        y: ["0%", "-50%", "0%"]
                    }}
                    transition={{
                        duration: 0.5,
                        repeat: Infinity,
                        delay: i * 0.1
                    }}
                />
            ))}
        </motion.div>
    );
}
