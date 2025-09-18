export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
}

export interface Teacher {
  id?: number;
  teacherId?: string;
  name: string;
  mobile: string;
  email: string;
  nid: string;
  dateOfBirth: string;
  presentAddress?: string;
  permanentAddress?: string;
  gender: Gender;
  skills: string[];
  highestEducation: string;
  profileImagePath?: string;
}

export interface TeacherRequestDto {
  id?: number;
  name: string;
  mobile: string;
  email: string;
  nid: string;
  dateOfBirth: string;
  presentAddress?: string;
  permanentAddress?: string;
  gender: Gender;
  skills: string[];
  highestEducation: string;
}

export interface TeacherPage {
  totalItems: number;
  teachers: Teacher[];
  totalPages: number;
  currentPage: number;
  sortBy: string;
  sortDir: string;
}
