import { Component, HostListener, OnInit } from '@angular/core';
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
  imageList: string[] = [
    'eco1.jpg',
    'eco2.jpg',
    'eco3.jpg',
    'eco4.jpg',
    'eco5.jpg',
    'eco6.jpg',
  ];
  currentImagePreview: string =
    this.imageList[Math.floor(Math.random() * this.imageList.length)];
  showWhenToggle: boolean = false;

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
      gender: [
        { value: '', disabled: this.mode === 'view' },
        Validators.required,
      ],
      studyDate: ['', Validators.required],
      bloodPressure: ['', Validators.required],
      rhythm: ['', Validators.required],
      heartRate: ['', Validators.required],
      ultrasoundTechnologist: ['', Validators.required],
      orderingPhysician: ['', Validators.required],
      indication: ['', Validators.required],
      findings: ['', Validators.required],
      conclusions: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      address: [''],
      medicalHistory: [''],
      lastVisit: [''],
      status: [
        { value: '', disabled: this.mode === 'view' },
        Validators.required,
      ],
      imageResult: [''],
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
    } else {
      // Set default image for new patients
      this.currentImagePreview = this.currentImagePreview;
      this.patientForm.patchValue({ imageResult: this.currentImagePreview });
    }
  }

  loadPatient(): void {
    if (this.patientId) {
      const patient = this.patientService.getPatientById(this.patientId);
      if (patient) {
        this.patientForm.patchValue(patient);
        this.currentImagePreview
          ? this.currentImagePreview
          : patient.imageResult;
      } else {
        alert('Patient not found!');
        this.goBack();
      }
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Validate file size (2MB limit)
      if (file.size > 2 * 1024 * 1024) {
        alert('File size must be less than 2MB');
        return;
      }

      // Validate file type
      if (!file.type.startWith('image/')) {
        alert('Please select a valid image file');
        return;
      }

      // Convert to base64 for straoge
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.currentImagePreview = e.target.result;
        this.patientForm.patchValue({ imageResult: e.target.result });
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(): void {
    this.currentImagePreview = '';
    this.patientForm.patchValue({ imageResult: this.currentImagePreview });
  }

  getTitle(): string {
    if (this.mode === 'create') return 'Add New Patient';
    if (this.mode === 'edit') return 'Edit Patient';
    return 'Echocardiography Examination';
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
        imageResult: this.currentImagePreview,
      });
      this.currentImagePreview = '';
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

  // printDetails(): void {
  //   if (typeof window.print()) {
  //     setTimeout(() => {
  //       this.showWhenToggle = !this.showWhenToggle;
  //     }, 1000);
  //   }
  // }

  goBack(): void {
    this.router.navigate(['/patients']);
  }

  private markFormGroupTouched(): void {
    Object.keys(this.patientForm.controls).forEach((key) => {
      const control = this.patientForm.get(key);
      control?.markAsTouched();
    });
  }

  @HostListener('window:beforeprint', [])
  onBeforePrint() {
    console.log('🖨 Print dialog opened');
    this.showWhenToggle = true;
    // Optional: hide UI elements, adjust layout, etc.
  }

  @HostListener('window:afterprint', [])
  onAfterPrint() {
    console.log('✅ Print dialog closed (printed or canceled)');
    this.showWhenToggle = false;
    // Optional: reset layout, show hidden elements, etc.
  }

  printDetails() {
    this.showWhenToggle = true;
    setTimeout(() => {
      window.print(); // Trigger native print dialog
    }, 1000);
  }
}
