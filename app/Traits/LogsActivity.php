<?php

namespace App\Traits;

use App\Services\ActivityLogger;
use Exception;

trait LogsActivity
{
    public static function bootLogsActivity()
    {
        static::created(function ($model) {
            try {
                ActivityLogger::log(
                    strtolower(class_basename($model)) . '.created',
                    $model
                );
            } catch (Exception $e) {
                // Log the error but don't stop execution
                \Log::error('ActivityLogger error: ' . $e->getMessage());
            }
        });

        static::updated(function ($model) {
            if ($model->wasChanged()) {
                try {
                    ActivityLogger::log(
                        strtolower(class_basename($model)) . '.updated',
                        $model,
                        ['changes' => $model->getChanges()]
                    );
                } catch (Exception $e) {
                    // Log the error but don't stop execution
                    \Log::error('ActivityLogger error: ' . $e->getMessage());
                }
            }
        });

        static::deleted(function ($model) {
            try {
                ActivityLogger::log(
                    strtolower(class_basename($model)) . '.deleted',
                    $model
                );
            } catch (Exception $e) {
                // Log the error but don't stop execution
                \Log::error('ActivityLogger error: ' . $e->getMessage());
            }
        });
    }

    public function activities()
    {
        return $this->morphMany(\App\Models\ActivityLog::class, 'entity', 'entity_type', 'entity_id');
    }
}
