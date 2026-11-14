import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from "../../guard/authguard";
import { ProcessFlowComponent } from './processflow.component';
 

const routes: Routes = [
    {
        path: '',
        component: ProcessFlowComponent,
        canActivate: [AuthGuard]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProcessFlowRoutingModule { }
