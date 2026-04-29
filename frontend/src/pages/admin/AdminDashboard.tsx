import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { toast } from '@/hooks/use-toast';
import { api } from '@/lib/api';
import { 
  Users, 
  DollarSign, 
  Activity,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Search,
  Filter,
  Eye,
  Edit,
  Ban,
  Shield,
  Calendar,
  Trash2,
  UserCheck,
  UserX,
  Plus,
  Megaphone,
  RefreshCw,
  Settings,
  Package,
  Bell,
  XCircle,
  Clock,
  MailCheck,
  Phone
} from 'lucide-react';

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: 'customer' | 'worker' | 'admin';
  accountStatus: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  createdAt: string;
}

interface Worker extends User {
  profile?: {
    verificationStatus: string;
    skills: string[];
    experience: number;
    rating: number;
  };
}

interface Service {
  _id: string;
  name: string;
  description: string;
  category: string;
  basePrice: number;
  duration: number;
  isActive: boolean;
}

interface Announcement {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  targetAudience: 'all' | 'customers' | 'workers';
  isActive: boolean;
  createdAt: string;
  expiresAt?: string;
}

interface Stats {
  totalUsers: number;
  totalWorkers: number;
  totalBookings: number;
  revenue: number;
  activeUsers: number;
  pendingVerifications: number;
  totalServices: number;
  todayBookings: number;
  todayRevenue: number;
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Dialogs
  const [showAddServiceDialog, setShowAddServiceDialog] = useState(false);
  const [showAddAnnouncementDialog, setShowAddAnnouncementDialog] = useState(false);
  
