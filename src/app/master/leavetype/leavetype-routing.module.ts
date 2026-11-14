import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from "../../guard/authguard";
import { LeavetypeComponent } from './leavetype.component';

const routes: Routes = [
    {
        path: '',
        component: LeavetypeComponent,
        canActivate: [AuthGuard]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class LeaveTypeRoutingModule { }