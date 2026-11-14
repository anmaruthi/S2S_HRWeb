import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { MatTabsModule } from '@angular/material/tabs';
import { TabViewModule } from 'primeng/tabview';
import { AccordionModule } from 'primeng/accordion';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { AutoCompleteComponentModule } from 'src/app/custom-components/autocomplete/autocomplete.module';
import { CustomDateComponentModule } from '../custom-components/customdate/customdate.module';
import { DeductionstRoutingModule } from './deductions-routing.module';
import { DeductionsComponent } from './deductions.component';
import { EmployeeRoutingModule } from '../employee/employee-routing.module';


@NgModule({
  imports: [
    TabViewModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    FlexLayoutModule,
    DeductionstRoutingModule,
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
    MatDialogModule,
    MatTabsModule,
    //prime components
    //DataTableModule,
    TableModule,
    ConfirmDialogModule,
    AccordionModule,
    MatAutocompleteModule,
    AutoCompleteComponentModule,
    CustomDateComponentModule
  ],
  exports: [
  ],
  declarations: [DeductionsComponent],
  entryComponents: [],
  providers: [],
})
export class deductions  {
}