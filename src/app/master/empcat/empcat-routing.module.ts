import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from "../../guard/authguard";
import { EmpcatComponent } from './empcat.component';
 

const routes: Routes = [
    {
        path: '',
        component: EmpcatComponent,
        canActivate: [AuthGuard]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class EmpcatRoutingModule { }