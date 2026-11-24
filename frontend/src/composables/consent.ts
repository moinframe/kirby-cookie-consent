import type { Category, Policy } from "../types";

/** Policy ids mapped to their revision */
export type Revisions = Record<string, string>;

export interface ConsentRecord {
	consent: string[];
	// revisions of the policies the visitor was shown when deciding; `null` for cookies written before 1.0
	policies: Revisions | null;
}

export interface PendingPolicies {
	added: string[];
	// granted under a revision that has changed since, so the consent no longer covers them
	changed: string[];
}

/**
 * Returns `null` when the visitor hasn't decided yet (or the cookie is unusable),
 * so the banner shows again. Unknown ids are dropped: versions before 1.0 also
 * stored category ids, and policies may have been removed since.
 */
export const parseRecord = (raw: string | undefined, revisions: Revisions): ConsentRecord | null => {
	if (!raw) return null;

	const known = (ids: unknown[]) =>
		ids.filter((id): id is string => typeof id === "string" && Object.hasOwn(revisions, id));

	try {
		const value: unknown = JSON.parse(raw);

		if (Array.isArray(value)) {
			return { consent: known(value), policies: null };
		}

		if (
			typeof value === "object" &&
			value !== null &&
			"consent" in value &&
			"policies" in value &&
			Array.isArray(value.consent) &&
			typeof value.policies === "object" &&
			value.policies !== null &&
			!Array.isArray(value.policies)
		) {
			const policies = Object.fromEntries(
				Object.entries(value.policies).filter(
					(entry): entry is [string, string] =>
						Object.hasOwn(revisions, entry[0]) && typeof entry[1] === "string",
				),
			);
			return { consent: known(value.consent), policies };
		}

		return null;
	} catch {
		return null;
	}
};

export const serializeRecord = (consent: string[], revisions: Revisions): string =>
	JSON.stringify({ consent, policies: revisions } satisfies ConsentRecord);

/**
 * Policies the visitor has to decide on again. Old cookies don't record what was
 * shown, so they count as complete instead of asking every visitor again. A
 * declined policy that changed stays declined without asking.
 */
export const pendingPolicies = (record: ConsentRecord | null, revisions: Revisions): PendingPolicies => {
	const shown = record?.policies;
	if (!record || !shown) return { added: [], changed: [] };

	return {
		added: Object.keys(revisions).filter((id) => !Object.hasOwn(shown, id)),
		changed: record.consent.filter((id) => Object.hasOwn(shown, id) && shown[id] !== revisions[id]),
	};
};

/**
 * Scripts that already ran can't be unloaded, and newly allowed ones are usually
 * only initialised on page load, so any added or removed policy needs a reload.
 */
export const needsReload = (previous: string[] | null, next: string[]): boolean => {
	const before = new Set(previous ?? []);
	const after = new Set(next);
	return before.size !== after.size || [...after].some((id) => !before.has(id));
};

export const requiredPolicies = (categories: Category[], policies: Policy[]): string[] => {
	const required = categories.filter((category) => category.required).map((category) => category.id);
	return policies.filter((policy) => required.includes(policy.category)).map((policy) => policy.id);
};
