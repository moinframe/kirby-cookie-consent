# Kirby Cookie Consent

A customizable, accessible cookie consent banner for [Kirby CMS](https://getkirby.com). Editors manage categories and policies in the Panel, visitors choose what they agree to, and your site loads scripts based on that choice.

## Requirements

- Kirby 4 or 5
- PHP 8.1+ (Kirby 5 requires PHP 8.2+)

For Kirby 3, use version `0.2.x`.

## Quick start

```bash
composer require moinframe/kirby-cookie-consent
```

Add the section to `site/blueprints/site.yml`:

```yaml
sections:
  cookieconsent: sections/cookie-consent
```

Add the snippet to your footer:

```php
<?php snippet('cookie-consent') ?>
```

Load your tools only with consent:

```html
<script type="text/plain" data-cookie-consent="matomo" src="https://matomo.example.com/matomo.js"></script>
```

## Documentation

1. [Installation](docs/01-installation.md)
2. [Configuration](docs/02-configuration.md)
3. [JavaScript API](docs/03-javascript-api.md)
4. [Translations](docs/04-translations.md)
5. [Styling](docs/05-styling.md)
6. [Upgrading from 0.x](docs/06-upgrading.md)

## License

[MIT](LICENSE)
