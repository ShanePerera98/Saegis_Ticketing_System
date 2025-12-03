import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ticketApi } from '../services/api';
import CommonHeader from '../components/CommonHeader';
import HamburgerMenu from '../components/HamburgerMenu';
import Sidebar from '../components/Sidebar';
import ContentWrapper from '../components/ContentWrapper';
import Toast from '../components/Toast';

const ClientTickets = () => {
  const { user } = useAuth();
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
    description: '',
    attachment: null
  });

  const showToastMessage = (message, type = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
  };

  const hideToast = () => {
    setShowToast(false);
    setToastMessage('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData(prev => ({
      ...prev,
      attachment: file
    }));
  };

  const handleAttachClick = () => {
    document.getElementById('attachment').click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.issueType || !formData.description) {
      showToastMessage('Please fill in all required fields', 'error');
      return;
    }

    try {
      const ticketData = new FormData();
      ticketData.append('issue_type', formData.issueType);
      ticketData.append('priority', formData.priority);
      ticketData.append('affected_users', formData.affectedUsers);
      ticketData.append('location', `${formData.floor} ${formData.hall}`.trim());
      ticketData.append('title', formData.issueType); // Use issue type as title for now
      ticketData.append('description', formData.description);
      
      if (formData.attachment) {
        ticketData.append('attachment', formData.attachment);
      }

      await ticketApi.createTicket(ticketData);
      
      // Reset form
      setFormData({
        issueType: '',
        priority: '',
        affectedUsers: '',
        floor: '',
        hall: '',
        description: '',
        attachment: null
      });
      
      // Reset file input
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) {
        fileInput.value = '';
      }
      
      showToastMessage('Ticket created successfully!', 'success');
    } catch (error) {
      console.error('Error creating ticket:', error);
      showToastMessage('Failed to create ticket. Please try again.', 'error');
    }
  };

  return (
    <>
      <CommonHeader 
        user={user}
        onMenuToggle={() => setIsMenuOpen(!isMenuOpen)}
      />
      
      <HamburgerMenu 
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        user={user}
      />
      
      <Sidebar />
      
      <ContentWrapper>
        <div className="p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">My Tickets</h1>
            
            {/* Create New Ticket Form */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Issue Type */}
                <div>
                  <input
                    type="text"
                    name="issueType"
                    value={formData.issueType}
                    onChange={handleInputChange}
                    placeholder="Select Issue Type"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                {/* Priority */}
                <div>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                  >
                    <option value="">Priority</option>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>

                {/* Affected Users */}
                <div>
                  <input
                    type="text"
                    name="affectedUsers"
                    value={formData.affectedUsers || ''}
                    onChange={handleInputChange}
                    placeholder="Affected Users"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Location</label>
                  <div className="grid grid-cols-2 gap-4">
                    <select
                      name="floor"
                      value={formData.floor || ''}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                    >
                      <option value="">Floor</option>
                      <option value="Ground Floor">Ground Floor</option>
                      <option value="1st Floor">1st Floor</option>
                      <option value="2nd Floor">2nd Floor</option>
                      <option value="3rd Floor">3rd Floor</option>
                      <option value="4th Floor">4th Floor</option>
                      <option value="5th Floor">5th Floor</option>
                    </select>
                    
                    <select
                      name="hall"
                      value={formData.hall || ''}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                    >
                      <option value="">Hall</option>
                      <option value="Hall A">Hall A</option>
                      <option value="Hall B">Hall B</option>
                      <option value="Hall C">Hall C</option>
                      <option value="Hall D">Hall D</option>
                      <option value="Conference Room">Conference Room</option>
                      <option value="Meeting Room 1">Meeting Room 1</option>
                      <option value="Meeting Room 2">Meeting Room 2</option>
                    </select>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Description :</label>
                  <div className="mb-3">
                    <div className="flex space-x-2">
                      <button
                        type="button"
                        onClick={handleAttachClick}
                        className="flex items-center px-3 py-2 text-sm border border-gray-300 rounded-md bg-white hover:bg-gray-50 text-gray-700"
                      >
                        📎 Attach Image
                      </button>
                      <button
                        type="button"
                        onClick={handleAttachClick}
                        className="flex items-center px-3 py-2 text-sm border border-gray-300 rounded-md bg-white hover:bg-gray-50 text-gray-700"
                      >
                        📁 Attach File
                      </button>
                    </div>
                  </div>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="6"
                    placeholder="Please describe the issue in detail..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    required
                  ></textarea>
                </div>

                {/* Hidden file input */}
                <input
                  type="file"
                  id="attachment"
                  name="attachment"
                  onChange={handleFileChange}
                  accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.txt"
                  className="hidden"
                />

                {/* Submit Button */}
                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors duration-200"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </ContentWrapper>

      {/* Toast Notification */}
      <Toast
        message={toastMessage}
        type={toastType}
        isVisible={showToast}
        onClose={hideToast}
        duration={4000}
      />
    </>
  );
};

export default ClientTickets;
