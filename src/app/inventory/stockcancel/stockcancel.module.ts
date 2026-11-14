import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { FlexLayoutModule } from "@angular/flex-layout";
import { TableModule } from 'primeng/table';
import { RatingModule } from 'primeng/rating';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';

import { MatTooltipModule } from '@angular/material/tooltip';     
import { MatIconModule } from '@angular/material/icon';  
import { MatFormFieldModule } from '@angular/material/form-field';      
import { MatInputModule } from '@angular/material/input';       
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatButtonModule } from "@angular/material/button";
import { MatSelectModule } from "@angular/material/select";
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from "@angular/material/dialog";

import { StockCancelComponent } from './stockcancel.component';
import { StockCancelRoutingModule } from './stockcancel-routing.module';
import { AutoCompleteComponentModule } from 'src/app/custom-components/autocomplete/autocomplete.module';

import { CustomValidationsModule } from 'src/app/custom-components/customvalidations/customvalidations.module';
import { CustomDateComponentModule } from 'src/app/custom-components/customdate/customdate.module';
import { CustomDropdownModule } from '../../custom-components/customdropdown/customdropdown.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        FlexLayoutModule,
        StockCancelRoutingModule,
        MatIconModule,
        MatFormFieldModule,
        MatTooltipModule,
        MatInputModule,
        MatButtonModule,
        MatSelectModule,
        MatDialogModule,
        MatCheckboxModule,
        MatAutocompleteModule,
        RatingModule,
        InputTextModule,
        ButtonModule,
        TableModule,
        AutoCompleteComponentModule,
        CustomValidationsModule,
        CustomDateComponentModule,
        CustomDropdownModule,
    ],
    exports: [
    ],
    declarations: [ StockCancelComponent
    ],
    entryComponents: [],
    providers: [],
})
export class StockCancelModule {
}
