import { Component, OnInit } from '@angular/core';
import { AppConfig, MasterStatus } from '../../const/app.config';
import { WebApiService } from "../../service/webapi.service";
import { TaxmasterInfo, Status } from "../../model/shared.model";
import { SessionService } from "../../service/session.service";
import { CommonService } from "../../service/common.service";
import { MatDialog } from '@angular/material/dialog';
import { TaxMasterGetAllByCorpIDResponse, ServiceReponse } from '../../model/response.model';
import { TaxMasterGetAllRequest, SaveTaxMasterRequest } from '../../model/request.model';
//import { SettingDialogComponent } from '../settings/settingdialog.component';
import { ConfirmDialogComponent } from '../../common/confirmdialog.component';

@Component({
  
  templateUrl: './taxmaster.component.html',
  styleUrls: ['./taxmaster.component.scss']
})
export class TaxmasterComponent implements OnInit {

  cols: any[];
  public selectedDataGridItem: TaxmasterInfo;
  public selectedData: TaxmasterInfo;
  public dataGridList: TaxmasterInfo[];
  

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
      { field: 'TaxCode', header: 'Tax Code', width: '10%', align: 'left', wrap: 'break-word' },
      { field: 'TaxName', header: 'Tax Name', width: '12%', align: 'left', wrap: 'break-word' },
      {field: 'Description', header: 'Description', width: '22%', align: 'left', wrap: 'break-word'},
      {field: 'ApplyOtherState', header: 'OtherState', width: '22%', align: 'left', wrap: 'break-word'},
      {field: 'ApplyInternational', header: 'International', width: '22%', align: 'left', wrap: 'break-word'},
      { field: 'StatusMessage', header: 'Status', width: '12%', align: 'left', wrap: 'break-word' }
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

    let req = new TaxMasterGetAllRequest();
    this.apiService.postData("TaxGetByCorpID", req).subscribe((data: TaxMasterGetAllByCorpIDResponse) => {
      if (data.SuccessCode == 1) {
        this.dataGridList = data.ResultList;
        console.log(this.dataGridList);
        //this.categoryList = data.CategoryList;
      }
      else
      {
        this.sessionService.showError(data.ErrorMessage);
      }
    });    

  }

  loadMasterData(){



    if (this.Mode == 'ADD'){
      this.StatusList = this.sessionService.StatusListAll.filter(x=> x.StatusCode==10);
    }
    else{
      this.StatusList = this.sessionService.StatusListAll;
    }

    this.sessionService.scrollAdjust();
  }

  addClick() {
    this.selectedDataGridItem = new TaxmasterInfo();
    this.selectedDataGridItem.StatusCode = MasterStatus.Active;
    this.Mode = 'ADD';
    this.loadMasterData();
  }

  editClick() {
    this.Mode = 'EDIT';
    this.onDoubleClick(this.selectedData);
  }

  onDoubleClick(rowData: TaxmasterInfo) {
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

          let req = new SaveTaxMasterRequest();
          req.Result = this.selectedData;
          req.SaveType = AppConfig.SaveType_Delete;

          this.apiService.postData("SaveTaxMaster", req).subscribe((data: ServiceReponse) => {
            if (data.SuccessCode == 1) {
              this.sessionService.showSuccess("Tax Master deleted sucessfully");
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

      let req = new SaveTaxMasterRequest();
      req.Result = this.selectedDataGridItem;

      if (this.Mode == 'ADD') {
        req.SaveType = AppConfig.SaveType_Insert
      }
      else {
        req.SaveType = AppConfig.SaveType_Update
      }

      this.apiService.postData("SaveTaxMaster", req).subscribe((data: ServiceReponse) => {
        if (data.SuccessCode == 1) {

          if (this.Mode == 'ADD') {
            this.sessionService.showSuccess("Tax Master added successfully");
          }

          else if (this.Mode == 'EDIT') {
            this.sessionService.showSuccess("Tax Master updated successfully");
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



