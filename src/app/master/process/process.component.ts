import { Component, OnInit } from '@angular/core';
import { AppConfig, MasterStatus} from '../../const/app.config';
import { WebApiService } from "../../service/webapi.service";
import { Status, ProcessInfo, Master_UOM, Master_Item } from "../../model/shared.model";
import { SessionService } from "../../service/session.service";
import { CommonService } from "../../service/common.service";
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../common/confirmdialog.component';
import { ProcessGetAllByCorpIDRequest, SaveProcessRequest } from '../../model/request.model';
import { ProcessGetAllByCorpIDResponse, ServiceReponse } from '../../model/response.model';

@Component({
  templateUrl: './process.component.html',
  styleUrls: ['./process.component.scss']
})

export class ProcessComponent implements OnInit {

  public submitAttempt: boolean;
  public selectedDataGridItem: ProcessInfo;
  public selectedData: ProcessInfo;
  public dataGridList: ProcessInfo[];
  public UOMResultList: Master_UOM[];
  public ItemResultList: Master_Item[];
  public cols: any[];

  public Mode: string;
  
  public StatusList: Status[];

  public FormColumnsWidth : number;

  constructor(public dialog: MatDialog, public sessionService: SessionService, private apiService: WebApiService,
    public commonService: CommonService) {
  
    this.FormColumnsWidth = 600;
    this.UOMResultList = [];
    this.ItemResultList = [];
  }

  ngOnInit() {
    
    this.Mode = 'HOME';

    this.loadDataGrid();

    this.cols = [
      { field: 'ProcessName', header: 'Process', width: '24%', align: 'left', wrap: 'break-word' },
      { field: 'InputUOMDescription', header: 'Input UOM', width: '15%', align: 'left', wrap: 'break-word' },
      { field: 'OutputUOMDescription', header: 'Output UOM', width: '15%', align: 'left', wrap: 'break-word' },
      { field: 'CategoryName', header: 'Category', width: '20%', align: 'left', wrap: 'break-word' },
      { field: 'ItemName', header: 'Dependent Item', width: '16%', align: 'left', wrap: 'break-word' },
      { field: 'StatusMessage', header: 'Status', width: '10%', align: 'left', wrap: 'break-word' }
    ];

  }
  
  loadDataGrid() {

    let req = new ProcessGetAllByCorpIDRequest();
    this.apiService.postData("ProcessGetAllByCorpID", req).subscribe((data: ProcessGetAllByCorpIDResponse) => {
      if (data.SuccessCode == 1) {
        if (this.commonService.getLengthNA(data.ResultList) > 0) {
          this.dataGridList = data.ResultList;
        }
      }
      else {
        this.sessionService.showError(data.ErrorMessage);
      }
    });

  }

    
  loadMasterData()
  {

      this.apiService.postData("ProcessGetAllByCorpID", null).subscribe((data: ProcessGetAllByCorpIDResponse) => {
        if (data.SuccessCode == 1) {
          if (this.commonService.getLengthNA(data.UOMResult) && this.commonService.getLengthNA(data.ItemResult) > 0) {
            this.UOMResultList = data.UOMResult;
            this.ItemResultList = data.ItemResult;
          }
        }
        else {
          this.sessionService.showError(data.ErrorMessage);
        }
      });
 

    if (this.Mode == 'ADD') {
        this.StatusList = this.sessionService.ActiveStatusList;
    }
    else
    {
      this.StatusList = this.sessionService.StatusList;
    }

    this.sessionService.scrollAdjust();
  }

  addClick() {
    this.selectedDataGridItem = new ProcessInfo();
    this.selectedDataGridItem.StatusCode = MasterStatus.Active;
    this.Mode = 'ADD';
    this.loadMasterData();
  }

  editClick() {
      this.onDoubleClick(this.selectedData);
  }

  onDoubleClick(rowData: ProcessInfo) {
    if (rowData != null) {
      this.selectedDataGridItem = Object.assign({}, rowData);
      this.Mode = 'EDIT';
      this.loadMasterData();
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

          let req = new SaveProcessRequest();

          req.ResultList = new ProcessInfo();

          req.ResultList.ProcessID = this.selectedData.ProcessID;
          req.SaveType = AppConfig.SaveType_Delete;

          this.apiService.postData("SaveProcess", req).subscribe((data: ServiceReponse) => {
            if (data.SuccessCode == 1) {
              this.sessionService.showSuccess("Process deleted sucessfully");
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

      let req = new SaveProcessRequest();
      req.ResultList = this.selectedDataGridItem;

      if (this.Mode == 'ADD') {
        req.SaveType = AppConfig.SaveType_Insert
      }
      else {
        req.SaveType = AppConfig.SaveType_Update
      }

      this.apiService.postData("SaveProcess", req).subscribe((data: ServiceReponse) => {
        if (data.SuccessCode == 1) {

          if (this.Mode == 'ADD') {
            this.sessionService.showSuccess("Process added successfully");
          }

          else if (this.Mode == 'EDIT') {
            this.sessionService.showSuccess("Process updated successfully");
          }

          this.RefreshClick();
          this.Mode = 'HOME';
        }
        else {
          this.sessionService.showError(data.ErrorMessage);
        }
      });

    }
    else {
      this.sessionService.showError('Some mandatory informations are missing, please check');
      return;
    }

  }

  finishSave()
  {

    this.RefreshClick();
    this.Mode = 'HOME';

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

}
