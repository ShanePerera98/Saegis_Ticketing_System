<?php

namespace App\Enums;

enum CancelledTicketType: string
{
    case IRRELEVANT = 'IRRELEVANT';
    case DUPLICATE = 'DUPLICATE';

    public function label(): string
    {
        return match($this) {
            self::IRRELEVANT => 'Irrelevant',
            self::DUPLICATE => 'Duplicate',
        };
    }

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
