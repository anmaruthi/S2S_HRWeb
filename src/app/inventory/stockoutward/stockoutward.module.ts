import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { FlexLayoutModule } from "@angular/flex-layout";
import { TableModule } from 'primeng/table';

import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from "@angular/material/button";
import { MatSelectModule } from "@angular/material/select";
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from "@angular/material/dialog";
import { MatRadioModule } from '@angular/material/radio';
import { StockOutwardComponent } from './stockoutward.component';
import { StockOutwardRoutingModule } from './stockoutward-routing.module';
import { AutoCompleteComponentModule } from 'src/app/custom-components/autocomplete/autocomplete.module';
import { CustomValidationsModule } from 'src/app/custom-components/customvalidations/customvalidations.module';
import { CustomDateComponentModule } from 'src/app/custom-components/customdate/customdate.module';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        FlexLayoutModule,
        StockOutwardRoutingModule,
        MatIconModule,
        MatFormFieldModule,
        MatTooltipModule,
        MatInputModule,
        MatButtonModule,
        MatSelectModule,
        MatDialogModule,
        MatRadioModule,
        MatCheckboxModule,
        TableModule,
        AutoCompleteComponentModule,
        CustomValidationsModule,
        CustomDateComponentModule,
    ],
    exports: [
    ],
    declarations: [StockOutwardComponent],


    entryComponents: [],
    providers: [],
})
export class StockOutwardModule {
}
