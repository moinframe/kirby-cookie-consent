export interface Options {
	cookieName: string;
	blockPage: boolean;
	expires: number;
	locale: string;
	position: "bottom-right" | "center";
	layout: "card" | "bar";
	reload: boolean;
}

export interface Cookie {
	name: string;
	duration: string;
}

export interface Policy {
	id: string;
	label: string;
	description: string;
	category: string;
	provider: string;
	location: string;
	privacy: string;
	cookies: Cookie[];
	revision: string;
}

export interface Category {
	id: string;
	label: string;
	description: string;
	required: boolean;
}

export interface Link {
	label: string;
	url: string;
}

export type Translations = Record<string, Record<string, string>>;

export interface Config {
	options: Options;
	policies: Policy[];
	categories: Category[];
	links: Link[];
	translations: Translations;
}

export interface CookieConsentApi {
	policies: string[];
	getUserConsent: () => string[];
	hasConsent: (policyId: string) => boolean;
	openSettings: () => boolean;
	audit: () => AuditEntry[];
}

export type StorageType = "cookie" | "localStorage" | "sessionStorage";

export interface AuditEntry {
	name: string;
	storage: StorageType;
	// id of the policy that declares it, `null` if none does
	policy: string | null;
	status: "ok" | "undeclared" | "without consent";
}

export interface ConsentChangeDetail {
	consent: string[];
	previous: string[] | null;
}
