import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule  } from '@angular/common/http';
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
import { ConsigneeMasterRoutingModule } from './consigneemaster-routing.module';
import { ConsigneeMasterComponent } from './consigneemaster.component';
import { CustomConsigneeModule } from '../../custom-components/customconsignee/customconsignee.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        FlexLayoutModule,
        ConsigneeMasterRoutingModule,
        //materialdesign components
        MatIconModule,
        MatFormFieldModule,
        MatTooltipModule,
        MatInputModule,
        MatButtonModule,
        MatSelectModule,
        MatDialogModule,
        MatCheckboxModule,
        //prime components
        TableModule,
        //
        CustomConsigneeModule
    ],
    exports: [
    ],
    declarations: [ConsigneeMasterComponent
    ],
    entryComponents: [],
    providers: [],
})
export class ConsigneeMasterModule {
}
