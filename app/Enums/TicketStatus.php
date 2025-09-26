<?php

namespace App\Enums;

enum TicketStatus: string
{
    case NEW = 'NEW';
    case IN_PROGRESS = 'IN_PROGRESS';
    case ON_HOLD = 'ON_HOLD';
    case RESOLVED = 'RESOLVED';
    case CLOSED = 'CLOSED';
    case CANCELLED_IRRELEVANT = 'CANCELLED_IRRELEVANT';
    case CANCELLED_DUPLICATE = 'CANCELLED_DUPLICATE';

    public function label(): string
    {
        return match($this) {
            self::NEW => 'New',
            self::IN_PROGRESS => 'In Progress',
            self::ON_HOLD => 'On Hold',
            self::RESOLVED => 'Resolved',
            self::CLOSED => 'Closed',
            self::CANCELLED_IRRELEVANT => 'Cancelled (Irrelevant)',
            self::CANCELLED_DUPLICATE => 'Cancelled (Duplicate)',
        };
    }

    public function color(): string
    {
        return match($this) {
            self::NEW => 'blue',
            self::IN_PROGRESS => 'yellow',
            self::ON_HOLD => 'orange',
            self::RESOLVED => 'green',
            self::CLOSED => 'gray',
            self::CANCELLED_IRRELEVANT => 'red',
            self::CANCELLED_DUPLICATE => 'red',
        };
    }

    public function canTransitionTo(TicketStatus $status): bool
    {
        return match($this) {
            self::NEW => $status === self::IN_PROGRESS,
            self::IN_PROGRESS => in_array($status, [self::ON_HOLD, self::RESOLVED]),
            self::ON_HOLD => $status === self::IN_PROGRESS,
            self::RESOLVED => in_array($status, [self::CLOSED, self::IN_PROGRESS]),
            default => false,
        };
    }

    public static function activeStates(): array
    {
        return [
            self::NEW,
            self::IN_PROGRESS,
            self::ON_HOLD,
            self::RESOLVED,
            self::CLOSED,
        ];
    }

    public static function cancelledStates(): array
    {
        return [
            self::CANCELLED_IRRELEVANT,
            self::CANCELLED_DUPLICATE,
        ];
    }

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
