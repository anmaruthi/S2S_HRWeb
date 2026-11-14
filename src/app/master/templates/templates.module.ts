//import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule  } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { FlexLayoutModule } from "@angular/flex-layout";
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { MultiSelectModule } from "primeng/multiselect";
import { DropdownModule } from "primeng/dropdown";

import { MatChipsModule } from "@angular/material/chips";
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatButtonModule } from "@angular/material/button";
import { MatSelectModule } from "@angular/material/select";
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from "@angular/material/dialog";

import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatNativeDateModule } from "@angular/material/core";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatListModule } from "@angular/material/list";
import { MatTabsModule } from "@angular/material/tabs";
import { MatStepperModule } from "@angular/material/stepper";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatCardModule } from "@angular/material/card";;
import { MatMenuModule } from "@angular/material/menu";
import { MatRadioModule } from "@angular/material/radio";
import { NativeDateAdapter } from "@angular/material/core";
import { DateAdapter } from "@angular/material/core";
import { MAT_DATE_FORMATS } from "@angular/material/core";

import { DialogModule } from "primeng/dialog";
import { GMapModule } from "primeng/gmap";
import { ConfirmationService } from "primeng/api";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { TooltipModule } from "primeng/tooltip";
import { ScrollPanelModule } from "primeng/scrollpanel";
import { DataViewModule } from 'primeng/dataview';
import { EditorModule } from 'primeng/editor';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { PickListModule } from "primeng/picklist";
import { ChartModule } from 'primeng/chart';
import { CarouselModule } from 'primeng/carousel';
import { DragDropModule } from 'primeng/dragdrop';

import { TemplatesRoutingModule } from './templates-routing.module';
import { TemplateComponent } from './template.component';
import { MessageService } from 'primeng/api';

//import { Observable } from "rxjs/Observable";
import { map, startWith } from 'rxjs/operators';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        FlexLayoutModule,
        TemplatesRoutingModule,
        //material design components
        MatCardModule,
        MatNativeDateModule,
        MatDatepickerModule,
        MatIconModule,
        MatFormFieldModule,
        MatProgressSpinnerModule,
        MatTooltipModule,
        MatInputModule,
        MatButtonModule,
        MatSelectModule,
        MatDialogModule,
        MatCheckboxModule,
        MatExpansionModule,
        MatMenuModule,
        MatAutocompleteModule,
        MatListModule,
        MatChipsModule,
        MatTabsModule,
        MatStepperModule,
        MatGridListModule,
        MatRadioModule,
        //prime ng
        DragDropModule,
        InputTextModule,
        //DataTableModule,
        ScrollPanelModule,
        ButtonModule,
        ConfirmDialogModule,
        DialogModule,
        GMapModule,
        TableModule,
        PickListModule,
        EditorModule,
        OverlayPanelModule,
        DropdownModule,
        TooltipModule,
        MultiSelectModule,
        ChartModule,
        CarouselModule,
        DataViewModule
    ],
    exports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        FlexLayoutModule,
        //material design components
        MatCardModule,
        MatNativeDateModule,
        MatDatepickerModule,
        MatIconModule,
        MatFormFieldModule,
        MatProgressSpinnerModule,
        MatTooltipModule,
        MatInputModule,
        MatButtonModule,
        MatSelectModule,
        MatDialogModule,
        MatCheckboxModule,
        MatExpansionModule,
        MatMenuModule,
        MatAutocompleteModule,
        MatListModule,
        MatChipsModule,
        MatTabsModule,
        MatStepperModule,
        MatGridListModule,
        MatRadioModule,
        //prime ng
        DragDropModule,
        InputTextModule,
        //DataTableModule,
        ScrollPanelModule,
        ButtonModule,
        ConfirmDialogModule,
        DialogModule,
        GMapModule,
        TableModule,
        PickListModule,
        EditorModule,
        OverlayPanelModule,
        DropdownModule,
        TooltipModule,
        MultiSelectModule,
        ChartModule,
        CarouselModule,
        DataViewModule
    ],
    declarations: [TemplateComponent],
    entryComponents: [TemplateComponent],
    providers: [ConfirmationService, MessageService
      ],
})
export class TemplatesModule {
}
