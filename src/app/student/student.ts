import { Gender } from '../teacher/teacher';
import { AddressDto } from './address';

export enum StudentClass {
  CLASS_1 = 'CLASS_1',
  CLASS_2 = 'CLASS_2',
  CLASS_3 = 'CLASS_3',
  CLASS_4 = 'CLASS_4',
  CLASS_5 = 'CLASS_5',
  CLASS_6 = 'CLASS_6',
  CLASS_7 = 'CLASS_7',
  CLASS_8 = 'CLASS_8',
  CLASS_9 = 'CLASS_9',
  CLASS_10 = 'CLASS_10',
  HSC_SCIENCE = 'HSC_SCIENCE',
  HSC_COMMERCE = 'HSC_COMMERCE',
  HSC_ARTS = 'HSC_ARTS',
}

export interface StudentDto {
  id?: number;
  studentIdNo?: string;
  firstName: string;
  lastName: string;
  fatherName: string;
  motherName: string;
  admissionNumber: string;
  dateOfBirth: string; // "dd/MM/yyyy"
  gender: Gender;
  email: string;
  phoneNumber: string;
  addresses: AddressDto[];
  studentClass: StudentClass;
  admissionDate: string; // "dd/MM/yyyy"
  section: string;
  rollNumber: string;
  profileImagePath?: string;
  active: boolean;
}

export interface StudentPage {
  totalItems: number;
  students: StudentDto[];
  totalPages: number;
  currentPage: number;
  sortBy: string;
  sortDir: string;
}
