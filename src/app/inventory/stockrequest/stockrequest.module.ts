import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule} from '@angular/common/http';
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

import { StockRequestComponent } from './stockrequest.component';
import { StockRequestRoutingModule } from './stockrequest-routing.module';
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
        StockRequestRoutingModule,
        MatIconModule,
        MatFormFieldModule,
        MatTooltipModule,
        MatInputModule,
        MatButtonModule,
        MatSelectModule,
        MatDialogModule,
        MatCheckboxModule,
        TableModule,
        AutoCompleteComponentModule,
        CustomValidationsModule,
        CustomDateComponentModule,
    ],
    exports: [
    ],
    declarations: [StockRequestComponent],


    entryComponents: [],
    providers: [],
})
export class StockRequestModule {
}
