import { useState, useEffect, useCallback } from 'react';

interface DistrictMap {
  [key: string]: string[];
}

interface UseVietnameseLocationsReturn {
  provinces: string[];
  districts: DistrictMap;
  getDistricts: (province: string) => string[];
  isLoading: boolean;
  error: string | null;
}

export function useVietnameseLocations(): UseVietnameseLocationsReturn {
  const [provinces, setProvinces] = useState<string[]>([]);
  const [districts, setDistricts] = useState<DistrictMap>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

        // Fetch provinces
        const provincesResponse = await fetch(
          'https://vn-public-apis.fpo.vn/provinces/getAll?limit=-1'
        );
        const provincesData = await provincesResponse.json();

        if (!isMounted) return;

        if (provincesData.exitcode === 1 && provincesData.data?.data) {
          setProvinces(
            provincesData.data.data.map(
              (p: { name_with_type: string }) => p.name_with_type
            )
          );
        } else {
          throw new Error('Failed to fetch provinces');
        }

        // Fetch districts
        const districtsResponse = await fetch(
          'https://vn-public-apis.fpo.vn/districts/getAll?limit=-1'
        );
        const districtsData = await districtsResponse.json();

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
        } else {
          throw new Error('Failed to fetch districts');
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err instanceof Error ? err.message : 'Failed to fetch locations'
          );
          setProvinces([]);
          setDistricts({});
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
    districts,
    getDistricts,
    isLoading,
    error,
  };
}
