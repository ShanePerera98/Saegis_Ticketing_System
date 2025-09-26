<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->where('is_active', true)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        $token = $user->createToken('api-token')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role->value,
            ],
            'abilities' => $this->getUserAbilities($user),
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logged out successfully']);
    }

    public function me(Request $request)
    {
        $user = $request->user();

        return response()->json([
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role->value,
                'is_active' => $user->is_active,
            ],
            'abilities' => $this->getUserAbilities($user),
        ]);
    }

    private function getUserAbilities(User $user): array
    {
        $abilities = [];

        // Basic abilities based on role
        if ($user->isSuperAdmin()) {
            $abilities = [
                'manage_users',
                'create_admins',
                'update_users',
                'delete_users',
                'assign_to_others',
                'restore_tickets',
                'approve_deletions',
                'manage_templates',
                'view_all_tickets',
                'manage_categories',
                'view_reports',
                'export_reports',
            ];
        } elseif ($user->role->value === 'ADMIN') {
            $abilities = [
                'create_admins',
                'create_clients',
                'self_assign',
                'add_collaborators',
                'cancel_tickets',
                'approve_deletions',
                'manage_templates',
                'view_assigned_tickets',
                'manage_categories',
                'view_reports',
            ];
        } else { // CLIENT
            $abilities = [
                'create_tickets',
                'view_own_tickets',
                'comment_on_tickets',
                'delete_own_tickets',
            ];
        }

        return $abilities;
    }
}
