'use client';

import { useState, useEffect } from 'react';
import { 
  Users, 
  FileText, 
  MessageSquare, 
  Shield, 
  Crown,
  Settings,
  Activity,
  AlertTriangle,
  CheckCircle,
  XCircle,
  UserPlus,
  UserMinus,
  RefreshCw,
  Database,
  BarChart3,
  Download,
  Wrench
} from 'lucide-react';

interface PlatformStats {
  totalUsers: number;
  totalBlogs: number;
  totalComments: number;
  newUsersToday: number;
  newBlogsToday: number;
  newCommentsToday: number;
}

interface RoleStats {
  super_admin: number;
  admin: number;
  user: number;
}

interface StatusStats {
  published: number;
  draft: number;
  archived: number;
  banned: number;
}

interface RecentActivity {
  _id: string;
  title: string;
  status: string;
  updatedAt: string;
  author: {
    _id: string;
    name: string;
    email: string;
    role: string;
  };
}

interface SystemHealth {
  database: string;
  timestamp: string;
  uptime: number;
}

interface SuperAdminData {
  platformStats: PlatformStats;
  roleStats: RoleStats;
  statusStats: StatusStats;
  recentActivity: RecentActivity[];
  systemHealth: SystemHealth;
}

interface ActionData {
  email?: string;
  userIds?: string;
}

