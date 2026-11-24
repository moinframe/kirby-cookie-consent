import {
	needsReload,
	parseRecord,
	pendingPolicies,
	requiredPolicies,
	serializeRecord,
	type PendingPolicies,
	type Revisions,
} from "../composables/consent";
import { readCookie, writeCookie } from "../composables/cookie";
import { activateScripts } from "../composables/scripts";
import { config } from "./config.svelte";

export const ui = $state({
	open: false,
	view: "start" as "start" | "settings",
	// settings opened directly (e.g. from a footer link) close on cancel instead of showing the start view
	settingsOnly: false,
});

export const requiredIds = () => requiredPolicies(config.categories, config.policies);

// required policies aren't stored: they need no consent, and changing them doesn't ask again
const revisions = (): Revisions => {
	const required = requiredIds();
	return Object.fromEntries(
		config.policies
			.filter((policy) => !required.includes(policy.id))
			.map((policy) => [policy.id, policy.revision]),
	);
};

const getRecord = () => parseRecord(readCookie(config.options.cookieName), revisions());

export const getPendingPolicies = (): PendingPolicies => pendingPolicies(getRecord(), revisions());

/** Optional policies the visitor granted, `null` before a decision */
export const getOptionalConsent = (): string[] | null => {
	const record = getRecord();
	if (!record) return null;
	const { changed } = pendingPolicies(record, revisions());
	return record.consent.filter((id) => !changed.includes(id));
};

export const getConsent = (): string[] | null => {
	const optional = getOptionalConsent();
	return optional && [...requiredIds(), ...optional];
};

export const hasConsent = (id: string): boolean => (getConsent() ?? requiredIds()).includes(id);

export const needsDecision = (): boolean => {
	const { added, changed } = getPendingPolicies();
	return getRecord() === null || added.length + changed.length > 0;
};

export const saveConsent = (ids: string[]) => {
	const current = revisions();
	const previous = getOptionalConsent();
	const consent = ids.filter((id) => Object.hasOwn(current, id));

	writeCookie(config.options.cookieName, serializeRecord(consent, current), config.options.expires);
	ui.open = false;

	const required = requiredIds();
	document.dispatchEvent(
		new CustomEvent("cookie-consent:change", {
			detail: {
				consent: [...required, ...consent],
				previous: previous && [...required, ...previous],
			},
		}),
	);

	if (config.options.reload && needsReload(previous, consent)) {
		location.reload();
	} else {
		activateScripts([...required, ...consent]);
	}
};

export const acceptAll = () => saveConsent(Object.keys(revisions()));
export const declineAll = () => saveConsent([]);

export const openStart = () => {
	ui.view = "start";
	ui.settingsOnly = false;
	ui.open = true;
};

export const openSettings = (settingsOnly = true) => {
	ui.view = "settings";
	ui.settingsOnly = settingsOnly;
	ui.open = true;
};

/**
 * Escape and Cancel step back one level. Without a decision on every policy the
 * banner can't be dismissed, because closing it is not a choice.
 */
export const goBack = () => {
	if (ui.view === "settings" && !ui.settingsOnly) {
		ui.view = "start";
		return;
	}
	if (!needsDecision()) {
		ui.open = false;
		return;
	}
	ui.view = "start";
	ui.settingsOnly = false;
};
