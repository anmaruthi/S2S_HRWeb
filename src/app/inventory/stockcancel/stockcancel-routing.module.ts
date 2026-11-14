import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from "../../guard/authguard";
import { StockCancelComponent } from './stockcancel.component';
 

const routes: Routes = [
    {
        path: '',
        component: StockCancelComponent,
        canActivate: [AuthGuard]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class StockCancelRoutingModule { }
