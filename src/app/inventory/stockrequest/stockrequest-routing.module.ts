import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from "../../guard/authguard";
import { StockRequestComponent } from './stockrequest.component';

const routes: Routes = [
    {
        path: '',
        component: StockRequestComponent,
        canActivate: [AuthGuard]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class StockRequestRoutingModule { }
