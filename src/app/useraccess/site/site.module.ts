import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { FlexLayoutModule } from "@angular/flex-layout";
import { TableModule } from 'primeng/table';
import { ConfirmDialogModule } from 'primeng/confirmdialog';


import { MatTooltipModule } from '@angular/material/tooltip';     
import { MatIconModule } from '@angular/material/icon';  
import { MatFormFieldModule } from '@angular/material/form-field';      
import { MatInputModule } from '@angular/material/input';       
import { MatNativeDateModule } from "@angular/material/core";
import { MatButtonModule } from "@angular/material/button";
import { MatSelectModule } from "@angular/material/select";
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatExpansionModule } from "@angular/material/expansion";

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { SiteRoutingModule } from './site-routing.module';
import { SiteComponent } from './site.component';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        FlexLayoutModule,
        SiteRoutingModule,
        //materialdesign components
        MatNativeDateModule,
        MatIconModule,
        MatFormFieldModule,
        MatTooltipModule,
        MatInputModule,
        MatButtonModule,
        MatSelectModule,
        MatExpansionModule,
        MatCheckboxModule,
        //prime components
        //DataTableModule,
        TableModule,
        ConfirmDialogModule,
        MatAutocompleteModule
    ],
    exports: [
  ],
    declarations: [SiteComponent],
    entryComponents: [],
    providers: [],
})
export class SiteModule {
}
