import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from "../../guard/authguard";
import { ReOrderLevelComponent } from './reorderlevel.component';

const routes: Routes = [
    {
        path: '',
        component: ReOrderLevelComponent,
        canActivate: [AuthGuard]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ReOrderLevelRoutingModule { }
