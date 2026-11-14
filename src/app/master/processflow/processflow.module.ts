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
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { RatingModule } from 'primeng/rating';
import { ProcessFlowComponent } from './processflow.component';
import { ProcessFlowRoutingModule } from './processflow-routing.module';
import { CustomDateComponentModule } from 'src/app/custom-components/customdate/customdate.module';
import { AutoCompleteComponentModule } from 'src/app/custom-components/autocomplete/autocomplete.module';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        FlexLayoutModule,
        ProcessFlowRoutingModule,
        //materialdesign components
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
        //prime components
        TableModule,
        AutoCompleteComponentModule,
        CustomDateComponentModule
    ],
    exports: [
    ],
    declarations: [ProcessFlowComponent
    ],
    entryComponents: [],
    providers: [],
})
export class ProcessFlowModule {
}
