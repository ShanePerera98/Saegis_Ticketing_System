<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class TicketTemplate extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'description',
        'category_id',
        'is_active',
        'created_by',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(TicketCategory::class, 'category_id');
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function fields(): HasMany
    {
        return $this->hasMany(TicketTemplateField::class)->orderBy('sort_order');
    }

    public function tickets(): HasMany
    {
        return $this->hasMany(Ticket::class, 'template_id');
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeForCategory($query, $categoryId)
    {
        return $query->where('category_id', $categoryId);
    }

    public function getFieldsCount(): int
    {
        return $this->fields()->count();
    }

    public function getTicketsCount(): int
    {
        return $this->tickets()->count();
    }

    public function activate(): void
    {
        $this->update(['is_active' => true]);
    }

    public function deactivate(): void
    {
        $this->update(['is_active' => false]);
    }

    public function duplicate(string $newName): self
    {
        $duplicate = $this->replicate();
        $duplicate->name = $newName;
        $duplicate->is_active = false;
        $duplicate->created_by = auth()->id();
        $duplicate->save();

        // Duplicate fields
        foreach ($this->fields as $field) {
            $duplicateField = $field->replicate();
            $duplicateField->template_id = $duplicate->id;
            $duplicateField->save();
        }

        return $duplicate;
    }

    public function toArray()
    {
        $array = parent::toArray();
        
        // Add computed attributes
        $array['fields_count'] = $this->getFieldsCount();
        $array['tickets_count'] = $this->getTicketsCount();
        
        return $array;
    }
}
