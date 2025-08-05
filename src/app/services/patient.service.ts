import { Injectable } from '@angular/core';
// import TEST_DATA from '../data.json';
import { firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Patient } from '../models/patient.model';

@Injectable({
  providedIn: 'root',
})
export class PatientService {
  private readonly STORAGE_KEY = 'radiology_patients';
  production = 'https://cvis.vercel.app/data';
  url = 'http://localhost:3000/data';

  constructor(private http: HttpClient) {
    this.initializeSampleData();
  }

  private async initializeSampleData(): Promise<void> {
    if (!localStorage.getItem(this.STORAGE_KEY)) {
      try {
        const data = await fetch(this.url);
        const samplePatients = (await data.json()) ?? [];
        this.savePatients(samplePatients);
      } catch (err) {
        console.log('Failed to load mock data:', err);
        this.savePatients([]);
      }
      // try {
      //   const response = await firstValueFrom(
      //     this.http.get<{ data: Patient[] }>('assets/mock-data.json')
      //   );
      //   const samplePatients = response.data;
      //   this.savePatients(samplePatients);
      // } catch (err) {
      //   console.log('Failed to load mock data:', err);
      //   this.savePatients([]);
      // }
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
      imageResult: patient.imageResult || 'assets/default.jpg',
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
