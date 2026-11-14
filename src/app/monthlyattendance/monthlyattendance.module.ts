import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ButtonModule} from 'primeng/button';
import { MonthlyattendanceRoutingModule } from './monthlyattendance-routing.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MonthlyattendanceRoutingModule,
    ButtonModule
  ]
})
export class MonthlyattendanceModule { }
