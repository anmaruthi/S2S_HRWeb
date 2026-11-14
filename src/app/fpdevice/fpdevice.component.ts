import { Component, OnInit } from '@angular/core';
import { AppConfig, MasterStatus } from '../const/app.config';
import { WebApiService } from "../service/webapi.service";
import { SessionService } from "../service/session.service";
import { CommonService } from "../service/common.service";
import { MatDialog } from '@angular/material/dialog';
import { FP_Devices, Status, AccessType } from '../model/shared.model';
import { ConfirmDialogComponent } from '../common/confirmdialog.component';
import { ServiceRequest, SaveFPDeviceRequest } from '../model/request.model';
import { FPDeviceGetAllBySiteIDResponse, SaveReponse } from '../model/response.model';

@Component({
  templateUrl: './fpdevice.component.html',
  styleUrls: ['./fpdevice.component.scss']
})

export class FPDeviceComponent implements OnInit {
  cols: any[];
  public Mode: string;
  public submitAttempt: boolean;
  public FormColumnsWidth: number;

  public dataGridList: FP_Devices[];
  public selectedData: FP_Devices;
  public selectedDataGridItem: FP_Devices;

  public StatusList: Status[];
  public AccessTypeList: AccessType[];
 

  constructor(public dialog: MatDialog, public sessionService: SessionService, private apiService: WebApiService,
    public commonService: CommonService) {
    this.FormColumnsWidth = 600;
  }
  ngOnInit() {
    this.Mode = 'HOME';
    this.submitAttempt = false;
    this.loadDataGrid();
    this.cols = [
      { field: 'FPDeviceID', header: 'Device ID', width: '10%', align: 'left', wrap: 'break-word' },
      { field: 'FPDeviceName', header: 'Device Name', width: '25%', align: 'left', wrap: 'break-word' },
      { field: 'FPDeviceIP', header: 'IP Address', width: '15%', align: 'left', wrap: 'break-word' },
      { field: 'FPDevicePort', header: 'Port', width: '10%', align: 'left', wrap: 'break-word' },
      { field: 'FPDeviceType', header: 'Access Type', width: '10%', align: 'left', wrap: 'break-word' },
      { field: 'FPDeviceNote', header: 'Device Note', width: '15%', align: 'left', wrap: 'break-word' },
      { field: 'StatusMessage', header: ' Status', width: '15%', align: 'left', wrap: 'break-word' }
    ];
  }
  onKeyUp() {
    this.selectedDataGridItem = null;
  }
  isRowSelected(): boolean {
    if (this.selectedData != null) {
      return true;
    }
    else {
      return false;
    }
  }
  cancelClick() {
    this.Mode = 'HOME';
    this.submitAttempt = false;
    this.selectedData = null;
    this.selectedDataGridItem = null;
  }
  addClick() {
    this.selectedDataGridItem = new FP_Devices();
    this.selectedDataGridItem.StatusCode = MasterStatus.Active;
    this.Mode = 'ADD';
    this.loadMasterData();
  }
  DisableEdit(): boolean {

    if (this.selectedData != null) {
      return false;
    }
    else {
      return true;
    }
  }

  editClick() {
    this.Mode = 'EDIT';
    this.onDoubleClick(this.selectedData);

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

          let req = new SaveFPDeviceRequest();
          req.Result = this.selectedData;             
          req.SaveType = AppConfig.SaveType_Delete;

          this.apiService.postData("SaveFPDevice", req).subscribe((data: SaveReponse) => {
            if (data.SuccessCode == 1) {
              this.sessionService.showSuccess("Device deleted sucessfully..");
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


  refreshClick() {
    this.cancelClick();
    this.loadDataGrid();
  }

  onDoubleClick(rowData: FP_Devices) {
    if (rowData != null) {
      this.selectedDataGridItem = Object.assign({}, rowData);
      this.Mode = 'EDIT';
      this.loadMasterData();
    }
  }

  loadMasterData() {
    if (this.Mode == 'ADD') {
      this.StatusList = this.sessionService.StatusListAll.filter(x => x.StatusCode == 10);
    }
    else {
      this.StatusList = this.sessionService.StatusListAll;
    }

    this.AccessTypeList = new Array();
    let jtm = new AccessType;
    jtm.AccessTypeName = 'IN';
    jtm.AccessTypeID = 1;

    this.AccessTypeList.push(jtm);

    jtm = new AccessType;

    jtm.AccessTypeName = 'OUT';
    jtm.AccessTypeID = 2;
    this.AccessTypeList.push(jtm);

    console.log(this.StatusList)
  }

  loadDataGrid() {
    this.dataGridList = new Array();
    let req = new ServiceRequest();
    this.apiService.postData("MasterFPDeviceGetBySiteID", req).subscribe((data: FPDeviceGetAllBySiteIDResponse) => {
    if (data.SuccessCode == 1) {
        this.dataGridList = data.ResultList;
      }
      else {
    this.sessionService.showError(data.ErrorMessage);
      }
    });

  }

  submitClick(isValid: boolean) {
    this.submitAttempt = true;

    if (isValid == true) {

      let req = new SaveFPDeviceRequest();
      req.Result = this.selectedDataGridItem;

      if (this.Mode == 'ADD') {
        req.SaveType = AppConfig.SaveType_Insert
      }
      else {
        req.SaveType = AppConfig.SaveType_Update
      }

      this.apiService.postData("SaveFPDevice", req).subscribe((data: SaveReponse) => {
        if (data.SuccessCode == 1) {

          if (this.Mode == 'ADD') {
            this.sessionService.showSuccess("Device added successfully");
          }
          else if (this.Mode == 'EDIT') {
            this.sessionService.showSuccess("Device updated successfully");
          }
         
          this.refreshClick();
          this.Mode = 'HOME';
        }
        else
        {
          this.sessionService.showError(data.ErrorMessage);
        }
      });

    }
    else {
      this.sessionService.showError("Some mandatory informations are missing, please check");
      return;
    }
    
  }
}



