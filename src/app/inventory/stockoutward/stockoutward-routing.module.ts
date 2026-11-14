import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from "../../guard/authguard";
import { StockOutwardComponent } from './stockoutward.component';

const routes: Routes = [
    {
        path: '',
        component: StockOutwardComponent,
        canActivate: [AuthGuard]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class StockOutwardRoutingModule { }
