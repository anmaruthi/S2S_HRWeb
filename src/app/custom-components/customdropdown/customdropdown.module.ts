import { NgModule } from '@angular/core';
import { CustomDropdownComponent } from './customdropdown.component';

import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from "@angular/flex-layout";
import { MatTooltipModule } from '@angular/material/tooltip';     
import { MatIconModule } from '@angular/material/icon';  
import { MatFormFieldModule } from '@angular/material/form-field';      
import { MatInputModule } from '@angular/material/input';       
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';

@NgModule({
    declarations: [CustomDropdownComponent],
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
      //
      MultiSelectModule,
      DropdownModule
    ],
    exports: [CustomDropdownComponent],
    providers: []
})

export class CustomDropdownModule {}
