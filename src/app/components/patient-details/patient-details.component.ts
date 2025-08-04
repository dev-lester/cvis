import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PatientService } from '../../services/patient.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-patient-details',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './patient-details.component.html',
  styleUrl: './patient-details.component.scss',
})
export class PatientDetailsComponent implements OnInit {
  patientForm!: FormGroup;
  mode: 'view' | 'edit' | 'create' = 'create';
  isEditing = false;
  patientId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private patientService: PatientService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.patientForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      gender: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      address: [''],
      medicalHistory: [''],
      lastVisit: [''],
      status: ['Active', Validators.required],
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.patientId = params['id'];
      this.isEditing = !!this.patientId;
    });

    this.route.queryParams.subscribe((queryParams) => {
      this.mode = queryParams['mode'] || (this.isEditing ? 'view' : 'create');
    });

    if (this.isEditing && this.patientId) {
      this.loadPatient();
    }
  }

  loadPatient(): void {
    if (this.patientId) {
      const patient = this.patientService.getPatientById(this.patientId);
      if (patient) {
        this.patientForm.patchValue(patient);
      } else {
        alert('Patient not found!');
        this.goBack();
      }
    }
  }

  getTitle(): string {
    if (this.mode === 'create') return 'Add New Patient';
    if (this.mode === 'edit') return 'Edit Patient';
    return 'Patient Details';
  }

  switchToEdit(): void {
    this.mode = 'edit';
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { mode: 'edit' },
      queryParamsHandling: 'merge',
    });
  }

  switchToView(): void {
    this.mode = 'view';
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { mode: 'view' },
      queryParamsHandling: 'merge',
    });
  }

  onSubmit(): void {
    if (this.patientForm.valid) {
      const patientData = this.patientForm.value;

      if (this.isEditing && this.patientId) {
        const updatedPatient = this.patientService.updatePatient(
          this.patientId,
          patientData
        );
        if (updatedPatient) {
          alert('Patient updated successfully!');
          this.switchToView();
        } else {
          alert('Error updating patient!');
        }
      } else {
        const newPatient = this.patientService.createPatient(patientData);
        alert('Patient created successfully!');
        this.router.navigate(['/patient', newPatient.id], {
          queryParams: { mode: 'view' },
        });
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  resetForm(): void {
    if (this.isEditing) {
      this.loadPatient();
    } else {
      this.patientForm.reset({
        status: 'Active',
      });
    }
  }

  deleteCurrentPatient(): void {
    if (
      this.patientId &&
      confirm('Are you sure you want to delete this patient?')
    ) {
      if (this.patientService.deletePatient(this.patientId)) {
        alert('Patient deleted successfully!');
        this.goBack();
      } else {
        alert('Error deleting patient!');
      }
    }
  }

  goBack(): void {
    this.router.navigate(['/patients']);
  }

  private markFormGroupTouched(): void {
    Object.keys(this.patientForm.controls).forEach((key) => {
      const control = this.patientForm.get(key);
      control?.markAsTouched();
    });
  }
}
