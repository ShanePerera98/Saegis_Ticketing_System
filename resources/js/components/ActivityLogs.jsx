import React, { useState, useEffect } from 'react';
import { Clock, User, Activity, Filter, Calendar } from 'lucide-react';
import api from '../services/api';

const ActivityLogs = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        entity_type: '',
        action: '',
        actor_id: '',
        from_date: '',
        to_date: '',
    });
    const [stats, setStats] = useState({});
    const [pagination, setPagination] = useState({});

    useEffect(() => {
        fetchLogs();
        fetchStats();
    }, [filters]);

    const fetchLogs = async (page = 1) => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            Object.entries(filters).forEach(([key, value]) => {
                if (value) params.append(key, value);
            });
            params.append('page', page);

            const response = await api.get(`/activity-logs?${params}`);
            setLogs(response.data.data);
            setPagination({
                current_page: response.data.current_page,
                last_page: response.data.last_page,
                total: response.data.total,
            });
        } catch (error) {
            console.error('Error fetching activity logs:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await api.get('/activity-logs/stats');
            setStats(response.data);
        } catch (error) {
            console.error('Error fetching activity stats:', error);
        }
    };

    const formatActionText = (log) => {
        const actionMap = {
            'ticket.created': 'created ticket',
            'ticket.updated': 'updated ticket',
            'ticket.status_changed': 'changed status',
            'ticket.assigned': 'assigned ticket',
            'ticket.cancelled': 'cancelled ticket',
            'ticket.merged': 'merged tickets',
            'comment.created': 'added comment',
            'comment.updated': 'updated comment',
            'comment.deleted': 'deleted comment',
            'user.login': 'logged in',
            'user.logout': 'logged out',
        };
        
        return actionMap[log.action] || log.action.replace('.', ' ').replace('_', ' ');
    };

    const getActionColor = (action) => {
        if (action.includes('created')) return 'text-green-600';
        if (action.includes('updated')) return 'text-blue-600';
        if (action.includes('deleted') || action.includes('cancelled')) return 'text-red-600';
        if (action.includes('assigned')) return 'text-purple-600';
        return 'text-gray-600';
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleString();
    };

    const renderPayload = (payload) => {
        if (!payload) return null;
        
        return (
            <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                <strong>Details:</strong>
                <pre className="text-xs overflow-x-auto">
                    {JSON.stringify(payload, null, 2)}
                </pre>
            </div>
        );
    };

    const renderChanges = (changes) => {
        if (!changes || Object.keys(changes).length === 0) return null;
        
        return (
            <div className="mt-2 p-2 bg-blue-50 rounded text-sm">
                <strong>Changes:</strong>
                <ul className="list-disc list-inside">
                    {Object.entries(changes).map(([field, value]) => (
                        <li key={field} className="text-xs">
                            <strong>{field}:</strong> {Array.isArray(value) ? value.join(', ') : String(value)}
                        </li>
                    ))}
                </ul>
            </div>
        );
    };

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Activity Logs</h1>
                <p className="text-gray-600">Monitor all system activities and user actions</p>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg shadow">
                    <div className="flex items-center">
                        <Activity className="h-8 w-8 text-blue-600" />
                        <div className="ml-4">
                            <p className="text-sm text-gray-500">Total Activities</p>
                            <p className="text-xl font-bold">{stats.total_activities || 0}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <div className="flex items-center">
                        <Calendar className="h-8 w-8 text-green-600" />
                        <div className="ml-4">
                            <p className="text-sm text-gray-500">Today</p>
                            <p className="text-xl font-bold">{stats.today_activities || 0}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <div className="flex items-center">
                        <Calendar className="h-8 w-8 text-yellow-600" />
                        <div className="ml-4">
                            <p className="text-sm text-gray-500">This Week</p>
                            <p className="text-xl font-bold">{stats.this_week_activities || 0}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <div className="flex items-center">
                        <Calendar className="h-8 w-8 text-purple-600" />
                        <div className="ml-4">
                            <p className="text-sm text-gray-500">This Month</p>
                            <p className="text-xl font-bold">{stats.this_month_activities || 0}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-lg shadow mb-6">
                <div className="flex items-center mb-4">
                    <Filter className="h-5 w-5 text-gray-400 mr-2" />
                    <h3 className="text-lg font-medium">Filters</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Entity Type</label>
                        <select
                            value={filters.entity_type}
                            onChange={(e) => setFilters(prev => ({ ...prev, entity_type: e.target.value }))}
                            className="w-full border border-gray-300 rounded-md px-3 py-2"
                        >
                            <option value="">All Types</option>
                            <option value="App\Models\Ticket">Tickets</option>
                            <option value="App\Models\User">Users</option>
                            <option value="App\Models\TicketComment">Comments</option>
                            <option value="App\Models\TicketTemplate">Templates</option>
                        </select>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Action</label>
                        <select
                            value={filters.action}
                            onChange={(e) => setFilters(prev => ({ ...prev, action: e.target.value }))}
                            className="w-full border border-gray-300 rounded-md px-3 py-2"
                        >
                            <option value="">All Actions</option>
                            <option value="ticket.created">Ticket Created</option>
                            <option value="ticket.updated">Ticket Updated</option>
                            <option value="ticket.status_changed">Status Changed</option>
                            <option value="ticket.assigned">Ticket Assigned</option>
                            <option value="comment.created">Comment Added</option>
                            <option value="user.login">User Login</option>
                        </select>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
                        <input
                            type="datetime-local"
                            value={filters.from_date}
                            onChange={(e) => setFilters(prev => ({ ...prev, from_date: e.target.value }))}
                            className="w-full border border-gray-300 rounded-md px-3 py-2"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
                        <input
                            type="datetime-local"
                            value={filters.to_date}
                            onChange={(e) => setFilters(prev => ({ ...prev, to_date: e.target.value }))}
                            className="w-full border border-gray-300 rounded-md px-3 py-2"
                        />
                    </div>
                    
                    <div className="flex items-end">
                        <button
                            onClick={() => setFilters({ entity_type: '', action: '', actor_id: '', from_date: '', to_date: '' })}
                            className="w-full bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                        >
                            Clear Filters
                        </button>
                    </div>
                </div>
            </div>

            {/* Activity Logs */}
            <div className="bg-white rounded-lg shadow">
                <div className="p-4 border-b">
                    <h3 className="text-lg font-medium">Activity Timeline</h3>
                </div>
                
                {loading ? (
                    <div className="p-8 text-center">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                        <p className="mt-2 text-gray-600">Loading activity logs...</p>
                    </div>
                ) : logs.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        No activity logs found for the selected filters.
                    </div>
                ) : (
                    <div className="divide-y">
                        {logs.map((log) => (
                            <div key={log.id} className="p-4">
                                <div className="flex items-start space-x-3">
                                    <div className="flex-shrink-0">
                                        <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                                            <User className="h-4 w-4 text-indigo-600" />
                                        </div>
                                    </div>
                                    
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-2">
                                                <p className="text-sm font-medium text-gray-900">
                                                    {log.actor?.name || 'System'}
                                                </p>
                                                <span className={`text-sm font-medium ${getActionColor(log.action)}`}>
                                                    {formatActionText(log)}
                                                </span>
                                                <span className="text-sm text-gray-500">
                                                    {log.entity_type.split('\\').pop()} #{log.entity_id}
                                                </span>
                                            </div>
                                            
                                            <div className="flex items-center text-sm text-gray-500">
                                                <Clock className="h-4 w-4 mr-1" />
                                                {formatDate(log.created_at)}
                                            </div>
                                        </div>
                                        
                                        {log.payload && renderPayload(log.payload)}
                                        {log.changes && renderChanges(log.changes)}
                                        
                                        {log.ip_address && (
                                            <p className="text-xs text-gray-400 mt-1">
                                                IP: {log.ip_address}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                
                {/* Pagination */}
                {pagination.last_page > 1 && (
                    <div className="flex items-center justify-between px-4 py-3 border-t">
                        <div className="text-sm text-gray-700">
                            Showing page {pagination.current_page} of {pagination.last_page} 
                            ({pagination.total} total activities)
                        </div>
                        <div className="flex space-x-2">
                            <button
                                onClick={() => fetchLogs(pagination.current_page - 1)}
                                disabled={pagination.current_page === 1}
                                className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50"
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => fetchLogs(pagination.current_page + 1)}
                                disabled={pagination.current_page === pagination.last_page}
                                className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ActivityLogs;
