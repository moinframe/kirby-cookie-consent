<?php

namespace Moinframe\CookieConsent\Models;

use JsonSerializable;

class Category implements JsonSerializable
{
    public function __construct(
        public readonly string $label,
        public readonly string $description,
        public readonly string $id,
        public readonly bool $required = false
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

    /**
     * Policies in a required category are always active and can't be switched off
     */
    public function required(): bool
    {
        return $this->required;
    }

    /**
     * @return array{id: string, label: string, description: string, required: bool}
     */
    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'label' => $this->label,
            'description' => $this->description,
            'required' => $this->required
        ];
    }

    public function toJson(): string
    {
        return json_encode($this->toArray(), JSON_THROW_ON_ERROR);
    }

    /**
     * @return array{id: string, label: string, description: string, required: bool}
     */
    public function jsonSerialize(): array
    {
        return $this->toArray();
    }
}
