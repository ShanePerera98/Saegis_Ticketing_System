<?php

namespace Database\Seeders;

use App\Models\User;
use App\Enums\UserRole;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Create basic users for testing (only if they don't exist)
        $superAdmin = User::firstOrCreate(
            ['email' => 'super@admin.com'],
            [
                'name' => 'Super Administrator',
                'password' => Hash::make('1234'),
                'role' => UserRole::SUPER_ADMIN,
                'is_active' => true,
            ]
        );

        $admin1 = User::firstOrCreate(
            ['email' => 'admin@admin.com'],
            [
                'name' => 'Admin User',
                'password' => Hash::make('1234'),
                'role' => UserRole::ADMIN,
                'is_active' => true,
            ]
        );

        $client1 = User::firstOrCreate(
            ['email' => 'client@example.com'],
            [
                'name' => 'Client User',
                'password' => Hash::make('1234'),
                'role' => UserRole::CLIENT,
                'is_active' => true,
            ]
        );

        // Create ticket categories (only if they don't exist)
        $categories = [
            ['name' => 'Technical Support', 'description' => 'Technical issues and support requests', 'is_active' => true],
            ['name' => 'Bug Report', 'description' => 'Software bugs and errors', 'is_active' => true],
            ['name' => 'Feature Request', 'description' => 'New feature requests', 'is_active' => true],
            ['name' => 'General Inquiry', 'description' => 'General questions and inquiries', 'is_active' => true],
        ];

        foreach ($categories as $categoryData) {
            \App\Models\TicketCategory::firstOrCreate(
                ['name' => $categoryData['name']],
                $categoryData
            );
        }

        // Create some sample tickets
        $techCategory = \App\Models\TicketCategory::where('name', 'Technical Support')->first();
        $bugCategory = \App\Models\TicketCategory::where('name', 'Bug Report')->first();

        \App\Models\Ticket::create([
            'title' => 'Login Issue - Cannot Access Dashboard',
            'description' => 'User experiencing issues logging into the system. Getting error message "Invalid credentials" even with correct password.',
            'status' => \App\Enums\TicketStatus::NEW,
            'priority' => \App\Enums\TicketPriority::HIGH,
            'category_id' => $techCategory->id,
            'client_id' => $client1->id,
            'created_by' => $client1->id,
        ]);

        \App\Models\Ticket::create([
            'title' => 'Page Loading Slowly',
            'description' => 'The reports page is taking more than 30 seconds to load. This started happening since yesterday.',
            'status' => \App\Enums\TicketStatus::IN_PROGRESS,
            'priority' => \App\Enums\TicketPriority::MEDIUM,
            'category_id' => $bugCategory->id,
            'client_id' => $client1->id,
            'created_by' => $client1->id,
            'current_assignee_id' => $admin1->id,
        ]);

        \App\Models\Ticket::create([
            'title' => 'Export Function Not Working',
            'description' => 'When trying to export data to Excel, I get a blank file. The function worked fine last week.',
            'status' => \App\Enums\TicketStatus::RESOLVED,
            'priority' => \App\Enums\TicketPriority::MEDIUM,
            'category_id' => $bugCategory->id,
            'client_id' => $client1->id,
            'created_by' => $client1->id,
            'current_assignee_id' => $admin1->id,
        ]);

        $this->command->info('Database seeded successfully!');
        $this->command->info('Basic users created:');
        $this->command->info('Super Admin: super@admin.com / password');
        $this->command->info('Admin: admin@admin.com / password');
        $this->command->info('Client: client@example.com / password');
        $this->command->info('Sample tickets and categories created.');
    }
}
