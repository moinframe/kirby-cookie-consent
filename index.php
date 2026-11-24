<?php

use Kirby\Cms\App as Kirby;
use Kirby\Filesystem\F;

// only needed for manual installs; Composer installs use the PSR-4 autoloader
F::loadClasses([
    'moinframe\\cookieconsent\\cookieconsent' => 'src/CookieConsent.php',
    'moinframe\\cookieconsent\\models\\category' => 'src/Models/Category.php',
    'moinframe\\cookieconsent\\models\\policy' => 'src/Models/Policy.php',
], __DIR__);

Kirby::plugin('moinframe/cookie-consent', [
    'blueprints' => [
        'sections/cookie-consent' => __DIR__ . '/blueprints/sections/cookie-consent.yml'
    ],
    'options' => [
        'cookieName' => 'cc_policies',
        'blockPage' => false,
        'expires' => 365,
        // null uses the current site language, falling back to English
        'locale' => null,
        'position' => 'bottom-right',
        'layout' => 'card',
        'autoIncludeJs' => true,
        // reload the page when consent changes, so scripts are loaded or dropped
        'reload' => true
    ],
    'snippets' => [
        'cookie-consent' => __DIR__ . '/snippets/cookie-consent.php',
    ],
    'translations' => [
        'en' => [
            'moinframe.cookie-consent.start.headline' => 'Cookie Management',
            'moinframe.cookie-consent.start.text' => 'We use cookies to run our website and analyze user interaction.',
            'moinframe.cookie-consent.settings.headline' => 'Settings',
            'moinframe.cookie-consent.settings.text' => 'Here you can choose individually, which cookies you wish to consent to.',
            'moinframe.cookie-consent.settings.required' => 'Always active',
            'moinframe.cookie-consent.settings.new' => 'New',
            'moinframe.cookie-consent.settings.changed' => 'Updated',
            'moinframe.cookie-consent.settings.details' => 'Details',
            'moinframe.cookie-consent.details.provider' => 'Provider',
            'moinframe.cookie-consent.details.location' => 'Processing location',
            'moinframe.cookie-consent.details.cookies' => 'Cookies',
            'moinframe.cookie-consent.details.privacy' => 'Privacy policy of the provider',
            'moinframe.cookie-consent.buttons.decline' => 'Decline',
            'moinframe.cookie-consent.buttons.cancel' => 'Cancel',
            'moinframe.cookie-consent.buttons.save' => 'Save',
            'moinframe.cookie-consent.buttons.acceptall' => 'Accept all',
            'moinframe.cookie-consent.buttons.settings' => 'Edit settings',
        ],
        'de' => [
            'moinframe.cookie-consent.start.headline' => 'Cookie Verwaltung',
            'moinframe.cookie-consent.start.text' => 'Wir verwenden Cookies zum Betrieb der Webseite und zur Analyse des Nutzerverhaltens.',
            'moinframe.cookie-consent.settings.headline' => 'Einstellungen',
            'moinframe.cookie-consent.settings.text' => 'Hier können Sie individuelle Einstellungen treffen, welchen Cookies Sie zustimmen möchten.',
            'moinframe.cookie-consent.settings.required' => 'Immer aktiv',
            'moinframe.cookie-consent.settings.new' => 'Neu',
            'moinframe.cookie-consent.settings.changed' => 'Geändert',
            'moinframe.cookie-consent.settings.details' => 'Details',
            'moinframe.cookie-consent.details.provider' => 'Anbieter',
            'moinframe.cookie-consent.details.location' => 'Ort der Verarbeitung',
            'moinframe.cookie-consent.details.cookies' => 'Cookies',
            'moinframe.cookie-consent.details.privacy' => 'Datenschutzerklärung des Anbieters',
            'moinframe.cookie-consent.buttons.decline' => 'Ablehnen',
            'moinframe.cookie-consent.buttons.cancel' => 'Abbrechen',
            'moinframe.cookie-consent.buttons.save' => 'Speichern',
            'moinframe.cookie-consent.buttons.acceptall' => 'Alle akzeptieren',
            'moinframe.cookie-consent.buttons.settings' => 'Einstellungen bearbeiten',
        ]
    ]
]);
