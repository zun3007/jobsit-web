import { useState, useEffect } from 'react';

interface Location {
  address: string | null;
  district: string | null;
  province: string | null;
  error: string | null;
  isLoading: boolean;
}

interface GeolocationPosition {
  coords: {
    latitude: number;
    longitude: number;
  };
}

interface NominatimResponse {
  display_name: string;
  address: {
    city?: string;
    state?: string;
    suburb?: string;
    district?: string;
    quarter?: string;
  };
}

export const useGeolocation = () => {
  const [location, setLocation] = useState<Location>({
    address: null,
    district: null,
    province: null,
    error: null,
    isLoading: true,
  });

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocation((prev) => ({
        ...prev,
        error: 'Trình duyệt của bạn không hỗ trợ Geolocation',
        isLoading: false,
      }));
      return;
    }

    setLocation((prev) => ({ ...prev, isLoading: true }));
    console.log('Requesting geolocation...');

    navigator.geolocation.getCurrentPosition(
      async (position: GeolocationPosition) => {
        console.log(
          'Got coordinates:',
          position.coords.latitude,
          position.coords.longitude
        );
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${position.coords.latitude}&lon=${position.coords.longitude}&format=json&accept-language=vi`,
            {
              headers: {
                'User-Agent': 'JobsIT/1.0',
                'Accept-Language': 'vi',
              },
            }
          );

          if (!response.ok) {
            throw new Error('Không thể xác định địa chỉ');
          }

          const data: NominatimResponse = await response.json();
          console.log('Nominatim response:', data);

          // Extract address components from the structured address object
          const province = data.address.city || data.address.state || null;
          const district =
            data.address.suburb ||
            data.address.district ||
            data.address.quarter ||
            null;
          console.log('Found province:', province);
          console.log('Found district:', district);

          // Map the province name to match our format
          let mappedProvince = province;
          if (
            province &&
            !province.startsWith('Thành phố') &&
            !province.startsWith('Tỉnh')
          ) {
            mappedProvince = province.includes('Thành phố')
              ? province
              : `Thành phố ${province}`;
          }

          // Map the district name to match our format
          let mappedDistrict = district;
          if (
            district &&
            !district.startsWith('Quận') &&
            !district.startsWith('Huyện')
          ) {
            mappedDistrict = district.includes('Quận')
              ? district
              : `Quận ${district}`;
          }

          setLocation({
            address: data.display_name,
            district: mappedDistrict,
            province: mappedProvince,
            error: null,
            isLoading: false,
          });
        } catch (error) {
          console.error('Error getting location:', error);
          setLocation((prev) => ({
            ...prev,
            error: 'Không thể xác định địa chỉ',
            isLoading: false,
          }));
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
        let errorMessage = 'Đã xảy ra lỗi khi lấy vị trí';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Người dùng từ chối cấp quyền truy cập vị trí';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Thông tin vị trí không khả dụng';
            break;
          case error.TIMEOUT:
            errorMessage = 'Yêu cầu vị trí đã hết thời gian chờ';
            break;
        }
        setLocation((prev) => ({
          ...prev,
          error: errorMessage,
          isLoading: false,
        }));
      }
    );
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  return {
    ...location,
    getCurrentLocation,
  };
};
