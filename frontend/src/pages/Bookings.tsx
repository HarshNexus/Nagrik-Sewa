import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import { toast } from '@/hooks/use-toast';
import { 
  Calendar, 
  Clock, 
  MapPin,
  Star,
  Phone,
  MessageCircle,
  AlertCircle,
  CheckCircle,
  XCircle,
  RefreshCw
} from 'lucide-react';

interface Booking {
  _id: string;
  service?: {
    name: string;
    category: string;
  };
  serviceId?: {
    name: string;
    category: string;
  };
  worker?: {
    _id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
    rating: number;
  };
  workerId?: {
    _id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
    rating?: number;
  };
  customerId?: {
    _id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
    phone?: string;
  };
  scheduledDate: string;
  scheduledTime: string;
  status: 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
  totalAmount: number;
  address: string;
  description: string;
  createdAt: string;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'confirmed':
      return 'bg-blue-100 text-blue-800';
    case 'in-progress':
      return 'bg-purple-100 text-purple-800';
    case 'completed':
      return 'bg-green-100 text-green-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'pending':
      return <Clock className="h-4 w-4" />;
    case 'confirmed':
      return <CheckCircle className="h-4 w-4" />;
    case 'in-progress':
      return <AlertCircle className="h-4 w-4" />;
    case 'completed':
      return <CheckCircle className="h-4 w-4" />;
    case 'cancelled':
      return <XCircle className="h-4 w-4" />;
    default:
      return <Clock className="h-4 w-4" />;
  }
};

const Bookings: React.FC = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await api.get('/bookings/my-bookings');
      if (response.data.success) {
        // API returns { success, data: { bookings: [], pagination: {} } }
        const bookingsData = response.data.data?.bookings || response.data.data || [];
        setBookings(Array.isArray(bookingsData) ? bookingsData : []);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast({
        title: 'Error',
        description: 'Failed to load bookings',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const filterBookings = (status?: string) => {
    if (!status || status === 'all') return bookings;
    return bookings.filter(booking => booking.status === status);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <RefreshCw className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading bookings...</span>
      </div>
    );
  }

  const getTabCount = (status?: string) => {
    return filterBookings(status).length;
  };

  const BookingCard: React.FC<{ booking: Booking }> = ({ booking }) => {
    // Handle both API field names (serviceId/workerId from API, service/worker for compatibility)
    const service = booking.service || booking.serviceId;
    const worker = booking.worker || booking.workerId;
    const workerName = worker ? `${worker.firstName} ${worker.lastName}` : 'Service Provider';
    const workerInitials = worker ? `${worker.firstName?.[0] || ''}${worker.lastName?.[0] || ''}` : 'SP';
    const serviceName = service?.name || 'Service';
    const workerRating = worker?.rating || 0;

    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={worker?.avatar} />
                <AvatarFallback>{workerInitials}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold">{serviceName}</h3>
                <p className="text-sm text-gray-600">by {workerName}</p>
                <div className="flex items-center gap-1 mt-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs text-gray-500">{workerRating}</span>
                </div>
              </div>
            </div>
            <Badge className={getStatusColor(booking.status)}>
              <span className="flex items-center gap-1">
                {getStatusIcon(booking.status)}
                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
              </span>
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              <span>{booking.scheduledDate ? new Date(booking.scheduledDate).toLocaleDateString() : 'TBD'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-400" />
              <span>{booking.scheduledTime || 'TBD'}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gray-400" />
              <span className="truncate">{booking.address || 'Address not set'}</span>
            </div>
            <div className="font-semibold text-primary">
              ₹{booking.totalAmount || 0}
            </div>
          </div>

          {booking.description && (
            <p className="text-sm text-gray-600">{booking.description}</p>
          )}

          <div className="flex gap-2">
            <Button asChild size="sm" className="flex-1">
              <Link to={`/bookings/${booking._id}`}>
                View Details
              </Link>
            </Button>
            {booking.status === 'confirmed' && (
              <>
                <Button variant="outline" size="sm">
                  <MessageCircle className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Phone className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Bookings</h1>
        <p className="text-gray-600">Track and manage your service bookings</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="all">
            All ({getTabCount()})
          </TabsTrigger>
          <TabsTrigger value="pending">
            Pending ({getTabCount('pending')})
          </TabsTrigger>
          <TabsTrigger value="confirmed">
            Confirmed ({getTabCount('confirmed')})
          </TabsTrigger>
          <TabsTrigger value="in-progress">
            In Progress ({getTabCount('in-progress')})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({getTabCount('completed')})
          </TabsTrigger>
          <TabsTrigger value="cancelled">
            Cancelled ({getTabCount('cancelled')})
          </TabsTrigger>
        </TabsList>

        {['all', 'pending', 'confirmed', 'in-progress', 'completed', 'cancelled'].map(status => (
          <TabsContent key={status} value={status} className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filterBookings(status === 'all' ? undefined : status).map(booking => (
                <BookingCard key={booking._id} booking={booking} />
              ))}
            </div>
            
            {filterBookings(status === 'all' ? undefined : status).length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">
                  No {status === 'all' ? '' : status} bookings found.
                </p>
                <Button asChild className="mt-4">
                  <Link to="/services">Book a Service</Link>
                </Button>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default Bookings;
