# Installation

## Composer

```bash
composer require moinframe/kirby-cookie-consent
```

## Manual

Download the repository and put it into `site/plugins/cookie-consent`. The built script `assets/cookie-consent.js` is included, so you don't need to build anything.

## Setup

### 1. Panel section

Add the section to `site/blueprints/site.yml`, for example in its own tab:

```yaml
tabs:
  content:
    # …
  cookies:
    label: Cookies
    sections:
      cookieconsent: sections/cookie-consent
```

It adds these fields to the site:

**Privacy policy** and **Imprint** are linked in the banner. With `blockPage`, these two pages are not blocked.

**Categories** group policies, e.g. "Essential", "Statistics" or "External media".

| Field         | Description                     |
| :------------ | :------------------------------ |
| `label`       | Shown to visitors               |
| `description` | Shown to visitors               |
| `id`          | Unique identifier               |
| `required`    | Policies in this category are always active and have no switch |

Use a required category for cookies the site needs to work, e.g. the session cookie or the cookie this plugin stores. They don't need consent, but visitors should still see them.

**Policies** are what visitors consent to: one per tool or cookie, e.g. "Matomo" or "YouTube".

| Field         | Description                                  |
| :------------ | :------------------------------------------- |
| `label`       | Shown to visitors                            |
| `description` | Shown to visitors, the purpose of the tool   |
| `id`          | Unique identifier, used in your code         |
| `category`    | The category the policy belongs to           |
| `provider`    | Who runs the tool, e.g. "Google Ireland Limited" |
| `location`    | Where the data is processed, e.g. "EU" or "USA (EU-US Data Privacy Framework)" |
| `privacy`     | URL of the provider's privacy policy         |
| `cookies`     | Name and duration of each cookie the tool sets |

Provider, location, privacy policy and cookies are optional, but Article 13 GDPR requires this information, so fill them in for every tool. Visitors see them under "Details" in the settings. Cookie names can use `*` as a wildcard, e.g. `_pk_id.*`. To find the cookies your site sets, see [Checking cookies](03-javascript-api.md#checking-cookies).

Don't change policy ids once the site is live. Consent is stored by id, so visitors would be asked again.

Visitors who already made a choice see the settings again on their next visit when:

- **a policy was added**: it's marked "New" and switched off.
- **a policy they agreed to changed** its description, category, provider, location or cookies: it's marked "Updated" and switched off until they agree again.

Changes to the label or the privacy policy URL, to declined policies and to required policies don't ask again.

### 2. Snippet

Add the snippet to the end of your layout, e.g. in `site/snippets/footer.php`:

```php
<?php snippet('cookie-consent') ?>
```

It renders the banner and loads its script.

### 3. Load your tools

Set the type of a script to `text/plain` and add the policy id. The script only runs after the visitor agrees:

```html
<script type="text/plain" data-cookie-consent="matomo" src="https://matomo.example.com/matomo.js"></script>
```

See [Blocking scripts](03-javascript-api.md#blocking-scripts) for details. To check consent in your own code, use the [JavaScript API](03-javascript-api.md).

Add a button that opens the settings again, e.g. in your footer:

```html
<button type="button" onclick="CookieConsent.openSettings()">Cookie settings</button>
```
