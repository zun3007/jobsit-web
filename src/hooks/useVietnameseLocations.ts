import { useState, useEffect, useCallback } from 'react';
import {
  vietnameseProvinces,
  vietnameseDistricts,
} from '@/utils/constants_backup';

// Constants for caching
const CACHE_KEY = 'vietnamese_locations_data';
const CACHE_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 1000; // 1 second

interface DistrictMap {
  [key: string]: string[];
}

interface CachedData {
  provinces: string[];
  districts: DistrictMap;
  timestamp: number;
}

interface UseVietnameseLocationsReturn {
  provinces: string[];
  getDistricts: (province: string) => string[];
  isLoading: boolean;
  error: string | null;
}

// Simple request queue to prevent too many simultaneous requests
class RequestQueue {
  private queue: (() => Promise<unknown>)[] = [];
  private processing = false;
  private requestInterval = 1000; // 1 second between requests

  async add<T>(request: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          const result = await request();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });

      if (!this.processing) {
        this.processQueue();
      }
    });
  }

  private async processQueue() {
    if (this.queue.length === 0) {
      this.processing = false;
      return;
    }

    this.processing = true;
    const request = this.queue.shift();

    if (request) {
      try {
        await request();
      } catch (error) {
        console.error('Error processing queued request:', error);
      }

      // Wait before processing next request
      await new Promise((resolve) => setTimeout(resolve, this.requestInterval));
      this.processQueue();
    }
  }
}

const requestQueue = new RequestQueue();

export function useVietnameseLocations(): UseVietnameseLocationsReturn {
  const [provinces, setProvinces] = useState<string[]>([]);
  const [districts, setDistricts] = useState<DistrictMap>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if cache exists and is valid
  const getFromCache = (): CachedData | null => {
    try {
      const cachedData = localStorage.getItem(CACHE_KEY);
      if (!cachedData) return null;

      const parsedData = JSON.parse(cachedData) as CachedData;

      // Check if cache is expired
      if (Date.now() - parsedData.timestamp > CACHE_EXPIRY) {
        localStorage.removeItem(CACHE_KEY);
        return null;
      }

      return parsedData;
    } catch (err) {
      console.error('Error reading from cache:', err);
      localStorage.removeItem(CACHE_KEY);
      return null;
    }
  };

  // Save data to cache
  const saveToCache = (provinces: string[], districts: DistrictMap) => {
    try {
      const cacheData: CachedData = {
        provinces,
        districts,
        timestamp: Date.now(),
      };
      localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
    } catch (err) {
      console.error('Error saving to cache:', err);
    }
  };

  // Apply fallback data from constants_backup.ts
  const applyFallbackData = () => {
    console.warn('Using fallback location data');
    setProvinces(vietnameseProvinces as unknown as string[]);
    setDistricts(vietnameseDistricts);
    saveToCache(
      vietnameseProvinces as unknown as string[],
      vietnameseDistricts
    );
  };

  // Fetch with retry logic
  const fetchWithRetry = async (
    url: string,
    retries = MAX_RETRIES,
    delay = INITIAL_RETRY_DELAY
  ) => {
    try {
      const response = await fetch(url);

      // Handle rate limiting
      if (response.status === 429) {
        if (retries > 0) {
          console.warn(
            `Rate limited, retrying in ${delay}ms. Retries left: ${retries}`
          );
          await new Promise((resolve) => setTimeout(resolve, delay));
          return fetchWithRetry(url, retries - 1, delay * 2); // Exponential backoff
        } else {
          throw new Error('Rate limit exceeded after multiple retries');
        }
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.json();
    } catch (err) {
      if (
        retries > 0 &&
        !(err instanceof Error && err.message.includes('Rate limit'))
      ) {
        console.warn(
          `Request failed, retrying in ${delay}ms. Retries left: ${retries}`
        );
        await new Promise((resolve) => setTimeout(resolve, delay));
        return fetchWithRetry(url, retries - 1, delay * 2);
      }
      throw err;
    }
  };

  // Memoize the getDistricts function
  const getDistricts = useCallback(
    (province: string): string[] => {
      return districts[province] || [];
    },
    [districts]
  );

  useEffect(() => {
    let isMounted = true;

    async function fetchLocations() {
      try {
        setIsLoading(true);
        setError(null);

        // Try to get from cache first
        const cachedData = getFromCache();
        if (cachedData) {
          console.log('Using cached location data');
          setProvinces(cachedData.provinces);
          setDistricts(cachedData.districts);
          setIsLoading(false);
          return;
        }

        // Queue the API requests to prevent too many simultaneous calls
        try {
          // Fetch provinces
          const provincesData = await requestQueue.add(() =>
            fetchWithRetry(
              'https://vn-public-apis.fpo.vn/provinces/getAll?limit=-1'
            )
          );

          if (!isMounted) return;

          if (provincesData.exitcode === 1 && provincesData.data?.data) {
            const fetchedProvinces = provincesData.data.data.map(
              (p: { name_with_type: string }) => p.name_with_type
            );
            setProvinces(fetchedProvinces);

            // Fetch districts
            const districtsData = await requestQueue.add(() =>
              fetchWithRetry(
                'https://vn-public-apis.fpo.vn/districts/getAll?limit=-1'
              )
            );

            if (!isMounted) return;

            if (districtsData.exitcode === 1 && districtsData.data?.data) {
              const districtMap = districtsData.data.data.reduce(
                (
                  acc: DistrictMap,
                  d: {
                    name_with_type: string;
                    path_with_type: string;
                  }
                ) => {
                  const provinceName = d.path_with_type.split(', ')[1].trim();
                  if (!acc[provinceName]) {
                    acc[provinceName] = [];
                  }
                  acc[provinceName].push(d.name_with_type);
                  acc[provinceName].sort();
                  return acc;
                },
                {}
              );
              setDistricts(districtMap);

              // Save successful API response to cache
              saveToCache(fetchedProvinces, districtMap);
            } else {
              throw new Error('Failed to fetch districts');
            }
          } else {
            throw new Error('Failed to fetch provinces');
          }
        } catch (apiError) {
          console.error('API error, using fallback data:', apiError);
          applyFallbackData();
        }
      } catch (err) {
        if (isMounted) {
          console.error('Error in fetchLocations:', err);
          setError(
            err instanceof Error ? err.message : 'Failed to fetch locations'
          );

          // Use fallback data if everything else fails
          applyFallbackData();
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchLocations();

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    provinces,
    getDistricts,
    isLoading,
    error,
  };
}
