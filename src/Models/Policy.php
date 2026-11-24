<?php

namespace Moinframe\CookieConsent\Models;

use JsonSerializable;

class Policy implements JsonSerializable
{
    /**
     * @param string $category Id of the category this policy belongs to
     * @param array<int, array{name: string, duration: string}> $cookies
     */
    public function __construct(
        public readonly string $label,
        public readonly string $description,
        public readonly string $id,
        public readonly string $category,
        public readonly string $provider = '',
        public readonly string $location = '',
        public readonly string $privacy = '',
        public readonly array $cookies = []
    ) {
    }

    public function label(): string
    {
        return $this->label;
    }

    public function description(): string
    {
        return $this->description;
    }

    public function id(): string
    {
        return $this->id;
    }

    public function category(): string
    {
        return $this->category;
    }

    public function provider(): string
    {
        return $this->provider;
    }

    public function location(): string
    {
        return $this->location;
    }

    public function privacy(): string
    {
        return $this->privacy;
    }

    /**
     * @return array<int, array{name: string, duration: string}>
     */
    public function cookies(): array
    {
        return $this->cookies;
    }

    /**
     * Changes when what visitors agree to changes, so they're asked again. The
     * label and privacy link are left out: renaming a tool or moving its privacy
     * policy doesn't change the processing.
     */
    public function revision(): string
    {
        return hash('crc32b', json_encode([
            trim($this->description),
            $this->category,
            trim($this->provider),
            trim($this->location),
            $this->cookies,
        ], JSON_THROW_ON_ERROR));
    }

    /**
     * @return array{id: string, label: string, description: string, category: string, provider: string, location: string, privacy: string, cookies: array<int, array{name: string, duration: string}>, revision: string}
     */
    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'label' => $this->label,
            'description' => $this->description,
            'category' => $this->category,
            'provider' => $this->provider,
            'location' => $this->location,
            'privacy' => $this->privacy,
            'cookies' => $this->cookies,
            'revision' => $this->revision(),
        ];
    }

    public function toJson(): string
    {
        return json_encode($this->toArray(), JSON_THROW_ON_ERROR);
    }

    /**
     * @return array{id: string, label: string, description: string, category: string, provider: string, location: string, privacy: string, cookies: array<int, array{name: string, duration: string}>, revision: string}
     */
    public function jsonSerialize(): array
    {
        return $this->toArray();
    }
}
