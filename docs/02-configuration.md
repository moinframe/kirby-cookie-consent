# Configuration

Set options in `site/config/config.php`:

```php
return [
    'moinframe.cookie-consent' => [
        'cookieName' => 'cc_policies',
        'blockPage' => false,
        'expires' => 365,
        'locale' => null,
        'position' => 'bottom-right',
        'layout' => 'card',
        'autoIncludeJs' => true,
        'reload' => true,
    ],
];
```

Snippet options override the config:

```php
<?php snippet('cookie-consent', ['position' => 'center', 'blockPage' => true]) ?>
```

| Option          | Type    | Default          | Description |
| :-------------- | :------ | :--------------- | :---------- |
| `cookieName`    | string  | `'cc_policies'`  | Name of the cookie that stores the consent |
| `blockPage`     | boolean | `false`          | Shows the banner as a modal. The page can't be used or scrolled until the visitor makes a choice. The privacy policy and imprint pages are not blocked |
| `expires`       | number  | `365`            | Days until the banner asks again |
| `locale`        | string  | `null`           | Language of the banner. `null` uses the current site language, or `en` on single-language sites |
| `position`      | string  | `'bottom-right'` | `'bottom-right'` or `'center'`. On small screens the banner is always at the bottom |
| `layout`        | string  | `'card'`         | `'card'` or `'bar'`. The bar sits at the bottom of the page and shows the text and buttons in one row, without a headline. The settings always open as a card. `position` has no effect on the bar |
| `autoIncludeJs` | boolean | `true`           | Adds the `<script>` tag. Set it to `false` to load the script yourself |
| `reload`        | boolean | `true`           | Reloads the page when consent is granted or revoked, see [JavaScript API](03-javascript-api.md#reacting-to-changes) |

## Snippet data

By default, the snippet reads policies, categories and links from the site. Pass `policies`, `categories` or `links` to set them yourself, e.g. to change the order of the links:

```php
<?php snippet('cookie-consent', [
    'links' => [
        ['label' => 'Imprint', 'url' => url('imprint')],
        ['label' => 'Privacy', 'url' => url('privacy')],
    ],
]) ?>
```

## Loading the script yourself

With `autoIncludeJs` set to `false`, load the script as a module. The page must contain the `<cookie-consent>` element, so keep the snippet:

```php
<script type="module" src="<?= Moinframe\CookieConsent\CookieConsent::scriptUrl() ?>"></script>
```

The URL contains a hash of the file, so browsers load the new version after an update.
