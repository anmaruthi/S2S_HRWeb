import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../guard/authguard';
import { CorporateComponent } from './corporate.component';

const routes: Routes = [
    {
        path: '',
        component: CorporateComponent,
        canActivate: [AuthGuard]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class CorporateRoutingModule { }
