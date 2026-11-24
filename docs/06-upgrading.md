# Upgrading from 0.x

1.0 moves the plugin to `moinframe`, drops Kirby 3 and renders the banner as a web component. Update the package name, the option and translation keys, and any custom CSS.

- **Kirby 4 or 5 and PHP 8.1+** are required.
- **Package** is now `moinframe/kirby-cookie-consent`. Run `composer remove femundfilou/kirby-cookie-consent` and `composer require moinframe/kirby-cookie-consent`.
- **Options and translations** use the prefix `moinframe.cookie-consent` instead of `femundfilou.cookie-consent`. Rename it in your `config.php` and in your translations.
- **Markup**: `<div id="cookie-consent">` is now `<cookie-consent>` with a shadow DOM. Styles for `.cc__button`, `.cookie-consent__inner` and other classes no longer work. Use [CSS variables and parts](05-styling.md) instead.
- **Script**: `assets/js/cookie-consent.js` is now `assets/cookie-consent.js` and loads as a module. If `autoIncludeJs` is `false`, update your `<script>` tag, see [Configuration](02-configuration.md#loading-the-script-yourself).
- **`locale`** defaults to the current site language instead of `en`. Set it to `'en'` to keep the old behavior.
- **Essential cookies**: categories without policies are no longer "Always active". Turn on **Required** for your essential category and add its cookies as policies.
- **`getUserConsent()`** only returns policy ids. Before the visitor makes a choice, it returns the required policies instead of `null`. Category ids are no longer included.
- **Cookie format** is an object with `consent` and `policies` instead of an array, see [JavaScript API](03-javascript-api.md#cookie). Old cookies still work and are converted on the next save. Update server-side code that reads the cookie.
- **"Decline"** has the same style and width as "Accept all".
- **Default primary color** is darker (`hsl(103 88% 28%)`), so white text has enough contrast.
- **PHP classes** are now `Moinframe\CookieConsent\Models\Category` and `Moinframe\CookieConsent\Models\Policy` instead of `Fefi\CookieConsent\…`, with readonly properties.
- **New**: links to the privacy policy and imprint, required categories, policy details (provider, location, privacy policy, cookies), blocking scripts with `data-cookie-consent`, asking again about added or changed policies, the `reload` option, `hasConsent()`, the `cookie-consent:change` event and new [strings](04-translations.md).
