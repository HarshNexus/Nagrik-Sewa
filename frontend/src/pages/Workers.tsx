import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { indianStates } from '@/data/indianLocations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/lib/api';
import { 
  Search, 
  MapPin, 
  Star, 
  Clock,
  Filter,
  Verified,
  Phone,
  MessageCircle,
  Users,
  Target,
  Briefcase,
  TrendingUp,
  Mail,
  User,
  RefreshCw
} from 'lucide-react';
import { CONTACT_INFO, makePhoneCall } from '@/constants/contact';

interface Worker {
  _id: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  skills: string[];
  rating: number;
  totalReviews: number;
  location: {
    address: string;
    city: string;
  };
  pricing: {
    hourlyRate: number;
  };
  availability: {
    isAvailable: boolean;
  };
  isVerified: boolean;
  completedJobs: number;
  joinedDate: string;
}

const Workers: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('All Skills');
  const [sortBy, setSortBy] = useState('rating');
  const [locationSearch, setLocationSearch] = useState('');
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [minRating, setMinRating] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  // Fetch workers from API
  useEffect(() => {
    fetchWorkers();
  }, [sortBy]);

  const fetchWorkers = async () => {
    setLoading(true);
    try {
      const params: any = { sortBy, limit: 50 };
      if (selectedCity) params.city = selectedCity;
      if (selectedSkill !== 'All Skills') params.category = selectedSkill;
      if (minRating) params.minRating = minRating;
      
      const response = await api.get('/workers', { params });
      if (response.data.success) {
        // Map API response to component interface
        const mappedWorkers = (response.data.data.workers || []).map((apiWorker: any) => ({
          _id: apiWorker._id,
          firstName: apiWorker.userId?.firstName || 'Unknown',
          lastName: apiWorker.userId?.lastName || 'Worker',
          avatar: apiWorker.userId?.avatar,
          skills: Array.isArray(apiWorker.skills) 
            ? apiWorker.skills.map((s: any) => typeof s === 'string' ? s : s.name).filter(Boolean)
            : [],
          rating: apiWorker.rating?.average || 0,
          totalReviews: apiWorker.rating?.totalReviews || 0,
          location: {
            address: apiWorker.userId?.address?.address || 'India',
            city: apiWorker.userId?.address?.city || 'Delhi'
          },
          pricing: {
            hourlyRate: apiWorker.pricing?.hourlyRate || 0
          },
          availability: {
            isAvailable: apiWorker.availability?.isCurrentlyAvailable ?? true
          },
          isVerified: (apiWorker.isActive && apiWorker.isApproved) || (apiWorker.verification?.status === 'verified'),
          completedJobs: apiWorker.statistics?.completedJobs || 0,
          joinedDate: apiWorker.userId?.createdAt || new Date().toISOString()
        }));
        setWorkers(mappedWorkers);
      }
    } catch (error) {
      console.error('Error fetching workers:', error);
      toast({
        title: 'Error',
        description: 'Failed to load workers. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  // Get all districts from all states
  const allLocations = indianStates.flatMap(state => 
    state.districts.map(district => ({ district, state: state.name }))
  );
  
  // Filter locations based on search
  const filteredLocations = locationSearch.length > 0
    ? allLocations.filter(item => 
        item.district.toLowerCase().includes(locationSearch.toLowerCase()) ||
        item.state.toLowerCase().includes(locationSearch.toLowerCase())
      ).slice(0, 20) // Limit to 20 results
    : [];
  
  const skills = ['All Skills', 'Plumbing', 'Electrical', 'House Cleaning', 'Cooking', 'AC Repair', 'Refrigerator Repair', 'Painting', 'Carpentry', 'Gardening'];

  const filteredWorkers = workers.filter(worker => {
    if (!worker) return false;
    
    const matchesSearch = 
      (worker.firstName?.toLowerCase?.() || '').includes(searchTerm.toLowerCase()) ||
      (worker.lastName?.toLowerCase?.() || '').includes(searchTerm.toLowerCase()) ||
      (Array.isArray(worker.skills) && worker.skills.some(skill => 
        (skill?.toLowerCase?.() || '').includes(searchTerm.toLowerCase())
      ));
    
    const matchesCity = !selectedCity || 
      (worker.location?.city?.toLowerCase?.() || '').includes(selectedCity.toLowerCase()) ||
      (worker.location?.address?.toLowerCase?.() || '').includes(selectedCity.toLowerCase()) ||
      selectedCity.toLowerCase().includes((worker.location?.city?.toLowerCase?.() || ''));
    
    const matchesSkill = !selectedSkill || selectedSkill === 'All Skills' || 
      (Array.isArray(worker.skills) && worker.skills.includes(selectedSkill));
    
    const matchesRating = !minRating || (worker.rating || 0) >= parseFloat(minRating);
    const matchesPrice = !maxPrice || (worker.pricing?.hourlyRate || 0) <= parseFloat(maxPrice);

    return matchesSearch && matchesCity && matchesSkill && matchesRating && matchesPrice;
  });

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCity('');
    setLocationSearch('');
    setSelectedSkill('All Skills');
    setMinRating('');
    setMaxPrice('');
    setSortBy('rating');
    toast({
      title: "Filters Cleared",
      description: "All filters have been reset",
    });
  };

  const handleContactWorker = (worker: Worker, method: 'call' | 'message') => {
    if (method === 'call') {
      makePhoneCall(CONTACT_INFO.MAIN_SUPPORT_PHONE);
      toast({
        title: "Calling Worker",
        description: `Initiating call to ${worker.firstName} ${worker.lastName}`,
      });
    } else {
      window.location.href = `sms:${CONTACT_INFO.MAIN_SUPPORT_PHONE.replace(/\s+/g, '')}`;
      toast({
        title: "Messaging Worker",
        description: `Opening messages for ${worker.firstName} ${worker.lastName}`,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-brand-600 to-brand-700 text-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Users className="w-16 h-16 mx-auto mb-6" />
            <h1 className="text-4xl font-bold mb-4">Find Skilled Workers</h1>
            <p className="text-xl text-brand-100 mb-8 max-w-3xl mx-auto">
              Connect with verified professionals for all your service needs. Browse profiles, check ratings, and hire with confidence.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="text-center">
                <div className="text-3xl font-bold">2,000+</div>
                <div className="text-brand-100">Verified Workers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">4.8★</div>
                <div className="text-brand-100">Average Rating</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">50K+</div>
                <div className="text-brand-100">Jobs Completed</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Search and Filter Section */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by name or skills..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Location Search */}
              <div className="relative flex-1">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
                <Input
                  placeholder="Search location..."
                  value={locationSearch || selectedCity}
                  onChange={(e) => {
                    setLocationSearch(e.target.value);
                    setShowLocationDropdown(true);
                    if (e.target.value === '') {
                      setSelectedCity('');
                    }
                  }}
                  onFocus={() => setShowLocationDropdown(true)}
                  className="pl-10"
                />
                {showLocationDropdown && filteredLocations.length > 0 && (
                  <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {filteredLocations.map((location, index) => (
                      <div
                        key={index}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          const locationText = `${location.district}, ${location.state}`;
                          setSelectedCity(locationText);
                          setLocationSearch(locationText);
                          setShowLocationDropdown(false);
                        }}
                      >
                        <div className="font-medium">{location.district}</div>
                        <div className="text-sm text-gray-500">{location.state}</div>
                      </div>
                    ))}
                  </div>
                )}
                {selectedCity && (
                  <button
                    onClick={() => {
                      setSelectedCity('');
                      setLocationSearch('');
                    }}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xl"
                  >
                    ×
                  </button>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                </Button>
                <Button variant="outline" onClick={handleClearFilters}>
                  Clear All
                </Button>
              </div>
            </div>

            {/* Extended Filters */}
            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t">
                <div>
                  <label className="block text-sm font-medium mb-2">Skill Category</label>
                  <select
                    value={selectedSkill}
                    onChange={(e) => setSelectedSkill(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    {skills.map(skill => (
                      <option key={skill} value={skill}>{skill}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Min Rating</label>
                  <select
                    value={minRating}
                    onChange={(e) => setMinRating(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Any Rating</option>
                    <option value="4.5">4.5+ Stars</option>
                    <option value="4.0">4.0+ Stars</option>
                    <option value="3.5">3.5+ Stars</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Max Price (₹/hour)</label>
                  <select
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Any Price</option>
                    <option value="300">Under ₹300</option>
                    <option value="500">Under ₹500</option>
                    <option value="1000">Under ₹1000</option>
                  </select>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results Count */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600">
            {filteredWorkers.length} worker{filteredWorkers.length !== 1 ? 's' : ''} found
          </p>
        </div>

        {/* Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWorkers.map(worker => (
            <Card key={worker._id} className="hover:shadow-2xl hover:scale-[1.02] transition-all duration-300">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-14 w-14">
                      <AvatarImage src={worker.avatar} />
                      <AvatarFallback className="bg-brand-100 text-brand-700 font-bold">
                        {worker.firstName[0]}{worker.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-lg">
                          {worker.firstName} {worker.lastName}
                        </h3>
                        {worker.isVerified && (
                          <Verified className="h-5 w-5 text-blue-500 fill-current" />
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <MapPin className="h-3 w-3" />
                        {worker.location.city}
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Availability Badge */}
                <div className="flex justify-between items-center">
                  {worker.availability.isAvailable ? (
                    <Badge className="bg-green-100 text-green-800">
                      <Clock className="h-3 w-3 mr-1" />
                      Available Now
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="bg-gray-100 text-gray-800">
                      Currently Busy
                    </Badge>
                  )}
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{worker.rating}</span>
                    <span className="text-sm text-gray-500">({worker.totalReviews})</span>
                  </div>
                </div>

                {/* Skills */}
                <div>
                  <div className="flex flex-wrap gap-2">
                    {worker.skills.slice(0, 3).map(skill => (
                      <Badge key={skill} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {worker.skills.length > 3 && (
                      <Badge variant="outline" className="text-xs bg-brand-50 text-brand-700 border-brand-200">
                        +{worker.skills.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Stats and Pricing */}
                <div className="border-t pt-4 mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Completed Jobs</span>
                    <span className="font-semibold text-brand-600">{worker.completedJobs}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Hourly Rate</span>
                    <span className="text-lg font-bold text-green-600">₹{worker.pricing.hourlyRate}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button 
                    className="flex-1 bg-brand-600 hover:bg-brand-700"
                    onClick={() => navigate(`/workers/${worker._id}`)}
                  >
                    <User className="h-4 w-4 mr-2" />
                    View Profile
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => handleContactWorker(worker, 'call')}
                  >
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => handleContactWorker(worker, 'message')}
                  >
                    <MessageCircle className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredWorkers.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Users className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Workers Found</h3>
              <p className="text-gray-500 mb-4">
                No workers match your current search criteria. Try adjusting your filters.
              </p>
              <Button variant="outline" onClick={handleClearFilters}>
                <Filter className="w-4 h-4 mr-2" />
                Clear All Filters
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-brand-600 to-brand-700 text-white mt-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Need Help with Your Project?</h2>
          <p className="text-xl text-brand-100 mb-8 max-w-2xl mx-auto">
            Connect with thousands of verified professionals ready to help with your service needs. Get quality work at fair prices.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-brand-600 hover:bg-gray-100 shadow-lg"
              onClick={() => navigate('/services')}
            >
              <Briefcase className="w-5 h-5 mr-2" />
              Browse All Services
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-2 border-white text-white bg-white/20 hover:bg-white hover:text-brand-600"
              onClick={() => makePhoneCall(CONTACT_INFO.MAIN_SUPPORT_PHONE)}
            >
              <Phone className="w-5 h-5 mr-2" />
              Call for Support
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Workers;
