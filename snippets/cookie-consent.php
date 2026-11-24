<?php

use Moinframe\CookieConsent\CookieConsent;

$options = CookieConsent::options(get_defined_vars());

// a modal banner would cover the privacy policy and imprint it links to
if ($options['blockPage'] === true && ($current = page()) !== null && CookieConsent::pages()->has($current)) {
    $options['blockPage'] = false;
}

// json_encode() doesn't escape quotes, so an apostrophe in any text would break out of the attribute
$attr = fn (mixed $data): string => esc(json_encode($data, JSON_THROW_ON_ERROR), 'html');
?>
<cookie-consent
  options="<?= $attr($options) ?>"
  policies="<?= $attr($policies ?? CookieConsent::policies()) ?>"
  categories="<?= $attr($categories ?? CookieConsent::categories()) ?>"
  links="<?= $attr($links ?? CookieConsent::links()) ?>"
  translations="<?= $attr(CookieConsent::translations($options['locale'])) ?>"
></cookie-consent>
<?php if ($options['autoIncludeJs'] === true): ?>
<script type="module" src="<?= CookieConsent::scriptUrl() ?>"></script>
<?php endif ?>
