export const readCookie = (
	name: string,
	cookies: string = document.cookie,
): string | undefined => {
	for (const pair of cookies.split("; ")) {
		const index = pair.indexOf("=");
		if (index === -1) continue;

		try {
			if (decodeURIComponent(pair.slice(0, index)) === name) {
				return decodeURIComponent(pair.slice(index + 1));
			}
		} catch {
			// a malformed cookie set by someone else must not break the banner
		}
	}
	return undefined;
};

export const writeCookie = (name: string, value: string, days: number) => {
	const expires = new Date(Date.now() + days * 864e5).toUTCString();
	const secure = location.protocol === "https:" ? "; Secure" : "";
	document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Strict${secure}`;
};
