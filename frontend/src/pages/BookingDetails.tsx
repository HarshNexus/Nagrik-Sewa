import React from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { 
  Calendar, 
  Clock, 
  MapPin,
  Star,
  Phone,
  MessageCircle,
  CreditCard,
  FileText,
  User,
  CheckCircle
} from 'lucide-react';

const BookingDetails: React.FC = () => {
  const { id } = useParams();

  // Mock data - would be fetched based on ID
  const booking = {
    _id: id,
    service: {
      name: 'Plumbing Repair',
      category: 'Home Maintenance',
      description: 'Professional plumbing services for residential and commercial properties'
    },
    worker: {
      _id: 'w1',
      firstName: 'Rajesh',
      lastName: 'Kumar',
      avatar: '',
      rating: 4.8,
      phone: '+91 9876543210',
      skills: ['Plumbing', 'Electrical']
    },
    customer: {
      firstName: 'John',
      lastName: 'Doe',
      phone: '+91 9876543210'
    },
    scheduledDate: '2024-01-15',
    scheduledTime: '10:00 AM',
    status: 'confirmed',
    totalAmount: 1200,
    breakdown: {
      serviceCharge: 1000,
      tax: 120,
      discount: 0,
      convenienceFee: 80
    },
    address: {
      street: 'Flat 301, Tower A',
      area: 'Sector 15',
      city: 'Gurgaon',
      state: 'Haryana',
      pincode: '122001'
    },
    description: 'Kitchen sink leakage repair. Water is continuously dripping from the main pipe connection.',
    requirements: ['Basic plumbing tools', 'Pipe sealant', 'Replacement parts if needed'],
    createdAt: '2024-01-12T10:30:00Z',
    updatedAt: '2024-01-12T15:45:00Z',
    paymentStatus: 'pending',
    timeline: [
      {
        status: 'created',
        timestamp: '2024-01-12T10:30:00Z',
        description: 'Booking created'
      },
      {
        status: 'confirmed',
        timestamp: '2024-01-12T15:45:00Z',
        description: 'Booking confirmed by worker'
      }
    ]
  };

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

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Booking Details</h1>
        <p className="text-gray-600">Booking ID: #{booking._id}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Service & Status */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl">{booking.service.name}</CardTitle>
                  <p className="text-gray-600 mt-1">{booking.service.category}</p>
                </div>
                <Badge className={getStatusColor(booking.status)}>
                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">{booking.description}</p>
            </CardContent>
          </Card>

          {/* Worker Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Worker Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={booking.worker.avatar} />
                  <AvatarFallback className="text-lg">
                    {booking.worker.firstName[0]}{booking.worker.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">
                    {booking.worker.firstName} {booking.worker.lastName}
                  </h3>
                  <div className="flex items-center gap-1 mb-2">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{booking.worker.rating}</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {booking.worker.skills.map(skill => (
                      <Badge key={skill} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <MessageCircle className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Phone className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Schedule & Location */}
          <Card>
            <CardHeader>
              <CardTitle>Schedule & Location</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium">Date</p>
                    <p className="text-sm text-gray-600">
                      {new Date(booking.scheduledDate).toLocaleDateString('en-IN', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium">Time</p>
                    <p className="text-sm text-gray-600">{booking.scheduledTime}</p>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-gray-400 mt-1" />
                <div>
                  <p className="font-medium">Service Location</p>
                  <p className="text-sm text-gray-600">
                    {booking.address.street}<br />
                    {booking.address.area}, {booking.address.city}<br />
                    {booking.address.state} - {booking.address.pincode}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Requirements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Requirements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {booking.requirements.map((req, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">{req}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Payment Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Service Charge</span>
                  <span>₹{booking.breakdown.serviceCharge}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (GST)</span>
                  <span>₹{booking.breakdown.tax}</span>
                </div>
                <div className="flex justify-between">
                  <span>Convenience Fee</span>
                  <span>₹{booking.breakdown.convenienceFee}</span>
                </div>
                {booking.breakdown.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-₹{booking.breakdown.discount}</span>
                  </div>
                )}
              </div>
              
              <Separator />
              
              <div className="flex justify-between font-semibold">
                <span>Total Amount</span>
                <span>₹{booking.totalAmount}</span>
              </div>
              
              <Badge 
                variant={booking.paymentStatus === 'paid' ? 'default' : 'destructive'}
                className="w-full justify-center"
              >
                Payment {booking.paymentStatus}
              </Badge>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {booking.status === 'confirmed' && (
                <>
                  <Button className="w-full">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Message Worker
                  </Button>
                  <Button variant="outline" className="w-full">
                    Reschedule
                  </Button>
                  <Button variant="destructive" className="w-full">
                    Cancel Booking
                  </Button>
                </>
              )}
              
              {booking.status === 'completed' && (
                <Button className="w-full">
                  <Star className="mr-2 h-4 w-4" />
                  Rate & Review
                </Button>
              )}
              
              <Button variant="outline" className="w-full">
                Download Invoice
              </Button>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Booking Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {booking.timeline.map((event, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="bg-primary/10 p-1 rounded-full">
                      <CheckCircle className="h-3 w-3 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{event.description}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(event.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BookingDetails;
