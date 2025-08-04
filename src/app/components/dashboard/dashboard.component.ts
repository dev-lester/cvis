import { Component, OnInit } from '@angular/core';
import { PatientService } from '../../services/patient.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  stats = { total: 0, active: 0, inactive: 0 };
  recentPatients: any[] = [];

  constructor(private patientService: PatientService, private router: Router) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.stats = this.patientService.getPatientStats();
    this.recentPatients = this.patientService.getAllPatients().slice(0, 5);
  }

  navigateToPatients(): void {
    // Implementation handled by router
  }

  navigateToNewPatient(): void {
    // Implementation handled by router
    this.router.navigate([['/patient']]);
  }
}
