import { NgModule } from '@angular/core';
import { AutoCompleteComponent } from './autocomplete.component';

import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from "@angular/flex-layout";
import { MatTooltipModule } from '@angular/material/tooltip';     
import { MatIconModule } from '@angular/material/icon';  
import { MatFormFieldModule } from '@angular/material/form-field';      
import { MatInputModule } from '@angular/material/input';       
import { MatAutocompleteModule } from '@angular/material/autocomplete';
          
@NgModule({
    declarations: [AutoCompleteComponent],
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
      MatAutocompleteModule
    ],
    exports: [AutoCompleteComponent],
    providers: []
})

export class AutoCompleteComponentModule {}
