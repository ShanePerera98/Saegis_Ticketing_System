import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import CommonHeader from '../components/CommonHeader';
import HamburgerMenu from '../components/HamburgerMenu';
import Sidebar from '../components/Sidebar';
import Toast from '../components/Toast';
import { profileApi } from '../services/api';

const ProfileManagement = () => {
  const { user, updateUser } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const [loading, setLoading] = useState(false);

  // Profile form state
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: ''
  });

  // Password form state
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    new_password_confirmation: ''
  });

  // Profile image state
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || ''
      });
      setImagePreview(user.profile_image);
    }
  }, [user]);

  const showToastMessage = (message, type = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
  };

  const hideToast = () => {
    setShowToast(false);
    setToastMessage('');
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await profileApi.update(profileData);
      // Update user context
      updateUser(response.data.data);
      showToastMessage('Profile updated successfully', 'success');
    } catch (error) {
      console.error('Error updating profile:', error);
      showToastMessage(error.response?.data?.message || 'Failed to update profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (passwordData.new_password !== passwordData.new_password_confirmation) {
      showToastMessage('New passwords do not match', 'error');
      setLoading(false);
      return;
    }

    try {
      await profileApi.updatePassword(passwordData);
      showToastMessage('Password updated successfully', 'success');
      setPasswordData({
        current_password: '',
        new_password: '',
        new_password_confirmation: ''
      });
    } catch (error) {
      console.error('Error updating password:', error);
      showToastMessage(error.response?.data?.message || 'Failed to update password', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async () => {
    if (!profileImage) {
      showToastMessage('Please select an image first', 'error');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('profile_image', profileImage);

    try {
      const response = await profileApi.updateImage(formData);
      setImagePreview(response.data.data.profile_image);
      showToastMessage('Profile image updated successfully', 'success');
      // Update user context with new image
      const updatedUser = { ...user, profile_image: response.data.data.profile_image };
      updateUser(updatedUser);
    } catch (error) {
      console.error('Error uploading image:', error);
      showToastMessage(error.response?.data?.message || 'Failed to upload image', 'error');
    } finally {
      setLoading(false);
      setProfileImage(null);
    }
  };

  const handleImageDelete = async () => {
    setLoading(true);

    try {
      await profileApi.deleteImage();
      setImagePreview(null);
      showToastMessage('Profile image deleted successfully', 'success');
      // Update user context
      const updatedUser = { ...user, profile_image: null };
      updateUser(updatedUser);
    } catch (error) {
      console.error('Error deleting image:', error);
      showToastMessage(error.response?.data?.message || 'Failed to delete image', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePasswordResetEmail = async () => {
    setLoading(true);

    try {
      await profileApi.sendPasswordResetEmail();
      showToastMessage('Password reset email sent successfully', 'success');
    } catch (error) {
      console.error('Error sending reset email:', error);
      showToastMessage(error.response?.data?.message || 'Failed to send reset email', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
      {/* Common Header */}
      <CommonHeader 
        onMenuToggle={() => setIsMenuOpen(!isMenuOpen)}
        isMenuOpen={isMenuOpen}
      />
      
      {/* Hamburger Menu */}
      <HamburgerMenu 
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
      />

      <div className="flex">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Profile Management
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage your profile information, security settings, and profile picture
              </p>
            </div>
            
            {/* Tab Navigation */}
            <div className="border-b border-gray-200 mb-6">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'profile'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Profile Information
                </button>
                <button
                  onClick={() => setActiveTab('security')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'security'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Security Settings
                </button>
                <button
                  onClick={() => setActiveTab('image')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'image'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Profile Picture
                </button>
              </nav>
            </div>

            {/* Profile Information Tab */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Profile Information</h2>
                <form onSubmit={handleProfileSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={profileData.name}
                      onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your phone number"
                    />
                  </div>
                  
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium transition-colors duration-200 disabled:opacity-50"
                    >
                      {loading ? 'Updating...' : 'Update Profile'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Security Settings Tab */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                {/* Change Password */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Change Password</h2>
                  <form onSubmit={handlePasswordSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="current_password" className="block text-sm font-medium text-gray-700 mb-1">
                        Current Password
                      </label>
                      <input
                        type="password"
                        id="current_password"
                        value={passwordData.current_password}
                        onChange={(e) => setPasswordData({...passwordData, current_password: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="new_password" className="block text-sm font-medium text-gray-700 mb-1">
                        New Password
                      </label>
                      <input
                        type="password"
                        id="new_password"
                        value={passwordData.new_password}
                        onChange={(e) => setPasswordData({...passwordData, new_password: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        minLength="8"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="new_password_confirmation" className="block text-sm font-medium text-gray-700 mb-1">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        id="new_password_confirmation"
                        value={passwordData.new_password_confirmation}
                        onChange={(e) => setPasswordData({...passwordData, new_password_confirmation: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        minLength="8"
                        required
                      />
                    </div>
                    
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium transition-colors duration-200 disabled:opacity-50"
                      >
                        {loading ? 'Updating...' : 'Change Password'}
                      </button>
                    </div>
                  </form>
                </div>

                {/* Password Reset via Email */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Password Reset via Email</h2>
                  <p className="text-gray-600 mb-4">
                    Send a password reset link to your email address: <strong>{user?.email}</strong>
                  </p>
                  <button
                    onClick={handlePasswordResetEmail}
                    disabled={loading}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-md font-medium transition-colors duration-200 disabled:opacity-50"
                  >
                    {loading ? 'Sending...' : 'Send Reset Email'}
                  </button>
                </div>
              </div>
            )}

            {/* Profile Picture Tab */}
            {activeTab === 'image' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Profile Picture</h2>
                
                <div className="flex flex-col items-center space-y-4">
                  {/* Current/Preview Image */}
                  <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <svg className="w-16 h-16 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>

                  {/* Upload Section */}
                  <div className="w-full max-w-md">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Maximum file size: 2MB. Supported formats: JPEG, PNG, JPG, GIF
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-3">
                    <button
                      onClick={handleImageUpload}
                      disabled={!profileImage || loading}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium transition-colors duration-200 disabled:opacity-50"
                    >
                      {loading ? 'Uploading...' : 'Upload Image'}
                    </button>
                    
                    {imagePreview && (
                      <button
                        onClick={handleImageDelete}
                        disabled={loading}
                        className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md font-medium transition-colors duration-200 disabled:opacity-50"
                      >
                        {loading ? 'Deleting...' : 'Delete Image'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Toast Notifications */}
      {showToast && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
};

export default ProfileManagement;
