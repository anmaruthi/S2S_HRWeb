import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule} from '@angular/common/http';
import { FlexLayoutModule } from "@angular/flex-layout";
import { TableModule } from 'primeng/table';
import { FileUploadModule } from 'primeng/fileupload';

import { MatTooltipModule } from '@angular/material/tooltip';     
import { MatIconModule } from '@angular/material/icon';  
import { MatFormFieldModule } from '@angular/material/form-field';      
import { MatInputModule } from '@angular/material/input';       
import { MatTabsModule } from "@angular/material/tabs";
import { MatButtonModule } from "@angular/material/button";
import { MatSelectModule } from "@angular/material/select";
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from "@angular/material/dialog";

import { StockRoutingModule } from './stock-routing.module';
import { StockComponent } from './stock.component';
import { StockDetailDialogComponent } from './stockdetaildialog.component';

import { CustomDateComponentModule } from 'src/app/custom-components/customdate/customdate.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        FlexLayoutModule,
        StockRoutingModule,
        //materialdesign components
        MatIconModule,
        MatFormFieldModule,
        MatTooltipModule,
        MatInputModule,
        MatButtonModule,
        MatSelectModule,
        MatDialogModule,
        MatCheckboxModule,
        MatTabsModule,
        //prime components
        TableModule,
        FileUploadModule,
        CustomDateComponentModule
    ],
    exports: [
    ],
    declarations: [StockComponent,StockDetailDialogComponent
    ],
    entryComponents: [StockDetailDialogComponent],
    providers: [],
})
export class StockModule {
}
