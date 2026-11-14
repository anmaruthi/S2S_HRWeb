import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SessionService } from "../../service/session.service";
import { CommonService } from "../../service/common.service";
import { SettingGetBySiteIDResponse } from "../../model/response.model";
import { WebApiService } from "../../service/webapi.service";
import { FormGroup } from '@angular/forms';
import { Setting, SettingCatgory, SettingDetail } from '../../model/shared.model';
import { SettingGetAllRequest, SaveSettingRequest } from '../../model/request.model';

@Component({
    templateUrl: './settingdialog.component.html',
    styleUrls: ['./settingdialog.component.css']
})

export class SettingDialogComponent implements OnInit {

    public formGroup: FormGroup;
    public submitAttempt: boolean;
    public DialogHeader: string;
    public Mode: string;
    public settingCategoryList: SettingCatgory[];

    public IsCorporateSetting: boolean;
    public CorpID: number;
    public SiteID: number;
    public settingData: boolean;

    constructor(public dialogRef: MatDialogRef<SettingDialogComponent>,
        public dialog: MatDialog,
      @Inject(MAT_DIALOG_DATA) public DialogInputData: any,
      public sessionService: SessionService, private apiService: WebApiService,
      public commonService: CommonService) {
        
    }

    cancelClick() {        
        this.dialogRef.close(0);
    }
    
  ngOnInit() {

      this.Mode = this.DialogInputData.Mode;
      this.CorpID = this.DialogInputData.CorpID;
      this.SiteID = this.DialogInputData.SiteID;
      
      //this.DialogHeader = this.DialogInputData.Mode + ' Settings';
    
      if (this.Mode == "Corporate") {
        this.DialogHeader = 'Organization Settings';
        this.IsCorporateSetting = true;
      }
      else {
        this.DialogHeader = this.DialogInputData.Mode + ' Settings';
        this.IsCorporateSetting = false;
      }

      this.loadData();
    }
 
    loadData() {

      let req = new SettingGetAllRequest();

      req.IsCorporateSetting = this.IsCorporateSetting;
      req.SettingCorpID = this.CorpID;
      req.SettingSiteID = this.SiteID;

      this.apiService.postData("SettingGetAll", req).subscribe((data: SettingGetBySiteIDResponse) => {
        if (data.SuccessCode == 1) {

          this.settingCategoryList = data.ResultList;

          console.log(this.settingCategoryList);

          if (this.commonService.getLength(this.settingCategoryList) > 0) {
            for (let item of this.settingCategoryList) {
              for (let setting of item.SettingList) {
                this.FillData(setting);
              }
            }
          }

        }
        else {
          this.sessionService.showError(data.ErrorMessage);
        }
      });
  }

  submitClick() {

    let isValid = true;

    let settingDetailList = new Array();

      for(let category of this.settingCategoryList){
          for(let setting of category.SettingList){
              if(this.HasError(setting)){
                  isValid=false;
              }
              else{
                  let settingItem = new SettingDetail();
                  settingItem.SettingID = setting.SettingID
                  settingItem.SettingsValue = setting.SettingsValue;
                  settingItem.Datatype = setting.Datatype;
                  settingDetailList.push(settingItem);
              }
          }
		  }

      if(isValid){

        let req = new SaveSettingRequest();

        req.IsCorporateSetting = this.IsCorporateSetting;
        req.SettingCorpID = this.CorpID;
        req.SettingSiteID = this.SiteID;

        req.SetingDetailList = settingDetailList;

        console.log(req);

        this.apiService.postData("SaveSetting", req).subscribe((data: SettingGetBySiteIDResponse) => {
            if (data.SuccessCode == 1) {
                this.sessionService.showSuccess("Settings updated successfully");
                this.dialogRef.close(1);
            }
            else{
                this.sessionService.showError(data.ErrorMessage)
            }
        });
      }
    }

    public FillData(settingData:Setting){
          if(settingData.ValueRange!=undefined && settingData.ValueRange.length>0){
              settingData.Datatype ="array"
              settingData.RangeList = new Array();
              settingData.RangeList = settingData.ValueRange.split(',');
          }
          if(settingData.Datatype =="bool"){
              if(settingData.SettingsValue =="true" || settingData.SettingsValue =="TRUE"){
                  settingData.IsSelected =true;
              }
              else{
                  settingData.IsSelected = false;
              }
          }
    }

    public HasError(settingData:Setting):boolean{
      settingData.HasError =false;
      settingData.ErrorMessage="";
       
      if(settingData.Datatype == "int"){
          if(settingData.IsMandatory && settingData.SettingsValue == undefined){
              settingData.HasError =true;
              settingData.ErrorMessage = settingData.DisplayName + " is required";
          }
          else
          {
              if(settingData.SettingsValue!=undefined){
                  let result = Number.parseFloat(settingData.SettingsValue);
                  if(Number.isNaN(result)){
                      settingData.HasError =true;
                      settingData.ErrorMessage = "Please enter a valid numeric value.";
                  }
                  else{
                      if(result < settingData.MinValue || result > settingData.MaxValue){
                          settingData.HasError =true;
                          settingData.ErrorMessage = "Value must be between " + settingData.MinValue + " - " + settingData.MaxValue;
                      }
                  }
              }
          }
      }
      else if(settingData.Datatype == "string"){
          if(settingData.IsMandatory && settingData.SettingsValue == undefined){
                  settingData.HasError =true;
                  settingData.ErrorMessage = settingData.DisplayName + " is required";
          }
      }
      return settingData.HasError;
    }


}
