import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from "../../guard/authguard";
import {BillingaddressComponent } from './billingaddress.component';


const routes: Routes = [
    {
        path: '',
        component: BillingaddressComponent,
        canActivate: [AuthGuard]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class BillingaddressRoutingModule { }