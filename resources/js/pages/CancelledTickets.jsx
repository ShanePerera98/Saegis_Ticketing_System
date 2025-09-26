import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ticketApi } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import AdminNavigation from '../components/AdminNavigation';

const CancelledTickets = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState({
    type: '',
  });

  const { data: cancelledTickets, isLoading } = useQuery({
    queryKey: ['cancelled-tickets', filters],
    queryFn: () => ticketApi.getCancelled(filters),
    enabled: !!user && (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN'),
  });

  const approveMutation = useMutation({
    mutationFn: ticketApi.approveCancellation,
    onSuccess: () => {
      queryClient.invalidateQueries(['cancelled-tickets']);
    },
  });

  const restoreMutation = useMutation({
    mutationFn: ticketApi.restoreTicket,
    onSuccess: () => {
      queryClient.invalidateQueries(['cancelled-tickets']);
      queryClient.invalidateQueries(['tickets']);
    },
  });

  const handleApprove = (ticketId) => {
    if (window.confirm('Are you sure you want to permanently delete this ticket? This cannot be undone.')) {
      approveMutation.mutate(ticketId);
    }
  };

  const handleRestore = (ticketId) => {
    if (window.confirm('Are you sure you want to restore this ticket to the dashboard?')) {
      restoreMutation.mutate(ticketId);
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
            <h1 className="text-3xl font-bold text-gray-900">Cancelled Tickets</h1>
            <p className="text-gray-600">Manage cancelled and duplicate tickets</p>
          </div>
          
          {/* Navigation */}
          <AdminNavigation />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-lg font-medium mb-4">Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type
              </label>
              <select
                value={filters.type}
                onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="">All Types</option>
                <option value="IRRELEVANT">Irrelevant</option>
                <option value="DUPLICATE">Duplicate</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tickets List */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium">
              Cancelled Tickets ({cancelledTickets?.data?.length || 0})
            </h2>
          </div>
          
          {isLoading ? (
            <div className="text-center py-12">Loading...</div>
          ) : cancelledTickets?.data?.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No cancelled tickets found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Ticket
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Cancelled By
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Auto Delete Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {cancelledTickets?.data?.map((cancelled) => (
                    <tr key={cancelled.id}>
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            #{cancelled.ticket?.ticket_number}
                          </div>
                          <div className="text-sm text-gray-500">
                            {cancelled.ticket?.title}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          cancelled.type === 'IRRELEVANT' ? 'bg-red-100 text-red-800' : 'bg-orange-100 text-orange-800'
                        }`}>
                          {cancelled.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {cancelled.cancelled_by?.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(cancelled.auto_delete_after).toLocaleDateString()}
                        {new Date(cancelled.auto_delete_after) <= new Date() && (
                          <span className="ml-2 text-red-600 font-medium">Ready for deletion</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium space-x-2">
                        {user.role === 'SUPER_ADMIN' && (
                          <button
                            onClick={() => handleRestore(cancelled.ticket_id)}
                            className="text-green-600 hover:text-green-900"
                            disabled={restoreMutation.isPending}
                          >
                            Restore
                          </button>
                        )}
                        <button
                          onClick={() => handleApprove(cancelled.ticket_id)}
                          className="text-red-600 hover:text-red-900"
                          disabled={approveMutation.isPending}
                        >
                          Approve Deletion
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CancelledTickets;
