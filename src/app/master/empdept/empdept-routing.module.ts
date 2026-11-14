import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from "../../guard/authguard";
import { EmpdeptComponent } from './empdept.component';


const routes: Routes = [
    {
        path: '',
        component: EmpdeptComponent,
        canActivate: [AuthGuard]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class EmpdeptRoutingModule { }

