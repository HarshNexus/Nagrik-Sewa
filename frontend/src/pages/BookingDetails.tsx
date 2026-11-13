import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { api } from '@/lib/api';
import {
  Calendar,
  Clock,
  MapPin,
  Star,
  Phone,
  CreditCard,
  FileText,
  User,
  CheckCircle
} from 'lucide-react';

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

const formatTime = (hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number);
  return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}`;
};

const BookingDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<any>(null);
  const [worker, setWorker] = useState<any>(null);
  const [receiptPaymentId, setReceiptPaymentId] = useState<string>();
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/bookings/${id}`)
      .then(({ data }) => {
        setBooking(data.data.booking);
        setWorker(data.data.workerProfile);
        setReceiptPaymentId(data.data.receiptPaymentId);
      })
      .catch((err) => setError(err.response?.data?.message || 'Could not load this booking.'));
  }, [id]);

  if (error) {
    return (
      <div className="container mx-auto py-16 px-4 text-center space-y-4">
        <p className="text-gray-600">{error}</p>
        <Button onClick={() => navigate('/bookings')}>My bookings</Button>
      </div>
    );
  }
  if (!booking) return <div className="py-16 text-center text-gray-600">Loading booking...</div>;

  const { serviceDetails, schedule, location, pricing, payment } = booking;
  const isPaid = payment.status === 'paid';
  const hours = schedule.estimatedDuration / 60;
  const workerName = worker ? `${worker.firstName} ${worker.lastName || ''}`.trim() : 'Worker';
  const skills: string[] = (worker?.skills || []).map((s: any) => s.name).filter(Boolean);
  const phone = worker?.phone && ['confirmed', 'in-progress'].includes(booking.status) ? worker.phone : null;

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Booking Details</h1>
        <p className="text-gray-600">Booking ID: #{booking.bookingId}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl">{serviceDetails.serviceName}</CardTitle>
                  <p className="text-gray-600 mt-1">{serviceDetails.category}</p>
                </div>
                <Badge className={getStatusColor(booking.status)}>
                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 break-words">{serviceDetails.description}</p>
            </CardContent>
          </Card>

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
                  <AvatarFallback className="text-lg">
                    {worker ? `${worker.firstName[0]}${worker.lastName?.[0] || ''}` : 'W'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{workerName}</h3>
                  {worker?.rating?.average > 0 && (
                    <div className="flex items-center gap-1 mb-2">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{worker.rating.average}</span>
                      <span className="text-sm text-gray-500">({worker.rating.totalReviews} reviews)</span>
                    </div>
                  )}
                  <div className="flex flex-wrap gap-1">
                    {skills.map((skill) => (
                      <Badge key={skill} variant="outline" className="text-xs">{skill}</Badge>
                    ))}
                  </div>
                </div>
                {phone && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={`tel:+91${phone}`} aria-label="Call worker"><Phone className="h-4 w-4" /></a>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

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
                      {new Date(schedule.requestedDate).toLocaleDateString('en-IN', {
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
                    <p className="text-sm text-gray-600">
                      {formatTime(schedule.requestedTime)} · {hours} hr
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-gray-400 mt-1" />
                <div>
                  <p className="font-medium">Service Location</p>
                  <p className="text-sm text-gray-600">
                    {location.address.street}<br />
                    {location.address.city}, {location.address.state} - {location.address.pincode}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {serviceDetails.customRequirements && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Special Requirements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700 break-words">{serviceDetails.customRequirements}</p>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
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
                  <span>Service ({hours} hr)</span>
                  <span>₹{pricing.basePrice}</span>
                </div>
                {pricing.emergencyCharges > 0 && (
                  <div className="flex justify-between">
                    <span>Emergency surcharge</span>
                    <span>₹{pricing.emergencyCharges}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>GST (18%)</span>
                  <span>₹{pricing.tax.gst}</span>
                </div>
                <div className="flex justify-between">
                  <span>Convenience Fee</span>
                  <span>₹{pricing.platformFee}</span>
                </div>
              </div>

              <Separator />

              <div className="flex justify-between font-semibold">
                <span>Total Amount</span>
                <span>₹{pricing.totalAmount}</span>
              </div>

              <Badge
                variant={isPaid ? 'default' : 'destructive'}
                className={`w-full justify-center ${isPaid ? 'bg-green-600 hover:bg-green-600' : ''}`}
              >
                {isPaid ? 'Paid' : `Payment ${payment.status}`}
              </Badge>
              {isPaid && payment.paidAt && (
                <p className="text-xs text-gray-500 text-center">
                  Paid on {new Date(payment.paidAt).toLocaleString()}{payment.method ? ` via ${payment.method.toUpperCase()}` : ''}
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {!isPaid && booking.status !== 'cancelled' && (
                <Button className="w-full" asChild>
                  <Link to={`/payment/${booking._id}`}>Pay now</Link>
                </Button>
              )}
              {receiptPaymentId && (
                <Button variant="outline" className="w-full" asChild>
                  <Link to={`/payments/${receiptPaymentId}/receipt`}>View receipt</Link>
                </Button>
              )}
              {booking.status === 'completed' && (
                <Button className="w-full">
                  <Star className="mr-2 h-4 w-4" />
                  Rate & Review
                </Button>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Booking Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {booking.tracking.milestones.map((event: any, index: number) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="bg-primary/10 p-1 rounded-full">
                      <CheckCircle className="h-3 w-3 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{event.description}</p>
                      <p className="text-xs text-gray-500">{new Date(event.timestamp).toLocaleString()}</p>
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
