import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ticketApi } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const ClientTickets = () => {
  const { user, logout } = useAuth();
  const [selectedStatus, setSelectedStatus] = useState('New');
  const [formData, setFormData] = useState({
    issueType: '',
    priority: '',
    affectedUsers: '',
    floor: '',
    hall: '',
    description: ''
  });

  // Status options for sidebar
  const statusOptions = [
    'New',
    'In Progress', 
    'Pending',
    'Resolved',
    'Canceled',
    'Closed',
    'Deleted'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Convert form data to API format
      const ticketData = {
        title: `${formData.issueType} - ${formData.floor}/${formData.hall}`,
        description: formData.description,
        priority: formData.priority.toUpperCase(),
        // Add other fields as needed
      };
      
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
      alert('Ticket created successfully!');
    } catch (error) {
      console.error('Failed to create ticket:', error);
      alert('Failed to create ticket. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <button className="p-2">
              <div className="w-6 h-6 flex flex-col justify-center space-y-1">
                <div className="w-full h-0.5 bg-gray-600"></div>
                <div className="w-full h-0.5 bg-gray-600"></div>
                <div className="w-full h-0.5 bg-gray-600"></div>
              </div>
            </button>
            <div className="flex items-center space-x-2">
              <img 
                src="/logo.svg" 
                alt="Saegis Logo" 
                className="w-8 h-8"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
              <span className="text-xl font-semibold text-gray-800">Saegis</span>
            </div>
          </div>
          
          <div className="bg-gray-200 px-6 py-2 rounded-full">
            <h1 className="text-lg font-medium text-gray-700">Saegis Help Desk</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-full hover:bg-gray-100">
              <div className="w-6 h-6 bg-gray-600 rounded-full"></div>
            </button>
            <button className="p-2 rounded-full hover:bg-gray-100">
              <div className="w-6 h-6 bg-gray-600 rounded"></div>
            </button>
            <button className="p-2 rounded-full hover:bg-gray-100">
              <div className="w-6 h-6 bg-gray-600 rounded-full border-2 border-gray-300"></div>
            </button>
            <button 
              onClick={logout}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <div className="w-6 h-6 bg-gray-600 rounded-full"></div>
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-sm min-h-screen">
          <div className="p-4">
            <div className="text-sm text-gray-500 mb-2">Client Side</div>
            <div className="space-y-1">
              {statusOptions.map((status) => (
                <button
                  key={status}
                  onClick={() => setSelectedStatus(status)}
                  className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    selectedStatus === status
                      ? 'bg-gray-200 text-gray-900'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="max-w-4xl">
            {/* Create Ticket Header */}
            <div className="bg-blue-500 text-white text-center py-4 rounded-lg mb-6">
              <h2 className="text-xl font-semibold flex items-center justify-center">
                Create Ticket
                <span className="ml-2 w-6 h-6 bg-white text-blue-500 rounded-full flex items-center justify-center text-lg font-bold">
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
                  className="w-full px-4 py-3 bg-gray-200 border-0 rounded-lg text-gray-700 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
                  className="w-full px-4 py-3 bg-gray-200 border-0 rounded-lg text-gray-700 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
                  className="w-full px-4 py-3 bg-gray-200 border-0 rounded-lg text-gray-700 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
                <div className="text-gray-700 font-medium mb-2">Location</div>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="floor"
                    value={formData.floor}
                    onChange={handleInputChange}
                    placeholder="Floor"
                    className="px-4 py-3 bg-gray-200 border-0 rounded-lg text-gray-700 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  <input
                    type="text"
                    name="hall"
                    value={formData.hall}
                    onChange={handleInputChange}
                    placeholder="Hall"
                    className="px-4 py-3 bg-gray-200 border-0 rounded-lg text-gray-700 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <div className="text-gray-700 font-medium mb-2">Description :</div>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows="6"
                  className="w-full px-4 py-3 bg-gray-200 border-0 rounded-lg text-gray-700 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                  placeholder="Please describe the issue in detail..."
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-8 py-3 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors"
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
        <div className="w-12 h-12 bg-gray-800 text-white rounded-full flex items-center justify-center text-xl font-bold cursor-pointer hover:bg-gray-700">
          ?
        </div>
      </div>
    </div>
  );
};

export default ClientTickets;
