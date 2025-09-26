import React, { useState, useEffect } from 'react';
import { 
    CheckCircle, 
    XCircle, 
    AlertCircle, 
    Database, 
    Server, 
    Users,
    Ticket,
    Activity,
    Settings,
    Shield,
    FileText,
    BarChart3,
    Merge,
    Archive
} from 'lucide-react';
import api from '../services/api';

const SystemStatus = () => {
    const [systemHealth, setSystemHealth] = useState({
        database: false,
        authentication: false,
        api: false,
        features: {
            tickets: false,
            users: false,
            templates: false,
            reports: false,
            activityLogs: false,
            cancellation: false,
            merging: false,
        }
    });
    const [stats, setStats] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkSystemHealth();
    }, []);

    const checkSystemHealth = async () => {
        setLoading(true);
        const health = { ...systemHealth };

        try {
            // Test API connectivity
            const apiTest = await api.get('/test');
            health.api = apiTest.status === 200;

            // Test authentication
            const authTest = await api.get('/me');
            health.authentication = authTest.status === 200;
            health.database = true; // If we can authenticate, DB is working

            // Test individual features
            try {
                await api.get('/tickets');
                health.features.tickets = true;
            } catch (error) {
                console.warn('Tickets API not available:', error);
            }

            try {
                await api.get('/ticket-templates');
                health.features.templates = true;
            } catch (error) {
                console.warn('Templates API not available:', error);
            }

            try {
                await api.get('/tickets/reports');
                health.features.reports = true;
            } catch (error) {
                console.warn('Reports API not available:', error);
            }

            try {
                await api.get('/activity-logs');
                health.features.activityLogs = true;
            } catch (error) {
                console.warn('Activity Logs API not available:', error);
            }

            try {
                await api.get('/tickets/cancelled');
                health.features.cancellation = true;
            } catch (error) {
                console.warn('Cancellation API not available:', error);
            }

            try {
                await api.get('/tickets/merges');
                health.features.merging = true;
            } catch (error) {
                console.warn('Merging API not available:', error);
            }

            // Get system stats
            try {
                const statsResponse = await api.get('/tickets/stats');
                setStats(statsResponse.data);
            } catch (error) {
                console.warn('Stats not available:', error);
            }

        } catch (error) {
            console.error('System health check failed:', error);
        }

        setSystemHealth(health);
        setLoading(false);
    };

    const getStatusIcon = (status) => {
        if (status) {
            return <CheckCircle className="h-5 w-5 text-green-500" />;
        }
        return <XCircle className="h-5 w-5 text-red-500" />;
    };

    const getOverallHealth = () => {
        const coreServices = [systemHealth.database, systemHealth.authentication, systemHealth.api];
        const coreHealthy = coreServices.every(Boolean);
        
        const featureServices = Object.values(systemHealth.features);
        const featuresHealthy = featureServices.filter(Boolean).length;
        const totalFeatures = featureServices.length;
        
        if (coreHealthy && featuresHealthy === totalFeatures) {
            return { status: 'healthy', text: 'All Systems Operational', color: 'text-green-600' };
        } else if (coreHealthy && featuresHealthy >= totalFeatures * 0.5) {
            return { status: 'degraded', text: 'Partial Service Available', color: 'text-yellow-600' };
        } else {
            return { status: 'down', text: 'Service Disruption', color: 'text-red-600' };
        }
    };

    const overallHealth = getOverallHealth();

    const featureDetails = [
        { key: 'tickets', name: 'Ticket Management', icon: Ticket, description: 'Create, view, and manage support tickets' },
        { key: 'users', name: 'User Management', icon: Users, description: 'User authentication and role-based access' },
        { key: 'templates', name: 'Ticket Templates', icon: FileText, description: 'Dynamic form builder and templates' },
        { key: 'reports', name: 'Reports & Analytics', icon: BarChart3, description: 'System reporting and data visualization' },
        { key: 'activityLogs', name: 'Activity Logging', icon: Activity, description: 'Comprehensive audit trail system' },
        { key: 'cancellation', name: 'Ticket Cancellation', icon: Archive, description: 'Irrelevant and duplicate ticket workflows' },
        { key: 'merging', name: 'Duplicate Merging', icon: Merge, description: 'Merge duplicate tickets and manage relationships' },
    ];

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">System Status Dashboard</h1>
                <p className="text-gray-600">Help Desk Ticketing System - Production Ready</p>
            </div>

            {/* Overall Status */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className={`p-3 rounded-full ${overallHealth.status === 'healthy' ? 'bg-green-100' : overallHealth.status === 'degraded' ? 'bg-yellow-100' : 'bg-red-100'}`}>
                            {overallHealth.status === 'healthy' ? (
                                <CheckCircle className="h-8 w-8 text-green-600" />
                            ) : overallHealth.status === 'degraded' ? (
                                <AlertCircle className="h-8 w-8 text-yellow-600" />
                            ) : (
                                <XCircle className="h-8 w-8 text-red-600" />
                            )}
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">{overallHealth.text}</h2>
                            <p className="text-gray-600">Help Desk Ticketing System v1.0</p>
                        </div>
                    </div>
                    <button
                        onClick={checkSystemHealth}
                        disabled={loading}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
                    >
                        {loading ? 'Checking...' : 'Refresh Status'}
                    </button>
                </div>
            </div>

            {/* Core Services */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <Database className="h-8 w-8 text-indigo-600" />
                            <div>
                                <h3 className="text-lg font-semibold">Database</h3>
                                <p className="text-sm text-gray-600">SQLite Connection</p>
                            </div>
                        </div>
                        {getStatusIcon(systemHealth.database)}
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <Shield className="h-8 w-8 text-indigo-600" />
                            <div>
                                <h3 className="text-lg font-semibold">Authentication</h3>
                                <p className="text-sm text-gray-600">Laravel Sanctum</p>
                            </div>
                        </div>
                        {getStatusIcon(systemHealth.authentication)}
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <Server className="h-8 w-8 text-indigo-600" />
                            <div>
                                <h3 className="text-lg font-semibold">API Server</h3>
                                <p className="text-sm text-gray-600">Laravel 11 API</p>
                            </div>
                        </div>
                        {getStatusIcon(systemHealth.api)}
                    </div>
                </div>
            </div>

            {/* System Statistics */}
            {Object.keys(stats).length > 0 && (
                <div className="bg-white rounded-lg shadow p-6 mb-8">
                    <h3 className="text-lg font-semibold mb-4">System Statistics</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-indigo-600">{stats.total_tickets || 0}</div>
                            <div className="text-sm text-gray-600">Total Tickets</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">{stats.open_tickets || 0}</div>
                            <div className="text-sm text-gray-600">Open Tickets</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">{stats.resolved_tickets || 0}</div>
                            <div className="text-sm text-gray-600">Resolved</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-red-600">{stats.cancelled_tickets || 0}</div>
                            <div className="text-sm text-gray-600">Cancelled</div>
                        </div>
                    </div>
                </div>
            )}

            {/* Feature Status */}
            <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b">
                    <h3 className="text-lg font-semibold">Feature Status</h3>
                    <p className="text-sm text-gray-600">Core system features and their operational status</p>
                </div>
                <div className="divide-y">
                    {featureDetails.map((feature) => {
                        const Icon = feature.icon;
                        const isHealthy = systemHealth.features[feature.key];
                        
                        return (
                            <div key={feature.key} className="p-6 flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className={`p-2 rounded-lg ${isHealthy ? 'bg-green-100' : 'bg-red-100'}`}>
                                        <Icon className={`h-6 w-6 ${isHealthy ? 'text-green-600' : 'text-red-600'}`} />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900">{feature.name}</h4>
                                        <p className="text-sm text-gray-600">{feature.description}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    {getStatusIcon(isHealthy)}
                                    <span className={`text-sm font-medium ${isHealthy ? 'text-green-600' : 'text-red-600'}`}>
                                        {isHealthy ? 'Operational' : 'Unavailable'}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* System Information */}
            <div className="mt-8 bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">System Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                        <strong>Framework:</strong> Laravel 11 + React 18
                    </div>
                    <div>
                        <strong>Database:</strong> SQLite (Development) / MySQL (Production)
                    </div>
                    <div>
                        <strong>Authentication:</strong> Laravel Sanctum SPA
                    </div>
                    <div>
                        <strong>Frontend:</strong> React 18 + Vite + Tailwind CSS
                    </div>
                    <div>
                        <strong>State Management:</strong> React Query + Context API
                    </div>
                    <div>
                        <strong>Charts:</strong> Recharts Library
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SystemStatus;
