'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Users, 
  Search, 
  Trash2,
  CheckCircle,
  XCircle,
  Crown,
  Shield,
  User as UserIcon,
  Plus,
  Download,
  Eye,
  RefreshCw,
  X,
  Mail,
  Phone,
  UserCheck
} from 'lucide-react';

interface User {
  _id: string;
  name: string;
  email?: string;
  phoneNumber?: string;
  role: 'user' | 'admin' | 'super_admin';
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  createdAt: string;
  lastLogin?: string;
  blogsCount: number;
  avatar?: string;
  emailVerified: boolean;
  isVerified: boolean;
  isActive: boolean;
}

interface UserStats {
  total: number;
  active: number;
  inactive: number;
  banned: number;
  admins: number;
}

interface NewUser {
  name: string;
  email: string;
  phoneNumber: string;
  role: 'user' | 'admin' | 'super_admin';
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
}

export default function UserManagement() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userStats, setUserStats] = useState<UserStats>({
    total: 0,
    active: 0,
    inactive: 0,
    banned: 0,
    admins: 0
  });
  const [refreshing, setRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  
  // Debug logging for modal state
  useEffect(() => {
    console.log('Modal state changed:', showAddUserModal);
  }, [showAddUserModal]);
  const [addingUser, setAddingUser] = useState(false);
  const [newUser, setNewUser] = useState<NewUser>({
    name: '',
    email: '',
    phoneNumber: '',
    role: 'user',
    status: 'approved'
  });

  const fetchUsers = useCallback(async (showRefreshing = false) => {
    if (showRefreshing) {
      setRefreshing(true);
    }
    
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
        calculateStats(data.users || []);
        setLastRefresh(new Date());
      } else {
        // Mock data for development with current timestamps
        const now = new Date();
        const mockUsers: User[] = [
          {
            _id: '1',
            name: 'Priya Sharma',
            email: 'priya@example.com',
            role: 'user',
            status: 'approved',
            createdAt: '2024-01-15T10:30:00Z',
            lastLogin: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
            blogsCount: 5,
            emailVerified: true,
            isVerified: true,
            isActive: true
          },
          {
            _id: '2',
            name: 'Raj Patel',
            email: 'raj@example.com',
            role: 'admin',
            status: 'approved',
            createdAt: '2024-01-10T08:15:00Z',
            lastLogin: new Date(now.getTime() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
            blogsCount: 12,
            emailVerified: true,
            isVerified: true,
            isActive: true
          },
          {
            _id: '3',
            name: 'Anita Singh',
            email: 'anita@example.com',
            role: 'user',
            status: 'pending',
            createdAt: '2024-01-12T12:00:00Z',
            lastLogin: '2024-01-18T09:30:00Z',
            blogsCount: 2,
            emailVerified: false,
            isVerified: false,
            isActive: false
          },
          {
            _id: '4',
            name: 'Vikram Joshi',
            email: 'vikram@example.com',
            role: 'user',
            status: 'suspended',
            createdAt: '2024-01-08T16:20:00Z',
            lastLogin: '2024-01-15T11:10:00Z',
            blogsCount: 0,
            emailVerified: true,
            isVerified: false,
            isActive: false
          },
          {
            _id: '5',
            name: 'Admin User',
            email: 'admin@example.com',
            role: 'super_admin',
            status: 'approved',
            createdAt: '2024-01-01T00:00:00Z',
            lastLogin: new Date(now.getTime() - 5 * 60 * 1000).toISOString(), // 5 minutes ago
            blogsCount: 25,
            emailVerified: true,
            isVerified: true,
            isActive: true
          }
        ];
        setUsers(mockUsers);
        calculateStats(mockUsers);
        setLastRefresh(new Date());
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const filterUsers = useCallback(() => {
    let filtered = users;

    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(user => user.status === statusFilter);
    }

    setFilteredUsers(filtered);
  }, [users, searchTerm, roleFilter, statusFilter]);

  useEffect(() => {
    fetchCurrentUser();
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    filterUsers();
  }, [filterUsers]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchUsers(true);
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [fetchUsers]);

  const fetchCurrentUser = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setCurrentUser(data.user);
      }
    } catch (error) {
      console.error('Failed to fetch current user:', error);
    }
  };

  const calculateStats = (userList: User[]) => {
    const stats = userList.reduce((acc, user) => {
      acc.total++;
      if (user.status === 'approved') acc.active++;
      if (user.status === 'pending') acc.inactive++;
      if (user.status === 'suspended') acc.banned++;
      if (user.role === 'admin' || user.role === 'super_admin') acc.admins++;
      return acc;
    }, {
      total: 0,
      active: 0,
      inactive: 0,
      banned: 0,
      admins: 0
    });
    setUserStats(stats);
  };

  const updateUserStatus = async (userId: string, newStatus: 'pending' | 'approved' | 'rejected' | 'suspended') => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (response.ok) {
        setUsers(users.map(user => 
          user._id === userId ? { ...user, status: newStatus } : user
        ));
      } else {
        const errorData = await response.json();
        alert(`Failed to update user status: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Failed to update user status:', error);
      alert('Failed to update user status. Please try again.');
    }
  };

  const updateUserRole = async (userId: string, newRole: 'user' | 'admin' | 'super_admin') => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ role: newRole })
      });
      
      if (response.ok) {
        setUsers(users.map(user => 
          user._id === userId ? { ...user, role: newRole } : user
        ));
      } else {
        const errorData = await response.json();
        alert(`Failed to update user role: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Failed to update user role:', error);
      alert('Failed to update user role. Please try again.');
    }
  };

  const deleteUser = async (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await fetch(`/api/admin/users/${userId}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (response.ok) {
          // Remove user from local state
          setUsers(users.filter(user => user._id !== userId));
          // Recalculate stats
          calculateStats(users.filter(user => user._id !== userId));
        } else {
          const errorData = await response.json();
          alert(`Failed to delete user: ${errorData.error || 'Unknown error'}`);
        }
      } catch (error) {
        console.error('Failed to delete user:', error);
        alert('Failed to delete user. Please try again.');
      }
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'super_admin': return <Crown className="h-4 w-4 text-purple-600" />;
      case 'admin': return <Shield className="h-4 w-4 text-blue-600" />;
      default: return <UserIcon className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      approved: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      rejected: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
      suspended: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
    };
    return badges[status as keyof typeof badges] || badges.pending;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return 'Just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 2592000) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    } else {
      return formatDate(dateString);
    }
  };

  const statsCards = [
    {
      title: 'Total Users',
      value: userStats.total,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20'
    },
    {
      title: 'Active Users',
      value: userStats.active,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20'
    },
    {
      title: 'Inactive Users',
      value: userStats.inactive,
      icon: XCircle,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20'
    },
    {
      title: 'Admin Users',
      value: userStats.admins,
      icon: Shield,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20'
    }
  ];

  const exportUsers = () => {
    try {
      // Prepare data for export
      const exportData = filteredUsers.map(user => ({
        Name: user.name,
        Email: user.email || '',
        Phone: user.phoneNumber || '',
        Role: user.role.replace('_', ' '),
        Status: user.status,
        'Joined Date': formatDate(user.createdAt),
        'Last Login': user.lastLogin ? formatDate(user.lastLogin) : 'Never',
        'Blogs Count': user.blogsCount,
        'Email Verified': user.emailVerified ? 'Yes' : 'No',
        'Is Active': user.isActive ? 'Yes' : 'No'
      }));

      // Convert to CSV
      const headers = Object.keys(exportData[0]);
      const csvContent = [
        headers.join(','),
        ...exportData.map(row => 
          headers.map(header => {
            const value = row[header as keyof typeof row];
            // Escape commas and quotes in CSV
            if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
              return `"${value.replace(/"/g, '""')}"`;
            }
            return value;
          }).join(',')
        )
      ].join('\n');

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `users_export_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export users. Please try again.');
    }
  };

  const handleAddUser = async () => {
    console.log('handleAddUser called with:', newUser);
    if (!newUser.name || !newUser.email || !newUser.phoneNumber) {
      alert('Please fill in all required fields.');
      return;
    }

    setAddingUser(true);
    try {
      const token = localStorage.getItem('accessToken');
      console.log('Making API call to create user with token:', token ? 'Present' : 'Missing');
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(newUser)
      });

      if (response.ok) {
        alert('User created successfully!');
        setShowAddUserModal(false);
        setNewUser({
          name: '',
          email: '',
          phoneNumber: '',
          role: 'user',
          status: 'approved'
        });
        // Refresh the users list
        fetchUsers(true);
      } else {
        const errorData = await response.json();
        alert(`Failed to create user: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Failed to create user:', error);
      alert('Failed to create user. Please try again.');
    } finally {
      setAddingUser(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-6 animate-pulse">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">User Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage user accounts, roles, and permissions
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Last updated: {lastRefresh.toLocaleTimeString()}
          </p>
        </div>
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <button 
            onClick={() => fetchUsers(true)}
            disabled={refreshing}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl transition-colors disabled:opacity-50"
            title="Refresh data"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
          </button>
          <button 
            onClick={exportUsers}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
          <button 
            onClick={() => {
              console.log('Add User button clicked');
              setShowAddUserModal(true);
            }}
            className="flex items-center space-x-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Add User</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((card, index) => {
          const IconComponent = card.icon;
          return (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{card.title}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{card.value}</p>
                </div>
                <div className={`p-3 rounded-xl ${card.bgColor}`}>
                  <IconComponent className={`h-6 w-6 ${card.color}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters and Search */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
          
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center space-x-4">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="all">All Roles</option>
              <option value="user">Users</option>
              <option value="admin">Admins</option>
              <option value="super_admin">Super Admins</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Last Login
                </th>
                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredUsers.map((user) => (
                <tr 
                  key={user._id} 
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer"
                  onClick={() => router.push(`/admin/users/${user._id}`)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className={`w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center text-white font-bold text-sm ${
                        user.role === 'super_admin' 
                          ? 'bg-gradient-to-r from-purple-600 to-orange-600' 
                          : user.role === 'admin' 
                          ? 'bg-gradient-to-r from-blue-600 to-orange-600'
                          : 'bg-gradient-to-r from-gray-600 to-gray-700'
                      }`}>
                        {user.avatar ? (
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span>{user.name.charAt(0).toUpperCase()}</span>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {user.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {getRoleIcon(user.role)}
                      <span className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                        {user.role.replace('_', ' ')}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(user.status)}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(user.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {user.lastLogin ? (
                      <div>
                        <div>{formatRelativeTime(user.lastLogin)}</div>
                        <div className="text-xs text-gray-400 dark:text-gray-500">
                          {formatDate(user.lastLogin)}
                        </div>
                      </div>
                    ) : 'Never'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => router.push(`/admin/users/${user._id}`)}
                        className="p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      
                      {currentUser?.role === 'super_admin' && user._id !== currentUser._id && (
                        <>
                          <select
                            value={user.role}
                            onChange={(e) => updateUserRole(user._id, e.target.value as 'user' | 'admin' | 'super_admin')}
                            className="text-xs px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                            {currentUser.role === 'super_admin' && (
                              <option value="super_admin">Super Admin</option>
                            )}
                          </select>
                          
                          <select
                            value={user.status}
                            onChange={(e) => updateUserStatus(user._id, e.target.value as 'pending' | 'approved' | 'rejected' | 'suspended')}
                            className="text-xs px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          >
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                            <option value="suspended">Suspended</option>
                          </select>

                          <button
                            onClick={() => deleteUser(user._id)}
                            className="p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                            title="Delete User"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No users found</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        )}
      </div>

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Add New User</h2>
              <button
                onClick={() => setShowAddUserModal(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Enter full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Enter email address"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Phone Number *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="tel"
                    value={newUser.phoneNumber}
                    onChange={(e) => setNewUser({ ...newUser, phoneNumber: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Enter phone number"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Role
                  </label>
                  <select
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value as 'user' | 'admin' | 'super_admin' })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                    {currentUser?.role === 'super_admin' && (
                      <option value="super_admin">Super Admin</option>
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Status
                  </label>
                  <select
                    value={newUser.status}
                    onChange={(e) => setNewUser({ ...newUser, status: e.target.value as 'pending' | 'approved' | 'rejected' | 'suspended' })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="approved">Approved</option>
                    <option value="pending">Pending</option>
                    <option value="rejected">Rejected</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowAddUserModal(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddUser}
                disabled={addingUser || !newUser.name || !newUser.email || !newUser.phoneNumber}
                className="flex items-center space-x-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {addingUser ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <UserCheck className="h-4 w-4" />
                    <span>Create User</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 