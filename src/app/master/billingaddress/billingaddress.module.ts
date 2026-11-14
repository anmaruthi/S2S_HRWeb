import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { TableModule } from 'primeng/table';
import { MatDialogModule } from "@angular/material/dialog";
import { FlexLayoutModule } from "@angular/flex-layout";
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from "@angular/material/button";
import { MatSelectModule } from "@angular/material/select";
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from "@angular/material/core";
import { MatExpansionModule } from "@angular/material/expansion";
import { ConfirmDialogModule } from "primeng/confirmdialog";

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { BillingaddressRoutingModule } from './billingaddress-routing.module';
import { BillingaddressComponent } from './billingaddress.component';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        FlexLayoutModule,
        BillingaddressRoutingModule,
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
    declarations: [BillingaddressComponent],
    entryComponents: [],
    providers: [],
})
export class BillingaddressModule {
}