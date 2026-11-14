import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from "../../guard/authguard";
import {DeliveryaddressComponent } from './deliveryaddress.component';


const routes: Routes = [
    {
        path: '',
        component: DeliveryaddressComponent,
        canActivate: [AuthGuard]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DeliveryaddressRoutingModule { }