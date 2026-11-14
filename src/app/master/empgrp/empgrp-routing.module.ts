import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from "../../guard/authguard";
import { EmpgrpComponent } from './empgrp.component';
 

const routes: Routes = [
    {
        path: '',
        component: EmpgrpComponent,
        canActivate: [AuthGuard]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class EmpgrpRoutingModule { }
