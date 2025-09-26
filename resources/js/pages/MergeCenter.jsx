import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ticketApi } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import AdminNavigation from '../components/AdminNavigation';

const MergeCenter = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedTickets, setSelectedTickets] = useState([]);
  const [mergeData, setMergeData] = useState({
    title: '',
    description: '',
    priority: 'MEDIUM',
  });
  const [showMergeForm, setShowMergeForm] = useState(false);

  const { data: tickets } = useQuery({
    queryKey: ['tickets', { status: 'NEW,IN_PROGRESS,ON_HOLD' }],
    queryFn: () => ticketApi.list({ status: 'NEW,IN_PROGRESS,ON_HOLD' }),
    enabled: !!user && (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN'),
  });

  const { data: merges } = useQuery({
    queryKey: ['merged-tickets'],
    queryFn: () => ticketApi.getMerges(),
    enabled: !!user && (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN'),
  });

  const mergeMutation = useMutation({
    mutationFn: ticketApi.merge,
    onSuccess: () => {
      queryClient.invalidateQueries(['tickets']);
      queryClient.invalidateQueries(['merged-tickets']);
      setSelectedTickets([]);
      setShowMergeForm(false);
      setMergeData({ title: '', description: '', priority: 'MEDIUM' });
    },
  });

  const undoMergeMutation = useMutation({
    mutationFn: ticketApi.undoMerge,
    onSuccess: () => {
      queryClient.invalidateQueries(['tickets']);
      queryClient.invalidateQueries(['merged-tickets']);
    },
  });

  const handleTicketSelect = (ticketId) => {
    setSelectedTickets(prev => 
      prev.includes(ticketId)
        ? prev.filter(id => id !== ticketId)
        : [...prev, ticketId]
    );
  };

  const handleMerge = () => {
    if (selectedTickets.length < 2) {
      alert('Please select at least 2 tickets to merge');
      return;
    }
    setShowMergeForm(true);
  };

  const submitMerge = (e) => {
    e.preventDefault();
    mergeMutation.mutate({
      parent: mergeData,
      childrenIds: selectedTickets,
    });
  };

  const handleUndoMerge = (mergeId) => {
    if (window.confirm('Are you sure you want to undo this merge? This will restore all original tickets.')) {
      undoMergeMutation.mutate(mergeId);
    }
  };

  if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
    return <div className="text-center py-8">Access denied</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-3xl font-bold text-gray-900">Merge Center</h1>
            <p className="text-gray-600">Merge duplicate tickets and manage merged tickets</p>
          </div>
          
          {/* Navigation */}
          <AdminNavigation />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Available Tickets */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-medium">Available Tickets</h2>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">
                  {selectedTickets.length} selected
                </span>
                <button
                  onClick={handleMerge}
                  disabled={selectedTickets.length < 2}
                  className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 disabled:opacity-50"
                >
                  Merge Selected
                </button>
              </div>
            </div>
            
            <div className="max-h-96 overflow-y-auto">
              {tickets?.data?.data?.map((ticket) => (
                <div
                  key={ticket.id}
                  className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                    selectedTickets.includes(ticket.id) ? 'bg-blue-50 border-blue-200' : ''
                  }`}
                  onClick={() => handleTicketSelect(ticket.id)}
                >
                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      checked={selectedTickets.includes(ticket.id)}
                      readOnly
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">
                        #{ticket.ticket_number}
                      </div>
                      <div className="text-sm text-gray-600 truncate">
                        {ticket.title}
                      </div>
                      <div className="text-xs text-gray-500">
                        {ticket.client?.name} • {new Date(ticket.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Merged Tickets */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium">Merged Tickets</h2>
            </div>
            
            <div className="max-h-96 overflow-y-auto">
              {merges?.data?.map((merge) => (
                <div key={merge.id} className="p-4 border-b border-gray-100">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">
                        Parent: #{merge.parent_ticket?.ticket_number}
                      </div>
                      <div className="text-sm text-gray-600">
                        {merge.parent_ticket?.title}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Merged {merge.child_tickets?.length} tickets on{' '}
                        {new Date(merge.merged_at).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        Children: {merge.child_tickets?.map(child => `#${child.ticket_number}`).join(', ')}
                      </div>
                    </div>
                    <button
                      onClick={() => handleUndoMerge(merge.id)}
                      className="text-red-600 hover:text-red-900 text-sm"
                      disabled={undoMergeMutation.isPending}
                    >
                      Undo
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Merge Form Modal */}
        {showMergeForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h3 className="text-lg font-medium mb-4">Create Merged Ticket</h3>
              <form onSubmit={submitMerge} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    required
                    value={mergeData.title}
                    onChange={(e) => setMergeData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="Title for the merged ticket"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority
                  </label>
                  <select
                    value={mergeData.priority}
                    onChange={(e) => setMergeData(prev => ({ ...prev, priority: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">Urgent</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={mergeData.description}
                    onChange={(e) => setMergeData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="Description for the merged ticket..."
                  />
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowMergeForm(false)}
                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={mergeMutation.isPending}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                  >
                    {mergeMutation.isPending ? 'Creating...' : 'Create Merged Ticket'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MergeCenter;
