import { CommonModule } from "@angular/common";
import { NgModule } from '@angular/core';

import { MatTooltipModule } from '@angular/material/tooltip';     
import { MatIconModule } from '@angular/material/icon';  
import { MatFormFieldModule } from '@angular/material/form-field';      
import { MatInputModule } from '@angular/material/input';       
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from "@angular/material/chips";
import { MatButtonModule } from "@angular/material/button";
import { MatSelectModule } from "@angular/material/select";
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from "@angular/material/datepicker";

import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatNativeDateModule } from "@angular/material/core";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatListModule } from "@angular/material/list";
import { MatTabsModule } from "@angular/material/tabs";
import { MatStepperModule } from "@angular/material/stepper";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatCardModule } from "@angular/material/card";
import { MatDialogModule } from "@angular/material/dialog";

import { MultiSelectModule } from "primeng/multiselect";
import { DropdownModule } from "primeng/dropdown";
import { ButtonModule } from "primeng/button";

import { InputTextModule } from "primeng/inputtext";
//import { Table } from "primeng/table";
import { DialogModule } from "primeng/dialog";
import { CalendarModule } from "primeng/calendar";
import { GMapModule } from "primeng/gmap";
//import { DataListModule } from "primeng/dataview";
import { RatingModule } from "primeng/rating";
import { OverlayPanelModule } from "primeng/overlaypanel";
import { ConfirmDialogModule } from "primeng/confirmdialog";

import { ChartModule } from 'primeng/chart';
import { TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { FlexLayoutModule } from "@angular/flex-layout";

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';

@NgModule({
  declarations: [
      HomeComponent
  ],
  imports: [
    FormsModule,
    CommonModule,
    FlexLayoutModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatInputModule,
    MatButtonModule,
    MatGridListModule,
    MatListModule,
    MatTabsModule,
    MatSelectModule,
    MatDialogModule,
    MatCheckboxModule,
    MatStepperModule,
    MatAutocompleteModule,
    MatExpansionModule,
    MatChipsModule,
    InputTextModule,
    //DataTableModule,
    ButtonModule,
    DialogModule,
    CalendarModule,
    DropdownModule,
    GMapModule,
    //DataListModule,
    RatingModule,
    MatCardModule,
    OverlayPanelModule,
    ConfirmDialogModule,
    HomeRoutingModule,
    TableModule,
    MultiSelectModule,
    ChartModule,
  ],
  exports: [
  ],
  entryComponents: [],
})
export class HomeModule { }
