<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ActivityLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'actor_id',
        'action',
        'entity_type',
        'entity_id',
        'payload',
        'changes',
        'ip_address',
        'user_agent',
    ];

    protected $casts = [
        'payload' => 'array',
        'changes' => 'array',
    ];

    public function actor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'actor_id');
    }

    public function entity()
    {
        return $this->morphTo();
    }

    public static function log(
        int $actorId,
        string $action,
        string $entityType,
        int $entityId,
        ?array $payload = null,
        ?array $changes = null,
        ?string $ipAddress = null,
        ?string $userAgent = null
    ): self {
        return self::create([
            'actor_id' => $actorId,
            'action' => $action,
            'entity_type' => $entityType,
            'entity_id' => $entityId,
            'payload' => $payload,
            'changes' => $changes,
            'ip_address' => $ipAddress,
            'user_agent' => $userAgent,
        ]);
    }

    public function getEntityAttribute()
    {
        $class = $this->entity_type;
        if (class_exists($class)) {
            return $class::find($this->entity_id);
        }
        return null;
    }
}
