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

import { RoleRoutingModule } from './role-routing.module';
import { RoleComponent } from './role.component';
import { PickListModule } from 'primeng/picklist';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

// import { CustomMaxValueDirective } from '../../custom-components/customvalidations/maxvalue.directive';
// import { CustomMinValueDirective } from '../../custom-components/customvalidations/minvalue.directive';

import { CustomValidationsModule } from '../../custom-components/customvalidations/customvalidations.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        FlexLayoutModule,
        RoleRoutingModule,
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
        //DataTableModule,
        TableModule,
        PickListModule,
        ConfirmDialogModule,
        CustomValidationsModule
    ],
    exports: [
    ],
    declarations: [RoleComponent,/*  CustomMaxValueDirective, 
        CustomMinValueDirective */
    ],
    entryComponents: [],
    providers: [],
})
export class RoleModule {
}
