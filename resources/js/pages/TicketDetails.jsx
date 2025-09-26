import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ticketApi } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const statusColors = {
  NEW: 'bg-blue-100 text-blue-800',
  IN_PROGRESS: 'bg-yellow-100 text-yellow-800',
  ON_HOLD: 'bg-orange-100 text-orange-800',
  RESOLVED: 'bg-green-100 text-green-800',
  CLOSED: 'bg-gray-100 text-gray-800',
};

const priorityColors = {
  LOW: 'bg-green-100 text-green-800',
  MEDIUM: 'bg-blue-100 text-blue-800',
  HIGH: 'bg-orange-100 text-orange-800',
  URGENT: 'bg-red-100 text-red-800',
};

const CommentForm = ({ onSubmit, isLoading }) => {
  const [comment, setComment] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (comment.trim()) {
      onSubmit(comment.trim());
      setComment('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Add Comment
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Write your comment here..."
          required
        />
      </div>
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isLoading || !comment.trim()}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? 'Adding...' : 'Add Comment'}
        </button>
      </div>
    </form>
  );
};

const StatusUpdateForm = ({ currentStatus, onStatusUpdate, isLoading }) => {
  const [newStatus, setNewStatus] = useState(currentStatus);
  const [comment, setComment] = useState('');

  const statusOptions = [
    { value: 'NEW', label: 'New' },
    { value: 'IN_PROGRESS', label: 'In Progress' },
    { value: 'ON_HOLD', label: 'On Hold' },
    { value: 'RESOLVED', label: 'Resolved' },
    { value: 'CLOSED', label: 'Closed' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newStatus !== currentStatus) {
      onStatusUpdate(newStatus, comment);
      setComment('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Update Status
        </label>
        <select
          value={newStatus}
          onChange={(e) => setNewStatus(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      
      {newStatus !== currentStatus && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status Change Comment (Optional)
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Explain the reason for status change..."
          />
        </div>
      )}
      
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isLoading || newStatus === currentStatus}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50"
        >
          {isLoading ? 'Updating...' : 'Update Status'}
        </button>
      </div>
    </form>
  );
};

const TicketDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch ticket details
  const { data: ticket, isLoading, error } = useQuery({
    queryKey: ['ticket', id],
    queryFn: () => ticketApi.get(id).then(res => res.data),
  });

  // Add comment mutation
  const addCommentMutation = useMutation({
    mutationFn: (comment) => ticketApi.addComment(id, { comment }),
    onSuccess: () => {
      queryClient.invalidateQueries(['ticket', id]);
    },
  });

  // Update status mutation
  const updateStatusMutation = useMutation({
    mutationFn: ({ status, comment }) => ticketApi.updateStatus(id, { status, comment }),
    onSuccess: () => {
      queryClient.invalidateQueries(['ticket', id]);
    },
  });

  const handleAddComment = (comment) => {
    addCommentMutation.mutate(comment);
  };

  const handleStatusUpdate = (status, comment) => {
    updateStatusMutation.mutate({ status, comment });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading ticket details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-red-600">Error loading ticket: {error.message}</div>
      </div>
    );
  }

  const canUpdateStatus = user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN';
  const canComment = true; // All authenticated users can comment

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => window.history.back()}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ← Back
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Ticket #{ticket?.data?.ticket_number}
                  </h1>
                  <p className="text-gray-600">{ticket?.data?.title}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${statusColors[ticket?.data?.status]}`}>
                  {ticket?.data?.status?.replace('_', ' ')}
                </span>
                <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${priorityColors[ticket?.data?.priority]}`}>
                  {ticket?.data?.priority}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Ticket Description */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium mb-4">Description</h3>
              <div className="prose max-w-none">
                <p className="text-gray-700 whitespace-pre-wrap">
                  {ticket?.data?.description}
                </p>
              </div>
            </div>

            {/* Comments */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium mb-4">
                Comments ({ticket?.data?.comments?.length || 0})
              </h3>
              
              <div className="space-y-4 mb-6">
                {ticket?.data?.comments?.map((comment) => (
                  <div key={comment.id} className="border-l-4 border-blue-200 pl-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-900">
                          {comment.user?.name}
                        </span>
                        <span className="text-xs text-gray-500">
                          {comment.user?.role}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(comment.created_at).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-gray-700 whitespace-pre-wrap">{comment.comment}</p>
                  </div>
                ))}
                
                {(!ticket?.data?.comments || ticket.data.comments.length === 0) && (
                  <p className="text-gray-500 text-center py-8">No comments yet</p>
                )}
              </div>

              {/* Add Comment Form */}
              {canComment && (
                <div className="border-t pt-6">
                  <CommentForm
                    onSubmit={handleAddComment}
                    isLoading={addCommentMutation.isPending}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Ticket Info */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium mb-4">Ticket Information</h3>
              <dl className="space-y-3">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Client</dt>
                  <dd className="text-sm text-gray-900">{ticket?.data?.client?.name}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Category</dt>
                  <dd className="text-sm text-gray-900">
                    {ticket?.data?.category?.name || 'Uncategorized'}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Assignee</dt>
                  <dd className="text-sm text-gray-900">
                    {ticket?.data?.current_assignee?.name || 'Unassigned'}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Created</dt>
                  <dd className="text-sm text-gray-900">
                    {new Date(ticket?.data?.created_at).toLocaleString()}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
                  <dd className="text-sm text-gray-900">
                    {new Date(ticket?.data?.updated_at).toLocaleString()}
                  </dd>
                </div>
              </dl>
            </div>

            {/* Status Update Form */}
            {canUpdateStatus && (
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium mb-4">Update Status</h3>
                <StatusUpdateForm
                  currentStatus={ticket?.data?.status}
                  onStatusUpdate={handleStatusUpdate}
                  isLoading={updateStatusMutation.isPending}
                />
              </div>
            )}

            {/* Collaborators */}
            {ticket?.data?.collaborators && ticket.data.collaborators.length > 0 && (
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium mb-4">Collaborators</h3>
                <div className="space-y-2">
                  {ticket.data.collaborators.map((collab) => (
                    <div key={collab.id} className="flex items-center justify-between">
                      <span className="text-sm text-gray-900">{collab.user?.name}</span>
                      <span className="text-xs text-gray-500">{collab.user?.role}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketDetails;
