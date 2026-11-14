import { Component, OnInit, ɵConsole } from '@angular/core';
import { WebApiService } from "../../service/webapi.service";
import { EventInfo, MasterTemplateGetallLimitedResult } from "../../model/shared.model";
import { SessionService } from "../../service/session.service";
import { CommonService } from "../../service/common.service";
import { MatDialog } from '@angular/material/dialog';
import { ServiceReponse, EventConfigurationGetAllByCorpIDResponse } from '../../model/response.model';
import { SaveEventConfigurationRequest } from '../../model/request.model';

@Component({
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss']
})

export class EventComponent implements OnInit {

  public selectedDataGridItem: EventInfo;

  public dataGridList: EventInfo[];
  public orgDataGridList: EventInfo[];

  public cols: any[];
 
  public TemplateEmailList :MasterTemplateGetallLimitedResult[];
  public TemplateSMSList: MasterTemplateGetallLimitedResult[];
  public TemplatesList: MasterTemplateGetallLimitedResult[];

  constructor(public dialog: MatDialog, public sessionService: SessionService, private apiService: WebApiService,
    public commonService: CommonService) {

  }

  ngOnInit() 
  {

    this.loadDataGrid();

    this.cols = [
      { field: 'EventName'},
      { field: 'SendEmail'},
      { field: 'EmailTemplateName'},
      { field: 'DefaultToEmailID'},
      { field: 'DefaultCCEmailID'},
      { field: 'DefaultBCCEmailID'},
      { field: 'SendSMS'},
      { field: 'SMSTemplateName'},
      { field: 'DefaultMobileNumber'}
    ];

  }

  onKeyUp()
  {
    this.selectedDataGridItem = null;
  }	

  loadDataGrid(){

    this.apiService.postData("EventConfigurationGetAllByCorpID", null).subscribe((data: EventConfigurationGetAllByCorpIDResponse) => {
      
      if (data.SuccessCode == 1) {
          
        this.orgDataGridList = [];

        this.dataGridList = data.EventConfigurationList;
        
        this.TemplatesList = data.TemplatesList;
        
        if(this.commonService.getLength(this.TemplatesList) > 0)
        {
          this.TemplateEmailList = this.TemplatesList.filter(itm => itm.TemplateType == 'E');
          this.TemplateSMSList = this.TemplatesList.filter(itm => itm.TemplateType == 'S');
        }

        if(this.commonService.getLength(this.dataGridList) > 0)
        {
          
          this.dataGridList.forEach(x => {

            let newItem = Object.assign({}, x);
            this.orgDataGridList.push(newItem);

              if (x.EmailTemplateID != null)
              {
                if(this.commonService.getLength(this.TemplateEmailList) > 0){
                  x.SelectedEmailTemplate = this.TemplateEmailList.find(y => y.TemplateID == x.EmailTemplateID);
                  x.EmailTemplateName = x.SelectedEmailTemplate.TemplateName;
                }
              }

              if (x.SMSTemplateID != null)  
              {
                if(this.commonService.getLength(this.TemplateSMSList) > 0){
                  x.SelectedSMSTemplate = this.TemplateSMSList.find(y => y.TemplateID == x.SMSTemplateID);
                  x.SMSTemplateName = x.SelectedSMSTemplate.TemplateName;
                }
              }

          });

        }

      }
      else
      {
        this.sessionService.showError(data.ErrorMessage);
      }

    });         

    this.selectedDataGridItem = null;

  }

  saveClick()
  {

    let isValid: boolean;
    isValid = true;

    let req = new SaveEventConfigurationRequest();   
    req.EventConfigurationList = [];   

    if(this.commonService.getLength(this.dataGridList) > 0)
    {
        this.dataGridList.forEach(itm => {

          let orgItem = this.orgDataGridList.find( fitm => fitm.EventID == itm.EventID);

          if (
            (itm.SendEmail != orgItem.SendEmail) || 
            (this.commonService.nvl(itm.EmailTemplateID,0) != this.commonService.nvl(orgItem.EmailTemplateID,0)) || 
            (this.commonService.nvl(itm.DefaultToEmailID,'0') != this.commonService.nvl(orgItem.DefaultToEmailID,'0') ) ||
            (this.commonService.nvl(itm.DefaultCCEmailID,'0') != this.commonService.nvl(orgItem.DefaultCCEmailID,'0')) || 
            (this.commonService.nvl(itm.DefaultBCCEmailID,'0') != this.commonService.nvl(orgItem.DefaultBCCEmailID,'0') ) || 
            (itm.SendSMS != orgItem.SendSMS) ||
            (this.commonService.nvl(itm.SMSTemplateID,0) != this.commonService.nvl(orgItem.SMSTemplateID,0)) ||
            (this.commonService.nvl(itm.DefaultMobileNumber,'0') != this.commonService.nvl(orgItem.DefaultMobileNumber,'0'))
          )
          {
            req.EventConfigurationList.push(itm);
          }

        });
        
    }

    if(this.commonService.getLength(req.EventConfigurationList) > 0){

      req.EventConfigurationList.forEach(x=>
      {

        if (isValid){
          isValid = this.validate(x);
        }
        
        if (isValid)
        {
          isValid = this.emailValidate(x.EventName, x.DefaultToEmailID);
        }

        if (isValid)
        {
          isValid = this.emailValidate(x.EventName, x.DefaultCCEmailID);
        }

        if (isValid)
        {
          isValid = this.emailValidate(x.EventName, x.DefaultBCCEmailID);
        }

        if (isValid)
        {
          isValid = this.mobileValidate(x.EventName, x.DefaultMobileNumber);
        }

      });  

      if(isValid){
        
        this.apiService.postData("SaveEventConfiguration", req).subscribe((data: ServiceReponse) => {
      
          if (data.SuccessCode == 1) 
          {
            this.sessionService.showSuccess("Event configuration saved successfully");
            this.refreshClick();
          }
          else
          {
            this.sessionService.showError(data.ErrorMessage);
          }
      
        });
      }

    }
    else
    {
      this.sessionService.showError('No modifications have been done to save');
      return;
    }

  }

