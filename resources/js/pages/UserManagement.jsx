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

// Password Reset Modal Component
const PasswordResetModal = ({ user, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    new_password: '',
    new_password_confirmation: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.new_password) {
      newErrors.new_password = 'New password is required';
    } else if (formData.new_password.length < 4) {
      newErrors.new_password = 'Password must be at least 4 characters';
    }
    
    if (!formData.new_password_confirmation) {
      newErrors.new_password_confirmation = 'Please confirm the password';
    } else if (formData.new_password !== formData.new_password_confirmation) {
      newErrors.new_password_confirmation = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 blur-overlay flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Reset Password for {user.name}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Enter a new password for this user. They will be able to use this password immediately.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* New Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              New Password
            </label>
            <input
              type="password"
              name="new_password"
              value={formData.new_password}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 ${
                errors.new_password ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
              placeholder="Enter new password"
            />
            {errors.new_password && (
              <p className="text-red-500 text-sm mt-1">{errors.new_password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              name="new_password_confirmation"
              value={formData.new_password_confirmation}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 ${
                errors.new_password_confirmation ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
              placeholder="Confirm new password"
            />
            {errors.new_password_confirmation && (
              <p className="text-red-500 text-sm mt-1">{errors.new_password_confirmation}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-md font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {isSubmitting && (
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              Reset Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const UserManagement = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const [showPasswordResetModal, setShowPasswordResetModal] = useState(false);
  const [resetPasswordUser, setResetPasswordUser] = useState(null);

  // Fetch users based on role filter
  const { data: allUsers = [], isLoading, error, refetch } = useQuery({
    queryKey: ['users', selectedRole],
    queryFn: () => userApi.list({ role: selectedRole === 'all' ? undefined : selectedRole }),
    select: (data) => data.data.data || data.data || [],
  });

  // Filter users based on search term (enhanced search)
  const users = allUsers.filter(user => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      user.name.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower) ||
      (user.id && user.id.toString().includes(searchLower)) ||
      (user.phone && user.phone.toLowerCase().includes(searchLower)) ||
      user.role.toLowerCase().includes(searchLower)
    );
  });

  // Get filtered user count for display
  const filteredCount = users.length;
  const totalCount = allUsers.length;

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

  const handleSendPasswordReset = async (userId) => {
    if (window.confirm('Are you sure you want to send a password reset email to this user?')) {
      try {
        await userApi.sendPasswordReset(userId);
        showToastMessage('Password reset email sent successfully', 'success');
      } catch (error) {
        showToastMessage(error.response?.data?.message || 'Failed to send password reset email', 'error');
      }
    }
  };

  const handleResetPassword = (user) => {
    setResetPasswordUser(user);
    setShowPasswordResetModal(true);
  };

  const handlePasswordResetSubmit = async (passwordData) => {
    try {
      await userApi.resetPassword(resetPasswordUser.id, passwordData);
      showToastMessage('Password reset successfully', 'success');
      setShowPasswordResetModal(false);
      setResetPasswordUser(null);
    } catch (error) {
      showToastMessage(error.response?.data?.message || 'Failed to reset password', 'error');
    }
  };

  const handlePasswordResetCancel = () => {
    setShowPasswordResetModal(false);
    setResetPasswordUser(null);
  };

  // Define permissions based on user role
  const getPermissions = () => {
    if (!user) return {};
    
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

  // Show loading if user is not available
  if (!user || isLoading) {
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
                {/* Filter Controls */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-1">
                  {/* Role Filter */}
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Filter by Role:
                    </label>
                    <select
                      value={selectedRole}
                      onChange={(e) => setSelectedRole(e.target.value)}
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">All Roles</option>
                      {user.role === 'SUPER_ADMIN' && <option value="SUPER_ADMIN">Super Admin</option>}
                      <option value="ADMIN">Admin</option>
                      <option value="CLIENT">Client</option>
                    </select>
                  </div>
                  
                  {/* Search User */}
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Search User:
                    </label>
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Type User ID, Name, Email, Phone or Role"
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 min-w-[300px]"
                    />
                  </div>
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

            {/* User Form (when adding/editing) */}
            {showForm && (
              <div className="mb-6">
                <UserForm
                  user={editingUser}
                  onSubmit={handleFormSubmit}
                  onCancel={handleFormCancel}
                  permissions={permissions}
                />
              </div>
            )}

            {/* User List (always visible with filtering) */}
            <UserList
              users={users}
              permissions={permissions}
              onEdit={handleEditUser}
              onDelete={handleDeleteUser}
              onSendPasswordReset={handleSendPasswordReset}
              onResetPassword={handleResetPassword}
            />

            {/* Password Reset Modal */}
            {showPasswordResetModal && resetPasswordUser && (
              <PasswordResetModal
                user={resetPasswordUser}
                onSubmit={handlePasswordResetSubmit}
                onCancel={handlePasswordResetCancel}
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
