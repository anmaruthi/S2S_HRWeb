import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from "../../guard/authguard";
import { WorkOrderComponent } from './workorder.component';
 

const routes: Routes = [
    {
        path: '',
        component: WorkOrderComponent,
        canActivate: [AuthGuard]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class WorkOrderRoutingModule { }
