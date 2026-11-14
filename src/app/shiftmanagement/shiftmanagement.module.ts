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
import { ShiftmanagementComponent } from './shiftmanagement.component';
import { ShiftmanagementRoutingModule } from './shiftmanagement-routing.module';
import { MatRadioModule } from '@angular/material/radio';

@NgModule({
  imports: [
    TabViewModule,
    MatRadioModule,
    ShiftmanagementRoutingModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    FlexLayoutModule,
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
  declarations: [ShiftmanagementComponent],
  entryComponents: [],
  providers: [],
})
export class ShiftmanagementModule { }
