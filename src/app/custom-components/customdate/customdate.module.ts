import { NgModule } from '@angular/core';
import { CustomDateComponent } from './customdate.component';

import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from "@angular/flex-layout";
import { MatTooltipModule } from '@angular/material/tooltip';     
import { MatIconModule } from '@angular/material/icon';  
import { MatFormFieldModule } from '@angular/material/form-field';      
import { MatInputModule } from '@angular/material/input';       
import { MatDatepickerModule } from "@angular/material/datepicker";


@NgModule({
    declarations: [CustomDateComponent],
    imports: [
      CommonModule,
      FormsModule,
      ReactiveFormsModule,
      FlexLayoutModule,
      //materialdesign components
      MatIconModule,
      MatFormFieldModule,
      MatTooltipModule,
      MatInputModule,
      MatDatepickerModule
    ],
    exports: [CustomDateComponent],
    providers: []
})

export class CustomDateComponentModule {}
