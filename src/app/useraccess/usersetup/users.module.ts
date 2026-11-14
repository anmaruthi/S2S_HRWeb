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

import { UsersRoutingModule } from './users-routing.module';
import { UserSetupComponent } from './usersetup.component';
import { AutoCompleteComponentModule } from '../../custom-components/autocomplete/autocomplete.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        FlexLayoutModule,
        UsersRoutingModule,
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
        AutoCompleteComponentModule
    ],
    exports: [
    ],
    declarations: [UserSetupComponent
    ],
    entryComponents: [],
    providers: [],
})
export class UsersModule {
}
