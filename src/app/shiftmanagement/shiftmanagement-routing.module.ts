import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../guard/authguard';
import { ShiftmanagementComponent } from './shiftmanagement.component';

const routes: Routes = [
  {
    path: '',
    component: ShiftmanagementComponent,
    canActivate: [AuthGuard]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShiftmanagementRoutingModule { }
