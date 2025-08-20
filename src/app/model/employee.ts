export interface Employee {
  id: string; // 8-digit custom string
  name: string;
  mobile: string;
  email: string;
  nid: string;               
  dateOfBirth: string;      
  presentAddress?: string;
  permanentAddress?: string;
  gender: string;
  skills?: string[];           
  highestEducation: string;

  profileImage?: any;
  imageName?: string;
  imageType?: string;
  imageSize?: number[] |null;
}


