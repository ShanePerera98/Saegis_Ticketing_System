import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ticketApi } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import CommonHeader from '../components/CommonHeader';
import HamburgerMenu from '../components/HamburgerMenu';
import Sidebar from '../components/Sidebar';
import Toast from '../components/Toast';

const ClientTickets = () => {
  const { user } = useAuth();
  const [selectedStatus, setSelectedStatus] = useState('New');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const [formData, setFormData] = useState({
    issueType: '',
    priority: '',
    affectedUsers: '',
    floor: '',
    hall: '',
    description: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const showToastMessage = (message, type = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
  };

  const hideToast = () => {
    setShowToast(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Convert form data to API format
      const ticketData = {
        title: `${formData.issueType}${formData.floor || formData.hall ? ` - ${formData.floor}/${formData.hall}` : ''}`,
        description: formData.description,
        priority: formData.priority.toUpperCase(),
        location: formData.floor || formData.hall ? `${formData.floor}/${formData.hall}` : null,
        // Add other fields as needed
      };
      
      console.log('Sending ticket data:', ticketData);
      await ticketApi.create(ticketData);
      // Reset form
      setFormData({
        issueType: '',
        priority: '',
        affectedUsers: '',
        floor: '',
        hall: '',
        description: ''
      });
      showToastMessage('Ticket created successfully!', 'success');
    } catch (error) {
      console.error('Failed to create ticket:', error);
      if (error.response && error.response.data) {
        console.error('Validation errors:', error.response.data);
        const errorMessages = error.response.data.errors 
          ? Object.values(error.response.data.errors).flat().join(', ')
          : error.response.data.message || 'Unknown error';
        showToastMessage(`Failed to create ticket: ${errorMessages}`, 'error');
      } else {
        showToastMessage('Failed to create ticket. Please try again.', 'error');
      }
    }
  };

  const handleStatusChange = (status) => {
    setSelectedStatus(status);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Mock ticket counts for sidebar
  const ticketCounts = {
    'New': 5,
    'In Progress': 3,
    'Pending': 1,
    'Resolved': 12,
    'Canceled': 0,
    'Closed': 2,
    'Deleted': 0
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
      {/* Common Header */}
      <CommonHeader onMenuToggle={toggleMenu} isMenuOpen={isMenuOpen} />
      
      {/* Hamburger Menu */}
      <HamburgerMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      <div className="flex">
        {/* Sidebar */}
        <Sidebar 
          selectedStatus={selectedStatus}
          onStatusChange={handleStatusChange}
          ticketCounts={ticketCounts}
        />

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="max-w-4xl">
            {/* Create Ticket Header */}
            <div className="bg-blue-500 dark:bg-blue-600 text-white text-center py-4 rounded-lg mb-6 transition-colors">
              <h2 className="text-xl font-semibold flex items-center justify-center">
                Create Ticket
                <span className="ml-2 w-6 h-6 bg-white text-blue-500 dark:text-blue-600 rounded-full flex items-center justify-center text-lg font-bold">
                  +
                </span>
              </h2>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Issue Type */}
              <div>
                <select
                  name="issueType"
                  value={formData.issueType}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-gray-200 dark:bg-gray-700 border-0 rounded-lg text-gray-700 dark:text-gray-200 focus:bg-white dark:focus:bg-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors"
                >
                  <option value="">Issue Type</option>
                  <option value="Technical Support">Technical Support</option>
                  <option value="Hardware Issue">Hardware Issue</option>
                  <option value="Software Issue">Software Issue</option>
                  <option value="Network Issue">Network Issue</option>
                  <option value="Account Access">Account Access</option>
                  <option value="General Inquiry">General Inquiry</option>
                </select>
              </div>

              {/* Priority */}
              <div>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-gray-200 dark:bg-gray-700 border-0 rounded-lg text-gray-700 dark:text-gray-200 focus:bg-white dark:focus:bg-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors"
                >
                  <option value="">Priority</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>

              {/* Affected Users */}
              <div>
                <select
                  name="affectedUsers"
                  value={formData.affectedUsers}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-200 dark:bg-gray-700 border-0 rounded-lg text-gray-700 dark:text-gray-200 focus:bg-white dark:focus:bg-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors"
                >
                  <option value="">Affected Users</option>
                  <option value="single">Single User</option>
                  <option value="multiple">Multiple Users</option>
                  <option value="department">Entire Department</option>
                  <option value="company">Company Wide</option>
                </select>
              </div>

              {/* Location */}
              <div>
                <div className="text-gray-700 dark:text-gray-300 font-medium mb-2 transition-colors">Location</div>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="floor"
                    value={formData.floor}
                    onChange={handleInputChange}
                    placeholder="Floor"
                    className="px-4 py-3 bg-gray-200 dark:bg-gray-700 border-0 rounded-lg text-gray-700 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 focus:bg-white dark:focus:bg-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors"
                  />
                  <input
                    type="text"
                    name="hall"
                    value={formData.hall}
                    onChange={handleInputChange}
                    placeholder="Hall"
                    className="px-4 py-3 bg-gray-200 dark:bg-gray-700 border-0 rounded-lg text-gray-700 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 focus:bg-white dark:focus:bg-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <div className="text-gray-700 dark:text-gray-300 font-medium mb-2 transition-colors">Description :</div>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows="6"
                  className="w-full px-4 py-3 bg-gray-200 dark:bg-gray-700 border-0 rounded-lg text-gray-700 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 focus:bg-white dark:focus:bg-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none transition-colors"
                  placeholder="Please describe the issue in detail..."
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-8 py-3 bg-blue-500 dark:bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>

      {/* Question Mark Help Icon */}
      <div className="fixed bottom-6 right-6">
        <div className="w-12 h-12 bg-gray-800 dark:bg-gray-700 text-white rounded-full flex items-center justify-center text-xl font-bold cursor-pointer hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors">
          ?
        </div>
      </div>

      {/* Toast Notification */}
      <Toast
        message={toastMessage}
        type={toastType}
        isVisible={showToast}
        onClose={hideToast}
        duration={4000}
      />
    </div>
  );
};

export default ClientTickets;
