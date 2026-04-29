import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
  ArrowLeft,
  Shield,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const BookService: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const serviceId = searchParams.get('service');
  const workerId = searchParams.get('worker');

  const [formData, setFormData] = useState({
    date: '',
    time: '',
    address: {
      street: '',
      area: '',
      city: 'Delhi',
      state: 'Delhi',
      pincode: ''
    },
    description: '',
    requirements: '',
    contactPerson: '',
    contactPhone: '',
    alternatePhone: '',
    emergencyService: false,
    recurringService: false,
    recurringFrequency: 'weekly'
  });

  const [step, setStep] = useState(1); // 1: Service Details, 2: Worker Selection, 3: Payment

  // Mock data - would be fetched based on serviceId and workerId
  const service = {
    id: '1',
    name: 'House Cleaning',
    category: 'Home Services',
    description: 'Professional home cleaning services',
    basePrice: 500,
    icon: '🏠'
  };

  const selectedWorker = {
    id: 'w1',
    firstName: 'Priya',
    lastName: 'Sharma',
    avatar: '',
    rating: 4.9,
    reviews: 234,
    experience: '5 years',
    skills: ['House Cleaning', 'Deep Cleaning'],
    price: 500,
    availability: 'Today',
    verified: true
  };

  const timeSlots = [
    '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM'
  ];

  const cities = ['Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad'];
  const states = ['Delhi', 'Maharashtra', 'Karnataka', 'Tamil Nadu', 'West Bengal', 'Telangana'];

  const handleInputChange = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof typeof prev] as any),
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const calculateTotal = () => {
    let total = selectedWorker.price;
    if (formData.emergencyService) total += 100;
    const tax = Math.round(total * 0.18);
    const convenienceFee = 50;
    return {
      serviceCharge: total,
      tax,
      convenienceFee,
      total: total + tax + convenienceFee
    };
  };

  const handleBooking = () => {
    // Simulate booking process
    console.log('Booking data:', { formData, service, worker: selectedWorker });
    alert('Booking successful! Redirecting to booking details...');
    navigate('/bookings/123'); // Redirect to booking details
  };

  const pricing = calculateTotal();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold">Book Service</h1>
          <p className="text-gray-600 mt-2">Complete your booking in 3 simple steps</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            {[1, 2, 3].map((stepNum) => (
              <div key={stepNum} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= stepNum ? 'bg-brand-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {stepNum}
                </div>
                <span className={`ml-2 text-sm ${step >= stepNum ? 'text-brand-600' : 'text-gray-600'}`}>
                  {stepNum === 1 ? 'Service Details' : stepNum === 2 ? 'Worker Selection' : 'Payment'}
                </span>
                {stepNum < 3 && <div className="w-8 h-px bg-gray-300 mx-4" />}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {step === 1 && (
              <div className="space-y-6">
                {/* Service Info */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <span className="text-2xl">{service.icon}</span>
                      {service.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{service.description}</p>
                    <Badge variant="secondary" className="mt-2">{service.category}</Badge>
                  </CardContent>
                </Card>

                {/* Schedule */}
                <Card>
                  <CardHeader>
                    <CardTitle>Schedule Service</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Select Date</label>
                        <Input
                          type="date"
                          value={formData.date}
                          onChange={(e) => handleInputChange('date', e.target.value)}
                          min={new Date().toISOString().split('T')[0]}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Select Time</label>
                        <div className="grid grid-cols-3 gap-2">
                          {timeSlots.map(time => (
                            <Button
                              key={time}
                              variant={formData.time === time ? "default" : "outline"}
                              size="sm"
                              onClick={() => handleInputChange('time', time)}
                              className="text-xs"
                            >
                              {time}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="emergency"
                        checked={formData.emergencyService}
                        onChange={(e) => handleInputChange('emergencyService', e.target.checked)}
                      />
                      <label htmlFor="emergency" className="text-sm">
                        Emergency Service (+₹100)
                      </label>
                    </div>
                  </CardContent>
                </Card>

                {/* Address */}
                <Card>
                  <CardHeader>
                    <CardTitle>Service Address</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Street Address</label>
                      <Input
                        placeholder="Flat/House number, Building name"
                        value={formData.address.street}
                        onChange={(e) => handleInputChange('address.street', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Area/Locality</label>
                      <Input
                        placeholder="Area, Sector, Locality"
                        value={formData.address.area}
                        onChange={(e) => handleInputChange('address.area', e.target.value)}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">City</label>
                        <select
                          value={formData.address.city}
                          onChange={(e) => handleInputChange('address.city', e.target.value)}
                          className="w-full px-3 py-2 border rounded-md"
                        >
                          {cities.map(city => (
                            <option key={city} value={city}>{city}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">State</label>
                        <select
                          value={formData.address.state}
                          onChange={(e) => handleInputChange('address.state', e.target.value)}
                          className="w-full px-3 py-2 border rounded-md"
                        >
                          {states.map(state => (
                            <option key={state} value={state}>{state}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Pincode</label>
                        <Input
                          placeholder="110001"
                          value={formData.address.pincode}
                          onChange={(e) => handleInputChange('address.pincode', e.target.value)}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Service Details */}
                <Card>
                  <CardHeader>
                    <CardTitle>Service Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Describe your requirements</label>
                      <Textarea
                        placeholder="Please describe what needs to be done..."
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        rows={4}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Special Requirements (Optional)</label>
                      <Textarea
                        placeholder="Any special tools, materials, or instructions..."
                        value={formData.requirements}
                        onChange={(e) => handleInputChange('requirements', e.target.value)}
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Contact Details */}
                <Card>
                  <CardHeader>
                    <CardTitle>Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Contact Person</label>
                        <Input
                          placeholder="Your name"
                          value={formData.contactPerson}
                          onChange={(e) => handleInputChange('contactPerson', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Phone Number</label>
                        <Input
                          placeholder="+91 98765 43210"
                          value={formData.contactPhone}
                          onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Alternate Phone (Optional)</label>
                      <Input
                        placeholder="+91 98765 43210"
                        value={formData.alternatePhone}
                        onChange={(e) => handleInputChange('alternatePhone', e.target.value)}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Button 
                  onClick={() => setStep(2)}
                  disabled={!formData.date || !formData.time || !formData.address.street}
                  className="w-full"
                >
                  Continue to Worker Selection
                </Button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Selected Worker</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={selectedWorker.avatar} />
                        <AvatarFallback className="text-lg">
                          {selectedWorker.firstName[0]}{selectedWorker.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-lg">
                            {selectedWorker.firstName} {selectedWorker.lastName}
                          </h3>
                          {selectedWorker.verified && (
                            <Shield className="h-4 w-4 text-green-600" />
                          )}
                        </div>
                        <div className="flex items-center gap-1 mb-2">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{selectedWorker.rating}</span>
                          <span className="text-gray-500">({selectedWorker.reviews} reviews)</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{selectedWorker.experience} experience</p>
                        <div className="flex flex-wrap gap-1">
                          {selectedWorker.skills.map(skill => (
                            <Badge key={skill} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-brand-600">₹{selectedWorker.price}</p>
                        <p className="text-sm text-gray-600">Available {selectedWorker.availability}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex gap-4">
                  <Button variant="outline" onClick={() => setStep(1)}>
                    Back
                  </Button>
                  <Button onClick={() => setStep(3)} className="flex-1">
                    Continue to Payment
                  </Button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Payment Method</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {['Credit/Debit Card', 'UPI', 'Cash on Service'].map(method => (
                        <div key={method} className="border rounded-lg p-4 cursor-pointer hover:border-brand-500">
                          <div className="flex items-center space-x-2">
                            <input type="radio" name="payment" id={method} />
                            <label htmlFor={method} className="text-sm font-medium">{method}</label>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-blue-900">Payment Protection</h4>
                          <p className="text-sm text-blue-700">
                            Your payment is protected. Money is only released to the worker after service completion.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex gap-4">
                  <Button variant="outline" onClick={() => setStep(2)}>
                    Back
                  </Button>
                  <Button onClick={handleBooking} className="flex-1">
                    Confirm Booking & Pay ₹{pricing.total}
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Booking Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{service.icon}</span>
                  <div>
                    <h3 className="font-medium">{service.name}</h3>
                    <p className="text-sm text-gray-600">{service.category}</p>
                  </div>
                </div>

                <Separator />

                {formData.date && formData.time && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span>{new Date(formData.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span>{formData.time}</span>
                    </div>
                  </div>
                )}

                {formData.address.area && (
                  <div className="flex items-start gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                    <span>{formData.address.area}, {formData.address.city}</span>
                  </div>
                )}

                <Separator />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Service Charge</span>
                    <span>₹{pricing.serviceCharge}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (18% GST)</span>
                    <span>₹{pricing.tax}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Convenience Fee</span>
                    <span>₹{pricing.convenienceFee}</span>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between font-semibold">
                  <span>Total Amount</span>
                  <span>₹{pricing.total}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-green-600" />
                  Service Guarantee
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Verified professionals</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>100% satisfaction guarantee</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Insurance coverage</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>24/7 customer support</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookService;