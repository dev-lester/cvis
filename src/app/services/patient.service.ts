import { Injectable } from '@angular/core';

interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  phone: string;
  email: string;
  address: string;
  medicalHistory: string;
  lastVisit: string;
  status: 'Active' | 'Inactive';
}

@Injectable({
  providedIn: 'root',
})
export class PatientService {
  private readonly STORAGE_KEY = 'radiology_patients';

  constructor() {
    this.initializeSampleData();
  }

  private initializeSampleData(): void {
    if (!localStorage.getItem(this.STORAGE_KEY)) {
      const samplePatients: Patient[] = [
        {
          id: '1',
          firstName: 'John',
          lastName: 'Doe',
          dateOfBirth: '1985-03-15',
          gender: 'Male',
          phone: '+1-555-0123',
          email: 'john.doe@email.com',
          address: '123 Main St, City, State 12345',
          medicalHistory: 'Hypertension, Diabetes',
          lastVisit: '2024-01-15',
          status: 'Active',
        },
        {
          id: '2',
          firstName: 'Jane',
          lastName: 'Smith',
          dateOfBirth: '1990-07-22',
          gender: 'Female',
          phone: '+1-555-0456',
          email: 'jane.smith@email.com',
          address: '456 Oak Ave, City, State 12345',
          medicalHistory: 'Asthma',
          lastVisit: '2024-01-20',
          status: 'Active',
        },
      ];
      this.savePatients(samplePatients);
    }
  }

  getAllPatients(): Patient[] {
    const patients = localStorage.getItem(this.STORAGE_KEY);
    return patients ? JSON.parse(patients) : [];
  }

  getPatientById(id: string): Patient | undefined {
    const patients = this.getAllPatients();
    return patients.find((p) => p.id === id);
  }

  createPatient(patient: Omit<Patient, 'id'>): Patient {
    const patients = this.getAllPatients();
    const newPatient: Patient = {
      ...patient,
      id: Date.now().toString(),
    };
    patients.push(newPatient);
    this.savePatients(patients);
    return newPatient;
  }

  updatePatient(
    id: string,
    updatedPatient: Omit<Patient, 'id'>
  ): Patient | null {
    const patients = this.getAllPatients();
    const index = patients.findIndex((p) => p.id === id);
    if (index !== -1) {
      patients[index] = { ...updatedPatient, id };
      this.savePatients(patients);
      return patients[index];
    }
    return null;
  }

  deletePatient(id: string): boolean {
    const patients = this.getAllPatients();
    const filteredPatients = patients.filter((p) => p.id !== id);
    if (filteredPatients.length < patients.length) {
      this.savePatients(filteredPatients);
      return true;
    }
    return false;
  }

  private savePatients(patients: Patient[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(patients));
  }

  getPatientStats() {
    const patients = this.getAllPatients();
    return {
      total: patients.length,
      active: patients.filter((p) => p.status === 'Active').length,
      inactive: patients.filter((p) => p.status === 'Inactive').length,
    };
  }
}
