import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from "../../guard/authguard";
import {TransportmasterComponent } from './transportmaster.component';


const routes: Routes = [
    {
        path: '',
        component: TransportmasterComponent,
        canActivate: [AuthGuard]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TransportmasterRoutingModule { }
