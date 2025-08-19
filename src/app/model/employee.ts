export interface Employee {
  id: string; // 8-digit custom string
  name: string;
  mobile: string;
  email: string;
  nid: string;               // 10 or 17 digits
  dateOfBirth: string;       // yyyy-MM-dd
  presentAddress?: string;
  permanentAddress?: string;
  gender: 'Male' | 'Female' | 'Other';
  skills?: string;           // comma-separated
  highestEducation: 'M.Sc' | 'B.Sc' | 'HSC' | 'SSC';

  profileImage?: any;
  imageName?: string;
  imageType?: string;
  imageSize?: number;
}

export interface EmployeeRequest {
  name: string;
  mobile: string;
  email: string;
  nid: string;
  dateOfBirth: string;      // yyyy-MM-dd
  presentAddress?: string;
  permanentAddress?: string;
  gender: 'Male' | 'Female' | 'Other';
  skills?: string;
  highestEducation: 'M.Sc' | 'B.Sc' | 'HSC' | 'SSC';
  profileImage?: File | null;
}
