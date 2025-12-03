<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TicketTemplateField extends Model
{
    use HasFactory;

    protected $fillable = [
        'template_id',
        'key',
        'label',
        'type',
        'required',
        'options',
        'validation',
        'order_index',
        'name',           // for compatibility
        'is_required',    // for compatibility
        'validation_rules', // for compatibility
        'order',          // for compatibility
    ];

    protected $casts = [
        'required' => 'boolean',
        'is_required' => 'boolean',
        'options' => 'array',
        'validation' => 'array',
        'order_index' => 'integer',
        'order' => 'integer',
    ];

    public function template(): BelongsTo
    {
        return $this->belongsTo(TicketTemplate::class);
    }

    public function fieldValues(): HasMany
    {
        return $this->hasMany(TicketFieldValue::class, 'field_id');
    }

    // Compatibility accessors for different naming conventions
    public function getIsRequiredAttribute()
    {
        return $this->required;
    }

    public function getValidationRulesAttribute()
    {
        return is_array($this->validation) ? implode('|', $this->validation) : $this->validation;
    }

    public function getNameAttribute()
    {
        return $this->key;
    }

    public function getOrderAttribute()
    {
        return $this->order_index;
    }
}
