import { Component, OnInit } from '@angular/core';
import { AppConfig, MasterStatus } from '../../const/app.config';
import { WebApiService } from "../../service/webapi.service";
import { MasterReason, Status, MasterReasonCategory } from "../../model/shared.model";
import { SessionService } from "../../service/session.service";
import { CommonService } from "../../service/common.service";
import { MatDialog } from '@angular/material/dialog';
import { MasterReasonGetAllByCorpIDResponse , ServiceReponse } from '../../model/response.model';
import { MasterReasonGetAllRequest,SaveReasonRequest, SaveReasonCategoryRequest } from '../../model/request.model';
//import { SettingDialogComponent } from '../settings/settingdialog.component';
import { ConfirmDialogComponent } from '../../common/confirmdialog.component';


@Component({
  selector: 'app-reasons',
  templateUrl: './reasons.component.html',
  styleUrls: ['./reasons.component.scss']
})
export class ReasonsComponent implements OnInit {
  cols: any[];

  public selectedDataGridItem: MasterReason;
  public selectedData: MasterReason;
  public dataGridList: MasterReason[];

  public ReasonCategoryList: MasterReasonCategory[];

  public Mode: string;

  public StatusList: Status[];

  public submitAttempt: boolean;

  public FormColumnsWidth: number;


  constructor(public dialog: MatDialog, public sessionService: SessionService, private apiService: WebApiService,
    public commonService: CommonService) { 

      this.FormColumnsWidth = 600;

    }

  ngOnInit() {

    this.Mode = 'HOME';
    this.submitAttempt = false;
    this.loadDataGrid();

    this.cols = [
      { field: 'Reason', header: 'Reason', width: '25%', align: 'left', wrap: 'break-word' },
      { field: 'ReasonDescription', header: 'Description', width: '25%', align: 'left', wrap: 'break-word' },
      { field: 'ReasonCategory', header: 'Category', width: '25%', align: 'left', wrap: 'break-word' },
      { field: 'StatusMessage', header: 'Status', width: '25%', align: 'left', wrap: 'break-word' }
    ];

  }

  isRowSelected(): boolean {

    if (this.selectedData != null) {
        return true;
    }
    else {
        return false;
    }
  }

  loadDataGrid() {

    let req = new MasterReasonGetAllRequest();
    
    this.apiService.postData("MasterReasonGetByCorpID", req).subscribe((data: MasterReasonGetAllByCorpIDResponse) => {
      if (data.SuccessCode == 1) {
        this.dataGridList = data.ResultList;
        this.ReasonCategoryList = data.ReasonCategoryList;
        console.log(this.ReasonCategoryList);
      }
      else
      {
        this.sessionService.showError(data.ErrorMessage);
      }
    });

  }

  loadMasterData(){

    let req = new MasterReasonGetAllRequest();
    
  
    if (this.Mode == 'ADD'){
      this.StatusList = this.sessionService.StatusListAll.filter(x=> x.StatusCode==10);
    }
    else{
      this.StatusList = this.sessionService.StatusListAll;
    }

    this.sessionService.scrollAdjust();
  }

  addClick() {
    this.selectedDataGridItem = new MasterReason();
    this.selectedDataGridItem.StatusCode = MasterStatus.Active;
    this.Mode = 'ADD';
    this.loadMasterData();
  }

  editClick() {
    this.Mode = 'EDIT';
    this.onDoubleClick(this.selectedData);
  }

  onDoubleClick(rowData: MasterReason) {
    if (rowData != null) {
      this.selectedDataGridItem = Object.assign({}, rowData);
      this.Mode = 'EDIT';
      this.loadMasterData();
      console.log(this.Mode);
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

          let req = new SaveReasonRequest();

          req.Result = new MasterReason();
          req.Result = this.selectedData;
          
          req.SaveType = AppConfig.SaveType_Delete;

          this.apiService.postData("SaveReason", req).subscribe((data: ServiceReponse) => {
            if (data.SuccessCode == 1) {
              this.sessionService.showSuccess("Reason deleted sucessfully");
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

  submitClick(isValid: boolean) {

    this.submitAttempt = true;

    if (isValid) {

      let req = new SaveReasonRequest();
      req.Result = this.selectedDataGridItem;

      console.log(req);

      if (this.Mode == 'ADD') {
        req.SaveType = AppConfig.SaveType_Insert
      }
      else {
        req.SaveType = AppConfig.SaveType_Update
      }

      this.apiService.postData("SaveReason", req).subscribe((data: ServiceReponse) => {
        if (data.SuccessCode == 1) {

          if (this.Mode == 'ADD') {
            this.sessionService.showSuccess("Reason added successfully");
          }

          else if (this.Mode == 'EDIT') {
            this.sessionService.showSuccess("Reason updated successfully");
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






