interface DistrictMap {
  [key: string]: string[];
}

export type VietnameseProvince = string;

// These are now managed by the useVietnameseLocations hook
export const vietnameseProvinces: string[] = [];
export const vietnameseDistricts: DistrictMap = {};

// Helper function is now part of the hook
export const getDistricts = (province: string): string[] => {
  return vietnameseDistricts[province] || [];
};
