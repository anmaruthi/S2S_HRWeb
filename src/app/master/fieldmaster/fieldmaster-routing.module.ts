import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from "../../guard/authguard";
import { FieldMasterComponent } from './fieldmaster.component';
 

const routes: Routes = [
    {
        path: '',
        component: FieldMasterComponent,
        canActivate: [AuthGuard]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class FieldMasterRoutingModule { }
