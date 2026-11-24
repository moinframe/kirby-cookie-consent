<?php

namespace Moinframe\CookieConsent;

use Moinframe\CookieConsent\Models\Category;
use Moinframe\CookieConsent\Models\Policy;
use Kirby\Cms\App as Kirby;
use Kirby\Cms\Page;
use Kirby\Cms\Pages;
use Kirby\Cms\StructureObject;
use Kirby\Toolkit\A;
use Kirby\Toolkit\Str;

class CookieConsent
{
    public const PLUGIN = 'moinframe/cookie-consent';
    public const TRANSLATION_PREFIX = 'moinframe.cookie-consent.';

    /**
     * Plugin options, with snippet variables of the same name taking precedence
     *
     * @param array<string, mixed> $overrides
     * @return array<string, mixed>
     */
    public static function options(array $overrides = []): array
    {
        /** @var array<string, mixed> $options */
        $options = option('moinframe.cookie-consent', []);

        foreach ($options as $key => $value) {
            $options[$key] = $overrides[$key] ?? $value;
        }

        $options['locale'] ??= Kirby::instance()->language()?->code() ?? 'en';

        return $options;
    }

    /**
     * @return array<int, Policy>
     */
    public static function policies(): array
    {
        return Kirby::instance()->site()->cookiepolicies()->toStructure()->values(
            fn (StructureObject $policy) => new Policy(
                $policy->label()->value(),
                Str::unhtml($policy->description()->value()),
                $policy->id(),
                $policy->category()->value(),
                $policy->provider()->value() ?? '',
                $policy->location()->value() ?? '',
                $policy->privacy()->value() ?? '',
                $policy->cookies()->toStructure()->values(
                    fn (StructureObject $cookie) => [
                        'name' => $cookie->name()->value() ?? '',
                        'duration' => $cookie->duration()->value() ?? '',
                    ]
                ),
            )
        );
    }

    /**
     * @return array<int, Category>
     */
    public static function categories(): array
    {
        return Kirby::instance()->site()->cookiecategories()->toStructure()->values(
            fn (StructureObject $category) => new Category(
                $category->label()->value(),
                Str::unhtml($category->description()->value()),
                $category->id(),
                $category->required()->toBool()
            )
        );
    }

    /**
     * The privacy policy and imprint pages chosen in the Panel
     *
     * @return Pages<Page>
     */
    public static function pages(): Pages
    {
        $site = Kirby::instance()->site();

        return new Pages(A::filter([
            $site->cookieprivacypage()->toPage(),
            $site->cookieimprintpage()->toPage(),
        ], fn ($page) => $page instanceof Page));
    }

    /**
     * @return array<int, array{label: string, url: string}>
     */
    public static function links(): array
    {
        return static::pages()->values(fn (Page $page) => [
            'label' => $page->title()->value(),
            'url' => $page->url(),
        ]);
    }

    /**
     * Plugin strings for the given locale and the frontend's `en` fallback,
     * including custom language variables of multi-language sites
     *
     * @return array<string, array<string, string>>
     */
    public static function translations(string $locale): array
    {
        $kirby = Kirby::instance();
        $translations = [];

        foreach (array_unique([$locale, 'en']) as $code) {
            // since Kirby 5.6, translation() drops language variables that shadow plugin strings
            $strings = [
                ...$kirby->translation($code)->data(),
                ...$kirby->language($code)?->translations() ?? [],
            ];

            $translations[$code] = A::filter(
                $strings,
                fn ($value, $key) => Str::startsWith($key, static::TRANSLATION_PREFIX)
            );
        }

        return $translations;
    }

    public static function scriptUrl(): string
    {
        return Kirby::plugin(static::PLUGIN)?->asset('cookie-consent.js')?->url() ?? '';
    }
}
