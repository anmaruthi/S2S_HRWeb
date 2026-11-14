import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from "../../guard/authguard";
import {MaterialCategoryComponent } from './materialcategory.component';


const routes: Routes = [
    {
        path: '',
        component: MaterialCategoryComponent,
        canActivate: [AuthGuard]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MaterialCategoryRoutingModule { }
