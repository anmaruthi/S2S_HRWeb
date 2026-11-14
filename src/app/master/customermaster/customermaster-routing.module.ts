import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from "../../guard/authguard";
import { CustomerMasterComponent } from './customermaster.component';

const routes: Routes = [
    {
        path: '',
        component: CustomerMasterComponent,
        canActivate: [AuthGuard]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class CustomerMasterRoutingModule { }
