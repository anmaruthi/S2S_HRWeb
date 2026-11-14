import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl, SafeUrl} from '@angular/platform-browser';
import { AppConfig, MasterStatus} from '../const/app.config';
import { WebApiService } from "../service/webapi.service";
import { Status, State, Country, BuyerMasterInfo, ReportsInfo, DropDownMaster, ParameterInfo } from "../model/shared.model";
import { SessionService } from "../service/session.service";
import { CommonService } from "../service/common.service";
import { MatDialog } from '@angular/material/dialog';
import { ServiceReponse, ReportsGetByCorpIDResponse, GetReportGuikeyByParametersResponse } from '../model/response.model';
import { SaveBuyerRequest, ReportRequest, GetReportGuikeyByParametersRequest } from '../model/request.model';
import { ConfirmDialogComponent } from '../common/confirmdialog.component';
import * as moment from 'moment';
import { FormGroup } from '@angular/forms';
import { toPublicName } from '@angular/compiler/src/i18n/serializers/xmb';

@Component({
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})

export class ReportsComponent implements OnInit {

  public ReportsList:ReportsInfo[];
  public SelectedReport:ReportsInfo;
  public SelectedReport1:ReportsInfo;

  public dropDownList:DropDownMaster[];
  public parameterList:ParameterInfo[];
  
  public submitAttempt: boolean;
  public cols: any[];

  public Mode: string;

  public FormColumnsWidth : number;
  public showDownload:boolean;
  public showReport:boolean;

  public reportPage:string;
  public reportUrl:SafeResourceUrl;

  constructor(public dialog: MatDialog, public sessionService: SessionService, private apiService: WebApiService,
    public commonService: CommonService, private sanitizer: DomSanitizer) {

    this.FormColumnsWidth = 600;

  }

  ngOnInit() {

    this.ReportsList = new Array();
    this.SelectedReport = new ReportsInfo();
    this.dropDownList = new Array();
    this.submitAttempt = false;
    this.showReport = false;

    this.loadDataGrid();

  }

  loadDataGrid() 
  {
      let req = new ReportRequest();
      req.RoleID = this.sessionService.RoleID;
      //req.DeviceType = 'FS';

      this.apiService.postData("MasterReportsGetByCorpID", req).subscribe((data: ReportsGetByCorpIDResponse) => {
        if (data.SuccessCode == 1) {
          this.ReportsList = data.ReportList;
          this.dropDownList = data.DDList;

 
        }
        else
        {
          this.sessionService.showError(data.ErrorMessage);
        }
      });     
                 

  }
  
  selectReport()
  {
      this.submitAttempt = false;
      let tmpRpt = new ReportsInfo();

      if (this.SelectedReport)
      {
          if (this.SelectedReport.IsDetail == true)
          {
              tmpRpt = this.ReportsList.find(x=> x.ReportName == this.SelectedReport.ReportName + 'Detail' && x.IsDetail == true );
          }
          else
          {
              tmpRpt = this.ReportsList.find(x=> x.ReportID == this.SelectedReport.ReportID && x.IsDetail == false);
          }

          
          //tmpRpt.ReportName = this.SelectedReport.ReportName;
          this.SelectedReport1 = tmpRpt;
          //this.showDownload = false;
          //this.dataGridList = [];


          if (this.SelectedReport1.FieldDetail != null)
          {
            this.loadParameters();
          }
          
      }
  }

  validateDatePeriod() :boolean
  {
      let res:boolean;
      let dtFrom:string;
      let dtTo:string;

      res = true;

      dtFrom = this.parameterList.find(x=> x.ParameterName.toUpperCase() == 'FROMDATE').ParameterValue;
      dtTo = this.parameterList.find(x=> x.ParameterName.toUpperCase() == 'TODATE').ParameterValue;
  
      if (dtFrom != null && dtTo != null)
      {
          dtFrom = moment(dtFrom).format();
          dtTo = moment(dtTo).format();
  
          if (moment(dtTo).isBefore(moment(dtFrom).format()))
          {
              res = false;
              this.sessionService.showError('InvalidDatePeriod');
          }
  
      }

      return res;
  }
  
