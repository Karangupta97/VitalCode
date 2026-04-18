import React from "react";
import { getNextLanguage, useRxLanguage } from "../utils/rxI18n";

const GlobalLanguageSwitch = ({ className = "" }) => {
	const { lang, t, applyLang } = useRxLanguage();
	const nextLang = getNextLanguage(lang);
	const nextLabelByLang = {
		en: t("lang.next.en", "EN"),
		hi: t("lang.next.hi", "हिं"),
		mr: t("lang.next.mr", "मर"),
	};
	const ariaLabelByLang = {
		en: "Switch language to English",
		hi: "Switch language to Hindi",
		mr: "Switch language to Marathi",
	};

	return (
		<button
			type="button"
			onClick={() => applyLang(nextLang)}
			aria-label={ariaLabelByLang[nextLang]}
			className={`inline-flex items-center justify-center rounded-full border border-slate-200 bg-white/80 px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-100 ${className}`}
		>
			{nextLabelByLang[nextLang]}
		</button>
	);
};

export default GlobalLanguageSwitch;
