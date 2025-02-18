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
  // Special cases for major cities
  'Thành phố Hồ Chí Minh': 'Thành phố Hồ Chí Minh',
  'TP. Hồ Chí Minh': 'Thành phố Hồ Chí Minh',
  'Tp. Hồ Chí Minh': 'Thành phố Hồ Chí Minh',
  'Hồ Chí Minh': 'Thành phố Hồ Chí Minh',
  'Thành phố Hà Nội': 'Thành phố Hà Nội',
  'TP. Hà Nội': 'Thành phố Hà Nội',
  'Tp. Hà Nội': 'Thành phố Hà Nội',
  'Hà Nội': 'Thành phố Hà Nội',
  'Thành phố Đà Nẵng': 'Thành phố Đà Nẵng',
  'TP. Đà Nẵng': 'Thành phố Đà Nẵng',
  'Tp. Đà Nẵng': 'Thành phố Đà Nẵng',
  'Đà Nẵng': 'Thành phố Đà Nẵng',
  'Thành phố Hải Phòng': 'Thành phố Hải Phòng',
  'TP. Hải Phòng': 'Thành phố Hải Phòng',
  'Tp. Hải Phòng': 'Thành phố Hải Phòng',
  'Hải Phòng': 'Thành phố Hải Phòng',
  'Thành phố Cần Thơ': 'Thành phố Cần Thơ',
  'TP. Cần Thơ': 'Thành phố Cần Thơ',
  'Tp. Cần Thơ': 'Thành phố Cần Thơ',
  'Cần Thơ': 'Thành phố Cần Thơ',

  // Handle provinces with "Tỉnh" prefix
  'Tỉnh An Giang': 'Tỉnh An Giang',
  'An Giang': 'Tỉnh An Giang',
  'Tỉnh Bà Rịa - Vũng Tàu': 'Tỉnh Bà Rịa - Vũng Tàu',
  'Bà Rịa - Vũng Tàu': 'Tỉnh Bà Rịa - Vũng Tàu',
  'Tỉnh Bạc Liêu': 'Tỉnh Bạc Liêu',
  'Bạc Liêu': 'Tỉnh Bạc Liêu',
  'Tỉnh Bắc Giang': 'Tỉnh Bắc Giang',
  'Bắc Giang': 'Tỉnh Bắc Giang',
  'Tỉnh Bắc Kạn': 'Tỉnh Bắc Kạn',
  'Bắc Kạn': 'Tỉnh Bắc Kạn',
  'Tỉnh Bắc Ninh': 'Tỉnh Bắc Ninh',
  'Bắc Ninh': 'Tỉnh Bắc Ninh',
  'Tỉnh Bến Tre': 'Tỉnh Bến Tre',
  'Bến Tre': 'Tỉnh Bến Tre',
  'Tỉnh Bình Dương': 'Tỉnh Bình Dương',
  'Bình Dương': 'Tỉnh Bình Dương',
  'Tỉnh Bình Định': 'Tỉnh Bình Định',
  'Bình Định': 'Tỉnh Bình Định',
  'Tỉnh Bình Phước': 'Tỉnh Bình Phước',
  'Bình Phước': 'Tỉnh Bình Phước',
  'Tỉnh Bình Thuận': 'Tỉnh Bình Thuận',
  'Bình Thuận': 'Tỉnh Bình Thuận',
  'Tỉnh Cà Mau': 'Tỉnh Cà Mau',
  'Cà Mau': 'Tỉnh Cà Mau',
  'Tỉnh Cao Bằng': 'Tỉnh Cao Bằng',
  'Cao Bằng': 'Tỉnh Cao Bằng',
  'Tỉnh Đắk Lắk': 'Tỉnh Đắk Lắk',
  'Đắk Lắk': 'Tỉnh Đắk Lắk',
  'Tỉnh Đắk Nông': 'Tỉnh Đắk Nông',
  'Đắk Nông': 'Tỉnh Đắk Nông',
  'Tỉnh Điện Biên': 'Tỉnh Điện Biên',
  'Điện Biên': 'Tỉnh Điện Biên',
  'Tỉnh Đồng Nai': 'Tỉnh Đồng Nai',
  'Đồng Nai': 'Tỉnh Đồng Nai',
  'Tỉnh Đồng Tháp': 'Tỉnh Đồng Tháp',
  'Đồng Tháp': 'Tỉnh Đồng Tháp',
  'Tỉnh Gia Lai': 'Tỉnh Gia Lai',
  'Gia Lai': 'Tỉnh Gia Lai',
  'Tỉnh Hà Giang': 'Tỉnh Hà Giang',
  'Hà Giang': 'Tỉnh Hà Giang',
  'Tỉnh Hà Nam': 'Tỉnh Hà Nam',
  'Hà Nam': 'Tỉnh Hà Nam',
  'Tỉnh Hà Tĩnh': 'Tỉnh Hà Tĩnh',
  'Hà Tĩnh': 'Tỉnh Hà Tĩnh',
  'Tỉnh Hải Dương': 'Tỉnh Hải Dương',
  'Hải Dương': 'Tỉnh Hải Dương',
  'Tỉnh Hậu Giang': 'Tỉnh Hậu Giang',
  'Hậu Giang': 'Tỉnh Hậu Giang',
  'Tỉnh Hoà Bình': 'Tỉnh Hoà Bình',
  'Hoà Bình': 'Tỉnh Hoà Bình',
  'Tỉnh Hưng Yên': 'Tỉnh Hưng Yên',
  'Hưng Yên': 'Tỉnh Hưng Yên',
  'Tỉnh Khánh Hòa': 'Tỉnh Khánh Hòa',
  'Khánh Hòa': 'Tỉnh Khánh Hòa',
  'Tỉnh Kiên Giang': 'Tỉnh Kiên Giang',
  'Kiên Giang': 'Tỉnh Kiên Giang',
  'Tỉnh Kon Tum': 'Tỉnh Kon Tum',
  'Kon Tum': 'Tỉnh Kon Tum',
  'Tỉnh Lai Châu': 'Tỉnh Lai Châu',
  'Lai Châu': 'Tỉnh Lai Châu',
  'Tỉnh Lạng Sơn': 'Tỉnh Lạng Sơn',
  'Lạng Sơn': 'Tỉnh Lạng Sơn',
  'Tỉnh Lào Cai': 'Tỉnh Lào Cai',
  'Lào Cai': 'Tỉnh Lào Cai',
  'Tỉnh Lâm Đồng': 'Tỉnh Lâm Đồng',
  'Lâm Đồng': 'Tỉnh Lâm Đồng',
  'Tỉnh Long An': 'Tỉnh Long An',
  'Long An': 'Tỉnh Long An',
  'Tỉnh Nam Định': 'Tỉnh Nam Định',
  'Nam Định': 'Tỉnh Nam Định',
  'Tỉnh Nghệ An': 'Tỉnh Nghệ An',
  'Nghệ An': 'Tỉnh Nghệ An',
  'Tỉnh Ninh Bình': 'Tỉnh Ninh Bình',
  'Ninh Bình': 'Tỉnh Ninh Bình',
  'Tỉnh Ninh Thuận': 'Tỉnh Ninh Thuận',
  'Ninh Thuận': 'Tỉnh Ninh Thuận',
  'Tỉnh Phú Thọ': 'Tỉnh Phú Thọ',
  'Phú Thọ': 'Tỉnh Phú Thọ',
  'Tỉnh Phú Yên': 'Tỉnh Phú Yên',
  'Phú Yên': 'Tỉnh Phú Yên',
  'Tỉnh Quảng Bình': 'Tỉnh Quảng Bình',
  'Quảng Bình': 'Tỉnh Quảng Bình',
  'Tỉnh Quảng Nam': 'Tỉnh Quảng Nam',
  'Quảng Nam': 'Tỉnh Quảng Nam',
  'Tỉnh Quảng Ngãi': 'Tỉnh Quảng Ngãi',
  'Quảng Ngãi': 'Tỉnh Quảng Ngãi',
  'Tỉnh Quảng Ninh': 'Tỉnh Quảng Ninh',
  'Quảng Ninh': 'Tỉnh Quảng Ninh',
  'Tỉnh Quảng Trị': 'Tỉnh Quảng Trị',
  'Quảng Trị': 'Tỉnh Quảng Trị',
  'Tỉnh Sóc Trăng': 'Tỉnh Sóc Trăng',
  'Sóc Trăng': 'Tỉnh Sóc Trăng',
  'Tỉnh Sơn La': 'Tỉnh Sơn La',
  'Sơn La': 'Tỉnh Sơn La',
  'Tỉnh Tây Ninh': 'Tỉnh Tây Ninh',
  'Tây Ninh': 'Tỉnh Tây Ninh',
  'Tỉnh Thái Bình': 'Tỉnh Thái Bình',
  'Thái Bình': 'Tỉnh Thái Bình',
  'Tỉnh Thái Nguyên': 'Tỉnh Thái Nguyên',
  'Thái Nguyên': 'Tỉnh Thái Nguyên',
  'Tỉnh Thanh Hóa': 'Tỉnh Thanh Hóa',
  'Thanh Hóa': 'Tỉnh Thanh Hóa',
  'Tỉnh Thừa Thiên Huế': 'Tỉnh Thừa Thiên Huế',
  'Thừa Thiên Huế': 'Tỉnh Thừa Thiên Huế',
  'Tỉnh Tiền Giang': 'Tỉnh Tiền Giang',
  'Tiền Giang': 'Tỉnh Tiền Giang',
  'Tỉnh Trà Vinh': 'Tỉnh Trà Vinh',
  'Trà Vinh': 'Tỉnh Trà Vinh',
  'Tỉnh Tuyên Quang': 'Tỉnh Tuyên Quang',
  'Tuyên Quang': 'Tỉnh Tuyên Quang',
  'Tỉnh Vĩnh Long': 'Tỉnh Vĩnh Long',
  'Vĩnh Long': 'Tỉnh Vĩnh Long',
  'Tỉnh Vĩnh Phúc': 'Tỉnh Vĩnh Phúc',
  'Vĩnh Phúc': 'Tỉnh Vĩnh Phúc',
  'Tỉnh Yên Bái': 'Tỉnh Yên Bái',
  'Yên Bái': 'Tỉnh Yên Bái',
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
