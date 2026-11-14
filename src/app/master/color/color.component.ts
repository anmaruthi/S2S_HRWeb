import { Component, OnInit } from '@angular/core';
import { AppConfig, MasterStatus } from '../../const/app.config';
import { WebApiService } from "../../service/webapi.service";
import { Status, Master_Color_GetAll_ByCorpIDResult, MasterColor } from "../../model/shared.model";
import { SessionService } from "../../service/session.service";
import { CommonService } from "../../service/common.service";
import { MatDialog } from '@angular/material/dialog';
import { ServiceReponse, ColorGetByCorpIDResponse } from '../../model/response.model';
import { SaveColorRequest } from '../../model/request.model';
import { ConfirmDialogComponent } from '../../common/confirmdialog.component';

@Component({
  templateUrl: './color.component.html',
  styleUrls: ['./color.component.css']
})

export class ColorComponent implements OnInit {

    cols: any[];

    public selectedDataGridItem: MasterColor;
    public selectedData: MasterColor;
    public dataGridList: Master_Color_GetAll_ByCorpIDResult[];
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
      { field: 'ColorName', header: 'Color', width: '92%', align: 'left', wrap: 'break-word' },
      { field: 'StatusMessage', header: 'Status', width: '8%', align: 'left', wrap: 'break-word' }
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

    this.apiService.postData("ColorGetByCorpID", null).subscribe((data: ColorGetByCorpIDResponse) => {
      if (data.SuccessCode == 1) {
        this.dataGridList = data.ResultList;
      }
      else
      {
        this.sessionService.showError(data.ErrorMessage);
      }
    });    


  }

  loadMasterData(){
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
    this.selectedDataGridItem = new MasterColor();
    this.selectedDataGridItem.StatusCode = MasterStatus.Active;
    this.Mode = 'ADD';
    this.loadMasterData();
  }

  editClick() {
    this.onDoubleClick(this.selectedData);
  }

  onDoubleClick(rowData: MasterColor) {
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

          let req = new SaveColorRequest();

          req.Result = new MasterColor();

          req.Result.ColorID = this.selectedData.ColorID;
          req.SaveType = AppConfig.SaveType_Delete;

          this.apiService.postData("SaveColor", req).subscribe((data: ServiceReponse) => {
            if (data.SuccessCode == 1) {
              this.sessionService.showSuccess("Color deleted sucessfully");
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

      let req = new SaveColorRequest();
      req.Result = this.selectedDataGridItem;

      if (this.Mode == 'ADD') {
        req.SaveType = AppConfig.SaveType_Insert
      }
      else {
        req.SaveType = AppConfig.SaveType_Update
      }

      this.apiService.postData("SaveColor", req).subscribe((data: ServiceReponse) => {
        if (data.SuccessCode == 1) {

          if (this.Mode == 'ADD') {
            this.sessionService.showSuccess("Color added successfully");
          }

          else if (this.Mode == 'EDIT') {
            this.sessionService.showSuccess("Color updated successfully");
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

  finishSave()
  {
    this.refreshClick();
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

}
