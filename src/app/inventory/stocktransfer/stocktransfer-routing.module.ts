import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from "../../guard/authguard";
import { StockTransferComponent } from './stocktransfer.component';

const routes: Routes = [
    {
        path: '',
        component: StockTransferComponent,
        canActivate: [AuthGuard]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class StockTransferRoutingModule { }
