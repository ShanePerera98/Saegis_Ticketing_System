<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Enums\UserRole;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        
        // Only admins and super admins can access user management
        if (!in_array($user->role->value, ['ADMIN', 'SUPER_ADMIN'])) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $query = User::query();

        // Filter by role if specified
        if ($request->has('role') && $request->role !== 'all') {
            $query->where('role', $request->role);
        }

        // Apply role-based access control
        if ($user->role->value === 'ADMIN') {
            // Admins can only see admins and clients, not super admins
            $query->whereIn('role', ['ADMIN', 'CLIENT']);
        }
        // Super admins can see all users (no additional filtering needed)

        $users = $query->orderBy('created_at', 'desc')
                      ->get()
                      ->map(function ($user) {
                          return [
                              'id' => $user->id,
                              'name' => $user->name,
                              'email' => $user->email,
                              'role' => $user->role->value,
                              'is_active' => $user->is_active,
                              'created_at' => $user->created_at,
                              'updated_at' => $user->updated_at,
                          ];
                      });

        return response()->json([
            'success' => true,
            'data' => $users
        ]);
    }

    public function show(Request $request, $id)
    {
        $user = $request->user();
        $targetUser = User::findOrFail($id);

        // Check permissions
        if (!$this->canViewUser($user, $targetUser)) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $targetUser->id,
                'name' => $targetUser->name,
                'email' => $targetUser->email,
                'role' => $targetUser->role->value,
                'is_active' => $targetUser->is_active,
                'created_at' => $targetUser->created_at,
                'updated_at' => $targetUser->updated_at,
            ]
        ]);
    }

    public function store(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:4',
            'role' => ['required', Rule::in(['CLIENT', 'ADMIN', 'SUPER_ADMIN'])],
            'is_active' => 'boolean',
        ]);

        // Check if user can create this role
        if (!$this->canCreateRole($user, $request->role)) {
            return response()->json(['message' => 'You cannot create users with this role'], 403);
        }

        $newUser = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => UserRole::from($request->role),
            'is_active' => $request->is_active ?? true,
        ]);

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $newUser->id,
                'name' => $newUser->name,
                'email' => $newUser->email,
                'role' => $newUser->role->value,
                'is_active' => $newUser->is_active,
                'created_at' => $newUser->created_at,
                'updated_at' => $newUser->updated_at,
            ],
            'message' => 'User created successfully'
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $user = $request->user();
        $targetUser = User::findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($id)],
            'password' => 'nullable|string|min:4',
            'role' => ['required', Rule::in(['CLIENT', 'ADMIN', 'SUPER_ADMIN'])],
            'is_active' => 'boolean',
        ]);

        // Check if user can update this user
        if (!$this->canUpdateUser($user, $targetUser)) {
            return response()->json(['message' => 'You cannot update this user'], 403);
        }

        // Check if user can assign this role
        if (!$this->canCreateRole($user, $request->role)) {
            return response()->json(['message' => 'You cannot assign this role'], 403);
        }

        $updateData = [
            'name' => $request->name,
            'email' => $request->email,
            'role' => UserRole::from($request->role),
            'is_active' => $request->is_active ?? $targetUser->is_active,
        ];

        // Only update password if provided
        if ($request->filled('password')) {
            $updateData['password'] = Hash::make($request->password);
        }

        $targetUser->update($updateData);

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $targetUser->id,
                'name' => $targetUser->name,
                'email' => $targetUser->email,
                'role' => $targetUser->role->value,
                'is_active' => $targetUser->is_active,
                'created_at' => $targetUser->created_at,
                'updated_at' => $targetUser->updated_at,
            ],
            'message' => 'User updated successfully'
        ]);
    }

    public function destroy(Request $request, $id)
    {
        $user = $request->user();
        $targetUser = User::findOrFail($id);

        // Prevent self-deletion
        if ($user->id === $targetUser->id) {
            return response()->json(['message' => 'You cannot delete yourself'], 403);
        }

        // Check if user can delete this user
        if (!$this->canDeleteUser($user, $targetUser)) {
            return response()->json(['message' => 'You cannot delete this user'], 403);
        }

        $targetUser->delete();

        return response()->json([
            'success' => true,
            'message' => 'User deleted successfully'
        ]);
    }

    public function updateStatus(Request $request, $id)
    {
        $user = $request->user();
        $targetUser = User::findOrFail($id);

        $request->validate([
            'is_active' => 'required|boolean',
        ]);

        // Check if user can update this user
        if (!$this->canUpdateUser($user, $targetUser)) {
            return response()->json(['message' => 'You cannot update this user'], 403);
        }

        $targetUser->update(['is_active' => $request->is_active]);

        return response()->json([
            'success' => true,
            'message' => 'User status updated successfully'
        ]);
    }

    private function canViewUser($user, $targetUser)
    {
        if ($user->role->value === 'SUPER_ADMIN') {
            return true; // Super admin can view all users
        }

        if ($user->role->value === 'ADMIN') {
            // Admin can view admin and client users, but not super admins
            return in_array($targetUser->role->value, ['ADMIN', 'CLIENT']);
        }

        return false;
    }

    private function canCreateRole($user, $role)
    {
        if ($user->role->value === 'SUPER_ADMIN') {
            return true; // Super admin can create any role
        }

        if ($user->role->value === 'ADMIN') {
            // Admin can create admin and client roles, but not super admin
            return in_array($role, ['ADMIN', 'CLIENT']);
        }

        return false;
    }

    private function canUpdateUser($user, $targetUser)
    {
        if ($user->role->value === 'SUPER_ADMIN') {
            return true; // Super admin can update all users
        }

        if ($user->role->value === 'ADMIN') {
            // Admin can only update client users, not other admins or super admins
            return $targetUser->role->value === 'CLIENT';
        }

        return false;
    }

    private function canDeleteUser($user, $targetUser)
    {
        if ($user->role->value === 'SUPER_ADMIN') {
            return true; // Super admin can delete all users (except self, handled elsewhere)
        }

        if ($user->role->value === 'ADMIN') {
            // Admin can only delete client users
            return $targetUser->role->value === 'CLIENT';
        }

        return false;
    }
}
