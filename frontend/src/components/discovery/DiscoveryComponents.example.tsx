/**
 * Example Components for Bi-Directional Discovery System
 * 
 * These are example implementations showing how to integrate
 * the discovery system into customer and worker dashboards.
 * 
 * Copy and adapt these components for your dashboard pages.
 */

import React, { useState, useEffect } from 'react';
import { discoveryApi } from '@/lib/api';

// ============================================================================
// COMPONENT 1: Customer Dashboard - Worker Discovery
// ============================================================================

interface Worker {
  _id: string;
  userId: string;
  name: string;
  phone: string;
  email: string;
  avatar?: string;
  experience: number;
  businessName?: string;
  description: string;
  location?: {
    city: string;
    state: string;
    pincode: string;
    radius: number;
  };
  serviceCategories: string[];
  skills?: Array<{
    name: string;
    level: 'beginner' | 'intermediate' | 'expert';
    yearsOfExperience: number;
    hourlyRate?: number;
  }>;
  rating: {
    average: number;
    totalReviews: number;
  };
  completedBookings: number;
  isCurrentlyAvailable?: boolean;
  verificationStatus: string;
  memberSince: string;
}

interface WorkerDiscoveryProps {
  selectedService?: string;
  onWorkerSelect?: (worker: Worker) => void;
}

