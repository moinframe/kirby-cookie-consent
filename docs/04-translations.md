# Translations

The banner is available in English and German. It uses the current site language or the `locale` option, and falls back to English.

## Strings

```yaml
moinframe.cookie-consent.start.headline: Cookie Management
moinframe.cookie-consent.start.text: We use cookies to run our website and analyze user interaction.
moinframe.cookie-consent.settings.headline: Settings
moinframe.cookie-consent.settings.text: Here you can choose individually, which cookies you wish to consent to.
moinframe.cookie-consent.settings.required: Always active
moinframe.cookie-consent.settings.new: New
moinframe.cookie-consent.settings.changed: Updated
moinframe.cookie-consent.settings.details: Details
moinframe.cookie-consent.details.provider: Provider
moinframe.cookie-consent.details.location: Processing location
moinframe.cookie-consent.details.cookies: Cookies
moinframe.cookie-consent.details.privacy: Privacy policy of the provider
moinframe.cookie-consent.buttons.decline: Decline
moinframe.cookie-consent.buttons.cancel: Cancel
moinframe.cookie-consent.buttons.save: Save
moinframe.cookie-consent.buttons.acceptall: Accept all
moinframe.cookie-consent.buttons.settings: Edit settings
```

## Multi-language sites

Change or add strings with [language variables](https://getkirby.com/docs/guide/languages/custom-language-variables), e.g. in `site/languages/fr.php`:

```php
return [
    'code' => 'fr',
    // …
    'translations' => [
        'moinframe.cookie-consent.start.headline' => 'Gestion des cookies',
        'moinframe.cookie-consent.start.text' => 'Nous utilisons des cookies…',
        // …
    ],
];
```

You can also edit language variables in the Panel under Languages.

## Single-language sites

Add the strings in a plugin, e.g. `site/plugins/site/index.php`, and set the `locale` option:

```php
Kirby::plugin('site/site', [
    'translations' => [
        'fr' => [
            'moinframe.cookie-consent.start.headline' => 'Gestion des cookies',
            // …
        ],
    ],
]);
```
