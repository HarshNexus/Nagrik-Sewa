import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { api } from '@/lib/api';
import { 
  Calendar, 
  Users, 
  DollarSign, 
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Star,
  Bookmark
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState({
    activeBookings: 0,
    totalSpent: 0,
    reviewsGiven: 0,
    savedServices: 0,
    recentActivity: [] as any[],
    bookingsByStatus: {
      pending: 0,
      confirmed: 0,
      'in-progress': 0,
      completed: 0,
      cancelled: 0
    },
    totalBookings: 0,
    // Worker specific
    earnings: 0,
    rating: 0,
    completionRate: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        if (user?.role === 'worker') {
          // Fetch worker dashboard data
          const response = await api.get('/workers/me/dashboard');
          if (response.data.success) {
            const data = response.data.data;
            setDashboardData({
              activeBookings: data.stats?.pendingBookings || 0,
              totalSpent: 0,
              reviewsGiven: 0,
              savedServices: 0,
              recentActivity: data.recentBookings || [],
              bookingsByStatus: {
                pending: data.stats?.pendingBookings || 0,
                confirmed: 0,
                'in-progress': 0,
                completed: data.stats?.completedBookings || 0,
                cancelled: 0
              },
              totalBookings: data.stats?.totalBookings || 0,
              earnings: data.stats?.totalEarnings || 0,
              rating: data.stats?.averageRating || 0,
              completionRate: data.stats?.totalBookings > 0 
                ? Math.round((data.stats?.completedBookings / data.stats?.totalBookings) * 100) 
                : 0
            });
          }
        } else {
          // Fetch customer dashboard data
          const response = await api.get('/bookings/customer/dashboard');
          if (response.data.success) {
            const data = response.data.data;
            setDashboardData({
              activeBookings: data.activeBookings || 0,
              totalSpent: data.totalSpent || 0,
              reviewsGiven: data.reviewsGiven || 0,
              savedServices: data.savedServices || 0,
              recentActivity: data.recentActivity || [],
              bookingsByStatus: data.bookingsByStatus || {
                pending: 0,
                confirmed: 0,
                'in-progress': 0,
                completed: 0,
                cancelled: 0
              },
              totalBookings: data.totalBookings || 0,
              earnings: 0,
              rating: 0,
              completionRate: 0
            });
          }
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  if (!user) return null;

  const isWorker = user.role === 'worker';
  const isAdmin = user.role === 'admin';

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">
            Welcome back, {user.firstName}!
          </h1>
          <p className="text-gray-600 mt-2">
            {isWorker 
              ? 'Manage your services and bookings'
              : isAdmin
                ? 'Admin dashboard overview'
                : 'Track your bookings and services'
            }
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={user.isEmailVerified ? "default" : "destructive"}>
            {user.isEmailVerified ? "Verified" : "Unverified"}
          </Badge>
          {user.role === 'worker' && (
            <Badge variant="outline">Worker</Badge>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <TooltipProvider>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Tooltip>
            <TooltipTrigger asChild>
              <Card className="cursor-pointer hover:shadow-blue-500/20 hover:border-blue-500/50">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {isWorker ? 'Total Bookings' : 'Active Bookings'}
                  </CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {loading ? '...' : (isWorker ? dashboardData.totalBookings : dashboardData.activeBookings)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {isWorker 
                      ? (dashboardData.totalBookings === 0 ? 'No bookings yet' : `${dashboardData.bookingsByStatus.pending} pending`)
                      : (dashboardData.activeBookings === 0 ? 'No active bookings' : `${dashboardData.totalBookings} total`)
                    }
                  </p>
                </CardContent>
              </Card>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="max-w-xs">
              <p className="font-medium">{isWorker ? 'Total Bookings' : 'Active Bookings'}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {isWorker 
                  ? 'Total number of service requests you have received'
                  : 'Your current active service bookings. Click to view details.'}
              </p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Card className="cursor-pointer hover:shadow-green-500/20 hover:border-green-500/50">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {isWorker ? 'Earnings' : 'Total Spent'}
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ₹{loading ? '...' : (isWorker ? dashboardData.earnings : dashboardData.totalSpent).toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {isWorker 
                      ? (dashboardData.earnings === 0 ? 'No earnings yet' : 'From completed services')
                      : (dashboardData.totalSpent === 0 ? 'No transactions yet' : 'From completed bookings')
                    }
                  </p>
                </CardContent>
              </Card>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="max-w-xs">
              <p className="font-medium">{isWorker ? 'Total Earnings' : 'Total Spent'}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {isWorker 
                  ? 'Your total earnings from completed services'
                  : 'Total amount spent on services. Includes all completed bookings.'}
              </p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Card className="cursor-pointer hover:shadow-yellow-500/20 hover:border-yellow-500/50">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {isWorker ? 'Rating' : 'Reviews Given'}
                  </CardTitle>
                  <Star className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {loading ? '...' : (isWorker ? (dashboardData.rating || 0).toFixed(1) : dashboardData.reviewsGiven)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {isWorker 
                      ? (dashboardData.rating === 0 ? 'No reviews yet' : 'Average rating')
                      : (dashboardData.reviewsGiven === 0 ? 'No reviews given' : 'Services reviewed')
                    }
                  </p>
                </CardContent>
              </Card>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="max-w-xs">
              <p className="font-medium">{isWorker ? 'Your Rating' : 'Reviews Given'}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {isWorker 
                  ? 'Your average rating from customer reviews'
                  : 'Number of reviews you have given to service providers.'}
              </p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Card className="cursor-pointer hover:shadow-purple-500/20 hover:border-purple-500/50">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {isWorker ? 'Completion Rate' : 'Saved Services'}
                  </CardTitle>
                  {isWorker ? <TrendingUp className="h-4 w-4 text-muted-foreground" /> : <Bookmark className="h-4 w-4 text-muted-foreground" />}
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {loading ? '...' : (isWorker ? `${dashboardData.completionRate}%` : dashboardData.savedServices)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {isWorker 
                      ? (dashboardData.completionRate === 0 ? 'No completed bookings' : `${dashboardData.bookingsByStatus.completed} completed`)
                      : (dashboardData.savedServices === 0 ? 'No saved services' : 'Bookmarked services')
                    }
                  </p>
                </CardContent>
              </Card>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="max-w-xs">
              <p className="font-medium">{isWorker ? 'Completion Rate' : 'Saved Services'}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {isWorker 
                  ? 'Percentage of bookings you have successfully completed'
                  : 'Services you have bookmarked for quick access later.'}
              </p>
            </TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Your latest {isWorker ? 'bookings and updates' : 'service requests'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <div className="text-center text-gray-500">Loading activity...</div>
            ) : dashboardData.recentActivity.length > 0 ? (
              dashboardData.recentActivity.map((activity: any, index: number) => (
                <div key={activity._id || index} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer" onClick={() => navigate(`/bookings/${activity._id}`)}>
                  <div className={`p-2 rounded-full ${
                    activity.status === 'completed' ? 'bg-green-100' :
                    activity.status === 'cancelled' ? 'bg-red-100' :
                    activity.status === 'in-progress' ? 'bg-purple-100' :
                    'bg-blue-100'
                  }`}>
                    <Calendar className={`h-4 w-4 ${
                      activity.status === 'completed' ? 'text-green-600' :
                      activity.status === 'cancelled' ? 'text-red-600' :
                      activity.status === 'in-progress' ? 'text-purple-600' :
                      'text-blue-600'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      {activity.title || `Booking #${activity._id?.slice(-4) || 'New'}`}
                    </p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {activity.status || 'Pending'} • {activity.date ? new Date(activity.date).toLocaleDateString() : 'Recent'}
                    </p>
                  </div>
                  {activity.amount > 0 && (
                    <div className="text-sm font-medium text-primary">
                      ₹{activity.amount.toLocaleString()}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 py-4">
                <Calendar className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">No recent activity</p>
                <p className="text-xs text-gray-400">
                  {isWorker ? 'Start accepting bookings to see activity' : 'Book a service to see activity here'}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks and shortcuts
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {isWorker ? (
              <>
                <Button 
                  className="w-full justify-start" 
                  variant="outline"
                  onClick={() => navigate('/workers/profile')}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  Update Availability
                </Button>
                <Button 
                  className="w-full justify-start" 
                  variant="outline"
                  onClick={() => navigate('/bookings')}
                >
                  <Users className="mr-2 h-4 w-4" />
                  View Pending Bookings
                </Button>
                <Button 
                  className="w-full justify-start" 
                  variant="outline"
                  onClick={() => navigate('/workers/earnings')}
                >
                  <DollarSign className="mr-2 h-4 w-4" />
                  Withdrawal Request
                </Button>
              </>
            ) : (
              <>
                <Button 
                  className="w-full justify-start" 
                  variant="outline"
                  onClick={() => navigate('/services')}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  Book a Service
                </Button>
                <Button 
                  className="w-full justify-start" 
                  variant="outline"
                  onClick={() => navigate('/workers')}
                >
                  <Users className="mr-2 h-4 w-4" />
                  Find Workers
                </Button>
                <Button 
                  className="w-full justify-start" 
                  variant="outline"
                  onClick={() => navigate('/bookings')}
                >
                  <Star className="mr-2 h-4 w-4" />
                  View My Bookings
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Profile Completion - Removed for testing */}
      {/* Email verification requirement removed to allow full functionality testing */}
    </div>
  );
};

export default Dashboard;
