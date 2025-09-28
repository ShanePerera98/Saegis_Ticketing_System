<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ActivityLog extends Model
{
    use HasFactory;

    // The migrations in this project created a table named `activity_log` (singular).
    // Explicitly set the table name so Eloquent doesn't expect `activity_logs`.
    protected $table = 'activity_log';

    // Use the fields defined in the existing migration (`activity_log` table).
    protected $fillable = [
        'log_name',
        'description',
        'subject_type',
        'subject_id',
        'event',
        'causer_type',
        'causer_id',
        'properties',
        'batch_uuid',
    ];

    protected $casts = [
        'properties' => 'array',
    ];

    // The previous implementation assumed a different audit table schema. To be
    // compatible with the `activity_log` migration we adapt the helper method
    // to write into the available columns. We store the action in `event`, the
    // related model in the subject_* columns and the causer (actor) in the
    // causer_* columns. `properties` can hold additional payload.
    public function actor(): BelongsTo
    {
        // If a causer_id is present and refers to users, relate to User model
        return $this->belongsTo(User::class, 'causer_id');
    }

    public function entity()
    {
        return $this->morphTo('subject', 'subject_type', 'subject_id');
    }

    /**
     * Create an activity log entry compatible with the `activity_log` table.
     *
     * Parameters are kept similar to prior API for minimal changes elsewhere:
     * - $actorId may be null
     * - $action is stored in `event`
     * - $entityType and $entityId are stored in the subject columns
     * - $payload (array) is stored in `properties`
     */
    public static function log(?int $actorId, string $action, string $entityType = null, ?int $entityId = null, ?array $payload = null)
    {
        return self::create([
            'log_name' => null,
            'description' => $action,
            'subject_type' => $entityType,
            'subject_id' => $entityId,
            'event' => $action,
            'causer_type' => $actorId ? \App\Models\User::class : null,
            'causer_id' => $actorId,
            'properties' => $payload,
            'batch_uuid' => null,
        ]);
    }

    public function getEntityAttribute()
    {
        $class = $this->subject_type;
        if ($class && class_exists($class)) {
            return $class::find($this->subject_id);
        }
        return null;
    }
}
