import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { FlexLayoutModule } from "@angular/flex-layout";
import { TableModule } from 'primeng/table';
import { CheckboxModule } from 'primeng/checkbox';
import { OverlayModule } from '@angular/cdk/overlay';

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
import { MatTabsModule } from "@angular/material/tabs";
import { MatMenuModule } from '@angular/material/menu';

import { StockTransferRoutingModule } from './stocktransfer-routing.module';
import { StockTransferComponent } from './stocktransfer.component';
import { CustomDateComponentModule } from '../../custom-components/customdate/customdate.module';
import { AutoCompleteComponentModule } from 'src/app/custom-components/autocomplete/autocomplete.module';
import { CustomValidationsModule } from '../../custom-components/customvalidations/customvalidations.module';
import { CustomDropdownModule } from '../../custom-components/customdropdown/customdropdown.module';


import { MatCardModule } from '@angular/material/card';
import { MatRadioModule } from '@angular/material/radio';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { ProgressBarModule } from 'primeng/progressbar';

@NgModule({
    imports: [
        CommonModule,
        MatCardModule,
        MatRadioModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        FlexLayoutModule,
        StockTransferRoutingModule,
        CustomValidationsModule,
        CustomDropdownModule,
        //materialdesign components
        MatIconModule,
        MatFormFieldModule,
        MatTooltipModule,
        MatInputModule,
        MatTableModule,
        MatButtonModule,
        MatSelectModule,
        MatDialogModule,
        MatCheckboxModule,
        DropdownModule,
        OverlayModule,
        MatTabsModule,
        MatMenuModule,
        //prime components
        TableModule,
        CheckboxModule,
        MatDatepickerModule,
        CustomDateComponentModule,
        AutoCompleteComponentModule,
        DialogModule,
        ProgressBarModule
    ],
    exports: [
    ],
    declarations: [StockTransferComponent, ],
    entryComponents: [],
    providers: [],
})
export class StockTransferModule {
}