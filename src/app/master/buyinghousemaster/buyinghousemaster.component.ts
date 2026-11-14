import { Component, OnInit } from '@angular/core';
import { AppConfig, MasterStatus} from '../../const/app.config';
import { WebApiService } from "../../service/webapi.service";
import { Status, State, Country, HouseMasterInfo, AgentMasterInfo } from "../../model/shared.model";
import { SessionService } from "../../service/session.service";
import { CommonService } from "../../service/common.service";
import { MatDialog } from '@angular/material/dialog';
import { MasterData_RegisterCorp_GetAllResponse, ServiceReponse, Master_BuyerGetByCorpIDResponse, Master_HouseGetByCorpIDResponse } from '../../model/response.model';
import { SaveBuyerRequest, SaveHouseRequest } from '../../model/request.model';
import { ConfirmDialogComponent } from '../../common/confirmdialog.component';

@Component({
  templateUrl: './buyinghousemaster.component.html',
  styleUrls: ['./buyinghousemaster.component.scss']
})

export class BuyingHouseComponent implements OnInit {

  public submitAttempt: boolean;
  public selectedDataGridItem: HouseMasterInfo;
  public selectedData: HouseMasterInfo;
  public dataGridList: HouseMasterInfo[];
  public cols: any[];

  public Mode: string;
  
  public StatusList: Status[];
  public StateList: State[];
  public StateListFiltered: State[];
  public CountryList: Country[];
  public agentList: AgentMasterInfo[];

  public FormColumnsWidth : number;
  public alsoCustomer:boolean;

  constructor(public dialog: MatDialog, public sessionService: SessionService, private apiService: WebApiService,
    public commonService: CommonService) {
  
    this.StateList = [];
    this.StateListFiltered = [];
    this.CountryList = [];

    this.FormColumnsWidth = 600;

  }

  ngOnInit() {
    
    this.Mode = 'HOME';

    this.loadDataGrid();

    this.cols = [
      { field: 'HouseName', header: 'Consignee Name', width: '27%', align: 'left', wrap: 'break-word' },
      { field: 'SPOC', header: 'SPOC', width: '27%', align: 'left', wrap: 'break-word' },
      { field: 'MobileNumber', header: 'Mobile', width: '9%', align: 'left', wrap: 'break-word' },
      { field: 'Email', header: 'Email', width: '22%', align: 'left', wrap: 'break-word' },
      { field: 'City', header: 'City', width: '10%', align: 'left', wrap: 'break-word' },
      { field: 'StatusMessage', header: 'Status', width: '8%', align: 'left', wrap: 'break-word' }
    ];

  }
  
  loadDataGrid() {

    this.apiService.postData("Master_HouseGetByCorpID", null).subscribe((data: Master_HouseGetByCorpIDResponse) => {
      if (data.SuccessCode == 1) {
        this.dataGridList = data.ResultList;
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

  
  loadMasterData(Mode: string)
  {

    if (Mode == 'ADD') {
        this.StatusList = this.sessionService.ActiveStatusList;
    }
    else
    {
      this.StatusList = this.sessionService.StatusList;
    }
    
    if (this.commonService.getLength(this.CountryList) == 0 || this.commonService.getLength(this.StateList) == 0 )
    {

      this.apiService.postData("MasterData_RegisterCorp_GetAll", null).subscribe((data: MasterData_RegisterCorp_GetAllResponse) => {
      if (data.SuccessCode == 1) {
      
          this.StateList = data.StateList;
          this.CountryList = data.CountryList;
          //this.agentList = data.AgentList;
           
          if (Mode != 'ADD') {
            this.onCountrySelect();
          }

          this.Mode = Mode;
        }
        else
        {
          this.sessionService.showError(data.ErrorMessage);
          this.cancelClick();
        }
      });

    }
    else
    {
      if (Mode != 'ADD') {
        this.onCountrySelect();
      }

      this.Mode = Mode;
    }

    this.sessionService.scrollAdjust();
  }

  addClick() {
    this.selectedDataGridItem = new HouseMasterInfo();
    this.selectedDataGridItem.StatusCode = MasterStatus.Active;
    this.loadMasterData('ADD');
  }

  editClick() {
      this.onDoubleClick(this.selectedData);
  }

  onDoubleClick(rowData: HouseMasterInfo) {
    if (rowData != null) {
      this.selectedDataGridItem = Object.assign({}, rowData);
      this.loadMasterData('EDIT');
    }
  }
  
  deleteClick() {

    if (this.selectedData != null) {
      
      let dialogRef = this.dialog.open(ConfirmDialogComponent, {
        data: {
          DialogHeader: 'Alert',
          DialogMessage: 'Are you sure you want to delete?'
        },
        disableClose: true,
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result == 1) {

          let req = new SaveHouseRequest();
          req.Result = new HouseMasterInfo();
          req.Result.HouseID = this.selectedData.HouseID;
          req.SaveType = AppConfig.SaveType_Delete;

          this.apiService.postData("SaveHouse", req).subscribe((data: ServiceReponse) => {
            if (data.SuccessCode == 1) {
              this.sessionService.showSuccess("Customer deleted sucessfully..");
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

      if (this.selectedDataGridItem.CountryCode == 'IND')
      {
        if (this.commonService.getLengthNA(this.selectedDataGridItem.Pincode) != 6)
        {
            this.sessionService.showError("Invalid pincode");
            return;
        }
      }

      let req = new SaveHouseRequest();
      req.Result = this.selectedDataGridItem;     
      req.SaveType = this.Mode == 'ADD' ? AppConfig.SaveType_Insert : AppConfig.SaveType_Update;

      this.apiService.postData("SaveHouse", req).subscribe((data: ServiceReponse) => {
        if (data.SuccessCode == 1) {
          this.sessionService.showSuccess(this.Mode == 'ADD' ? "Customer added successfully" : "Customer updated successfully");
          this.Mode = 'HOME';
          this.RefreshClick();       
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

  finishAddEdit()
  {
    this.Mode = 'HOME';
    this.RefreshClick();   
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

  isRowSelected(): boolean {

    if (this.selectedData != null) {
        return true;
    }
    else {
        return false;        
    }
  }

  onCustomerCheckbox()
  {
    if (this.alsoCustomer == true)
    {
        this.selectedDataGridItem.AgentID = -1;
    }
  }

}
