import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

type ProgressStats = {
    totalQuestions: number;
    correctAnswers: number;
    accuracy: number;
    difficultyBreakdown: {
        easy: number;
        medium: number;
        hard: number;
    };
    accuracyByDifficulty: {
        easy: number;
        medium: number;
        hard: number;
    };
};

type Properties = {
    stats: ProgressStats;
};

export function ProgressPanel({ stats }: Properties) {
    const { t } = useTranslation();

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-lg bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-xl font-bold">{t("progress.title")}</h2>

            <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-purple-50 p-4">
                    <h3 className="text-sm font-medium text-purple-800">{t("progress.overall")}</h3>
                    <p className="text-2xl font-bold text-purple-900">{stats.accuracy.toFixed(1)}%</p>
                    <p className="text-sm text-purple-700">
                        {stats.correctAnswers} / {stats.totalQuestions} {t("progress.questionsCorrect")}
                    </p>
                </div>

                <div className="rounded-lg bg-pink-50 p-4">
                    <h3 className="text-sm font-medium text-pink-800">{t("progress.byDifficulty")}</h3>
                    <div className="mt-2 space-y-1">
                        {Object.entries(stats.accuracyByDifficulty).map(([difficulty, accuracy]) => (
                            <div key={difficulty} className="flex justify-between">
                                <span className="text-sm capitalize text-pink-700">{difficulty}</span>
                                <span className="text-sm font-medium text-pink-900">{accuracy.toFixed(1)}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
