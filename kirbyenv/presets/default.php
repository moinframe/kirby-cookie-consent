<?php

return [
    'hooks' => [
        'page.render:after' => function (string $contentType, array $data, string $html) {
            if ($contentType !== 'html') {
                return $html;
            }
            $blocked = '<script type="text/plain" data-cookie-consent="matomo">console.log("Cookie Consent: matomo script ran")</script>';
            // matches the "Kirby" column of the Starterkit footer
            $website = '<li><a href="https://getkirby.com">Website</a></li>';
            $settings = '<li><a href="#" onclick="window.CookieConsent.openSettings(); return false">Cookie settings</a></li>';

            $html = str_replace($website, $settings . $website, $html);

            return str_replace('</body>', $blocked . snippet('cookie-consent', [], true) . '</body>', $html);
        },
    ],
];
