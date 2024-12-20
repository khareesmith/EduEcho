import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { Globe } from "lucide-react";
import { Button } from "./button";

const languages = [
    { code: "en", name: "English" },
    { code: "es", name: "Español" },
    { code: "fr", name: "Français" },
    { code: "de", name: "Deutsch" },
    { code: "ja", name: "日本語" },
    { code: "zh", name: "中文" }
];

export function LanguageSelector() {
    const { t, i18n } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);

    const handleLanguageChange = (languageCode: string) => {
        i18n.changeLanguage(languageCode);
        setIsOpen(false);
    };

    return (
        <div className="relative">
            <Button variant="ghost" size="sm" className="group relative text-gray-500 hover:text-[#ff914d]" onClick={() => setIsOpen(!isOpen)}>
                <Globe className="h-5 w-5" />
                <span className="absolute left-0 top-1/2 z-50 -translate-x-[calc(100%+8px)] -translate-y-1/2 transform whitespace-nowrap text-xs font-medium text-gray-600 opacity-0 transition-opacity group-hover:opacity-100">
                    {t("app.changeLanguage")}
                </span>
            </Button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 mt-2 w-48 rounded-xl bg-white p-2 shadow-lg ring-1 ring-black/5"
                    >
                        {languages.map(language => (
                            <button
                                key={language.code}
                                className={`w-full rounded-lg px-4 py-2 text-left text-sm transition-colors hover:bg-orange-50 ${i18n.language === language.code ? "bg-orange-100 text-[#ff914d]" : "text-gray-700"}`}
                                onClick={() => handleLanguageChange(language.code)}
                            >
                                {language.name}
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
