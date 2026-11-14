import { Component, OnInit } from '@angular/core';
import { AppConfig, MasterStatus} from '../../const/app.config';
import { WebApiService } from "../../service/webapi.service";
import { CorpInfo, Status, State, Country, TimeZone, AppsInfo } from "../../model/shared.model";
import { SessionService } from "../../service/session.service";
import { CommonService } from "../../service/common.service";
import { MatDialog } from '@angular/material/dialog';
import { CorporateGetAllResponse, MasterData_RegisterCorp_GetAllResponse, ServiceReponse } from '../../model/response.model';
import { CorporateGetAllRequest, SaveCorporateRequest } from '../../model/request.model';
import { SettingDialogComponent } from '../settings/settingdialog.component';
import { ConfirmDialogComponent } from '../../common/confirmdialog.component';


@Component({
  templateUrl: './corporate.component.html',
  styleUrls: ['./corporate.component.css']
})

export class CorporateComponent implements OnInit {

  cols: any[];

  public selectedDataGridItem: CorpInfo;
  public selectedData: CorpInfo;
  public dataGridList: CorpInfo[];

  public DialogHeader: string;
  public Mode: string;
  
  public StatusList: Status[];
  public StateList: State[];
  public StateListFiltered: State[];
  public CountryList: Country[];
  public TimeZoneList: TimeZone[];

  public SelectedApps:AppsInfo[];
  public AppsList:AppsInfo[];

  public submitAttempt: boolean;

  public FormColumnsWidth: number;

  constructor(public dialog: MatDialog, public sessionService: SessionService, private apiService: WebApiService,
    public commonService: CommonService) {
  
    this.StateList = [];
    this.StateListFiltered = [];
    this.CountryList = [];
    this.TimeZoneList = [];
    this.FormColumnsWidth = 700;
  }

  ngOnInit() {
    
    this.Mode = 'HOME';

    this.loadDataGrid();

    this.cols = [
      { field: 'CorpName', header: 'Organization Name', width: '20%', align: 'left', wrap: 'break-word' },
      { field: 'CorpCode', header: 'Organization Code', width: '12%', align: 'left', wrap: 'break-word' },
      { field: 'ContactPerson', header: 'Contact Person', width: '17%', align: 'left', wrap: 'break-word' },
      { field: 'MobileNumber', header: 'Mobile', width: '13%', align: 'left', wrap: 'break-word' },
      { field: 'Email', header: 'eMail ID', width: '15%', align: 'left', wrap: 'break-word' },
      { field: 'City', header: 'City', width: '12%', align: 'left', wrap: 'break-word' },
      { field: 'StatusMessage', header: 'Status', width: '10%', align: 'left', wrap: 'break-word' }
    ];

  }

  
  loadDataGrid() {

    let req = new CorporateGetAllRequest();
    if(this.sessionService.RoleID == 1){
      req.IsAdmin =true;
    }    
    
    this.apiService.postData("CorporateGetAll", req).subscribe((data: CorporateGetAllResponse) => {
      if (data.SuccessCode == 1) { 
        this.dataGridList = data.ResultList;
        console.log(this.dataGridList);
      }
      else
      {
        this.sessionService.showError(data.ErrorMessage);
      }
    });

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
        Mode: "Corporate",
        CorpID: this.selectedData.CorpID
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
    this.AppsList = this.sessionService.AppsList;

    console.log(this.selectedDataGridItem);
    
    if (Mode != 'ADD') {
      this.onCountrySelect();
      this.SelectedApps =  new Array();

      if (this.commonService.getLengthNA(this.selectedDataGridItem.AppIDs) > 0) {
      
        let appList = this.selectedDataGridItem.AppIDs.split(",");
        for (let i of appList) {
          let selectedApp = this.AppsList.find(x => x.AppID == Number(i));
          if (selectedApp != undefined) {
              this.SelectedApps.push(selectedApp);
          }
        }
      }
    }

    this.Mode = Mode;


    // if (this.commonService.getLength(this.CountryList) == 0 || this.commonService.getLength(this.StateList) == 0 
    //   || this.commonService.getLength(this.TimeZoneList) == 0)
    // {

    //   this.apiService.postData("MasterData_RegisterCorp_GetAll", null).subscribe((data: MasterData_RegisterCorp_GetAllResponse) => {
    //   if (data.SuccessCode == 1) {
      
    //       this.StateList = data.StateList;
    //       this.CountryList = data.CountryList;
    //     this.TimeZoneList = data.TimeZoneList;

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
    this.selectedDataGridItem = new CorpInfo();
    this.selectedDataGridItem.StatusCode = MasterStatus.Active;
    this.loadMasterData('ADD');
  }

  editClick() {
      this.onDoubleClick(this.selectedData);
  }

  onDoubleClick(rowData: CorpInfo) {
    if (rowData != null) {
      this.selectedDataGridItem = Object.assign({}, rowData);
      this.loadMasterData('EDIT');
    }
  }
  
  deleteClick() {

    if (this.selectedData != null) {
      
      if (this.selectedData.CorpID == this.sessionService.CorpID)
      {
        this.sessionService.showError('Selected Organization is your current. Could not be deleted....!');
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

          let req = new SaveCorporateRequest();
          req.Result = this.selectedData;    
          req.Result = this.selectedData;
          req.SaveType = AppConfig.SaveType_Delete;

          this.apiService.postData("SaveCorporate", req).subscribe((data: ServiceReponse) => {
            if (data.SuccessCode == 1) {
              this.sessionService.showSuccess("Organization deleted sucessfully..");
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

      let req = new SaveCorporateRequest();
      req.Result = this.selectedDataGridItem;

      if (this.Mode == 'ADD') {
        req.SaveType = AppConfig.SaveType_Insert
      }
      else {
        req.SaveType = AppConfig.SaveType_Update
      }

      req.Result.AppIDs = null;

      if (this.commonService.getLength(this.SelectedApps) > 0) 
      {
          this.SelectedApps.forEach(itm => {
              if (req.Result.AppIDs == null) {
                  req.Result.AppIDs = itm.AppID.toString();
              }
              else {
                  req.Result.AppIDs = req.Result.AppIDs + ',' + itm.AppID.toString();
              }
          });
      } 

      this.apiService.postData("SaveCorporate", req).subscribe((data: ServiceReponse) => {
        if (data.SuccessCode == 1) {

          if (this.Mode == 'ADD') {
            this.sessionService.showSuccess("Organization added successfully");
          }

          else if (this.Mode == 'EDIT') {
            this.sessionService.showSuccess("Organization updated successfully");
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
      this.sessionService.showError('Some mandatory informations are missing, please check');
      return;
    }
  }

  cancelClick() {
    this.Mode = 'HOME';
    this.submitAttempt = false;
    this.selectedDataGridItem = null;
    this.selectedData = null;
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
