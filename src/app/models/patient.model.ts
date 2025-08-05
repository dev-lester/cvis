export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  studyDate: string;
  bloodPressure: string;
  rhythm: string;
  heartRate: string;
  ultrasoundTechnologist: string;
  orderingPhysician: string;
  indication: string;
  findings: string;
  conclusions: string;
  phone: string;
  email: string;
  address: string;
  medicalHistory: string;
  lastVisit: string;
  status: 'Active' | 'Inactive';
  profileImage: string;
  imageResult: string;
}
