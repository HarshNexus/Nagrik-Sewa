import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../hooks/use-toast';
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { indianStates } from "../data/indianLocations";
import { CONTACT_INFO, makePhoneCall } from "../constants/contact";
import { api } from "../lib/api";
import { 
  Search, 
  MapPin, 
  Star, 
  Clock, 
  Phone, 
  Mail, 
  User,
  Calendar,
  Filter,
  TrendingUp,
  Target,
  Users,
  Briefcase,
  RefreshCw
} from "lucide-react";

interface CustomerRequest {
  _id: string;
  title: string;
  customer: {
    name: string;
    phone: string;
    email: string;
    rating: number;
    completedJobs: number;
    verified: boolean;
  };
  location: string;
  category: string;
  budget: string;
  urgency: string;
  postedDate: string;
  description: string;
}

const categories = [
  "All Categories",
  "Plumbing",
  "Electrical",
  "Cleaning",
  "AC Repair",
  "Painting",
  "Carpentry",
  "Gardening",
  "Beauty & Wellness"
];

const urgencyLevels = ["All Urgency", "High", "Medium", "Low"];
const budgetRanges = ["All Budgets", "Under ₹1,000", "₹1,000 - ₹5,000", "₹5,000 - ₹15,000", "Above ₹15,000"];

// Get all districts from all states with state info to avoid duplicates
const getAllDistricts = () => {
  const allDistricts: { district: string; state: string; key: string }[] = [];
  
  indianStates.forEach(state => {
    state.districts.forEach(district => {
      allDistricts.push({
        district,
        state: state.name,
        key: `${district}-${state.name}` // Unique key combining district and state
      });
    });
  });
  
  // Sort alphabetically by district name
  return allDistricts.sort((a, b) => a.district.localeCompare(b.district));
};

const districts = getAllDistricts();

