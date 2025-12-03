import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ticketApi } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import CommonHeader from '../components/CommonHeader';
import HamburgerMenu from '../components/HamburgerMenu';
import Sidebar from '../components/Sidebar';
import Toast from '../components/Toast';
import ScrollToTop from '../components/ScrollToTop';
import ContentWrapper from '../components/ContentWrapper';
import HeadsUpNotice from '../components/HeadsUpNotice';

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
  const [attachedImages, setAttachedImages] = useState([]);
  const [attachedFiles, setAttachedFiles] = useState([]);

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

  // File attachment handlers
  const handleImageAttach = (e) => {
    const files = Array.from(e.target.files);
    const validImages = files.filter(file => {
      const isImage = file.type.startsWith('image/');
      const isValidSize = file.size <= 3 * 1024 * 1024; // 3MB limit
      
      if (!isImage) {
        showToastMessage('Please select only image files', 'error');
        return false;
      }
      if (!isValidSize) {
        showToastMessage('Image size must be less than 3MB', 'error');
        return false;
      }
      return true;
    });
    
    setAttachedImages(prev => [...prev, ...validImages]);
    e.target.value = ''; // Reset input
  };

  const handleFileAttach = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(file => {
      const isValidSize = file.size <= 20 * 1024 * 1024; // 20MB limit
      
      if (!isValidSize) {
        showToastMessage('File size must be less than 20MB', 'error');
        return false;
      }
      return true;
    });
    
    setAttachedFiles(prev => [...prev, ...validFiles]);
    e.target.value = ''; // Reset input
  };

  const removeImage = (index) => {
    setAttachedImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeFile = (index) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate priority is selected
    if (!formData.priority || formData.priority.trim() === '') {
      showToastMessage('Please select a priority for your ticket.', 'error');
      return;
    }
    
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
      
      // Reset form and attachments
      setFormData({
        issueType: '',
        priority: '',
        affectedUsers: '',
        floor: '',
        hall: '',
        description: ''
      });
      setAttachedImages([]);
      setAttachedFiles([]);
      showToastMessage('Ticket created successfully!', 'success');
    } catch (error) {
      console.error('Failed to create ticket:', error);
      if (error.response && error.response.data) {
        console.error('Validation errors:', error.response.data);
        const errorMessages = error.response.data.errors 
          ? Object.values(error.response.data.errors).flat().join(', ')
          : error.response.data.message || 'Failed to create ticket';
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
    'New': 0,
    'In Progress': 0,
    'Pending': 0,
    'Resolved': 0,
    'Canceled': 0,
    'Closed': 0,
    'Deleted': 0
  };

  return (
    <>
      {/* Common Header */}
      <CommonHeader onMenuToggle={toggleMenu} isMenuOpen={isMenuOpen} />
      
      {/* Hamburger Menu */}
      <HamburgerMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      <ContentWrapper isMenuOpen={isMenuOpen}>
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
          <div className="flex">
          {/* Sidebar */}
          <Sidebar 
            selectedStatus={selectedStatus}
            onStatusChange={handleStatusChange}
            ticketCounts={ticketCounts}
          />

          {/* Main Content */}
          <main className="flex-1 p-6 elastic-scroll overflow-y-auto scroll-shadow">
            <div className="max-w-4xl mx-auto">
              {/* Heads Up Notice - Replaces Create Ticket Header */}
              <HeadsUpNotice />

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Issue Type */}
              <div>
                <select
                  name="issueType"
                  value={formData.issueType}
                  onChange={handleInputChange}
                  required
                  className="dropdown-menu w-full px-4 py-3 pr-10 bg-gray-200 dark:bg-gray-700 border-0 rounded-lg text-gray-700 dark:text-gray-200 focus:bg-white dark:focus:bg-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors appearance-none"
                >
                  <option value="" disabled hidden>Select Issue Type</option>
                  <option value="Technical Issue" className="dropdown-option">Technical Issue</option>
                  <option value="Hardware Issue" className="dropdown-option">Hardware Issue</option>
                  <option value="Software Issue" className="dropdown-option">Software Issue</option>
                  <option value="Network Issue" className="dropdown-option">Network Issue</option>
                  <option value="Account Access" className="dropdown-option">Account Access</option>
                  <option value="General Inquiry" className="dropdown-option">General Inquiry</option>
                </select>
              </div>

              {/* Priority */}
              <div>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                  required
                  className="dropdown-menu w-full px-4 py-3 pr-10 bg-gray-200 dark:bg-gray-700 border-0 rounded-lg text-gray-700 dark:text-gray-200 focus:bg-white dark:focus:bg-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors appearance-none"
                >
                  <option value="" disabled hidden>Priority</option>
                  <option value="high" className="dropdown-option">High</option>
                  <option value="medium" className="dropdown-option">Medium</option>
                  <option value="low" className="dropdown-option">Low</option>
                  <option value="critical" className="dropdown-option">Critical</option>
                </select>
              </div>

              {/* Affected Users */}
              <div>
                <select
                  name="affectedUsers"
                  value={formData.affectedUsers}
                  onChange={handleInputChange}
                  className="dropdown-menu w-full px-4 py-3 pr-10 bg-gray-200 dark:bg-gray-700 border-0 rounded-lg text-gray-700 dark:text-gray-200 focus:bg-white dark:focus:bg-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors appearance-none"
                >
                  <option value="" disabled hidden>Affected Users</option>
                  <option value="single" className="dropdown-option">Only Me</option>
                  <option value="multiple" className="dropdown-option">Multiple Users</option>
                  <option value="department" className="dropdown-option">Entire Department</option>
                  <option value="building" className="dropdown-option">Entire Building</option>
                </select>
              </div>

              {/* Location */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <select
                    name="floor"
                    value={formData.floor}
                    onChange={handleInputChange}
                    className="dropdown-menu w-full px-4 py-3 pr-10 bg-gray-200 dark:bg-gray-700 border-0 rounded-lg text-gray-700 dark:text-gray-200 focus:bg-white dark:focus:bg-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors appearance-none"
                  >
                    <option value="" disabled hidden>Floor</option>
                    <option value="Ground Floor" className="dropdown-option">Ground Floor</option>
                    <option value="1st Floor" className="dropdown-option">1st Floor</option>
                    <option value="2nd Floor" className="dropdown-option">2nd Floor</option>
                    <option value="3rd Floor" className="dropdown-option">3rd Floor</option>
                    <option value="4th Floor" className="dropdown-option">4th Floor</option>
                    <option value="5th Floor" className="dropdown-option">5th Floor</option>
                  </select>
                </div>
                <div>
                  <select
                    name="hall"
                    value={formData.hall}
                    onChange={handleInputChange}
                    className="dropdown-menu w-full px-4 py-3 pr-10 bg-gray-200 dark:bg-gray-700 border-0 rounded-lg text-gray-700 dark:text-gray-200 focus:bg-white dark:focus:bg-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors appearance-none"
                  >
                    <option value="" disabled hidden>Hall/Room</option>
                    <option value="Main Hall" className="dropdown-option">Main Hall</option>
                    <option value="Conference Room A" className="dropdown-option">Conference Room A</option>
                    <option value="Conference Room B" className="dropdown-option">Conference Room B</option>
                    <option value="Lab 1" className="dropdown-option">Lab 1</option>
                    <option value="Lab 2" className="dropdown-option">Lab 2</option>
                    <option value="Office" className="dropdown-option">Office</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe your issue in detail..."
                  required
                  rows={6}
                  className="w-full px-4 py-3 bg-gray-200 dark:bg-gray-700 border-0 rounded-lg text-gray-700 dark:text-gray-200 focus:bg-white dark:focus:bg-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors resize-vertical"
                />
              </div>
                      <option value="Technical Issue" className="dropdown-option">Technical Issue</option>
                      <option value="Hardware Issue" className="dropdown-option">Hardware Issue</option>
                      <option value="Software Issue" className="dropdown-option">Software Issue</option>
                      <option value="Network Issue" className="dropdown-option">Network Issue</option>
                      <option value="Account Access" className="dropdown-option">Account Access</option>
                      <option value="General Inquiry" className="dropdown-option">General Inquiry</option>
                    </select>
                  </div>

                  {/* Priority */}
                  <div>
                    <select
                      name="priority"
                      value={formData.priority}
                      onChange={handleInputChange}
                      required
                      className="dropdown-menu w-full px-4 py-3 pr-10 bg-gray-200 dark:bg-gray-700 border-0 rounded-lg text-gray-700 dark:text-gray-200 focus:bg-white dark:focus:bg-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors appearance-none"
                    >
                      <option value="" disabled hidden>Priority</option>
                      <option value="high" className="dropdown-option">High</option>
                      <option value="medium" className="dropdown-option">Medium</option>
                      <option value="low" className="dropdown-option">Low</option>
                      <option value="critical" className="dropdown-option">Critical</option>
                    </select>
                  </div>
                </>
              )}

              {/* Always show priority field for template forms too */}
              {selectedTemplate && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Priority <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                    required
                    className="dropdown-menu w-full px-4 py-3 pr-10 bg-gray-200 dark:bg-gray-700 border-0 rounded-lg text-gray-700 dark:text-gray-200 focus:bg-white dark:focus:bg-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors appearance-none"
                  >
                    <option value="" disabled hidden>Priority</option>
                    <option value="high" className="dropdown-option">High</option>
                    <option value="medium" className="dropdown-option">Medium</option>
                    <option value="low" className="dropdown-option">Low</option>
                    <option value="critical" className="dropdown-option">Critical</option>
                  </select>
                </div>
              )}

              {/* Default form fields - only show when no template is selected */}
              {!selectedTemplate && (
                <>
                  {/* Affected Users */}
                  <div>
                    <select
                      name="affectedUsers"
                      value={formData.affectedUsers}
                      onChange={handleInputChange}
                      className="dropdown-menu w-full px-4 py-3 pr-10 bg-gray-200 dark:bg-gray-700 border-0 rounded-lg text-gray-700 dark:text-gray-200 focus:bg-white dark:focus:bg-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors appearance-none"
                >
                  <option value="" disabled hidden>Affected Users</option>
                  <option value="single" className="dropdown-option">Only Me</option>
                  <option value="multiple" className="dropdown-option">Less than 3</option>
                  <option value="multiple" className="dropdown-option">Less than 5</option>
                  <option value="multiple" className="dropdown-option">Less than 10</option>
                  <option value="department" className="dropdown-option">Entire Room</option>
                </select>
              </div>

              {/* Location */}
              <div>
                <div className="text-gray-700 dark:text-gray-300 font-medium mb-2 transition-colors">Location</div>
                <div className="grid grid-cols-2 gap-4">
                  <select
                    name="floor"
                    value={formData.floor}
                    onChange={handleInputChange}
                    className="dropdown-menu px-4 py-3 bg-gray-200 dark:bg-gray-700 border-0 rounded-lg text-gray-700 dark:text-gray-200 focus:bg-white dark:focus:bg-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors"
                  >
                    <option value="" disabled hidden>Floor</option>
                    <option value="Ground Floor" className="dropdown-option">Ground Floor</option>
                    <option value="1st Floor" className="dropdown-option">1st Floor</option>
                    <option value="2nd Floor" className="dropdown-option">2nd Floor</option>
                    <option value="3rd Floor" className="dropdown-option">3rd Floor</option>
                    <option value="4th Floor" className="dropdown-option">4th Floor</option>
                    <option value="5th Floor" className="dropdown-option">5th Floor</option>
                    <option value="Basement" className="dropdown-option">Basement</option>
                  </select>
                  <select
                    name="hall"
                    value={formData.hall}
                    onChange={handleInputChange}
                    className="dropdown-menu px-4 py-3 bg-gray-200 dark:bg-gray-700 border-0 rounded-lg text-gray-700 dark:text-gray-200 focus:bg-white dark:focus:bg-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors"
                  >
                    <option value="" disabled hidden>Hall</option>
                    <option value="Hall A" className="dropdown-option">Hall A</option>
                    <option value="Hall B" className="dropdown-option">Hall B</option>
                    <option value="Hall C" className="dropdown-option">Hall C</option>
                    <option value="Hall D" className="dropdown-option">Hall D</option>
                    <option value="Computer Lab 1" className="dropdown-option">Computer Lab 1</option>
                    <option value="Computer Lab 2" className="dropdown-option">Computer Lab 2</option>
                    <option value="Library" className="dropdown-option">Library</option>
                    <option value="Cafeteria" className="dropdown-option">Cafeteria</option>
                    <option value="Admin Office" className="dropdown-option">Admin Office</option>
                  </select>
                </div>
              </div>
                </>
              )}

              {/* Description */}
              <div>
                <div className="text-gray-700 dark:text-gray-300 font-medium mb-2 transition-colors">Description :</div>
                
                {/* File Attachment Options */}
                <div className="file-input-container mb-2">
                  <label className="file-input-btn">
                    📎 Attach Image
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageAttach}
                      className="hidden"
                    />
                  </label>
                  <label className="file-input-btn">
                    📄 Attach File
                    <input
                      type="file"
                      multiple
                      onChange={handleFileAttach}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Attached Images Display */}
                {attachedImages.length > 0 && (
                  <div className="mb-3">
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Attached Images:</div>
                    <div className="flex flex-wrap gap-2">
                      {attachedImages.map((image, index) => (
                        <div key={index} className="flex items-center bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded text-sm">
                          <span className="text-blue-700 dark:text-blue-300">{image.name}</span>
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="ml-2 text-red-500 hover:text-red-700"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Attached Files Display */}
                {attachedFiles.length > 0 && (
                  <div className="mb-3">
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Attached Files:</div>
                    <div className="flex flex-wrap gap-2">
                      {attachedFiles.map((file, index) => (
                        <div key={index} className="flex items-center bg-green-100 dark:bg-green-900 px-2 py-1 rounded text-sm">
                          <span className="text-green-700 dark:text-green-300">{file.name}</span>
                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className="ml-2 text-red-500 hover:text-red-700"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

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
      
      {/* Scroll to Top Button */}
      <ScrollToTop />
    </>
  );
};

export default ClientTickets;
