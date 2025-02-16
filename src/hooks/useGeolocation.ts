import { useState, useEffect } from 'react';
import {
  vietnameseProvinces,
  vietnameseDistricts,
  type VietnameseProvince,
} from '@/utils/constants';

interface Location {
  address: string | null;
  district: string | null;
  province: VietnameseProvince | null;
  error: string | null;
  isLoading: boolean;
}

interface GeolocationPosition {
  coords: {
    latitude: number;
    longitude: number;
  };
}

// Special case mappings for provinces
const provinceMapping: Record<string, VietnameseProvince> = {
  'Thành phố Hồ Chí Minh': 'TP Hồ Chí Minh',
  'TP. Hồ Chí Minh': 'TP Hồ Chí Minh',
  'Tp. Hồ Chí Minh': 'TP Hồ Chí Minh',
  'Hồ Chí Minh': 'TP Hồ Chí Minh',
  'Thành phố Hà Nội': 'Hà Nội',
  'TP. Hà Nội': 'Hà Nội',
  'Tp. Hà Nội': 'Hà Nội',
  'Thành phố Đà Nẵng': 'Đà Nẵng',
  'TP. Đà Nẵng': 'Đà Nẵng',
  'Tp. Đà Nẵng': 'Đà Nẵng',
  'Thành phố Hải Phòng': 'Hải Phòng',
  'TP. Hải Phòng': 'Hải Phòng',
  'Tp. Hải Phòng': 'Hải Phòng',
  'Thành phố Cần Thơ': 'Cần Thơ',
  'TP. Cần Thơ': 'Cần Thơ',
  'Tp. Cần Thơ': 'Cần Thơ',
} as const;

// Special case mappings for districts
const getDistrictMapping = (
  province: VietnameseProvince
): Record<string, string> => {
  const districts = vietnameseDistricts[province];
  const mapping: Record<string, string> = {};

  districts.forEach((district) => {
    // Handle "Quận" prefix
    if (district.startsWith('Quận ')) {
      mapping[district.replace('Quận ', 'Q.')] = district;
      mapping[district.replace('Quận ', 'Q')] = district;
      mapping[district.replace('Quận ', '')] = district;
    }
    // Handle "Huyện" prefix
    if (district.startsWith('Huyện ')) {
      mapping[district.replace('Huyện ', 'H.')] = district;
      mapping[district.replace('Huyện ', 'H')] = district;
      mapping[district.replace('Huyện ', '')] = district;
    }
    // Handle "Thành phố" prefix
    if (district.startsWith('Thành phố ')) {
      mapping[district.replace('Thành phố ', 'TP.')] = district;
      mapping[district.replace('Thành phố ', 'TP')] = district;
      mapping[district.replace('Thành phố ', '')] = district;
    }
    // Handle "Thị xã" prefix
    if (district.startsWith('Thị xã ')) {
      mapping[district.replace('Thị xã ', 'TX.')] = district;
      mapping[district.replace('Thị xã ', 'TX')] = district;
      mapping[district.replace('Thị xã ', '')] = district;
    }
  });

  return mapping;
};

export const useGeolocation = () => {
  const [location, setLocation] = useState<Location>({
    address: null,
    district: null,
    province: null,
    error: null,
    isLoading: true,
  });

  const findProvince = (address: string): VietnameseProvince | null => {
    // First try direct match
    for (const province of vietnameseProvinces) {
      if (address.includes(province)) {
        return province;
      }
    }

    // Try mapped variations
    for (const [key, value] of Object.entries(provinceMapping)) {
      if (address.includes(key)) {
        return value;
      }
    }

    return null;
  };

  const findDistrict = (
    address: string,
    province: VietnameseProvince | null
  ): string | null => {
    if (!province) return null;

    const districts = vietnameseDistricts[province];
    const districtMapping = getDistrictMapping(province);

    // First try direct match
    for (const district of districts) {
      if (address.includes(district)) {
        return district;
      }
    }

    // Try mapped variations
    for (const [key, value] of Object.entries(districtMapping)) {
      if (address.includes(key)) {
        return value;
      }
    }

    return null;
  };

  const getAddressFromCoords = async (latitude: number, longitude: number) => {
    try {
      // Use OpenStreetMap's Nominatim service with proper headers
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=vi`,
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

      const data = await response.json();

      // Extract address components
      const address = data.display_name;
      const province = findProvince(address);
      const district = findDistrict(address, province);

      setLocation({
        address,
        district,
        province,
        error: null,
        isLoading: false,
      });
    } catch {
      setLocation((prev) => ({
        ...prev,
        error: 'Không thể xác định địa chỉ',
        isLoading: false,
      }));
    }
  };

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

    navigator.geolocation.getCurrentPosition(
      (position: GeolocationPosition) => {
        getAddressFromCoords(
          position.coords.latitude,
          position.coords.longitude
        );
      },
      (error) => {
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
    getCurrentLocation, // Expose this method to allow manual refresh
  };
};
