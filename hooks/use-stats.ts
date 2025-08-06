"use client";

import { useState, useEffect, useCallback, useMemo } from 'react';

interface StatsData {
  totalPatients: number;
  totalDoctors: number;
  totalAppointments: number;
  appointmentsLast7Days: number;
  appointmentsByStatus: any[];
  appointmentsByType: any[];
  genderDistribution: any[];
}

interface UseStatsReturn {
  stats: StatsData | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

// Simple cache implementation
const CACHE_KEY = 'dashboard-stats';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

interface CacheEntry {
  data: StatsData;
  timestamp: number;
}

class StatsCache {
  private cache: Map<string, CacheEntry> = new Map();

  set(key: string, data: StatsData): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  get(key: string): StatsData | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const isExpired = Date.now() - entry.timestamp > CACHE_DURATION;
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  clear(): void {
    this.cache.clear();
  }
}

const statsCache = new StatsCache();

export function useStats(): UseStatsReturn {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      setError(null);
      
      // Check cache first
      const cachedStats = statsCache.get(CACHE_KEY);
      if (cachedStats) {
        setStats(cachedStats);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      const response = await fetch('/api/stats', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch stats: ${response.statusText}`);
      }

      const data: StatsData = await response.json();
      
      // Cache the data
      statsCache.set(CACHE_KEY, data);
      setStats(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      console.error('Error fetching stats:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refetch = useCallback(() => {
    statsCache.clear();
    fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // Memoize the return value to prevent unnecessary re-renders
  const returnValue = useMemo(() => ({
    stats,
    isLoading,
    error,
    refetch,
  }), [stats, isLoading, error, refetch]);

  return returnValue;
}

// Performance monitoring hook
export function usePerformanceMonitor(componentName: string) {
  useEffect(() => {
    const startTime = performance.now();
    console.log(`🚀 ${componentName} started rendering`);

    return () => {
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      console.log(`✅ ${componentName} rendered in ${renderTime.toFixed(2)}ms`);
      
      // Log performance warning if render takes too long
      if (renderTime > 100) {
        console.warn(`⚠️ ${componentName} took ${renderTime.toFixed(2)}ms to render (>100ms)`);
      }
    };
  }, [componentName]);
}
