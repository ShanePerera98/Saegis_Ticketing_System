<?php

namespace App\Enums;

enum TicketStatus: string
{
    case NEW = 'NEW';
    case ACQUIRED = 'ACQUIRED';
    case IN_PROGRESS = 'IN_PROGRESS';
    case PENDING = 'PENDING';
    case RESOLVED = 'RESOLVED';
    case CANCELLED = 'CANCELLED';
    case CLOSED = 'CLOSED';
    case DELETED = 'DELETED';

    public function label(): string
    {
        return match($this) {
            self::NEW => 'New',
            self::ACQUIRED => 'Acquired',
            self::IN_PROGRESS => 'In Progress',
            self::PENDING => 'Pending',
            self::RESOLVED => 'Resolved',
            self::CANCELLED => 'Cancelled',
            self::CLOSED => 'Closed',
            self::DELETED => 'Deleted',
        };
    }

    public function color(): string
    {
        return match($this) {
            self::NEW => 'blue',
            self::ACQUIRED => 'purple',
            self::IN_PROGRESS => 'yellow',
            self::PENDING => 'orange',
            self::RESOLVED => 'green',
            self::CANCELLED => 'red',
            self::CLOSED => 'gray',
            self::DELETED => 'black',
        };
    }

    public function canTransitionTo(TicketStatus $status): bool
    {
        return match($this) {
            self::NEW => in_array($status, [self::ACQUIRED, self::DELETED]),
            self::ACQUIRED => in_array($status, [self::IN_PROGRESS, self::CANCELLED, self::CLOSED, self::DELETED]),
            self::IN_PROGRESS => in_array($status, [self::PENDING, self::RESOLVED, self::CANCELLED, self::CLOSED, self::DELETED]),
            self::PENDING => in_array($status, [self::IN_PROGRESS, self::CANCELLED, self::CLOSED]),
            self::RESOLVED => false, // Resolved tickets cannot change status
            self::CANCELLED => false, // Cancelled tickets cannot change status
            self::CLOSED => false, // Closed tickets cannot change status
            self::DELETED => false, // Deleted tickets cannot change status
        };
    }

    public static function activeStates(): array
    {
        return [
            self::NEW,
            self::ACQUIRED,
            self::IN_PROGRESS,
            self::PENDING,
        ];
    }

    public static function completedStates(): array
    {
        return [
            self::RESOLVED,
            self::CANCELLED,
            self::CLOSED,
            self::DELETED,
        ];
    }

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
