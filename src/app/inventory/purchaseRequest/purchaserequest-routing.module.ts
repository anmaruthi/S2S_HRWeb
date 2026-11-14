import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from "../../guard/authguard";
import { PurchaserequestComponent } from './purchaserequest.component';

const routes: Routes = [
    {
        path: '',
        component: PurchaserequestComponent,
        canActivate: [AuthGuard]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class PurchaseRequestRoutingModule { }
