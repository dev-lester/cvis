import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PatientService } from '../../services/patient.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-patient-list',
  imports: [CommonModule, FormsModule],
  templateUrl: './patient-list.component.html',
  styleUrl: './patient-list.component.scss',
})
export class PatientListComponent implements OnInit {
  patients: any[] = [];
  filteredPatients: any[] = [];
  searchTerm: string = '';
  statusFilter: string = '';

  // Modal properties
  showImageModal: boolean = false;
  modalImageSrc: string = 'default.jpg';
  modalImageTitle: string = '';

  constructor(private patientService: PatientService, private router: Router) {}

  ngOnInit(): void {
    this.loadPatients();
  }

  loadPatients(): void {
    this.patients = this.patientService.getAllPatients();
    console.table(this.patients);
    this.filteredPatients = this.patients;
  }

  filterPatients(): void {
    this.filteredPatients = this.patients.filter((patient) => {
      const matchesSearch =
        !this.searchTerm ||
        patient.firstName
          .toLowerCase()
          .includes(this.searchTerm.toLowerCase()) ||
        patient.lastName
          .toLowerCase()
          .includes(this.searchTerm.toLowerCase()) ||
        patient.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        patient.phone.includes(this.searchTerm);

      const matchesStatus =
        !this.statusFilter || patient.status === this.statusFilter;

      return matchesSearch && matchesStatus;
    });
  }

  addNewPatient(): void {
    this.router.navigate(['/patient']);
  }

  viewPatient(id: string): void {
    this.router.navigate(['/patient', id], { queryParams: { mode: 'view' } });
  }

  editPatient(id: string): void {
    this.router.navigate(['/patient', id], { queryParams: { mode: 'edit' } });
  }

  deletePatient(id: string): void {
    if (confirm('Are you sure you want to delete this patient?')) {
      this.patientService.deletePatient(id);
      this.loadPatients();
    }
  }

  openImageModal(imageSrc: string, imageTitle: string): void {
    console.log(imageSrc, imageTitle);

    this.modalImageSrc = imageSrc;
    this.modalImageTitle = imageTitle;
    this.showImageModal = true;
    document.body.style.overflow = 'hidden';
  }

  closeImageModal(): void {
    this.showImageModal = false;
    document.body.style.overflow = 'auto'; // Restore body scroll
  }

  onImageError(event: any): void {
    // Fallback to default image if image fails to load
    // event.target.src = 'assets/images/patients/default-avatar.jpg';
  }
}
