import { useState, useEffect } from 'react';
import { statsApi } from '@/lib/api';

interface PlatformStats {
  totalUsers: number;
  totalCustomers: number;
  totalWorkers: number;
  verifiedWorkers: number;
  totalBookings: number;
  activeDistricts: number;
  completedBookings: number;
  averageRating: number;
  activeStates: number;
}

export function usePlatformStats() {
  const [platformStats, setPlatformStats] = useState<PlatformStats>({
    totalUsers: 0,
    totalCustomers: 0,
    totalWorkers: 0,
    verifiedWorkers: 0,
    totalBookings: 0,
    activeDistricts: 0,
    completedBookings: 0,
    averageRating: 0,
    activeStates: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await statsApi.getPlatformStats();
        setPlatformStats({
          totalUsers: response.data.totalUsers || 0,
          totalCustomers: response.data.totalCustomers || 0,
          totalWorkers: response.data.totalWorkers || 0,
          verifiedWorkers: response.data.verifiedWorkers || 0,
          totalBookings: response.data.totalBookings || 0,
          activeDistricts: response.data.activeDistricts || 0,
          completedBookings: response.data.completedBookings || 0,
          averageRating: response.data.averageRating || 4.5,
          activeStates: response.data.activeStates || 0
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        console.error('Failed to fetch platform stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { platformStats, loading, error };
}