  loadParameters()
  {
     this.submitAttempt = false;

     if (this.SelectedReport1) 
     {

         let xId = 0;
         this.parameterList = new Array();

         console.log(this.SelectedReport1.FieldDetail);

        if (this.commonService.getLengthNA(this.SelectedReport1.FieldDetail.trim())>0)
        {
            this.SelectedReport1.FieldDetail.trim().split(',').forEach(x=> {

              xId = xId + 1;
              let k = x.indexOf('|');
              let tmp=new ParameterInfo();
              tmp.ParameterId = xId;
              tmp.ParameterName = x.substring(0,k).trim();
              tmp.ParameterType = x.substring(k+1,x.length).toUpperCase();
              tmp.MasterDataList = new Array();
            
              if (tmp.ParameterType == 'DROPDOWN' || tmp.ParameterType == 'DROPDOWN-MULTISELECT')
              {              
                  tmp.MasterDataList = this.dropDownList.filter(z=> z.Domain.toUpperCase() == tmp.ParameterName.toUpperCase());

                  console.log(tmp.MasterDataList);

                  if (tmp.ParameterType == 'DROPDOWN')
                  {
                    if (this.commonService.getLength(tmp.MasterDataList) == 1)
                    {
                        tmp.SelectedDataListSingle = tmp.MasterDataList[0];
                    }
                      tmp.IsMultiple = false;
                  }
                  else if (tmp.ParameterType == 'DROPDOWN-MULTISELECT')
                  {
                      tmp.IsMultiple = true;
                  }
                
                  tmp.SelectedDataList = [];
                  
              }

              else if (tmp.ParameterType == 'DATE')
              {
                  if (!tmp.ParameterValue) 
                  {
                      if (tmp.ParameterName == 'From Date')
                      { 
                        tmp.ParameterValue = moment().add('months', -1).format();
                      }
                      else
                        { tmp.ParameterValue = moment().format(); }

                  }
              }

              this.parameterList.push(tmp);                
            });
        }

         console.log(this.parameterList);
        //  if (this.SelectedReport1.ReportName == "UNO Report")
        //  {
        //      this.showDownload = true;
        //  }
     }

  }

  getIframHeight(): string
  {
    return (this.sessionService.getDataTableHeight(100) + 'px');
  }  

  GetReport() {

    this.submitAttempt = true;
    this.showReport = false;
    
    let req = new GetReportGuikeyByParametersRequest();
    req.SelectedReport = this.SelectedReport;

    let isParametersValid:boolean;
    isParametersValid = true;

    console.log(this.parameterList);

    if (this.parameterList != null && this.parameterList.length > 0)
    {
        this.parameterList.forEach(x => {
      
            if (x.ParameterType == 'DATE')
            {
                switch(x.ParameterName.toUpperCase())
                {        
                    case 'FROM DATE':
                    {
                        req.DateFrom = moment(x.ParameterValue).format(AppConfig.UPDATE_DATE_FORMAT);
                        break;
                    }
                    case 'TO DATE':
                    {
                        req.DateTo = moment(x.ParameterValue).format(AppConfig.UPDATE_DATE_FORMAT);
                        break;
                    }                               
                }

            }
            else  
            {
                if (x.ParameterType == 'DROPDOWN') 
                {
                    if (x.SelectedDataListSingle != null) 
                    {
                            x.ParameterValue = x.SelectedDataListSingle.MasterId.toString();

                    } 
                }
                else  if (x.ParameterType == 'DROPDOWN-MULTISELECT') 
                {
                    if (this.commonService.getLengthNA(x.SelectedDataList) >0 )
                    {
                        x.ParameterValue = '';
                        x.SelectedDataList.forEach(z=> {
                            x.ParameterValue = x.ParameterValue + z.MasterId.toString() + ',';
                        });

                        x.ParameterValue = x.ParameterValue.substr(0,x.ParameterValue.length-1);       
                    }
                }
                        
            
            }

            if (x.ParameterValue == null)
            {
                isParametersValid = false;
            }  
            else
            {
                if (req.ParameterDataList == undefined || req.ParameterDataList == null)
                {
                    req.ParameterDataList = x.ParameterName + ':' + x.ParameterValue + '|';
                }
                else
                {
                    req.ParameterDataList =  req.ParameterDataList + x.ParameterName + ':' + x.ParameterValue + '|';
                }
            }     

        });

    }
    else
    {

    }

    if (req.DateFrom != null && req.DateTo != null)
    {
        if (moment(req.DateTo).isBefore(moment(req.DateFrom))) 
        {
            this.sessionService.showError("To Date should be greater than From Date");
            return;
        }    
        if (moment(req.DateFrom).isSame(moment(req.DateTo))) 
        {
           this.sessionService.showError("From Date and To Date should not be Same");
           return;
        }
    }

    if(isParametersValid != true)
    {
        return;
    }

    console.log(req);

    this.apiService.postData("GetReportGuikeyByParameters", req).subscribe((data: GetReportGuikeyByParametersResponse) => { 
        if (data.ReportTransanctionID != null && data.SuccessCode == 1) 
        {

          this.reportPage = AppConfig.REPORTPAGE_PATH + '?reportid=' + this.SelectedReport.ReportID + '&reportkey=' + data.ReportTransanctionID.toString().trim();
          console.log(this.reportPage);

          this.reportUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.reportPage);     
          this.showReport = true; 
        }
        else if (data.SuccessCode == 0) 
        {
            this.sessionService.showError(data.ErrorMessage);
        }
    });

  }

  reportCloseClick()
  {
      this.showReport = false;
  }

  hasError(form: FormGroup, control: any, errorCode: any): boolean {
    try {
      if (form != null) {
        if (control != null) {
          if (errorCode != null) {
            return form.controls[control].hasError(errorCode);
          }
          else {
            return false;
          }
        }
        else {
          return false;
        }
      }
      else {
        return false;
      }
    }
    catch {
      //console.log(form);
      //console.log(control);
    }
  }

}
