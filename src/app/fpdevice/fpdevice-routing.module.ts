import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from "../guard/authguard";
import { FPDeviceComponent } from './fpdevice.component';


const routes: Routes = [
    {
        path: '',
        component: FPDeviceComponent,
        canActivate: [AuthGuard]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class FPDeviceRoutingModule { }
