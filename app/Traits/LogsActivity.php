<?php

namespace App\Traits;

use App\Services\ActivityLogger;

trait LogsActivity
{
    public static function bootLogsActivity()
    {
        static::created(function ($model) {
            ActivityLogger::log(
                strtolower(class_basename($model)) . '.created',
                $model
            );
        });

        static::updated(function ($model) {
            if ($model->wasChanged()) {
                ActivityLogger::log(
                    strtolower(class_basename($model)) . '.updated',
                    $model,
                    null,
                    $model->getChanges()
                );
            }
        });

        static::deleted(function ($model) {
            ActivityLogger::log(
                strtolower(class_basename($model)) . '.deleted',
                $model
            );
        });
    }

    public function activities()
    {
        return $this->morphMany(\App\Models\ActivityLog::class, 'entity', 'entity_type', 'entity_id');
    }
}
