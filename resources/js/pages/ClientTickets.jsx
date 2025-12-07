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
import UserAvatar from '../components/UserAvatar';

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
  };

  const handleFileAttach = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(file => {
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB limit
      
      if (!isValidSize) {
        showToastMessage('File size must be less than 5MB', 'error');
        return false;
      }
      return true;
    });
    
    setAttachedFiles(prev => [...prev, ...validFiles]);
  };

  const removeAttachment = (index, type) => {
    if (type === 'image') {
      setAttachedImages(prev => prev.filter((_, i) => i !== index));
    } else {
      setAttachedFiles(prev => prev.filter((_, i) => i !== index));
    }
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
      console.error('Error creating ticket:', error);
      if (error.response && error.response.status === 422) {
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

  // Map frontend status names to backend enum values
  const mapStatusToBackend = (status) => {
    const statusMap = {
      'New': 'NEW',
      'In Progress': 'IN_PROGRESS',
      'Pending': 'PENDING', 
      'Resolved': 'RESOLVED',
      'Cancelled': 'CANCELLED',
      'Closed': 'CLOSED',
      'Deleted': 'DELETED'
    };
    return statusMap[status] || status.toUpperCase();
  };

  // Query to fetch client's individual tickets
  const { data: tickets } = useQuery({
    queryKey: ['user-tickets', selectedStatus, user?.id],
    queryFn: () => ticketApi.list({ 
      status: mapStatusToBackend(selectedStatus)
    }),
    enabled: !!user
  });

  // Query to fetch client's individual ticket statistics
  const { data: stats = {} } = useQuery({
    queryKey: ['client-ticket-stats', user?.id],
    queryFn: () => ticketApi.getStats(),
    enabled: !!user
  });

  return (
    <>
      {/* Common Header */}
      <CommonHeader onMenuToggle={() => setIsMenuOpen(!isMenuOpen)} isMenuOpen={isMenuOpen} />
      
      {/* Hamburger Menu */}
      <HamburgerMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      
      <ContentWrapper isMenuOpen={isMenuOpen}>
        <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
          {/* Sidebar */}
          <Sidebar 
            selectedStatus={selectedStatus}
            onStatusChange={setSelectedStatus}
            ticketCounts={{
              'New': stats.new || 0,
              'In Progress': stats.in_progress || 0,
              'Pending': stats.pending || 0,
              'Resolved': stats.resolved || 0,
              'Cancelled': stats.cancelled || 0,
              'Closed': stats.closed || 0,
              'Deleted': stats.deleted || 0
            }}
          />

          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Main Content */}
            <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-gray-900">
              <div className="container mx-auto px-6 py-8">

                {/* Create New Ticket Form */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
                  {/* Heads Up Notice */}
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

                    {/* File Attachments */}
                    <div className="space-y-4">
                      {/* Image Attachments */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Attach Images (Optional)
                        </label>
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleImageAttach}
                          className="block w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-900 dark:file:text-blue-200"
                        />
                        <p className="text-xs text-gray-500 mt-1">Max 3MB per image</p>
                      </div>

                      {/* Document Attachments */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Attach Files (Optional)
                        </label>
                        <input
                          type="file"
                          multiple
                          onChange={handleFileAttach}
                          className="block w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-900 dark:file:text-blue-200"
                        />
                        <p className="text-xs text-gray-500 mt-1">Max 5MB per file</p>
                      </div>

                      {/* Attachment Preview */}
                      {(attachedImages.length > 0 || attachedFiles.length > 0) && (
                        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Attached Files:</h4>
                          
                          {/* Image Previews */}
                          {attachedImages.length > 0 && (
                            <div className="mb-3">
                              <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Images:</p>
                              <div className="flex flex-wrap gap-2">
                                {attachedImages.map((file, index) => (
                                  <div key={index} className="relative">
                                    <img
                                      src={URL.createObjectURL(file)}
                                      alt={file.name}
                                      className="w-16 h-16 object-cover rounded border"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => removeAttachment(index, 'image')}
                                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                                    >
                                      ×
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* File List */}
                          {attachedFiles.length > 0 && (
                            <div>
                              <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Files:</p>
                              <div className="space-y-1">
                                {attachedFiles.map((file, index) => (
                                  <div key={index} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 rounded px-3 py-2">
                                    <span className="text-sm text-gray-700 dark:text-gray-300 truncate">{file.name}</span>
                                    <button
                                      type="button"
                                      onClick={() => removeAttachment(index, 'file')}
                                      className="text-red-500 hover:text-red-700 ml-2"
                                    >
                                      ×
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors"
                    >
                      Create Ticket
                    </button>
                  </form>
                </div>

                {/* Tickets List */}
                {tickets?.data && tickets.data.length > 0 && (
                  <div className="grid gap-4">
                    {tickets.data.map((ticket) => (
                      <div key={ticket.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{ticket.title}</h3>
                            <p className="text-gray-600 dark:text-gray-400 mt-1">{ticket.description}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            ticket.status === 'New' ? 'bg-blue-100 text-blue-800' :
                            ticket.status === 'Open' ? 'bg-yellow-100 text-yellow-800' :
                            ticket.status === 'In Progress' ? 'bg-purple-100 text-purple-800' :
                            ticket.status === 'Resolved' ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {ticket.status}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                          <span>Priority: {ticket.priority}</span>
                          <span>{new Date(ticket.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
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

      {/* Scroll to Top */}
      <ScrollToTop />
    </>
  );
};

export default ClientTickets;