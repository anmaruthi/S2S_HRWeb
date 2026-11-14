import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from "../../guard/authguard";
import { StockReturnComponent } from './stockreturn.component';


const routes: Routes = [
    {
        path: '',
        component: StockReturnComponent,
        canActivate: [AuthGuard]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class StockReturnRoutingModule { }
