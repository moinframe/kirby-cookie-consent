# JavaScript API

The script adds a global `CookieConsent` object. Use it after `DOMContentLoaded`.

| Member                 | Type                          | Description |
| :--------------------- | :---------------------------- | :---------- |
| `policies`             | `string[]`                    | Ids of all policies |
| `getUserConsent()`     | `() => string[]`              | Ids of the policies the visitor agreed to, plus required policies. Before the visitor makes a choice, only required policies |
| `hasConsent(id)`       | `(id: string) => boolean`     | Whether the visitor agreed to a policy. Always `true` for required policies |
| `openSettings()`       | `() => true`                  | Opens the settings |
| `audit()`              | `() => AuditEntry[]`          | Lists the cookies and storage entries of the page, see [Checking cookies](#checking-cookies) |

```html
<script>
  document.addEventListener("DOMContentLoaded", () => {
    if (CookieConsent.hasConsent("matomo")) {
      const script = document.createElement("script");
      script.src = "https://matomo.example.com/matomo.js";
      document.head.append(script);
    }
  });
</script>
```

## Blocking scripts

Browsers don't run scripts with the type `text/plain`. Add `data-cookie-consent` with a policy id, and the plugin runs the script after the visitor agrees:

```html
<script type="text/plain" data-cookie-consent="matomo" src="https://matomo.example.com/matomo.js"></script>

<script type="text/plain" data-cookie-consent="matomo">
  var _paq = (window._paq = window._paq || []);
  _paq.push(["trackPageView"]);
</script>
```

- To require several policies, separate the ids with spaces: `data-cookie-consent="matomo youtube"`.
- Add `data-type="module"` for module scripts.
- Other attributes, including `nonce`, are kept.
- Scripts run in the order they appear on the page, unless they have `async`.
- Scripts of required policies run on every visit.
- With `reload` set to `false`, scripts run right after the visitor agrees. Otherwise they run after the reload.

This only works for scripts in the HTML. Scripts you add with JavaScript need to check `hasConsent()`.

## Checking cookies

To find cookies that no policy lists, or that a tool sets without consent, run this in the browser console:

```js
CookieConsent.audit();
```

It prints a table of all cookies and `localStorage` and `sessionStorage` entries, with the policy that lists each one and a status:

| Status            | Meaning |
| :---------------- | :------ |
| `ok`              | Listed by a policy the visitor agreed to, or by a required policy |
| `without consent` | Listed by a policy the visitor didn't agree to. A script ran too early |
| `undeclared`      | Not listed by any policy. Add it to a policy |

Names must match exactly. `*` is a wildcard: `_pk_id.*` matches `_pk_id.1.a2b3`.

Run it in a private window, so cookies from earlier visits don't show up. Run it once after declining and once after accepting everything, and on pages with embeds or forms.

Some cookies are not visible to JavaScript:

- **HttpOnly cookies**, e.g. Kirby's `kirby_session`. Kirby sets it when someone logs in or a form uses the session. Check the response headers in the network tab of the browser.
- **Third-party cookies** from other domains, e.g. in a YouTube iframe. You find them in the developer tools under Application (Chrome) or Storage (Firefox, Safari).

## Reacting to changes

When the visitor saves a choice, the plugin fires `cookie-consent:change` on `document`:

```js
document.addEventListener("cookie-consent:change", (event) => {
  event.detail.consent; // ["matomo"]
  event.detail.previous; // null on the first decision
});
```

Both lists include required policies.

By default, the page then reloads if a policy was granted or revoked. This runs newly allowed scripts and removes scripts that are no longer allowed. Declining on the first visit doesn't reload the page.

Set `reload` to `false` if your code reacts to the event instead. Scripts that already ran can't be removed without a reload, so reload the page yourself if a policy in `previous` is missing from `consent`.

## Cookie

The consent is stored as JSON in the cookie named by `cookieName`, with `SameSite=Strict` and `Secure` on HTTPS:

```json
{"consent":["matomo"],"policies":{"matomo":"cf59b4fd","youtube":"9a0c3e12"}}
```

- `consent` lists the policies the visitor agreed to.
- `policies` lists the policies the visitor was shown, each with a revision, a hash of its details.

The banner asks again for policies that are missing from `policies`, and for granted policies whose revision changed. Those don't count as granted until the visitor agrees again. Required policies are not stored. Unknown ids are ignored. If the cookie can't be read, the banner shows again.

Before 1.0, the cookie was a plain array of granted ids. These cookies still work and count as a choice for all current policies.
