import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from "../../guard/authguard";
import { ComponentFieldsComponent } from './componentfields.component';
 

const routes: Routes = [
    {
        path: '',
        component: ComponentFieldsComponent,
        canActivate: [AuthGuard]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ComponentFieldsRoutingModule { }
