import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from "../../guard/authguard";
import { HolidaysComponent } from './holidays.component';

const routes: Routes = [
    {
        path: '',
        component: HolidaysComponent,
        canActivate: [AuthGuard]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class HolidayRoutingModule { }