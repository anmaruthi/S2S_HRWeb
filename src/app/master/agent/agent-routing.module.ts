import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from "../../guard/authguard";
import { AgentMasterComponent } from './agent.component';

const routes: Routes = [
    {
        path: '',
        component: AgentMasterComponent,
        canActivate: [AuthGuard]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class AgentRoutingModule { }
