import React, { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Bell, Check, X, UserPlus, Star, AlertCircle } from 'lucide-react';
import { notificationApi } from '../services/api';

const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const queryClient = useQueryClient();

  // Fetch unread notifications
  const { data: unreadData = { notifications: [], count: 0 } } = useQuery({
    queryKey: ['notifications', 'unread'],
    queryFn: () => notificationApi.unread(),
    select: (data) => data.data || { notifications: [], count: 0 },
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  // Fetch all notifications when dropdown is open
  const { data: allNotifications = [] } = useQuery({
    queryKey: ['notifications', 'all'],
    queryFn: () => notificationApi.list(),
    select: (data) => data.data?.data || [],
    enabled: isOpen,
  });

  // Mark as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: (notificationId) => notificationApi.markAsRead(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries(['notifications']);
    },
  });

  // Mark all as read mutation
  const markAllAsReadMutation = useMutation({
    mutationFn: () => notificationApi.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries(['notifications']);
    },
  });

  // Accept collaboration mutation
  const acceptCollaborationMutation = useMutation({
    mutationFn: (notificationId) => notificationApi.acceptCollaboration(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries(['notifications']);
      queryClient.invalidateQueries(['tickets']);
    },
    onError: (error) => {
      console.error('Failed to accept collaboration:', error);
      alert('Failed to accept collaboration request. Please try again.');
    },
  });

  // Reject collaboration mutation
  const rejectCollaborationMutation = useMutation({
    mutationFn: (notificationId) => notificationApi.rejectCollaboration(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries(['notifications']);
    },
    onError: (error) => {
      console.error('Failed to reject collaboration:', error);
      alert('Failed to reject collaboration request. Please try again.');
    },
  });

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'ticket_rated':
        return <Star className="w-4 h-4 text-yellow-500" />;
      case 'status_changed':
        return <AlertCircle className="w-4 h-4 text-blue-500" />;
      case 'collaboration_request':
        return <UserPlus className="w-4 h-4 text-green-500" />;
      default:
        return <Bell className="w-4 h-4 text-gray-500" />;
    }
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const handleNotificationClick = async (notification) => {
    if (!notification.read_at) {
      await markAsReadMutation.mutateAsync(notification.id);
    }
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsReadMutation.mutateAsync();
  };

  const handleAcceptCollaboration = async (notificationId, e) => {
    e.stopPropagation();
    await acceptCollaborationMutation.mutateAsync(notificationId);
  };

  const handleRejectCollaboration = async (notificationId, e) => {
    e.stopPropagation();
    await rejectCollaborationMutation.mutateAsync(notificationId);
  };

  const displayNotifications = isOpen ? allNotifications : unreadData.notifications;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Icon */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg"
      >
        <Bell className="w-6 h-6" />
        {unreadData.count > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
            {unreadData.count > 99 ? '99+' : unreadData.count}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-96 overflow-hidden">
          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
            {unreadData.count > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                disabled={markAllAsReadMutation.isLoading}
              >
                Mark all read
              </button>
            )}
          </div>

          {/* Notification List */}
          <div className="max-h-80 overflow-y-auto">
            {displayNotifications.length === 0 ? (
              <div className="px-4 py-6 text-center text-gray-500">
                <Bell className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>No notifications</p>
              </div>
            ) : (
              displayNotifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`px-4 py-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                    !notification.read_at ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    {/* Icon */}
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {notification.title}
                      </p>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-3">
                        {notification.message}
                      </p>
                      
                      {/* Enhanced details for collaboration requests */}
                      {notification.data?.type === 'collaboration_request' && (
                        <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
                          <div className="grid grid-cols-2 gap-1">
                            <span className="font-medium">From:</span>
                            <span>{notification.data?.requested_by?.name} ({notification.data?.requested_by?.role})</span>
                            <span className="font-medium">Ticket:</span>
                            <span>#{notification.data?.ticket_number}</span>
                            <span className="font-medium">Status:</span>
                            <span className="capitalize">{notification.data?.ticket_status?.toLowerCase().replace('_', ' ')}</span>
                            <span className="font-medium">Priority:</span>
                            <span className="capitalize">{notification.data?.ticket_priority?.toLowerCase()}</span>
                          </div>
                          {notification.data?.ticket_title && (
                            <div className="mt-1 pt-1 border-t border-gray-200">
                              <span className="font-medium">Title:</span> {notification.data.ticket_title}
                            </div>
                          )}
                        </div>
                      )}
                      
                      <p className="text-xs text-gray-400 mt-1">
                        {formatTimeAgo(notification.created_at)}
                      </p>

                      {/* Collaboration request actions */}
                      {notification.data?.type === 'collaboration_request' && !notification.read_at && (
                        <div className="flex space-x-2 mt-2">
                          <button
                            onClick={(e) => handleAcceptCollaboration(notification.id, e)}
                            className="inline-flex items-center px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded hover:bg-green-200 disabled:opacity-50"
                            disabled={acceptCollaborationMutation.isPending}
                          >
                            <Check className="w-3 h-3 mr-1" />
                            {acceptCollaborationMutation.isPending ? 'Accepting...' : 'Accept'}
                          </button>
                          <button
                            onClick={(e) => handleRejectCollaboration(notification.id, e)}
                            className="inline-flex items-center px-2 py-1 text-xs font-medium text-red-700 bg-red-100 rounded hover:bg-red-200 disabled:opacity-50"
                            disabled={rejectCollaborationMutation.isPending}
                          >
                            <X className="w-3 h-3 mr-1" />
                            {rejectCollaborationMutation.isPending ? 'Declining...' : 'Decline'}
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Unread indicator */}
                    {!notification.read_at && (
                      <div className="flex-shrink-0">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {displayNotifications.length > 0 && (
            <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => setIsOpen(false)}
                className="w-full text-center text-sm text-gray-600 hover:text-gray-900"
              >
                View all notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
