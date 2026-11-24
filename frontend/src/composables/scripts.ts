export const ATTRIBUTE = "data-cookie-consent";

/** Every policy listed in the attribute has to be granted */
export const isAllowed = (attribute: string | null, consent: string[]): boolean => {
	const ids = (attribute ?? "").split(/\s+/).filter(Boolean);
	return ids.length > 0 && ids.every((id) => consent.includes(id));
};

/**
 * Swaps blocked `<script type="text/plain">` tags for real ones, because a
 * script only runs when it's inserted, not when its type changes.
 */
export const activateScripts = (consent: string[], root: ParentNode = document) => {
	for (const blocked of root.querySelectorAll<HTMLScriptElement>(`script[type="text/plain"][${ATTRIBUTE}]`)) {
		if (!isAllowed(blocked.getAttribute(ATTRIBUTE), consent)) continue;

		const script = document.createElement("script");
		for (const { name, value } of blocked.attributes) {
			if (name === "type") continue;
			script.setAttribute(name === "data-type" ? "type" : name, value);
		}
		// browsers hide the nonce attribute after parsing, only the property keeps it
		if (blocked.nonce) script.nonce = blocked.nonce;
		// inserted scripts load async by default, which would break the order of dependent scripts
		if (!blocked.hasAttribute("async")) script.async = false;
		script.textContent = blocked.textContent;

		blocked.replaceWith(script);
	}
};
