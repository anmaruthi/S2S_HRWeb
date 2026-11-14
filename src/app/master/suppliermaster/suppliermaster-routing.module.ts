import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from "../../guard/authguard";
import { SupplierMasterComponent } from './suppliermaster.component';

const routes: Routes = [
    {
        path: '',
        component: SupplierMasterComponent,
        canActivate: [AuthGuard]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class SupplierMasterRoutingModule { }