  // Forms
  const [newService, setNewService] = useState({
    name: '',
    description: '',
    category: 'home',
    basePrice: 0,
    duration: 60,
    isActive: true
  });
  
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    message: '',
    type: 'info' as const,
    targetAudience: 'all' as const,
    expiresAt: ''
  });

  // Fetch data on mount
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchStats(),
        fetchUsers(),
        fetchWorkers(),
        fetchServices(),
        fetchAnnouncements()
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load dashboard data',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get('/admin/stats');
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await api.get('/admin/users', {
        params: { limit: 100 }
      });
      if (response.data.success) {
        setUsers(response.data.data.users);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchWorkers = async () => {
    try {
      const response = await api.get('/admin/workers', {
        params: { limit: 100 }
      });
      if (response.data.success) {
        setWorkers(response.data.data.workers);
      }
    } catch (error) {
      console.error('Error fetching workers:', error);
    }
  };

  const fetchServices = async () => {
    try {
      const response = await api.get('/admin/services', {
        params: { limit: 100 }
      });
      if (response.data.success) {
        setServices(response.data.data.services);
      }
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  const fetchAnnouncements = async () => {
    try {
      const response = await api.get('/admin/announcements');
      if (response.data.success) {
        setAnnouncements(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching announcements:', error);
    }
  };

  // User actions
  const verifyUser = async (userId: string, type: 'email' | 'phone' | 'both') => {
    try {
      await api.post(`/admin/users/${userId}/verify`, { verificationType: type });
      toast({ title: 'Success', description: 'User verified successfully' });
      fetchUsers();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to verify user', variant: 'destructive' });
    }
  };

  const banUser = async (userId: string, reason: string) => {
    try {
      await api.post(`/admin/users/${userId}/ban`, { reason });
      toast({ title: 'Success', description: 'User banned successfully' });
      fetchUsers();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to ban user', variant: 'destructive' });
    }
  };

  const unbanUser = async (userId: string) => {
    try {
      await api.post(`/admin/users/${userId}/unban`);
      toast({ title: 'Success', description: 'User unbanned successfully' });
      fetchUsers();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to unban user', variant: 'destructive' });
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      await api.delete(`/admin/users/${userId}`);
      toast({ title: 'Success', description: 'User deleted successfully' });
      fetchUsers();
      fetchStats();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete user', variant: 'destructive' });
    }
  };

  // Worker actions
  const verifyWorker = async (workerId: string) => {
    try {
      await api.post(`/admin/workers/${workerId}/verify`);
      toast({ title: 'Success', description: 'Worker verified successfully' });
      fetchWorkers();
      fetchStats();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to verify worker', variant: 'destructive' });
    }
  };

  const rejectWorker = async (workerId: string, reason: string) => {
    try {
      await api.post(`/admin/workers/${workerId}/reject`, { reason });
      toast({ title: 'Success', description: 'Worker rejected' });
      fetchWorkers();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to reject worker', variant: 'destructive' });
    }
  };

  const deleteWorker = async (workerId: string) => {
    try {
      await api.delete(`/admin/workers/${workerId}`);
      toast({ title: 'Success', description: 'Worker deleted successfully' });
      fetchWorkers();
      fetchStats();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete worker', variant: 'destructive' });
    }
  };

  // Service actions
  const createService = async () => {
    try {
      await api.post('/admin/services', newService);
      toast({ title: 'Success', description: 'Service created successfully' });
      setShowAddServiceDialog(false);
      setNewService({ name: '', description: '', category: 'home', basePrice: 0, duration: 60, isActive: true });
      fetchServices();
      fetchStats();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to create service', variant: 'destructive' });
    }
  };

  const toggleServiceStatus = async (serviceId: string, isActive: boolean) => {
    try {
      await api.put(`/admin/services/${serviceId}`, { isActive: !isActive });
      toast({ title: 'Success', description: `Service ${!isActive ? 'activated' : 'deactivated'}` });
      fetchServices();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update service', variant: 'destructive' });
    }
  };

  const deleteService = async (serviceId: string) => {
    try {
      await api.delete(`/admin/services/${serviceId}`);
      toast({ title: 'Success', description: 'Service deleted successfully' });
      fetchServices();
      fetchStats();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete service', variant: 'destructive' });
    }
  };

  // Announcement actions
  const createAnnouncement = async () => {
    try {
      await api.post('/admin/announcements', newAnnouncement);
      toast({ title: 'Success', description: 'Announcement created successfully' });
      setShowAddAnnouncementDialog(false);
      setNewAnnouncement({ title: '', message: '', type: 'info', targetAudience: 'all', expiresAt: '' });
      fetchAnnouncements();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to create announcement', variant: 'destructive' });
    }
  };

  const toggleAnnouncementStatus = async (announcementId: string, isActive: boolean) => {
    try {
      await api.put(`/admin/announcements/${announcementId}`, { isActive: !isActive });
      toast({ title: 'Success', description: `Announcement ${!isActive ? 'activated' : 'deactivated'}` });
      fetchAnnouncements();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update announcement', variant: 'destructive' });
    }
  };

  const deleteAnnouncement = async (announcementId: string) => {
    try {
      await api.delete(`/admin/announcements/${announcementId}`);
      toast({ title: 'Success', description: 'Announcement deleted successfully' });
      fetchAnnouncements();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete announcement', variant: 'destructive' });
    }
  };

  // Filter users
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.accountStatus === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'suspended': return <Badge className="bg-red-100 text-red-800">Suspended</Badge>;
      case 'pending': return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      default: return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
    }
  };

  const getAnnouncementTypeBadge = (type: string) => {
    switch (type) {
      case 'info': return <Badge className="bg-blue-100 text-blue-800">Info</Badge>;
      case 'warning': return <Badge className="bg-yellow-100 text-yellow-800">Warning</Badge>;
      case 'success': return <Badge className="bg-green-100 text-green-800">Success</Badge>;
      case 'error': return <Badge className="bg-red-100 text-red-800">Alert</Badge>;
      default: return <Badge>{type}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <RefreshCw className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading dashboard...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Welcome back! Manage your platform efficiently.</p>
        </div>
        <Button onClick={fetchAllData} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh Data
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalUsers?.toLocaleString() || 0}</div>
            <p className="text-xs text-muted-foreground">Registered customers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Workers</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalWorkers?.toLocaleString() || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.pendingVerifications || 0} pending verification
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalBookings?.toLocaleString() || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.todayBookings || 0} today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{stats?.revenue?.toLocaleString() || 0}</div>
            <p className="text-xs text-muted-foreground">
              ₹{stats?.todayRevenue?.toLocaleString() || 0} today
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Dialog open={showAddServiceDialog} onOpenChange={setShowAddServiceDialog}>
          <DialogTrigger asChild>
            <Button className="w-full" variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add Service
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Service</DialogTitle>
              <DialogDescription>Create a new service category for the platform</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label>Service Name</Label>
                <Input
                  value={newService.name}
                  onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                  placeholder="e.g., House Cleaning"
                />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  value={newService.description}
                  onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                  placeholder="Service description..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Category</Label>
                  <Select
                    value={newService.category}
                    onValueChange={(v) => setNewService({ ...newService, category: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="home">Home Services</SelectItem>
                      <SelectItem value="construction">Construction</SelectItem>
                      <SelectItem value="electrical">Electrical</SelectItem>
                      <SelectItem value="plumbing">Plumbing</SelectItem>
                      <SelectItem value="cleaning">Cleaning</SelectItem>
                      <SelectItem value="gardening">Gardening</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Base Price (₹)</Label>
                  <Input
                    type="number"
                    value={newService.basePrice}
                    onChange={(e) => setNewService({ ...newService, basePrice: Number(e.target.value) })}
                  />
                </div>
              </div>
              <div>
                <Label>Duration (minutes)</Label>
                <Input
                  type="number"
                  value={newService.duration}
                  onChange={(e) => setNewService({ ...newService, duration: Number(e.target.value) })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddServiceDialog(false)}>Cancel</Button>
              <Button onClick={createService}>Create Service</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={showAddAnnouncementDialog} onOpenChange={setShowAddAnnouncementDialog}>
          <DialogTrigger asChild>
            <Button className="w-full" variant="outline">
              <Megaphone className="h-4 w-4 mr-2" />
              New Announcement
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Announcement</DialogTitle>
              <DialogDescription>Send a message to all users or specific groups</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label>Title</Label>
                <Input
                  value={newAnnouncement.title}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                  placeholder="Announcement title..."
                />
              </div>
              <div>
                <Label>Message</Label>
                <Textarea
                  value={newAnnouncement.message}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, message: e.target.value })}
                  placeholder="Your message..."
                  rows={4}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Type</Label>
                  <Select
                    value={newAnnouncement.type}
                    onValueChange={(v: any) => setNewAnnouncement({ ...newAnnouncement, type: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="info">Info</SelectItem>
                      <SelectItem value="warning">Warning</SelectItem>
                      <SelectItem value="success">Success</SelectItem>
                      <SelectItem value="error">Alert</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Target Audience</Label>
                  <Select
                    value={newAnnouncement.targetAudience}
                    onValueChange={(v: any) => setNewAnnouncement({ ...newAnnouncement, targetAudience: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Users</SelectItem>
                      <SelectItem value="customers">Customers Only</SelectItem>
                      <SelectItem value="workers">Workers Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label>Expires At (optional)</Label>
                <Input
                  type="datetime-local"
                  value={newAnnouncement.expiresAt}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, expiresAt: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddAnnouncementDialog(false)}>Cancel</Button>
              <Button onClick={createAnnouncement}>Publish Announcement</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Button className="w-full" variant="outline" onClick={() => window.location.href = '/support'}>
          <Settings className="h-4 w-4 mr-2" />
          Platform Settings
        </Button>

        <Button className="w-full" variant="outline" onClick={() => window.location.href = '/support'}>
          <Activity className="h-4 w-4 mr-2" />
          View Reports
        </Button>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="users" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="users">Users ({users.length})</TabsTrigger>
          <TabsTrigger value="workers">Workers ({workers.length})</TabsTrigger>
          <TabsTrigger value="services">Services ({services.length})</TabsTrigger>
          <TabsTrigger value="announcements">Announcements</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Users Tab */}
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>User Management</CardTitle>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input 
                      placeholder="Search users..." 
                      className="pl-10 w-64"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Select value={roleFilter} onValueChange={setRoleFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      <SelectItem value="customer">Customers</SelectItem>
                      <SelectItem value="worker">Workers</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredUsers.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No users found
                  </div>
                ) : (
                  filteredUsers.map((user) => (
                    <div key={user._id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-center gap-4">
                        <Avatar>
                          <AvatarFallback>
                            {user.firstName?.[0]}{user.lastName?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{user.firstName} {user.lastName}</p>
                          <p className="text-sm text-gray-600">{user.email}</p>
                          <p className="text-xs text-gray-500">{user.phone || 'No phone'}</p>
                        </div>
                        <div className="flex gap-2">
                          <Badge variant="outline">{user.role}</Badge>
                          {getStatusBadge(user.accountStatus || 'active')}
                          {user.isEmailVerified && (
                            <Badge className="bg-blue-100 text-blue-800">
                              <MailCheck className="h-3 w-3 mr-1" /> Email
                            </Badge>
                          )}
                          {user.isPhoneVerified && (
                            <Badge className="bg-purple-100 text-purple-800">
                              <Phone className="h-3 w-3 mr-1" /> Phone
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {!user.isEmailVerified && (
                          <Button size="sm" variant="outline" onClick={() => verifyUser(user._id, 'email')}>
                            <MailCheck className="h-4 w-4 mr-1" /> Verify Email
                          </Button>
                        )}
                        {!user.isPhoneVerified && (
                          <Button size="sm" variant="outline" onClick={() => verifyUser(user._id, 'phone')}>
                            <Phone className="h-4 w-4 mr-1" /> Verify Phone
                          </Button>
                        )}
                        {user.accountStatus === 'suspended' ? (
                          <Button size="sm" variant="outline" onClick={() => unbanUser(user._id)}>
                            <UserCheck className="h-4 w-4 mr-1" /> Unban
                          </Button>
                        ) : (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button size="sm" variant="outline" className="text-orange-600">
                                <Ban className="h-4 w-4 mr-1" /> Ban
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Ban User?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will suspend {user.firstName}'s account. They won't be able to access the platform.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => banUser(user._id, 'Admin action')}>
                                  Ban User
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete User?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will permanently delete {user.firstName}'s account and all associated data. This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => deleteUser(user._id)} className="bg-red-600">
                                Delete Permanently
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Workers Tab */}
        <TabsContent value="workers">
          <Card>
            <CardHeader>
              <CardTitle>Worker Management</CardTitle>
              <CardDescription>Verify, manage, and monitor service providers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {workers.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No workers registered yet
                  </div>
                ) : (
                  workers.map((worker) => (
                    <div key={worker._id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-center gap-4">
                        <Avatar>
                          <AvatarFallback>
                            {worker.firstName?.[0]}{worker.lastName?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{worker.firstName} {worker.lastName}</p>
                          <p className="text-sm text-gray-600">{worker.email}</p>
                          <p className="text-xs text-gray-500">{worker.phone}</p>
                        </div>
                        <div className="flex gap-2">
                          {worker.profile?.verificationStatus === 'verified' ? (
                            <Badge className="bg-green-100 text-green-800">
                              <CheckCircle className="h-3 w-3 mr-1" /> Verified
                            </Badge>
                          ) : worker.profile?.verificationStatus === 'rejected' ? (
                            <Badge className="bg-red-100 text-red-800">
                              <XCircle className="h-3 w-3 mr-1" /> Rejected
                            </Badge>
                          ) : (
                            <Badge className="bg-yellow-100 text-yellow-800">
                              <Clock className="h-3 w-3 mr-1" /> Pending
                            </Badge>
                          )}
                          {worker.profile?.skills?.slice(0, 2).map(skill => (
                            <Badge key={skill} variant="outline">{skill}</Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {worker.profile?.verificationStatus !== 'verified' && (
                          <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => verifyWorker(worker._id)}>
                            <CheckCircle className="h-4 w-4 mr-1" /> Verify
                          </Button>
                        )}
                        {worker.profile?.verificationStatus === 'pending' && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button size="sm" variant="outline" className="text-red-600">
                                <XCircle className="h-4 w-4 mr-1" /> Reject
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Reject Worker?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will reject {worker.firstName}'s verification request.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => rejectWorker(worker._id, 'Documents incomplete')}>
                                  Reject
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Worker?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will permanently delete {worker.firstName}'s profile and all associated bookings.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => deleteWorker(worker._id)} className="bg-red-600">
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Services Tab */}
        <TabsContent value="services">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Service Management</CardTitle>
                  <CardDescription>Add, edit, and manage service categories</CardDescription>
                </div>
                <Button onClick={() => setShowAddServiceDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" /> Add Service
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {services.length === 0 ? (
                  <div className="col-span-3 text-center py-8 text-gray-500">
                    No services added yet. Click "Add Service" to create one.
                  </div>
                ) : (
                  services.map((service) => (
                    <Card key={service._id} className={!service.isActive ? 'opacity-60' : ''}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">{service.name}</CardTitle>
                            <Badge variant="outline" className="mt-1">{service.category}</Badge>
                          </div>
                          {service.isActive ? (
                            <Badge className="bg-green-100 text-green-800">Active</Badge>
                          ) : (
                            <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600 mb-3">{service.description || 'No description'}</p>
                        <div className="flex justify-between items-center text-sm">
                          <span className="font-semibold">₹{service.basePrice}</span>
                          <span className="text-gray-500">{service.duration} mins</span>
                        </div>
                        <div className="flex gap-2 mt-4">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="flex-1"
                            onClick={() => toggleServiceStatus(service._id, service.isActive)}
                          >
                            {service.isActive ? 'Deactivate' : 'Activate'}
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button size="sm" variant="destructive">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Service?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will permanently delete "{service.name}" from the platform.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => deleteService(service._id)} className="bg-red-600">
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Announcements Tab */}
        <TabsContent value="announcements">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Announcements</CardTitle>
                  <CardDescription>Send messages to all users or specific groups</CardDescription>
                </div>
                <Button onClick={() => setShowAddAnnouncementDialog(true)}>
                  <Megaphone className="h-4 w-4 mr-2" /> New Announcement
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {announcements.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No announcements yet. Click "New Announcement" to create one.
                  </div>
                ) : (
                  announcements.map((announcement) => (
                    <div key={announcement.id} className={`p-4 border rounded-lg ${!announcement.isActive ? 'opacity-60' : ''}`}>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold">{announcement.title}</h3>
                            {getAnnouncementTypeBadge(announcement.type)}
                            <Badge variant="outline">{announcement.targetAudience}</Badge>
                            {announcement.isActive ? (
                              <Badge className="bg-green-100 text-green-800">Active</Badge>
                            ) : (
                              <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>
                            )}
                          </div>
                          <p className="text-gray-600">{announcement.message}</p>
                          <p className="text-xs text-gray-400 mt-2">
                            Created: {new Date(announcement.createdAt).toLocaleDateString()}
                            {announcement.expiresAt && ` • Expires: ${new Date(announcement.expiresAt).toLocaleDateString()}`}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => toggleAnnouncementStatus(announcement.id, announcement.isActive)}
                          >
                            {announcement.isActive ? 'Deactivate' : 'Activate'}
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button size="sm" variant="destructive">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Announcement?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will permanently delete this announcement.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => deleteAnnouncement(announcement.id)} className="bg-red-600">
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Platform Settings</CardTitle>
              <CardDescription>Configure platform-wide settings and preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">General Settings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label>Platform Name</Label>
                        <Input defaultValue="Nagrik Sewa" />
                      </div>
                      <div>
                        <Label>Support Email</Label>
                        <Input defaultValue="support@nagriksewa.co.in" />
                      </div>
                      <div>
                        <Label>Support Phone</Label>
                        <Input defaultValue="+91 1800-XXX-XXXX" />
                      </div>
                      <Button className="w-full">Save Changes</Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Payment Settings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label>Platform Commission (%)</Label>
                        <Input type="number" defaultValue="10" />
                      </div>
                      <div>
                        <Label>Minimum Booking Amount (₹)</Label>
                        <Input type="number" defaultValue="100" />
                      </div>
                      <div>
                        <Label>Payment Gateway</Label>
                        <Select defaultValue="razorpay">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="razorpay">Razorpay</SelectItem>
                            <SelectItem value="paytm">Paytm</SelectItem>
                            <SelectItem value="stripe">Stripe</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button className="w-full">Save Changes</Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;