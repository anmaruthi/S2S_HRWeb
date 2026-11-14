import { Component, OnInit } from '@angular/core';
import { AppConfig, MasterStatus } from '../../const/app.config';
import { WebApiService } from "../../service/webapi.service";
import { EmployeeType , Status, EmployeeCategory } from "../../model/shared.model";
import { SessionService } from "../../service/session.service";
import { CommonService } from "../../service/common.service";
import { MatDialog } from '@angular/material/dialog';
import { EmployeeTypeGetAllByCorpIDResponse, ServiceReponse } from '../../model/response.model';
import { EmployeeTypeGetAllRequest, SaveEmployeeTypeRequest } from '../../model/request.model';
//import { SettingDialogComponent } from '../settings/settingdialog.component';
import { ConfirmDialogComponent } from '../../common/confirmdialog.component';


@Component({
  selector: 'app-emptype',
  templateUrl: './emptype.component.html',
  styleUrls: ['./emptype.component.scss']
})
export class EmptypeComponent implements OnInit {

  cols: any[];

  public selectedDataGridItem:EmployeeType ;
  public selectedData:EmployeeType ;
  public dataGridList:  EmployeeType [];
  public categoryList:  EmployeeType [];

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
      { field: 'TypeCode', header: 'Employee Type Code', width: '35%', align: 'left', wrap: 'break-word' },
      { field: 'TypeName', header: 'Employee Type Name', width: '35%', align: 'left', wrap: 'break-word' },
      { field: 'StatusMessage', header: 'Status', width: '30%', align: 'left', wrap: 'break-word' }
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

    let req = new EmployeeTypeGetAllRequest();
    this.apiService.postData("EmployeeTypeGetByCorpID", req).subscribe((data: EmployeeTypeGetAllByCorpIDResponse) => {
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
  this.selectedDataGridItem = new EmployeeType();
    this.selectedDataGridItem.StatusCode = MasterStatus.Active;
    this.Mode = 'ADD';
    this.loadMasterData();
  }

  editClick() {
    this.Mode = 'EDIT';
    this.onDoubleClick(this.selectedData);
  }

  onDoubleClick(rowData: EmployeeType) {
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

          let req = new SaveEmployeeTypeRequest();

          req.Result = new EmployeeType();

          req.Result = this.selectedData;
          req.SaveType = AppConfig.SaveType_Delete;

          this.apiService.postData("SaveEmployeeType", req).subscribe((data: ServiceReponse) => {
            if (data.SuccessCode == 1) {
              this.sessionService.showSuccess("Employee Type deleted sucessfully");
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

      let req = new SaveEmployeeTypeRequest();
      req.Result = this.selectedDataGridItem;

      if (this.Mode == 'ADD') {
        req.SaveType = AppConfig.SaveType_Insert
      }
      else {
        req.SaveType = AppConfig.SaveType_Update
      }

      this.apiService.postData("SaveEmployeeType", req).subscribe((data: ServiceReponse) => {
        if (data.SuccessCode == 1) {

          if (this.Mode == 'ADD') {
            this.sessionService.showSuccess("Employee Type added successfully");
          }

          else if (this.Mode == 'EDIT') {
            this.sessionService.showSuccess("Employee Type updated successfully");
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


