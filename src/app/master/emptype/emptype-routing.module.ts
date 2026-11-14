import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from "../../guard/authguard";
import { EmptypeComponent } from './emptype.component';
 

const routes: Routes = [
    {
        path: '',
        component: EmptypeComponent,
        canActivate: [AuthGuard]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class EmptypeRoutingModule { }
