import { auditEntries, findStored } from "./composables/audit";
import { activateScripts } from "./composables/scripts";
import {
	getConsent,
	getPendingPolicies,
	hasConsent,
	openSettings,
	openStart,
	requiredIds,
} from "./store/consent.svelte";
import { config, setConfig } from "./store/config.svelte";
import "./App.svelte";

const parseAttribute = <T>(element: Element, name: string, fallback: T): T => {
	try {
		return JSON.parse(element.getAttribute(name) ?? "") as T;
	} catch {
		console.warn(`Cookie Consent: could not parse the "${name}" attribute.`);
		return fallback;
	}
};

const element = document.querySelector("cookie-consent");

if (element) {
	setConfig({
		options: parseAttribute(element, "options", config.options),
		policies: parseAttribute(element, "policies", []),
		categories: parseAttribute(element, "categories", []),
		links: parseAttribute(element, "links", []),
		translations: parseAttribute(element, "translations", {}),
	});

	const { added, changed } = getPendingPolicies();

	if (getConsent() === null) {
		openStart();
	} else if (added.length + changed.length > 0) {
		// ask in the settings, where earlier choices stay visible and new or changed ones are off
		openSettings(false);
	}
}

// set up synchronously, so inline scripts on DOMContentLoaded can use it
window.CookieConsent = {
	policies: config.policies.map((policy) => policy.id),
	getUserConsent: () => getConsent() ?? requiredIds(),
	hasConsent,
	openSettings: () => {
		openSettings();
		return true;
	},
	audit: () => {
		const entries = auditEntries(findStored(), config.policies, getConsent() ?? requiredIds());
		console.table(entries);
		return entries;
	},
};

// module scripts run after parsing, so every blocked script in the HTML is there already
activateScripts(getConsent() ?? requiredIds());
