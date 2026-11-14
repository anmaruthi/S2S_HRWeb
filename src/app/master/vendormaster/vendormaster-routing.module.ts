import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from "../../guard/authguard";
import { VendorMasterComponent } from './vendormaster.component';

const routes: Routes = [
    {
        path: '',
        component: VendorMasterComponent,
        canActivate: [AuthGuard]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class VendorMasterRoutingModule { }