export default function SuperAdminDashboard() {
  const [data, setData] = useState<SuperAdminData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [selectedAction, setSelectedAction] = useState<string>('');
  const [actionData, setActionData] = useState<ActionData>({});

  useEffect(() => {
    fetchSuperAdminData();
  }, []);

  const fetchSuperAdminData = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('accessToken');
      if (!token) {
        setError('Authentication required');
        return;
      }

      const response = await fetch('/api/admin/super-admin', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch Super Admin data');
      }

      const superAdminData = await response.json();
      setData(superAdminData);

    } catch (err) {
      console.error('Error fetching Super Admin data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const performSuperAdminAction = async (action: string, data: Record<string, unknown> | ActionData) => {
    try {
      setActionLoading(true);
      setError(null);

      const token = localStorage.getItem('accessToken');
      if (!token) {
        setError('Authentication required');
        return;
      }

      const response = await fetch('/api/admin/super-admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ action, data })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to perform action');
      }

      const result = await response.json();
      
      // Refresh data after successful action
      await fetchSuperAdminData();
      
      // Show success message (you can implement a toast notification here)
      alert(result.message);

    } catch (err) {
      console.error('Error performing Super Admin action:', err);
      setError(err instanceof Error ? err.message : 'Failed to perform action');
    } finally {
      setActionLoading(false);
      setSelectedAction('');
      setActionData({});
    }
  };

  const formatUptime = (uptime: number) => {
    const days = Math.floor(uptime / 86400);
    const hours = Math.floor((uptime % 86400) / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    
    if (days > 0) return `${days}d ${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'text-green-600 bg-green-100';
      case 'draft': return 'text-yellow-600 bg-yellow-100';
      case 'archived': return 'text-gray-600 bg-gray-100';
      case 'banned': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'super_admin': return 'text-purple-600 bg-purple-100';
      case 'admin': return 'text-blue-600 bg-blue-100';
      case 'user': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="animate-spin h-12 w-12 text-orange-600 mx-auto mb-4"></RefreshCw>
          <p className="text-gray-300">Loading Super Admin Dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-600 mx-auto mb-4"></AlertTriangle>
          <p className="text-red-300 mb-4">{error}</p>
          <button
            onClick={fetchSuperAdminData}
            className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="h-12 w-12 text-red-600 mx-auto mb-4"></XCircle>
          <p className="text-red-300">No data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900 to-indigo-900 shadow-lg border-b border-purple-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center">
                <Crown className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Super Admin Dashboard</h1>
                <p className="text-purple-200 mt-1">Complete platform control and management</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button 
                onClick={fetchSuperAdminData}
                disabled={loading}
                className="flex items-center space-x-2 bg-purple-700 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
              <div className="flex items-center space-x-2 bg-purple-800 px-3 py-2 rounded-lg">
                <Shield className="h-4 w-4 text-purple-300" />
                <span className="text-purple-200 text-sm font-medium">Super Admin</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Platform Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">Total Users</p>
                <p className="text-3xl font-bold text-white mt-2">{data.platformStats.totalUsers.toLocaleString()}</p>
                <p className="text-green-400 text-sm mt-1">+{data.platformStats.newUsersToday} today</p>
              </div>
              <div className="p-3 bg-blue-900 rounded-lg">
                <Users className="h-6 w-6 text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">Total Blogs</p>
                <p className="text-3xl font-bold text-white mt-2">{data.platformStats.totalBlogs.toLocaleString()}</p>
                <p className="text-green-400 text-sm mt-1">+{data.platformStats.newBlogsToday} today</p>
              </div>
              <div className="p-3 bg-green-900 rounded-lg">
                <FileText className="h-6 w-6 text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">Total Comments</p>
                <p className="text-3xl font-bold text-white mt-2">{data.platformStats.totalComments.toLocaleString()}</p>
                <p className="text-green-400 text-sm mt-1">+{data.platformStats.newCommentsToday} today</p>
              </div>
              <div className="p-3 bg-purple-900 rounded-lg">
                <MessageSquare className="h-6 w-6 text-purple-400" />
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">System Uptime</p>
                <p className="text-3xl font-bold text-white mt-2">{formatUptime(data.systemHealth.uptime)}</p>
                <p className="text-green-400 text-sm mt-1">Database: {data.systemHealth.database}</p>
              </div>
              <div className="p-3 bg-orange-900 rounded-lg">
                <Activity className="h-6 w-6 text-orange-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Role and Status Statistics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* User Roles */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Users className="h-5 w-5 mr-2 text-blue-400" />
              User Roles Distribution
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
                  <span className="text-gray-300">Super Admins</span>
                </div>
                <span className="text-white font-semibold">{data.roleStats.super_admin}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-300">Admins</span>
                </div>
                <span className="text-white font-semibold">{data.roleStats.admin}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                  <span className="text-gray-300">Users</span>
                </div>
                <span className="text-white font-semibold">{data.roleStats.user}</span>
              </div>
            </div>
          </div>

          {/* Blog Status */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <FileText className="h-5 w-5 mr-2 text-green-400" />
              Blog Status Distribution
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                  <span className="text-gray-300">Published</span>
                </div>
                <span className="text-white font-semibold">{data.statusStats.published}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                  <span className="text-gray-300">Drafts</span>
                </div>
                <span className="text-white font-semibold">{data.statusStats.draft}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-gray-500 rounded-full"></div>
                  <span className="text-gray-300">Archived</span>
                </div>
                <span className="text-white font-semibold">{data.statusStats.archived}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                  <span className="text-gray-300">Banned</span>
                </div>
                <span className="text-white font-semibold">{data.statusStats.banned}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Super Admin Actions */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-8">
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center">
            <Settings className="h-5 w-5 mr-2 text-purple-400" />
            Super Admin Actions
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* User Management */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-300">User Management</h4>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedAction('promote_user')}
                  className="w-full flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  <UserPlus className="h-4 w-4" />
                  <span>Promote to Admin</span>
                </button>
                <button
                  onClick={() => setSelectedAction('demote_user')}
                  className="w-full flex items-center space-x-2 px-3 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm"
                >
                  <UserMinus className="h-4 w-4" />
                  <span>Demote Admin</span>
                </button>
              </div>
            </div>

            {/* System Maintenance */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-300">System Maintenance</h4>
              <div className="space-y-2">
                <button
                  onClick={() => performSuperAdminAction('system_maintenance', { action: 'cleanup_orphaned_data' })}
                  disabled={actionLoading}
                  className="w-full flex items-center space-x-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm disabled:opacity-50"
                >
                  <Wrench className="h-4 w-4" />
                  <span>Cleanup Data</span>
                </button>
                <button
                  onClick={() => setSelectedAction('system_health')}
                  className="w-full flex items-center space-x-2 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
                >
                  <Database className="h-4 w-4" />
                  <span>System Health</span>
                </button>
              </div>
            </div>

            {/* Bulk Actions */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-300">Bulk Actions</h4>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedAction('bulk_approve')}
                  className="w-full flex items-center space-x-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                >
                  <CheckCircle className="h-4 w-4" />
                  <span>Bulk Approve</span>
                </button>
                <button
                  onClick={() => setSelectedAction('bulk_suspend')}
                  className="w-full flex items-center space-x-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                >
                  <XCircle className="h-4 w-4" />
                  <span>Bulk Suspend</span>
                </button>
              </div>
            </div>

            {/* Advanced Features */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-300">Advanced Features</h4>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedAction('export_data')}
                  className="w-full flex items-center space-x-2 px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm"
                >
                  <Download className="h-4 w-4" />
                  <span>Export Data</span>
                </button>
                <button
                  onClick={() => setSelectedAction('platform_analytics')}
                  className="w-full flex items-center space-x-2 px-3 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm"
                >
                  <BarChart3 className="h-4 w-4" />
                  <span>Analytics</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center">
            <Activity className="h-5 w-5 mr-2 text-orange-400" />
            Recent Platform Activity
          </h3>
          
          <div className="space-y-4">
            {data.recentActivity.map((activity) => (
              <div key={activity._id} className="flex items-center justify-between p-4 bg-gray-750 rounded-lg border border-gray-700">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">
                        {activity.author.name.charAt(0)}
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-white font-medium">{activity.title}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(activity.status)}`}>
                        {activity.status}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(activity.author.role)}`}>
                        {activity.author.role}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-gray-400 text-sm">{activity.author.name}</p>
                  <p className="text-gray-500 text-xs">
                    {new Date(activity.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Modals */}
        {selectedAction && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4">
                {selectedAction === 'promote_user' && 'Promote User to Admin'}
                {selectedAction === 'demote_user' && 'Demote Admin to User'}
                {selectedAction === 'bulk_approve' && 'Bulk Approve Users'}
                {selectedAction === 'bulk_suspend' && 'Bulk Suspend Users'}
                {selectedAction === 'system_health' && 'System Health Check'}
                {selectedAction === 'export_data' && 'Export Platform Data'}
                {selectedAction === 'platform_analytics' && 'Platform Analytics'}
              </h3>
              
              <div className="space-y-4">
                {selectedAction === 'promote_user' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      User Email
                    </label>
                    <input
                      type="email"
                      value={actionData.email || ''}
                      onChange={(e) => setActionData({ ...actionData, email: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Enter user email"
                    />
                  </div>
                )}
                
                {selectedAction === 'demote_user' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Admin Email
                    </label>
                    <input
                      type="email"
                      value={actionData.email || ''}
                      onChange={(e) => setActionData({ ...actionData, email: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Enter admin email"
                    />
                  </div>
                )}
                
                {(selectedAction === 'bulk_approve' || selectedAction === 'bulk_suspend') && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      User IDs (comma-separated)
                    </label>
                    <textarea
                      value={actionData.userIds || ''}
                      onChange={(e) => setActionData({ ...actionData, userIds: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Enter user IDs separated by commas"
                      rows={3}
                    />
                  </div>
                )}
              </div>
              
              <div className="flex items-center justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setSelectedAction('');
                    setActionData({});
                  }}
                  className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    // Handle the action based on selectedAction
                    if (selectedAction === 'promote_user') {
                      // You would need to implement user lookup by email
                      alert('User promotion feature - implement user lookup by email');
                    } else if (selectedAction === 'demote_user') {
                      // You would need to implement user lookup by email
                      alert('User demotion feature - implement user lookup by email');
                    } else if (selectedAction === 'bulk_approve') {
                      const userIds = actionData.userIds?.split(',').map((id: string) => id.trim()) || [];
                      performSuperAdminAction('bulk_user_action', { action: 'approve', userIds });
                    } else if (selectedAction === 'bulk_suspend') {
                      const userIds = actionData.userIds?.split(',').map((id: string) => id.trim()) || [];
                      performSuperAdminAction('bulk_user_action', { action: 'suspend', userIds });
                    } else {
                      alert(`${selectedAction} feature - implement specific functionality`);
                    }
                  }}
                  disabled={actionLoading}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                >
                  {actionLoading ? 'Processing...' : 'Execute'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 