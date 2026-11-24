import type { Config } from "../types";

export const config: Config = $state({
	options: {
		cookieName: "cc_policies",
		blockPage: false,
		expires: 365,
		locale: "en",
		position: "bottom-right",
		layout: "card",
		reload: true,
	},
	policies: [],
	categories: [],
	links: [],
	translations: {},
});

export const setConfig = (value: Config) => {
	Object.assign(config.options, value.options);
	config.policies = value.policies;
	config.categories = value.categories;
	config.links = value.links;
	config.translations = value.translations;
};
