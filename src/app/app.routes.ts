import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PatientListComponent } from './components/patient-list/patient-list.component';
import { PatientDetailsComponent } from './components/patient-details/patient-details.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'patients',
    component: PatientListComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'patient/:id',
    component: PatientDetailsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'patient',
    component: PatientDetailsComponent,
    canActivate: [AuthGuard],
  },
  { path: '**', redirectTo: '/login' },
];