export function WorkerDiscoveryComponent({
  selectedService = '',
  onWorkerSelect
}: WorkerDiscoveryProps) {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState(selectedService);
  const [filters, setFilters] = useState({
    city: '',
    minRating: 0,
    page: 1,
    limit: 12
  });

  const searchWorkers = async (searchCategory: string, pageNum: number = 1) => {
    if (!searchCategory.trim()) {
      setError('Please select a service category');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await discoveryApi.getWorkers(searchCategory, {
        city: filters.city || undefined,
        minRating: filters.minRating || undefined,
        limit: filters.limit,
        page: pageNum
      });

      if (response.data.success) {
        setWorkers(response.data.data.workers);
        setFilters(prev => ({ ...prev, page: pageNum }));
      } else {
        setError(response.data.message || 'Failed to fetch workers');
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to fetch workers. Please try again.'
      );
      setWorkers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    searchWorkers(category, 1);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategory(e.target.value);
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, city: e.target.value }));
  };

  const handleRatingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, minRating: parseFloat(e.target.value) }));
  };

  const handleWorkerClick = (worker: Worker) => {
    if (onWorkerSelect) {
      onWorkerSelect(worker);
    }
  };

  return (
    <div className="worker-discovery-container">
      <h2>Find Workers</h2>

      {/* Search Filters */}
      <div className="discovery-filters">
        <div className="filter-group">
          <label htmlFor="service-category">Service Category</label>
          <select
            id="service-category"
            value={category}
            onChange={handleCategoryChange}
            className="filter-select"
          >
            <option value="">-- Select Category --</option>
            <option value="plumbing">Plumbing</option>
            <option value="electrical">Electrical</option>
            <option value="cleaning">Cleaning</option>
            <option value="carpentry">Carpentry</option>
            <option value="painting">Painting</option>
            <option value="home-repair">Home Repair</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="city">City</label>
          <input
            id="city"
            type="text"
            placeholder="Enter city"
            value={filters.city}
            onChange={handleCityChange}
            className="filter-input"
          />
        </div>

        <div className="filter-group">
          <label htmlFor="min-rating">Minimum Rating</label>
          <input
            id="min-rating"
            type="number"
            min="0"
            max="5"
            step="0.5"
            value={filters.minRating}
            onChange={handleRatingChange}
            className="filter-input"
          />
        </div>

        <button
          onClick={handleSearch}
          disabled={loading}
          className="btn-search"
        >
          {loading ? 'Searching...' : 'Search Workers'}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      {/* Results */}
      <div className="workers-results">
        {loading && (
          <div className="loading-state">
            <p>Finding workers...</p>
          </div>
        )}

        {!loading && workers.length === 0 && category && (
          <div className="empty-state">
            <p>No workers found for "{category}"</p>
            <small>Try adjusting your filters</small>
          </div>
        )}

        {workers.length > 0 && (
          <div className="workers-grid">
            {workers.map(worker => (
              <div
                key={worker._id}
                className="worker-card"
                onClick={() => handleWorkerClick(worker)}
              >
                {worker.avatar && (
                  <img
                    src={worker.avatar}
                    alt={worker.name}
                    className="worker-avatar"
                  />
                )}

                <div className="worker-info">
                  <h3>{worker.name}</h3>
                  {worker.businessName && (
                    <p className="business-name">{worker.businessName}</p>
                  )}

                  <div className="worker-meta">
                    <span className="experience">
                      {worker.experience} years exp
                    </span>
                    <span className="rating">
                      ⭐ {worker.rating.average}/5
                      <small>({worker.rating.totalReviews})</small>
                    </span>
                  </div>

                  <p className="description">{worker.description}</p>

                  {worker.location && (
                    <p className="location">
                      📍 {worker.location.city}, {worker.location.state}
                    </p>
                  )}

                  {worker.skills && worker.skills.length > 0 && (
                    <div className="skills">
                      {worker.skills.slice(0, 3).map((skill, idx) => (
                        <span key={idx} className="skill-tag">
                          {skill.name}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="worker-actions">
                    <button className="btn btn-primary">
                      View Profile
                    </button>
                    <button className="btn btn-secondary">
                      Message
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// COMPONENT 2: Worker Dashboard - Customer Discovery
// ============================================================================

interface CustomerRequest {
  _id: string;
  bookingId: string;
  customerId: string;
  name: string;
  phone: string;
  email: string;
  avatar?: string;
  location: {
    address: string;
    city: string;
    state: string;
    pincode: string;
    landmark?: string;
  };
  serviceDetails: {
    serviceName: string;
    category: string;
    description: string;
    customRequirements?: string;
    urgencyLevel: 'low' | 'medium' | 'high' | 'emergency';
  };
  schedule: {
    requestedDate: string;
    requestedTime: string;
    estimatedDuration: number;
  };
  pricing: {
    totalAmount: number;
    basePrice: number;
  };
  bookingType: string;
  status: string;
  postedAt: string;
}

interface CustomerDiscoveryProps {
  onBookingAccept?: (bookingId: string) => void;
}

export function CustomerDiscoveryComponent({
  onBookingAccept
}: CustomerDiscoveryProps) {
  const [customers, setCustomers] = useState<CustomerRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();
  const [filters, setFilters] = useState({
    city: '',
    page: 1,
    limit: 12
  });

  // Fetch customer requests on component mount
  useEffect(() => {
    fetchCustomerRequests();
  }, []);

  const fetchCustomerRequests = async (pageNum: number = 1) => {
    setLoading(true);
    setError(null);

    try {
      const response = await discoveryApi.getCustomers(selectedCategory, {
        city: filters.city || undefined,
        limit: filters.limit,
        page: pageNum
      });

      if (response.data.success) {
        setCustomers(response.data.data.customers);
        setFilters(prev => ({ ...prev, page: pageNum }));
      } else {
        setError(response.data.message || 'Failed to fetch customer requests');
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to fetch customer requests. Please try again.'
      );
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value || undefined);
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, city: e.target.value }));
  };

  const handleRefresh = () => {
    fetchCustomerRequests(1);
  };

  const handleAcceptRequest = (bookingId: string) => {
    if (onBookingAccept) {
      onBookingAccept(bookingId);
    }
    // Remove from list temporarily
    setCustomers(prev => prev.filter(c => c.bookingId !== bookingId));
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'emergency':
        return 'urgency-emergency';
      case 'high':
        return 'urgency-high';
      case 'medium':
        return 'urgency-medium';
      default:
        return 'urgency-low';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="customer-discovery-container">
      <div className="discovery-header">
        <h2>New Customer Requests</h2>
        <button
          onClick={handleRefresh}
          disabled={loading}
          className="btn-refresh"
        >
          🔄 Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="discovery-filters">
        <div className="filter-group">
          <label htmlFor="category-filter">Service Category</label>
          <select
            id="category-filter"
            value={selectedCategory || ''}
            onChange={handleCategoryChange}
            className="filter-select"
          >
            <option value="">-- All Categories --</option>
            <option value="plumbing">Plumbing</option>
            <option value="electrical">Electrical</option>
            <option value="cleaning">Cleaning</option>
            <option value="carpentry">Carpentry</option>
            <option value="painting">Painting</option>
            <option value="home-repair">Home Repair</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="city-filter">City</label>
          <input
            id="city-filter"
            type="text"
            placeholder="Filter by city"
            value={filters.city}
            onChange={handleCityChange}
            className="filter-input"
          />
        </div>
      </div>

      {/* Status Messages */}
      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="loading-state">
          <p>Loading customer requests...</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && customers.length === 0 && (
        <div className="empty-state">
          <p>No customer requests at the moment</p>
          <small>Check back later or adjust your filters</small>
        </div>
      )}

      {/* Customer Requests Grid */}
      {customers.length > 0 && (
        <div className="customers-grid">
          {customers.map(customer => (
            <div
              key={customer.bookingId}
              className={`customer-card ${getUrgencyColor(
                customer.serviceDetails.urgencyLevel
              )}`}
            >
              <div className="card-header">
                <div className="customer-header">
                  {customer.avatar && (
                    <img
                      src={customer.avatar}
                      alt={customer.name}
                      className="customer-avatar"
                    />
                  )}
                  <div className="customer-name-info">
                    <h3>{customer.name}</h3>
                    <p className="phone">{customer.phone}</p>
                  </div>
                </div>
                <span className={`urgency-badge ${customer.serviceDetails.urgencyLevel}`}>
                  {customer.serviceDetails.urgencyLevel.toUpperCase()}
                </span>
              </div>

              <div className="card-body">
                <div className="service-info">
                  <h4>{customer.serviceDetails.serviceName}</h4>
                  <p className="description">
                    {customer.serviceDetails.description}
                  </p>
                  {customer.serviceDetails.customRequirements && (
                    <p className="requirements">
                      <strong>Requirements:</strong>{' '}
                      {customer.serviceDetails.customRequirements}
                    </p>
                  )}
                </div>

                <div className="location-info">
                  <p className="address">
                    📍 {customer.location.address}
                  </p>
                  <p className="city-state">
                    {customer.location.city}, {customer.location.state} -{' '}
                    {customer.location.pincode}
                  </p>
                  {customer.location.landmark && (
                    <p className="landmark">
                      <small>{customer.location.landmark}</small>
                    </p>
                  )}
                </div>

                <div className="schedule-info">
                  <p>
                    <strong>Date:</strong>{' '}
                    {formatDate(customer.schedule.requestedDate)}
                  </p>
                  <p>
                    <strong>Time:</strong> {customer.schedule.requestedTime}
                  </p>
                  <p>
                    <strong>Duration:</strong> ~
                    {customer.schedule.estimatedDuration} mins
                  </p>
                </div>

                <div className="pricing-info">
                  <p className="budget">
                    💰 <strong>₹{customer.pricing.totalAmount}</strong>
                  </p>
                  <p className="base-price">
                    (Base: ₹{customer.pricing.basePrice})
                  </p>
                </div>

                <div className="meta-info">
                  <p>Posted: {formatDate(customer.postedAt)}</p>
                </div>
              </div>

              <div className="card-actions">
                <button
                  onClick={() => handleAcceptRequest(customer.bookingId)}
                  className="btn btn-primary btn-accept"
                >
                  Accept Request
                </button>
                <button className="btn btn-secondary btn-message">
                  Message Customer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// EXPORT
// ============================================================================

export default {
  WorkerDiscoveryComponent,
  CustomerDiscoveryComponent
};
