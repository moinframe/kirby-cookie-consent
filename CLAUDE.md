# CLAUDE.md

Kirby CMS plugin (`moinframe/cookie-consent`) that renders a cookie consent banner. Supports Kirby 4 and 5.

## Structure

**PHP**
- `index.php`: plugin registration, options, en/de translations
- `src/CookieConsent.php`: options, policies, categories and legal page links from the site, translations, script URL
- `src/Models/`: `Category` and `Policy` value objects
- `snippets/cookie-consent.php`: renders `<cookie-consent>` with JSON attributes and the script tag
- `blueprints/sections/cookie-consent.yml`: Panel section with the privacy/imprint page fields and the category and policy structures

**Frontend (Svelte 5)**, in `frontend/`, built to `assets/cookie-consent.js` (committed, so manual installs work):
- `src/main.ts`: reads the element's attributes into the config store, opens the banner without a stored decision, defines `window.CookieConsent`
- `src/App.svelte`: the `<cookie-consent>` custom element (shadow DOM) with a native `<dialog>`
- `src/lib/`: `Start`, `Settings`, `Links`, `Button`
- `src/store/`: config, consent/UI state, translations (`.svelte.ts` runes modules)
- `src/composables/`: pure cookie and consent helpers with unit tests, and activation of `data-cookie-consent` scripts

## Commands

```bash
pnpm dev | build | test | check
composer analyse                  # PHPStan level 8 with strict rules
kirbyenv up                       # Kirby 4/5 test installs, single- and multi-language
kirbyenv preset blocking          # switch options (kirbyenv/presets)
```

Kirby 4 needs PHP ≤ 8.4; if Herd runs 8.5, use `php84 $(which kirbyenv) …` and serve k4 installs with `php84 -S`.

## Conventions

- New UI strings: add the key to both languages in `index.php` (`moinframe.cookie-consent.*`) and use `t("key.without.prefix")` in Svelte.
- The consent cookie is `{"consent": [...], "policies": {"id": "revision"}}`, without required policies; `parseRecord()` must keep reading the pre-1.0 plain array. `Policy::revision()` decides which edits ask visitors again.
- Accessibility is a feature: keep real form controls, focus handling and contrast.
- Documentation lives in `docs/`; update it with any option or API change.
