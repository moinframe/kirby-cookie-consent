import type { ConsentChangeDetail, CookieConsentApi } from "./types";

declare global {
	interface Window {
		CookieConsent: CookieConsentApi;
	}

	interface DocumentEventMap {
		"cookie-consent:change": CustomEvent<ConsentChangeDetail>;
	}
}
