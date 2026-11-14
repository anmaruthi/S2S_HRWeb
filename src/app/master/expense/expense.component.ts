import { Component, OnInit } from '@angular/core';
import { AppConfig, MasterStatus } from '../../const/app.config';
import { WebApiService } from "../../service/webapi.service";
import { Status, ExpenseInfo } from "../../model/shared.model";
import { SessionService } from "../../service/session.service";
import { CommonService } from "../../service/common.service";
import { MatDialog } from '@angular/material/dialog';
import { ServiceReponse, ExpenseGetAllByCorpIDResponse } from '../../model/response.model';
import { SaveExpenseRequest } from '../../model/request.model';
import { ConfirmDialogComponent } from '../../common/confirmdialog.component';

@Component({
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.scss']
})

export class ExpenseComponent implements OnInit {

  cols: any[];

  public selectedDataGridItem: ExpenseInfo;
  public selectedData: ExpenseInfo;
  public dataGridList: ExpenseInfo[];

  public Mode: string;
  
  public StatusList: Status[];
  public submitAttempt: boolean;

  public FormColumnsWidth : number;

  constructor(public dialog: MatDialog, public sessionService: SessionService, private apiService: WebApiService,
    public commonService: CommonService) {
        this.FormColumnsWidth = 600;
  }

  ngOnInit() {
    
    this.Mode = 'HOME';
    this.submitAttempt = false;
    this.loadDataGrid();

    this.cols = [
      { field: 'ExpenseName', header: 'Expense Name', width: '92%', align: 'left', wrap: 'break-word' },
      { field: 'StatusMessage', header: 'Status', width: '8%', align: 'left', wrap: 'break-word' }
    ];

  }

  
  loadDataGrid() {

    this.apiService.postData("ExpenseGetAllByCorpID", null).subscribe((data: ExpenseGetAllByCorpIDResponse) => {
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
    this.selectedDataGridItem = new ExpenseInfo();
    this.selectedDataGridItem.StatusCode = MasterStatus.Active;
    this.Mode = 'ADD';
    this.loadMasterData();
  }

  editClick() {
      this.onDoubleClick(this.selectedData);
  }

  onDoubleClick(rowData: ExpenseInfo) {
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

          let req = new SaveExpenseRequest();
          req.Result = new ExpenseInfo();
          req.Result.ExpenseID = this.selectedData.ExpenseID;
          req.SaveType = AppConfig.SaveType_Delete;

          this.apiService.postData("SaveExpense", req).subscribe((data: ServiceReponse) => {
            if (data.SuccessCode == 1) {
              this.sessionService.showSuccess("Expense deleted sucessfully");
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

      let req = new SaveExpenseRequest();
      req.Result = this.selectedDataGridItem;
      req.SaveType = this.Mode == 'ADD' ?  AppConfig.SaveType_Insert :  AppConfig.SaveType_Update

      this.apiService.postData("SaveExpense", req).subscribe((data: ServiceReponse) => {
        if (data.SuccessCode == 1) {
          this.sessionService.showSuccess(this.Mode == 'ADD' ? "Expense added successfully" : "Expense updated successfully");
          this.RefreshClick();
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

  finishSaved()
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