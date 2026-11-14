import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { FlexLayoutModule } from "@angular/flex-layout";
import { TableModule } from 'primeng/table';
import { CheckboxModule } from 'primeng/checkbox';

import { MatTooltipModule } from '@angular/material/tooltip';     
import { MatIconModule } from '@angular/material/icon';  
import { MatFormFieldModule } from '@angular/material/form-field';      
import { MatInputModule } from '@angular/material/input';       
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatTableModule } from "@angular/material/table";
import { MatButtonModule } from "@angular/material/button";
import { MatSelectModule } from "@angular/material/select";
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from "@angular/material/dialog";
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { ReasonsRoutingModule } from './reasons-routing.module';
import { ReasonsComponent } from './reasons.component';

import { CustomDateComponentModule } from '../../custom-components/customdate/customdate.module';
import { AutoCompleteComponentModule } from 'src/app/custom-components/autocomplete/autocomplete.module';
import { CustomValidationsModule } from '../../custom-components/customvalidations/customvalidations.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        FlexLayoutModule,
        ReasonsRoutingModule,
        CustomValidationsModule,
        //materialdesign components
        MatIconModule,
        MatFormFieldModule,
        MatTooltipModule,
        MatChipsModule,
        MatAutocompleteModule,
        MatInputModule,
        MatTableModule,
        MatButtonModule,
        MatSelectModule,
        MatDialogModule,
        MatCheckboxModule,
        //prime components
        TableModule,
        CheckboxModule,
        MatDatepickerModule,
        CustomDateComponentModule,
        AutoCompleteComponentModule
    ],
    exports: [
    ],
    declarations: [ReasonsComponent
    ],
    entryComponents: [],
    providers: [],
})
export class ReasonMasterModule {
}