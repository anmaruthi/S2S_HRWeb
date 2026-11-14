import { Component, OnInit } from '@angular/core';
import { AppConfig, MasterStatus } from '../../const/app.config';
import { WebApiService } from "../../service/webapi.service";
import { ItemTypeInfo, Status, ItemCategoryInfo } from "../../model/shared.model";
import { SessionService } from "../../service/session.service";
import { CommonService } from "../../service/common.service";
import { MatDialog } from '@angular/material/dialog';
import { ItemCategoryGetAllByCorpIDResponse, ItemTypeGetAllBycorpIDResponse, ServiceReponse } from '../../model/response.model';
import { ItemTypeGetAllRequest, SaveItemTypeRequest } from '../../model/request.model';
//import { SettingDialogComponent } from '../settings/settingdialog.component';
import { ConfirmDialogComponent } from '../../common/confirmdialog.component';

@Component({
  templateUrl: './itemtype.component.html',
  styleUrls: ['./itemtype.component.css']
})

export class ItemTypeComponent implements OnInit {

  cols: any[];

  public selectedDataGridItem: ItemTypeInfo;
  public selectedData: ItemTypeInfo;
  public dataGridList: ItemTypeInfo[];
  public categoryList: ItemCategoryInfo[];

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
      { field: 'ItemTypeName', header: 'Material Type', width: '60%', align: 'left', wrap: 'break-word' },
      { field: 'ItemCategoryName', header: 'Material Category', width: '32%', align: 'left', wrap: 'break-word' },
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

    let req = new ItemTypeGetAllRequest();
    this.apiService.postData("ItemTypeGetByCorpID", req).subscribe((data: ItemTypeGetAllBycorpIDResponse) => {
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


    let req = new ItemTypeGetAllRequest();
    this.apiService.postData("ItemCategoryGetByCorpID", req).subscribe((data: ItemCategoryGetAllByCorpIDResponse) => {
      if (data.SuccessCode == 1) {
        this.categoryList = data.ResultList;
      }
      else
      {
        this.sessionService.showError(data.ErrorMessage);
      }
    });


    if (this.Mode == 'ADD'){
      this.StatusList = this.sessionService.StatusListAll.filter(x=> x.StatusCode==10);
    }
    else{
      this.StatusList = this.sessionService.StatusListAll;
    }

    this.sessionService.scrollAdjust();
  }

  addClick() {
    this.selectedDataGridItem = new ItemTypeInfo();
    this.selectedDataGridItem.StatusCode = MasterStatus.Active;
    this.Mode = 'ADD';
    this.loadMasterData();
  }

  editClick() {
    this.Mode = 'EDIT';
    this.onDoubleClick(this.selectedData);
  }

  onDoubleClick(rowData: ItemTypeInfo) {
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

          let req = new SaveItemTypeRequest();

          req.Result = new ItemTypeInfo();

          req.Result = this.selectedData;
          req.SaveType = AppConfig.SaveType_Delete;

          this.apiService.postData("SaveItemTypeMaster", req).subscribe((data: ServiceReponse) => {
            if (data.SuccessCode == 1) {
              this.sessionService.showSuccess("Material Type deleted sucessfully");
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

      let req = new SaveItemTypeRequest();
      req.Result = this.selectedDataGridItem;

      if (this.Mode == 'ADD') {
        req.SaveType = AppConfig.SaveType_Insert
      }
      else {
        req.SaveType = AppConfig.SaveType_Update
      }

      this.apiService.postData("SaveItemTypeMaster", req).subscribe((data: ServiceReponse) => {
        if (data.SuccessCode == 1) {

          if (this.Mode == 'ADD') {
            this.sessionService.showSuccess("Material Type added successfully");
          }

          else if (this.Mode == 'EDIT') {
            this.sessionService.showSuccess("Material Type updated successfully");
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
