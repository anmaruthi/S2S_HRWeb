import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../guard/authguard';

import { MonthlyattendanceComponent } from './monthlyattendance.component';
const routes: Routes = [
  {
    path: '',
    component: MonthlyattendanceComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MonthlyattendanceRoutingModule { }
