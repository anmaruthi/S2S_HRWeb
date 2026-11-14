import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from "../../guard/authguard";
import { LookupComponent } from './lookup.component';

const routes: Routes = [
    {
        path: '',
        component: LookupComponent,
        canActivate: [AuthGuard]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class LookupRoutingModule { }
