import { Component, OnInit } from '@angular/core';
import { WebApiService } from "../service/webapi.service";
import { SessionService } from "../service/session.service";
import { CommonService } from "../service/common.service";
import { MatDialog } from '@angular/material/dialog';
import { FormGroup } from '@angular/forms';
import { Shift, Status } from '../model/shared.model';
import { ThisReceiver } from '@angular/compiler';
import { SaveReponse, ShiftGetAllByCorpIDResponse } from '../model/response.model';
import { AppConfig, MasterStatus } from '../const/app.config';
import { SaveShiftRequest } from '../model/request.model';
import { ConfirmDialogComponent } from '../common/confirmdialog.component';
@Component({

  templateUrl: './shift.component.html',
  styleUrls: ['./shift.component.scss']
})
export class ShiftComponent implements OnInit {
  cols: any[];
  public Mode: string;
  public selectedData: Shift;
  public selectedDataGridItem: Shift;
  public dataGridList: Shift[];
  public FormColumnsWidth: number;
  public submitAttempt: boolean;
  public ShiftEndNetDay: boolean;
  public ApplicableMale: boolean;
  public ApplicableFemale: boolean;
  public StatusList: Status[];

  constructor(public dialog: MatDialog, public sessionService: SessionService, private apiService: WebApiService,
    public commonService: CommonService) {

  }

  ngOnInit(): void {

    this.selectedDataGridItem = new Shift();
    this.FormColumnsWidth = 600;
    this.submitAttempt = false;
    this.ShiftEndNetDay = false;
    this.ApplicableMale = false;
    this.ApplicableFemale = false;
    this.loadDataGrid();
    this.cols = [
      { field: 'Shift', header: 'Shift', width: '40%', align: 'left', wrap: 'break-word' },
      { field: 'InTime', header: 'In Time', width: '30%', align: 'left', wrap: 'break-word' },
      { field: 'OutTime', header: ' Out Time', width: '30%', align: 'left', wrap: 'break-word' },

    ]

  }

  addClick() {
    this.selectedDataGridItem = new Shift();
    this.selectedDataGridItem.StatusCode = MasterStatus.Active;
    this.Mode = 'ADD';
    this.loadMasterData();
  }

  editClick() {
    this.Mode = 'EDIT';
    this.onDoubleClick(this.selectedData);
  }

  submitClick(isValid: boolean) {
    this.submitAttempt = true;

    if (isValid == true) {

      let req = new SaveShiftRequest();
      req.Result = this.selectedDataGridItem;
      console.log(this.selectedDataGridItem);
      if (this.Mode == 'ADD') {
        req.SaveType = AppConfig.SaveType_Insert
      }
      else {
        req.SaveType = AppConfig.SaveType_Update
      }

      this.apiService.postData("SaveShift", req).subscribe((data: SaveReponse) => {
        if (data.SuccessCode == 1) {

          if (this.Mode == 'ADD') {
            this.sessionService.showSuccess("Shift  added successfully");
          }
          else if (this.Mode == 'EDIT') {
            this.sessionService.showSuccess("Shift  updated successfully");
          }

          this.refreshClick();
          this.Mode = 'HOME';
        }
        else {
          this.sessionService.showError(data.ErrorMessage);
        }
      });

    }
    else {
      this.sessionService.showError("Some mandatory informations are missing, please check");
      return;
    }

  }

  cancelClick() {
    this.Mode = 'HOME';
    this.submitAttempt = false;
    this.selectedData = null;
    this.selectedDataGridItem = null;
  }

  refreshClick() {
    this.cancelClick();
    this.loadDataGrid();
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

          let req = new SaveShiftRequest();
          req.Result = this.selectedData;
          req.SaveType = AppConfig.SaveType_Delete;

          this.apiService.postData("SaveShift", req).subscribe((data: SaveReponse) => {
            if (data.SuccessCode == 1) {
              this.sessionService.showSuccess("shift deleted sucessfully..");
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

  DisableEdit(): boolean {

    if (this.selectedData != null) {
      return false;
    }
    else {
      return true;
    }
  }

  loadMasterData() {


    // if (this.Mode == 'ADD') {
    //   this.StatusList = this.sessionService.StatusListAll.filter(x => x.StatusCode == 10);
    // }
    // else {
    //   this.StatusList = this.sessionService.StatusListAll;
    // }

    // this.sessionService.scrollAdjust();
  }

  onDoubleClick(rowData: Shift) {
    if (rowData != null) {
      this.selectedDataGridItem = Object.assign({}, rowData);
      this.Mode = 'EDIT';
      this.loadMasterData();
      console.log(this.selectedDataGridItem);
    }
  }

  loadDataGrid() {

    let req = new SaveShiftRequest();
    if (this.Mode == 'EDIT') {
      req.ID = this.selectedDataGridItem.ShiftID;
    }
    this.apiService.postData("ShiftGetBySiteID", req).subscribe((data: ShiftGetAllByCorpIDResponse) => {
      console.log(data);
      if (data.SuccessCode == 1) {
        this.dataGridList = data.ResultList;
        console.log(this.dataGridList);

      }
      else {
        this.sessionService.showError(data.ErrorMessage);
      }
    });

  }

}
