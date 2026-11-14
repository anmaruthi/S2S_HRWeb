import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from "../../guard/authguard";
import { ConsigneeMasterComponent } from './consigneemaster.component';

const routes: Routes = [
    {
        path: '',
        component: ConsigneeMasterComponent,
        canActivate: [AuthGuard]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class ConsigneeMasterRoutingModule { }
