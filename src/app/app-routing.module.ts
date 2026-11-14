import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppConfig } from "./const/app.config";
import { LoginComponent } from './login/login.component';
import { AuthGuard } from "./guard/authguard";

import { AppsHomeComponent } from './home/appshome.component';

const routes: Routes = [

  { path: AppConfig.LOGIN_PATH, component: LoginComponent },
  { path: AppConfig.APPS_HOME_PATH, component: AppsHomeComponent, canActivate: [AuthGuard]},

  {
      //loadChildren: () => import('./home/home.module').then(mod => mod.HomeModule)
       path: AppConfig.HOME_PATH, loadChildren: () => import('./home/home.module').then(mod => mod.HomeModule), canActivate: [AuthGuard]
  },
  { path: "**", redirectTo: AppConfig.LOGIN_PATH }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule { }
