<?php

return [
    'slug' => 'cookie-consent',
    'variants' => [
        'k4'    => ['kirby' => 4],
        'k4-ml' => ['kirby' => 4, 'languages' => true],
        'k5'    => ['kirby' => 5],
        'k5-ml' => ['kirby' => 5, 'languages' => true],
    ],
    'languages' => [
        ['code' => 'en', 'name' => 'English', 'locale' => 'en_US'],
        ['code' => 'de', 'name' => 'Deutsch', 'locale' => 'de_DE'],
    ],
    'buildArtifacts' => ['assets/cookie-consent.js'],
    'buildCommand'   => 'pnpm build',
];
