import { config } from "./config.svelte";

const prefix = "moinframe.cookie-consent.";

export const t = (key: string): string =>
	config.translations[config.options.locale]?.[prefix + key] ??
	config.translations.en?.[prefix + key] ??
	key;
