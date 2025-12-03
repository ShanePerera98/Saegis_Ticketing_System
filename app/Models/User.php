<?php

namespace App\Models;

use App\Enums\UserRole;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;
use Laravel\Sanctum\HasApiTokens;
// use Spatie\Activitylog\Traits\LogsActivity;
// use Spatie\Activitylog\LogOptions;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, TwoFactorAuthenticatable; //, LogsActivity;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'is_active',
        'profile_image',
        'phone',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'role' => UserRole::class,
            'is_active' => 'boolean',
        ];
    }

    /*
    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['name', 'email', 'role', 'is_active'])
            ->logOnlyDirty();
    }
    */

    // Relationships
    public function createdTickets()
    {
        return $this->hasMany(Ticket::class, 'created_by');
    }

    public function clientTickets()
    {
        return $this->hasMany(Ticket::class, 'client_id');
    }

    public function assignedTickets()
    {
        return $this->hasMany(Ticket::class, 'current_assignee_id');
    }

    public function ticketAssignments()
    {
        return $this->hasMany(TicketAssignment::class, 'assigned_to');
    }

    public function ticketCollaborations()
    {
        return $this->hasMany(TicketCollaborator::class, 'user_id');
    }

    public function comments()
    {
        return $this->hasMany(TicketComment::class);
    }

    public function createdTemplates()
    {
        return $this->hasMany(TicketTemplate::class, 'created_by');
    }

    // Helper methods
    public function isAdmin(): bool
    {
        return $this->role->isAdmin();
    }

    public function isSuperAdmin(): bool
    {
        return $this->role->isSuperAdmin();
    }

    public function isClient(): bool
    {
        return $this->role->isClient();
    }

    public function isSupport(): bool
    {
        return $this->isAdmin() || $this->isSuperAdmin();
    }

    public function canManageUsers(): bool
    {
        return $this->role === UserRole::SUPER_ADMIN;
    }

    public function canCreateAdmins(): bool
    {
        return in_array($this->role, [UserRole::SUPER_ADMIN, UserRole::ADMIN]);
    }

    public function canAssignToOthers(): bool
    {
        return $this->role === UserRole::SUPER_ADMIN;
    }

    public function canApproveDeletion(): bool
    {
        return in_array($this->role, [UserRole::SUPER_ADMIN, UserRole::ADMIN]);
    }

    public function canRestoreTickets(): bool
    {
        return $this->role === UserRole::SUPER_ADMIN;
    }
}