  validate(itm: EventInfo): boolean
  {

      if (itm.SendEmail && (itm.EmailTemplateID == null || itm.EmailTemplateID == 0))
      {
        this.sessionService.showError(itm.EventName + ' : ' + 'Email Template not configured..');
        return false;
      }

      if(itm.SendSMS && (itm.SMSTemplateID == null || itm.SMSTemplateID == 0)){
        this.sessionService.showError(itm.EventName + ' : ' + 'SMS Template not configured');
        return false;
      }

      return true;
  }

  validateEmailID(emailid: string): boolean
  {

      var toEmail = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

      if(!toEmail.test(emailid)){
        return false;
      }     
      else
      {
        return true;
      }

  }

  emailValidate(EventName: string, DefaultToEmailID: string): boolean
  {
    
    let errorMessage = null;

    if (this.commonService.getLengthNA(DefaultToEmailID) > 0) 
    {

      let tmp = DefaultToEmailID.split(';');

      tmp.forEach(x1 =>
      {
         let status = this.validateEmailID(x1);

          let xCount = tmp.filter(z=> z == x1).length;
          if(xCount > 1){
            errorMessage = EventName + ' : ' + x1 + ' Email is duplicated';             
          }

          if (!status)
          {
            errorMessage = EventName + ' : ' + x1 + ' Email is invalid';
          }

      }
      );

      if (errorMessage != null)
      {
        this.sessionService.showError(errorMessage);
        return false;
      }
      else
      {
        return true;
      }
      
    }
    
    return true;
  }

  validateMobile(mobile: string): boolean
  {

      var mobile1 = /^[0-9]*/;

      if(!mobile1.test(mobile) || mobile.length != 10){
        return false;
      }
      else
      {
        return true;
      }

  }

  mobileValidate(EventName: string, DefaultMobileNumber: string): boolean
  {
      let errorMessage = null;

      if (this.commonService.getLengthNA(DefaultMobileNumber) > 0) 
      {

        let tmp = DefaultMobileNumber.split(';');

        tmp.forEach(x1 =>
        {
           let status = this.validateMobile(x1);

           let xCount = tmp.filter(z=> z == x1).length;
            if(xCount > 1){
              errorMessage = EventName + ' : ' + x1 + ' Mobile Number is duplicated';             
            }

            if (!status)
            {
              errorMessage = EventName + ' : ' + x1 + ' Mobile Number is invalid';
            }
        }
        );

        if (errorMessage != null)
        {
          this.sessionService.showError(errorMessage);
          return false;
        }
        else
        {
          return true;
        }
        
      }
      
      return true;
  }

      

  onEmailTemplateChange(inputRow: EventInfo) {      

    if (inputRow.SelectedEmailTemplate != null) {               
      inputRow.EmailTemplateID = inputRow.SelectedEmailTemplate.TemplateID;
      inputRow.EmailTemplateName = inputRow.SelectedEmailTemplate.TemplateName;
    }
    else
    { 
      inputRow.EmailTemplateID = null;
      inputRow.EmailTemplateName = null;
    }

  }

  onSMSTemplateChange(inputRow: EventInfo) {      

    if (inputRow.SelectedSMSTemplate != null) {               
      inputRow.SMSTemplateID = inputRow.SelectedSMSTemplate.TemplateID;
      inputRow.SMSTemplateName = inputRow.SelectedSMSTemplate.TemplateName;
    }
    else
    { 
      inputRow.SMSTemplateID = null;
      inputRow.SMSTemplateName = null;
    }

  }

  refreshClick() {
    this.loadDataGrid();
  }

  getDataGridWidth(): string
  {
    if (this.sessionService.showMenuBar)
    {
      return  (window.innerWidth - 252) + 'px';
    }
    else
    {
      return (window.innerWidth - 87) + 'px';
    }
  }

  emailClearClick(rowData:EventInfo){
    rowData.SelectedEmailTemplate = null;
    rowData.EmailTemplateID = null;
    rowData.EmailTemplateName = null;
  }

  smsClearClick(rowData:EventInfo){
    rowData.SelectedSMSTemplate = null;
    rowData.SMSTemplateID = null;
    rowData.SMSTemplateName = null;
  }

}