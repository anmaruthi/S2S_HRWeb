import { Component, OnInit } from '@angular/core';
import { AppConfig, MasterStatus} from '../../const/app.config';
import { WebApiService } from "../../service/webapi.service";
import { CorpInfo, Status, State, Country, TimeZone, SiteInfo } from "../../model/shared.model";
import { SessionService } from "../../service/session.service";
import { CommonService } from "../../service/common.service";
import { MatDialog } from '@angular/material/dialog';
import {
  SiteGetAllResponse, MasterData_RegisterCorp_GetAllResponse, ServiceReponse,
  CorporateGetByCorpIDResponse} from '../../model/response.model';
import { SiteGetAllRequest, ServiceRequest, SaveSiteRequest, CorporateGetByCorpIDRequest } from '../../model/request.model';
import { SettingDialogComponent } from '../settings/settingdialog.component';
import { ConfirmDialogComponent } from '../../common/confirmdialog.component';

@Component({
  templateUrl: './site.component.html',
  styleUrls: ['./site.component.css']
})

export class SiteComponent implements OnInit {

  cols: any[];

  public selectedDataGridItem: SiteInfo;
  public selectedData: SiteInfo;
  public dataGridList: SiteInfo[];

  public DialogHeader: string;
  public Mode: string;
  
  public StatusList: Status[];
  public StateList: State[];
  public StateListFiltered: State[];
  public CountryList: Country[];
  public TimeZoneList: TimeZone[];
  public submitAttempt: boolean;

  public CanCopyAddressFromCorporate: boolean;
  public CanCopyAddressFromCorporate1: boolean;

  public FormColumnsWidth: number;

  constructor(public dialog: MatDialog, public sessionService: SessionService, private apiService: WebApiService,
    public commonService: CommonService) {
  
    this.StateList = [];
    this.StateListFiltered = [];
    this.CountryList = [];
    this.TimeZoneList = [];
    this.FormColumnsWidth = 650;
  }

  ngOnInit() {
    
    this.Mode = 'HOME';

    this.loadDataGrid();

    this.cols = [
      { field: 'SiteCode', header: 'Site Code', width: '5%', align: 'left', wrap: 'break-word' },
      { field: 'SiteName', header: 'Site Name', width: '15%', align: 'left', wrap: 'break-word' },
      { field: 'CorpCode', header: 'Org. Code', width: '5%', align: 'left', wrap: 'break-word' },
      { field: 'CorpName', header: 'Organization', width: '15%', align: 'left', wrap: 'break-word' },          
      { field: 'ContactPerson', header: 'Contact Person', width: '14%', align: 'left', wrap: 'break-word' },
      { field: 'MobileNumber', header: 'Mobile', width: '12%', align: 'left', wrap: 'break-word' },
      { field: 'Email', header: 'eMail ID', width: '14%', align: 'left', wrap: 'break-word' },
      { field: 'City', header: 'City', width: '12%', align: 'left', wrap: 'break-word' },
      { field: 'StatusMessage', header: 'Status', width: '8%', align: 'left', wrap: 'break-word' }
    ];

    
  }

  
  loadDataGrid() {

    this.CountryList = this.sessionService.CountryList;
    this.StateList = this.sessionService.StateList;
    this.TimeZoneList = this.sessionService.TimeZoneList;

    let req = new SiteGetAllRequest();
    if(this.sessionService.RoleID ==1){
      req.IsAdmin =true;
    }
    this.apiService.postData("SiteGetAll", req).subscribe((data: SiteGetAllResponse) => {
      if (data.SuccessCode == 1) {
        this.dataGridList = data.ResultList;

      }
      else
      {
        this.sessionService.showError(data.ErrorMessage);
      }
    });

  }

  onCheckboxChange() {

    if (this.CanCopyAddressFromCorporate1) {
      let req = new CorporateGetByCorpIDRequest();      

      this.apiService.postData("CorporateGetByCorpID", req).subscribe((response: CorporateGetByCorpIDResponse) => {
        if (response.SuccessCode == 1) {

         

          if (response.ResultList != null) 
          {
            console.log(response.ResultList);

            //this.selectedDataGridItem.FirstName = response.Result.FirstName;
            //this.selectedDataGridItem.LastName = response.Result.LastName;
            this.selectedDataGridItem.MobileNumber = response.ResultList.MobileNumber;
            this.selectedDataGridItem.Address1 = response.ResultList.Address1;
            this.selectedDataGridItem.Address2 = response.ResultList.Address2;
            this.selectedDataGridItem.CountryCode = response.ResultList.CountryCode;
            this.onCountrySelect();
            this.selectedDataGridItem.StateID = response.ResultList.StateID;
            this.selectedDataGridItem.City = response.ResultList.City;
            this.selectedDataGridItem.Pincode = response.ResultList.Pincode;
            this.selectedDataGridItem.Email = response.ResultList.Email;

            this.selectedDataGridItem.RegionalTimeZone = response.ResultList.RegionalTimeZone;

            console.log(this.selectedDataGridItem);
          }
        }
      });
    }
  }

  onCountrySelect() {

    this.StateListFiltered = [];

    if (this.commonService.getLengthNA(this.selectedDataGridItem.CountryCode) > 0) {
        if (this.commonService.getLength(this.StateList) > 0) 
        {
          this.StateListFiltered = this.StateList.filter(itm => itm.CountryCode == this.selectedDataGridItem.CountryCode);
        }
    }
    else
    {
      this.selectedDataGridItem.StateID = null;
    }

  }