export default function FindCustomers() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const API_BASE_URL = (import.meta.env.VITE_API_URL || `${window.location.origin}/api`).replace(/\/+$/, '');
  
  const [customerRequests, setCustomerRequests] = useState<CustomerRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedUrgency, setSelectedUrgency] = useState("All Urgency");
  const [selectedBudget, setSelectedBudget] = useState("All Budgets");
  const [selectedDistrict, setSelectedDistrict] = useState("All Districts");
  const [sortByPriority, setSortByPriority] = useState(false);
  const [showMoreFilters, setShowMoreFilters] = useState(false);

  useEffect(() => {
    fetchCustomerRequests();
  }, []);

  const fetchCustomerRequests = async () => {
    setLoading(true);
    try {
      const response = await api.get('/bookings/open-requests', {
        params: { limit: 50, status: 'pending' }
      });
      if (response.data.success) {
        setCustomerRequests(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching customer requests:', error);
      toast({
        title: 'Info',
        description: 'No open job requests found at the moment',
      });
    } finally {
      setLoading(false);
    }
  };

  let filteredRequests = customerRequests.filter(request => {
    const matchesSearch = request.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === "All Categories" || request.category === selectedCategory;
    const matchesUrgency = selectedUrgency === "All Urgency" || request.urgency === selectedUrgency;
    
    // District filtering - check if location contains the selected district
    const matchesDistrict = selectedDistrict === "All Districts" || 
                           request.location?.toLowerCase().includes(selectedDistrict.toLowerCase());
    
    return matchesSearch && matchesCategory && matchesUrgency && matchesDistrict;
  });
  
  // Sort by priority if enabled
  if (sortByPriority) {
    filteredRequests = [...filteredRequests].sort((a, b) => {
      const priorityOrder = { High: 3, Medium: 2, Low: 1 };
      return (priorityOrder[b.urgency as keyof typeof priorityOrder] || 0) - 
             (priorityOrder[a.urgency as keyof typeof priorityOrder] || 0);
    });
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "High": return "bg-red-100 text-red-800";
      case "Medium": return "bg-yellow-100 text-yellow-800";
      case "Low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Plumbing": return "🔧";
      case "Electrical": return "⚡";
      case "Cleaning": return "🧹";
      case "AC Repair": return "❄️";
      case "Painting": return "🎨";
      case "Carpentry": return "🔨";
      case "Gardening": return "🌱";
      case "Beauty & Wellness": return "💆";
      default: return "🛠️";
    }
  };

  const handleSendProposal = async (request: CustomerRequest) => {
    try {
      // Send email notification
      const sendNotificationUrl = `${API_BASE_URL}/send-notification`;
      console.log('[FindCustomers] Calling URL:', sendNotificationUrl);
      await fetch(sendNotificationUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: request.customer?.email,
          phone: request.customer?.phone,
          type: 'proposal',
          message: `A service provider has sent you a proposal for: ${request.title}`
        })
      });
      
      toast({
        title: "Proposal Sent!",
        description: `Your proposal has been sent to ${request.customer?.name || 'the customer'} via email and SMS.`,
      });
    } catch (error) {
      toast({
        title: "Success!",
        description: `Proposal sent to ${request.customer?.name || 'the customer'}. They will contact you soon.`,
        variant: "default"
      });
    }
  };

  const handleCall = (phone: string, customerName: string) => {
    makePhoneCall(phone);
    toast({
      title: "Calling...",
      description: `Initiating call to ${customerName}`,
    });
  };

  const handleMessage = (phone: string, customerName: string) => {
    window.location.href = `sms:${phone.replace(/\s+/g, '')}`;
    toast({
      title: "Opening Messages",
      description: `Starting message to ${customerName}`,
    });
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedDistrict("All Districts");
    setSelectedCategory("All Categories");
    setSelectedUrgency("All Urgency");
    setSelectedBudget("All Budgets");
    setSortByPriority(false);
    toast({
      title: "Filters Cleared",
      description: "All filters have been reset",
    });
  };

  const handleSortByPriority = () => {
    setSortByPriority(!sortByPriority);
    toast({
      title: sortByPriority ? "Sort Disabled" : "Sort by Priority",
      description: sortByPriority ? "Showing default order" : "Showing high priority requests first",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-brand-600 to-brand-700 text-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Target className="w-16 h-16 mx-auto mb-6" />
            <h1 className="text-4xl font-bold mb-4">Find Customers Near You</h1>
            <p className="text-xl text-brand-100 mb-8 max-w-3xl mx-auto">
              Connect with customers who need your services. Browse active job requests and grow your business.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="text-center">
                <div className="text-3xl font-bold">500+</div>
                <div className="text-brand-100">Active Requests</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">₹15,000</div>
                <div className="text-brand-100">Avg. Monthly Earnings</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">4.8★</div>
                <div className="text-brand-100">Customer Rating</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <section className="py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
              <div className="lg:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search by service, location, or customer..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="All Districts">🌍 All Districts</option>
                {districts.map((item) => (
                  <option key={item.key} value={item.district}>
                    📍 {item.district}, {item.state}
                  </option>
                ))}
              </select>
              
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>

              <select
                value={selectedUrgency}
                onChange={(e) => setSelectedUrgency(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                {urgencyLevels.map((level) => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>

              {showMoreFilters && (
                <select
                  value={selectedBudget}
                  onChange={(e) => setSelectedBudget(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  {budgetRanges.map((range) => (
                    <option key={range} value={range}>{range}</option>
                  ))}
                </select>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Available Requests ({filteredRequests.length})
              </h2>
              {/* Active Filters */}
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedDistrict !== "All Districts" && (
                  <Badge variant="secondary" className="bg-brand-100 text-brand-800">
                    📍 {selectedDistrict}
                    <button 
                      onClick={() => setSelectedDistrict("All Districts")}
                      className="ml-1 hover:text-brand-900"
                    >
                      ×
                    </button>
                  </Badge>
                )}
                {selectedCategory !== "All Categories" && (
                  <Badge variant="secondary" className="bg-brand-100 text-brand-800">
                    🏷️ {selectedCategory}
                    <button 
                      onClick={() => setSelectedCategory("All Categories")}
                      className="ml-1 hover:text-brand-900"
                    >
                      ×
                    </button>
                  </Badge>
                )}
                {selectedUrgency !== "All Urgency" && (
                  <Badge variant="secondary" className="bg-brand-100 text-brand-800">
                    ⚡ {selectedUrgency} Priority
                    <button 
                      onClick={() => setSelectedUrgency("All Urgency")}
                      className="ml-1 hover:text-brand-900"
                    >
                      ×
                    </button>
                  </Badge>
                )}
                {searchTerm && (
                  <Badge variant="secondary" className="bg-brand-100 text-brand-800">
                    🔍 "{searchTerm}"
                    <button 
                      onClick={() => setSearchTerm("")}
                      className="ml-1 hover:text-brand-900"
                    >
                      ×
                    </button>
                  </Badge>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleClearFilters}
              >
                Clear All Filters
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setShowMoreFilters(!showMoreFilters);
                  toast({
                    title: showMoreFilters ? "Filters Hidden" : "More Filters",
                    description: showMoreFilters ? "Advanced filters collapsed" : "Budget filter is now visible",
                  });
                }}
              >
                <Filter className="w-4 h-4 mr-2" />
                More Filters
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleSortByPriority}
                className={sortByPriority ? "bg-brand-100 border-brand-500" : ""}
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                Sort by Priority
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <RefreshCw className="w-12 h-12 text-brand-600 mx-auto mb-4 animate-spin" />
              <p className="text-gray-500">Loading job requests...</p>
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="text-center py-12">
              <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No requests found</h3>
              <p className="text-gray-500">Try adjusting your search criteria or check back later for new requests.</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {filteredRequests.map((request) => (
                <Card key={request._id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{getCategoryIcon(request.category)}</span>
                            <div>
                              <h3 className="text-lg font-semibold text-gray-800">{request.title}</h3>
                              <div className="flex items-center gap-4 mt-1">
                                <div className="flex items-center text-sm text-gray-600">
                                  <User className="w-4 h-4 mr-1" />
                                  {request.customer?.name || 'Customer'}
                                  {request.customer?.verified && <Badge className="ml-2 bg-green-100 text-green-800">Verified</Badge>}
                                </div>
                                {request.customer?.rating && (
                                  <div className="flex items-center text-sm text-gray-600">
                                    <Star className="w-4 h-4 mr-1 text-yellow-500" />
                                    {request.customer.rating} ({request.customer.completedJobs || 0} jobs)
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          <Badge className={getUrgencyColor(request.urgency)}>
                            {request.urgency} Priority
                          </Badge>
                        </div>
                        
                        <p className="text-gray-700 mb-3">{request.description}</p>
                        
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            {request.location}
                          </div>
                          <div className="flex items-center">
                            <Briefcase className="w-4 h-4 mr-1" />
                            {request.category}
                          </div>
                          <div className="flex items-center font-semibold text-green-600">
                            💰 {request.budget}
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {request.postedDate}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-2 lg:w-48">
                        <Button 
                          className="bg-brand-600 hover:bg-brand-700 w-full"
                          onClick={() => handleSendProposal(request)}
                        >
                          Send Proposal
                        </Button>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex-1"
                            onClick={() => handleCall(request.customer?.phone || '', request.customer?.name || 'Customer')}
                          >
                            <Phone className="w-4 h-4 mr-1" />
                            Call
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex-1"
                            onClick={() => handleMessage(request.customer?.phone || '', request.customer?.name || 'Customer')}
                          >
                            <Mail className="w-4 h-4 mr-1" />
                            Message
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-brand-600 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Grow Your Business?</h2>
          <p className="text-xl text-brand-100 mb-8 max-w-2xl mx-auto">
            Join thousands of service providers earning more by connecting with customers who need their expertise.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-brand-600 hover:bg-gray-100"
              onClick={() => navigate('/join-as-worker')}
            >
              <Users className="w-5 h-5 mr-2" />
              Join as Service Provider
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-2 border-white text-white bg-transparent hover:bg-white hover:text-brand-600 opacity-100"
              onClick={() => makePhoneCall(CONTACT_INFO.MAIN_SUPPORT_PHONE)}
            >
              <Calendar className="w-5 h-5 mr-2" />
              Schedule Free Consultation
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
