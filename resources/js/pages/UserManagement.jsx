import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import CommonHeader from '../components/CommonHeader';
import HamburgerMenu from '../components/HamburgerMenu';
import Sidebar from '../components/Sidebar';
import Toast from '../components/Toast';
import UserForm from '../components/UserForm';
import UserList from '../components/UserList';
import { userApi } from '../services/api';

const UserManagement = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState('all');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  // Fetch users based on role filter
  const { data: users = [], isLoading, error, refetch } = useQuery({
    queryKey: ['users', selectedRole],
    queryFn: () => userApi.list({ role: selectedRole === 'all' ? undefined : selectedRole }),
    select: (data) => data.data.data || data.data || [],
  });

  const showToastMessage = (message, type = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
  };

  const hideToast = () => {
    setShowToast(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleAddUser = () => {
    setEditingUser(null);
    setShowForm(true);
  };

  const handleEditUser = (userToEdit) => {
    setEditingUser(userToEdit);
    setShowForm(true);
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await userApi.delete(userId);
        showToastMessage('User deleted successfully', 'success');
        refetch();
      } catch (error) {
        showToastMessage(error.response?.data?.message || 'Failed to delete user', 'error');
      }
    }
  };

  const handleFormSubmit = async (userData) => {
    try {
      if (editingUser) {
        await userApi.update(editingUser.id, userData);
        showToastMessage('User updated successfully', 'success');
      } else {
        await userApi.create(userData);
        showToastMessage('User created successfully', 'success');
      }
      setShowForm(false);
      setEditingUser(null);
      refetch();
    } catch (error) {
      showToastMessage(error.response?.data?.message || 'Failed to save user', 'error');
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingUser(null);
  };

  // Define permissions based on user role
  const getPermissions = () => {
    if (user.role === 'SUPER_ADMIN') {
      return {
        canAddSuperAdmin: true,
        canEditSuperAdmin: true,
        canDeleteSuperAdmin: true,
        canAddAdmin: true,
        canEditAdmin: true,
        canDeleteAdmin: true,
        canAddClient: true,
        canEditClient: true,
        canDeleteClient: true,
      };
    } else if (user.role === 'ADMIN') {
      return {
        canAddSuperAdmin: false,
        canEditSuperAdmin: false,
        canDeleteSuperAdmin: false,
        canAddAdmin: true,
        canEditAdmin: false,
        canDeleteAdmin: false,
        canAddClient: true,
        canEditClient: true,
        canDeleteClient: true,
      };
    }
    return {};
  };

  const permissions = getPermissions();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
      {/* Common Header */}
      <CommonHeader onMenuToggle={toggleMenu} isMenuOpen={isMenuOpen} />
      
      {/* Hamburger Menu */}
      <HamburgerMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      <div className="flex">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                User Management
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage system users and their access levels
              </p>
            </div>

            {/* Controls */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6 transition-colors">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                {/* Role Filter */}
                <div className="flex items-center gap-4">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Filter by Role:
                  </label>
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Roles</option>
                    <option value="SUPER_ADMIN">Super Admin</option>
                    <option value="ADMIN">Admin</option>
                    <option value="CLIENT">Client</option>
                  </select>
                </div>

                {/* Add User Button */}
                <button
                  onClick={handleAddUser}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add User
                </button>
              </div>
            </div>

            {/* User List */}
            {showForm ? (
              <UserForm
                user={editingUser}
                onSubmit={handleFormSubmit}
                onCancel={handleFormCancel}
                permissions={permissions}
              />
            ) : (
              <UserList
                users={users}
                permissions={permissions}
                onEdit={handleEditUser}
                onDelete={handleDeleteUser}
              />
            )}
          </div>
        </div>
      </div>

      {/* Toast Notifications */}
      {showToast && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={hideToast}
        />
      )}
    </div>
  );
};

export default UserManagement;
