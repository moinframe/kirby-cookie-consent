import type { AuditEntry, Policy, StorageType } from "../types";

/** `*` in a declared cookie name matches any characters, e.g. `_pk_id.*` */
export const matchesName = (pattern: string, name: string): boolean => {
	const source = pattern
		.trim()
		.split("*")
		.map((part) => part.replace(/[.+?^${}()|[\]\\]/g, "\\$&"))
		.join(".*");
	return source !== "" && new RegExp(`^${source}$`).test(name);
};

export const auditEntries = (
	found: { name: string; storage: StorageType }[],
	policies: Policy[],
	consent: string[],
): AuditEntry[] =>
	found.map(({ name, storage }) => {
		const policy = policies.find((policy) => policy.cookies.some((cookie) => matchesName(cookie.name, name)));

		return {
			name,
			storage,
			policy: policy?.id ?? null,
			status: !policy ? "undeclared" : consent.includes(policy.id) ? "ok" : "without consent",
		};
	});

const storageKeys = (storage: () => Storage): string[] => {
	try {
		return Object.keys(storage());
	} catch {
		// storage access throws when the browser blocks site data
		return [];
	}
};

/** Everything this page can see: HttpOnly and third-party cookies are invisible to JavaScript */
export const findStored = (): { name: string; storage: StorageType }[] => [
	...document.cookie
		.split("; ")
		.filter(Boolean)
		.map((pair) => ({ name: decodeURIComponent(pair.split("=")[0]), storage: "cookie" as const })),
	...storageKeys(() => localStorage).map((name) => ({ name, storage: "localStorage" as const })),
	...storageKeys(() => sessionStorage).map((name) => ({ name, storage: "sessionStorage" as const })),
];
