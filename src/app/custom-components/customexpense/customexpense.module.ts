import { NgModule } from '@angular/core';
import { CustomExpenseComponent } from './customexpense.component';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from "@angular/flex-layout";
import { MatTooltipModule } from '@angular/material/tooltip';     
import { MatIconModule } from '@angular/material/icon';  
import { MatFormFieldModule } from '@angular/material/form-field';      
import { MatInputModule } from '@angular/material/input';       
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from "@angular/material/chips";
import { MatButtonModule } from "@angular/material/button";
import { MatSelectModule } from "@angular/material/select";

@NgModule({
    declarations: [CustomExpenseComponent],
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
      MatSelectModule,
      //
      TableModule,
    ],
    exports: [CustomExpenseComponent],
    providers: []
})

export class CustomExpenseModule {}
