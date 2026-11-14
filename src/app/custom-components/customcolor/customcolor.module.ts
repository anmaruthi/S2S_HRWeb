import { NgModule } from '@angular/core';
import { CustomColorComponent } from './customcolor.component';

import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from "@angular/flex-layout";
import { MatIconModule } from '@angular/material/icon';  
import { MatFormFieldModule } from '@angular/material/form-field';      
import { MatInputModule } from '@angular/material/input';       
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from "@angular/material/chips";
import { MatButtonModule } from "@angular/material/button";
import { MatSelectModule } from "@angular/material/select";
import { MatTooltipModule } from '@angular/material/tooltip';  

@NgModule({
    declarations: [CustomColorComponent],
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
      MatAutocompleteModule,
      MatChipsModule,
      MatButtonModule,
      MatSelectModule
    ],
    exports: [CustomColorComponent],
    providers: []
})

export class CustomColorModule {}
