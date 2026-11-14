import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { HttpClientModule} from '@angular/common/http';
import { LocationStrategy, PathLocationStrategy, HashLocationStrategy } from '@angular/common';
import { FlexLayoutModule } from "@angular/flex-layout";
import { MultiSelectModule } from "primeng/multiselect";
import { DropdownModule } from "primeng/dropdown";
import { InputTextModule } from 'primeng/inputtext';
import { DataViewModule } from 'primeng/dataview';
import { ToastrModule } from 'ngx-toastr';

import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from "@angular/material/chips";
import { MatButtonModule } from "@angular/material/button";
import { MatSelectModule } from "@angular/material/select";
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from "@angular/material/dialog";
import { DateAdapter } from '@angular/material/core';

import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatNativeDateModule } from "@angular/material/core";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatTabsModule } from "@angular/material/tabs";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatCardModule } from "@angular/material/card";;

import { ErrorStateMatcher } from '@angular/material/core';
import { ShowOnDirtyErrorStateMatcher } from '@angular/material/core';
import { RatingModule } from 'primeng/rating';
import { CalendarModule } from 'primeng/calendar';
import { TableModule } from 'primeng/table';
import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from "primeng/button";
import { ProgressBarModule } from 'primeng/progressbar';
import { FileUploadModule } from 'primeng/fileupload';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';
import { CardModule } from 'primeng/card';
import { SessionService } from "./service/session.service";
import { WebApiService } from "./service/webapi.service";
import { CommonService } from "./service/common.service";
import { LoaderComponent } from './loader/loader.component';
import { NavLoaderComponent } from './loader/navloader.component';
import { LoaderService } from './service/loader.service';
import { NavLoaderService } from './service/navloader.service';
import { CustomDateAdapter } from "./model/custom.options";


import { LoginComponent } from './login/login.component';

import { AuthGuard } from './guard/authguard';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { ConfirmDialogComponent } from './common/confirmdialog.component';
import { ConfirmDialog1Component } from './common/confirmdialog1.component';
import { NoteBoxDialogComponent } from './common/noteboxdialog.component';
import { ImagePreviewDialogComponent  } from './common/imagepreviewdialog.component';
import { MessageComponent } from './common/message.component';
import { OkDialogComponent } from "./common/okdialog.component";
import { ChangePasswordDialogComponent } from "./useraccess/usersetup/changepassworddialog.component";
import { ImagesDialogComponent } from "./common/imagesdialog.component";


import { AppsHomeComponent } from './home/appshome.component';
import { SettingDialogComponent } from './useraccess/settings/settingdialog.component';

import { CustomDateComponentModule } from './custom-components/customdate/customdate.module';
import { AutoCompleteComponentModule } from './custom-components/autocomplete/autocomplete.module';
//import { CustomValidationsModule } from './custom-components/customvalidations/customvalidations.module';
import { CustomBuyerModule } from './custom-components/custombuyer/custombuyer.module'
import { CustomItemModule } from './custom-components/customitem/customitem.module'
import { CustomItemTypeModule } from './custom-components/customitemtype/customitemtype.module'
import { CustomColorModule } from './custom-components/customcolor/customcolor.module';
import { CustomSizeModule } from './custom-components/customsize/customsize.module';
import { CustomProcessModule } from './custom-components/customprocess/customprocess.module';
import { CustomFabricModule } from './custom-components/customfabric/customfabric.module';
import { CustomExpenseModule } from './custom-components/customexpense/customexpense.module';
import { CustomLookupModule } from './custom-components/customlookup/customlookup.module';
import { CustomDepartmentModule } from './custom-components/customdepartment/customdepartment.module';
import { CustomConsigneeModule } from './custom-components/customconsignee/customconsignee.module';
import { CustomDropdownModule } from './custom-components/customdropdown/customdropdown.module';
import { DailyattendanceComponent } from './dailyattendance/dailyattendance.component';
import { MonthlyattendanceComponent } from './monthlyattendance/monthlyattendance.component';
import { DatePipe } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    LoaderComponent,
    NavLoaderComponent,
    ConfirmDialogComponent,
    ConfirmDialog1Component,
    ImagePreviewDialogComponent,
    OkDialogComponent,
    ImagesDialogComponent,
    ChangePasswordDialogComponent,
    NoteBoxDialogComponent,
    MessageComponent,
    AppsHomeComponent,
    SettingDialogComponent,
    DailyattendanceComponent,
    MonthlyattendanceComponent,
  
    
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    //
    MatIconModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDialogModule,
    MatCheckboxModule,
    MatChipsModule,
    MatGridListModule,
    MatExpansionModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatAutocompleteModule,
    RatingModule,
    MatTabsModule,
    MatCardModule,
    TableModule,
    TooltipModule,
    DialogModule,
    CardModule,
      //
    MultiSelectModule,
    DropdownModule,
    CalendarModule,
    AccordionModule,
    InputTextModule,
    DataViewModule,
    ButtonModule,
    ProgressBarModule,
    FileUploadModule,
          //
          AutoCompleteComponentModule,
          CustomDateComponentModule,
          // CustomValidationsModule,
          CustomBuyerModule,
          CustomItemModule,
          CustomItemTypeModule,
          CustomColorModule,
          CustomSizeModule,
          CustomProcessModule,
          CustomFabricModule,
          CustomExpenseModule,
          CustomLookupModule,
          CustomDepartmentModule,
          CustomConsigneeModule,
          CustomDropdownModule,
    AppRoutingModule,
    ToastrModule.forRoot({
      timeOut: 5000,
      positionClass: 'toast-bottom-right'
    }),
  ],
  exports: [],
  entryComponents: [ConfirmDialogComponent, ConfirmDialog1Component, OkDialogComponent, ImagePreviewDialogComponent,
    ImagesDialogComponent, ChangePasswordDialogComponent, SettingDialogComponent],
  providers: [DatePipe, FormBuilder, SessionService, WebApiService, AuthGuard, CommonService, LoaderService, NavLoaderService,
    { provide: DateAdapter, useClass: CustomDateAdapter },
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    { provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher },],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(private dateAdapter: DateAdapter<Date>) {
    this.dateAdapter.setLocale('en-IN');
  }
}