  settingClick() {
    let dialogRef = this.dialog.open(SettingDialogComponent, {
      data: {
        Mode: "Site",
        SiteID: this.selectedData.SiteID
      },
      height: '95%',
      width: '50%',
      disableClose: true,
    });
  }

  loadMasterData(Mode: string)
  {

    this.CountryList = this.sessionService.CountryList;
    this.StateList = this.sessionService.StateList;
    this.TimeZoneList = this.sessionService.TimeZoneList;
    
    if (Mode != 'ADD') {
      this.onCountrySelect();
    }

    this.Mode = Mode;

    // if (this.commonService.getLength(this.CountryList) == 0 || this.commonService.getLength(this.StateList) == 0 
    //   || this.commonService.getLength(this.TimeZoneList) == 0)
    // {

    //   this.apiService.postData("MasterData_RegisterCorp_GetAll", null).subscribe((data: MasterData_RegisterCorp_GetAllResponse) => {
    //   if (data.SuccessCode == 1) {
      
    //       this.StateList = data.StateList;
    //       this.CountryList = data.CountryList;
    //       this.TimeZoneList = data.TimeZoneList;

    //       if (Mode != 'ADD') {
    //         this.onCountrySelect();
    //       }
    //       this.Mode = Mode;
    //   }
    //   else
    //   {
    //     this.sessionService.showError(data.ErrorMessage);
    //     this.cancelClick();
    //   }
    //   });

    // }
    // else
    // {
    //   if (Mode != 'ADD') {
    //     this.onCountrySelect();
    //   }

    //   this.Mode = Mode;
    // }

    if (Mode == 'ADD') {
      this.StatusList = this.sessionService.StatusListAll.filter(x=> x.StatusCode==10);
    }
    else if (Mode == 'EDIT')
    {      
      this.StatusList = this.sessionService.StatusListAll;
    }

    this.sessionService.scrollAdjust();

  }

  addClick() {
    this.selectedDataGridItem = new SiteInfo();
    this.selectedDataGridItem.StatusCode = MasterStatus.Active;
    this.loadMasterData('ADD');
  }

  editClick() {
      this.onDoubleClick(this.selectedData);
  }

  onDoubleClick(rowData: SiteInfo) {
    if (rowData != null) {
      this.selectedDataGridItem = Object.assign({}, rowData);
      this.loadMasterData('EDIT');
    }
  }
  
  deleteClick() {

    if (this.selectedData != null) {
   
      if (this.selectedData.SiteID == this.sessionService.SiteID)
      {
        this.sessionService.showError('Selected Site is your current site. Could not be deleted....!');
        return;
      }


      let dialogRef = this.dialog.open(ConfirmDialogComponent, {
        data: {
          DialogHeader: 'Alert',
          DialogMessage: 'Are you sure you want to delete?'
        },
        disableClose: true,
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result == 1) {

          let req = new SaveSiteRequest();

          req.Result = new SiteInfo();

          req.Result = this.selectedData;
          req.SaveType = AppConfig.SaveType_Delete;

          this.apiService.postData("SaveSite", req).subscribe((data: ServiceReponse) => {
            if (data.SuccessCode == 1) {
              this.sessionService.showSuccess("Site deleted sucessfully..");
              this.loadDataGrid();
              this.selectedData = null;
            }
            else {
              this.sessionService.showError(data.ErrorMessage);
            }
          });
        }
        else {
          this.selectedData = null;
        }
      });

    }

  }

  RefreshClick() {
    this.cancelClick();
    this.loadDataGrid();
  }

  SubmitClick(isValid: boolean) {

    this.submitAttempt = true;

    if (isValid) {

      let req = new SaveSiteRequest();
      req.Result = this.selectedDataGridItem;

      if (this.selectedDataGridItem.CountryCode == 'IND') {
        if (this.commonService.getLengthNA(this.selectedDataGridItem.Pincode) != 6) {
          this.sessionService.showError("Invalid pincode");
          return;
        }
      }

      if (this.Mode == 'ADD') {
        req.SaveType = AppConfig.SaveType_Insert
      }
      else {
        req.SaveType = AppConfig.SaveType_Update
      }

      this.apiService.postData("SaveSite", req).subscribe((data: ServiceReponse) => {
        if (data.SuccessCode == 1) {

          if (this.Mode == 'ADD') {
            this.sessionService.showSuccess("Site added successfully");
          }

          else if (this.Mode == 'EDIT') {
            this.sessionService.showSuccess("Site updated successfully");
          }
         
          this.RefreshClick();
          this.Mode = 'HOME';
        }
        else
        {
          this.sessionService.showError(data.ErrorMessage);
        }
      });
    }
    else {
      this.sessionService.showError('Kindly Check the Mandatory field(s)');
      return;
    }
  }

  cancelClick() {
    this.Mode = 'HOME';
    this.submitAttempt = false;
    this.selectedDataGridItem = null;
    this.selectedData = null;
    this.CanCopyAddressFromCorporate1 = false;
  }

  onKeyUp() {
    this.selectedData = null;
  }

  DisableEdit(): boolean {

    if (this.selectedData != null) {
        return false;
    }
    else {
      return true;
    }

  }

}
