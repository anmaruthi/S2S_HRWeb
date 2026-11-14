import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from "../../guard/authguard";
import { StockInwardComponent } from './stockinward.component';
 

const routes: Routes = [
    {
        path: '',
        component: StockInwardComponent,
        canActivate: [AuthGuard]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class StockInwardRoutingModule { }
