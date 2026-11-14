import { NgModule } from '@angular/core';
import { CustomItemComponent } from './customitem.component';

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
import { MatCheckboxModule } from '@angular/material/checkbox';

import { TableModule } from "primeng/table";
import { DropdownModule } from "primeng/dropdown";
import { ButtonModule } from "primeng/button";

import { CustomDropdownModule } from '../../custom-components/customdropdown/customdropdown.module';
import { CustomDateComponentModule } from '../../custom-components/customdate/customdate.module';

@NgModule({
    declarations: [CustomItemComponent],
    imports: [
      CommonModule,
      FormsModule,
      ReactiveFormsModule,
      FlexLayoutModule,
      //materialdesign components
      MatCheckboxModule,
      MatIconModule,
      MatFormFieldModule,
      MatTooltipModule,
      MatInputModule,
      MatAutocompleteModule,
      MatChipsModule,
      MatButtonModule,
      MatSelectModule,
      DropdownModule,
      CustomDropdownModule,
      CustomDateComponentModule,
      ButtonModule,
      TableModule

    ],
    exports: [CustomItemComponent],
    providers: []
})

export class CustomItemModule {}
