import { EmployeeDepartment } from './../../model/shared.model';
import { Component, OnInit } from '@angular/core';
import { AppConfig, MasterStatus } from '../../const/app.config';
import { WebApiService } from "../../service/webapi.service";
import { EmployeeDesignation, Status, EmployeeCategory } from "../../model/shared.model";
import { SessionService } from "../../service/session.service";
import { CommonService } from "../../service/common.service";
import { MatDialog } from '@angular/material/dialog';
import { EmployeeDesignationGetAllByCorpIDResponse , EmployeeDepartmentGetAllByCorpIDResponse, ServiceReponse } from '../../model/response.model';
import { EmployeeDesignationGetAllRequest, SaveEmployeeDesignationRequest  } from '../../model/request.model';
//import { SettingDialogComponent } from '../settings/settingdialog.component';
import { ConfirmDialogComponent } from '../../common/confirmdialog.component';

@Component({
  selector: 'app-empdesig',
  templateUrl: './empdesig.component.html',
  styleUrls: ['./empdesig.component.scss']
})
export class EmpdesigComponent implements OnInit {

  cols: any[];

  public selectedDataGridItem: EmployeeDesignation;
  public selectedData: EmployeeDesignation;
  public dataGridList: EmployeeDesignation[];
  public departmentList: EmployeeDepartment[];
  public dataGridListAll: EmployeeDesignation[];

  public submitAttempt: boolean;
    

  public Mode: string;
  
  public StatusList: Status[];
  

  public FormColumnsWidth: number;
  
  public selectedDepartment:EmployeeDepartment;


  constructor(public dialog: MatDialog, public sessionService: SessionService, private apiService: WebApiService,
    public commonService: CommonService) { 

      this.FormColumnsWidth = 600;
    }

  ngOnInit() {

    this.Mode = 'HOME';
    this.submitAttempt = false;
    this.selectedDepartment=new EmployeeDepartment();
    this.loadDataGrid();

    this.cols = [
      { field: 'DesignationName', header: 'Designation Name', width: '35%', align: 'left', wrap: 'break-word' },
      { field: 'DesignationShortName', header: 'Short Designation', width: '20%', align: 'left', wrap: 'break-word' },
      { field: 'DepartmentName', header: 'Department Name', width: '30%', align: 'left', wrap: 'break-word' },
      { field: 'StatusMessage', header: 'Status', width: '15%', align: 'left', wrap: 'break-word' }
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

    let req = new EmployeeDesignationGetAllRequest();
    this.departmentList = new Array();

    this.apiService.postData("EmployeeDesignationGetByCorpID", req).subscribe((data: EmployeeDesignationGetAllByCorpIDResponse) => {
      if (data.SuccessCode == 1) {
        this.dataGridListAll = data.ResultList;
        this.dataGridList = data.ResultList;
        this.departmentList = data.DepartmentList;
      }
      else
      {
        this.sessionService.showError(data.ErrorMessage);
      }
    });    

  }

  loadMasterData()
  {
    if (this.Mode == 'ADD'){
      this.StatusList = this.sessionService.StatusListAll.filter(x=> x.StatusCode==10);
    }
    else{
      this.StatusList = this.sessionService.StatusListAll;
    }

    this.sessionService.scrollAdjust();
  }

  addClick() {
    this.selectedDataGridItem = new EmployeeDesignation();
    this.selectedDataGridItem.StatusCode = MasterStatus.Active;
    this.selectedDataGridItem.DepartmentID = this.selectedDepartment.DepartmentID;
    this.Mode = 'ADD';
    this.loadMasterData();
  }

  editClick() {
    this.Mode = 'EDIT';
    this.onDoubleClick(this.selectedData);
  }

  onDoubleClick(rowData: EmployeeDesignation) {
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

          let req = new SaveEmployeeDesignationRequest();

          req.Result = new EmployeeDesignation();

          req.Result= this.selectedData;
          req.SaveType = AppConfig.SaveType_Delete;

          this.apiService.postData("SaveEmployeeDesignation", req).subscribe((data: ServiceReponse) => {
            if (data.SuccessCode == 1) {
              this.sessionService.showSuccess("Employee Designation deleted sucessfully");
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

  
  SubmitClick(isValid: boolean) {

    this.submitAttempt = true;

    if (isValid) {

      let req = new SaveEmployeeDesignationRequest ();
      req.Result = this.selectedDataGridItem;

      if (this.Mode == 'ADD') {
        req.SaveType = AppConfig.SaveType_Insert
      }
      else {
        req.SaveType = AppConfig.SaveType_Update
      }

      this.apiService.postData("SaveEmployeeDesignation", req).subscribe((data: ServiceReponse) => {
        if (data.SuccessCode == 1) {

          if (this.Mode == 'ADD') {
            this.sessionService.showSuccess("Employee Designation added successfully");
          }

          else if (this.Mode == 'EDIT') {
            this.sessionService.showSuccess("Employee Designation updated successfully");
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

  onDepartmentChange(){
    console.log('inside method');
    if(this.selectedDepartment != undefined){
      this.dataGridList = this.dataGridListAll.filter(x=>x.DepartmentID == this.selectedDepartment.DepartmentID)
    }
      
    console.log(this.dataGridList);
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
