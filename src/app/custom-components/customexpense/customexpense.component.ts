import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { AppConfig, MasterStatus } from '../../const/app.config';
import { WebApiService } from "../../service/webapi.service";
import { Status, ExpenseInfo } from "../../model/shared.model";
import { SessionService } from "../../service/session.service";
import { CommonService } from "../../service/common.service";
import { MatDialog } from '@angular/material/dialog';
import { ServiceReponse, ExpenseGetAllByCorpIDResponse, SaveReponse } from '../../model/response.model';
import { SaveExpenseRequest } from '../../model/request.model';
import { ConfirmDialogComponent } from '../../common/confirmdialog.component';

@Component({
  selector: 'custom-expense',
  templateUrl: './customexpense.component.html',
  styleUrls: ['./customexpense.component.scss']
})

export class CustomExpenseComponent implements OnInit {

  @Input('selectedExpense') selectedDataGridItem: ExpenseInfo;
  @Input('Mode') Mode: string;
  
  public StatusList: Status[];
  public submitAttempt: boolean;

  @Output() public cancelClicked : EventEmitter<any> = new EventEmitter();
  @Output() public saveCompleted : EventEmitter<any> = new EventEmitter();

  @ViewChild('ExpenseName') ExpenseName:ElementRef; 

  constructor(public dialog: MatDialog, public sessionService: SessionService, private apiService: WebApiService,
    public commonService: CommonService) {

    }

  ngOnInit() {  
    this.submitAttempt = false;
    this.StatusList = this.sessionService.StatusList;
    this.loadMasterData();
  }


  loadMasterData(){
    // if (this.Mode == 'ADD') {
    //     this.StatusList = this.sessionService.ActiveStatusList;
    // }
    // else
    // {
    //   this.StatusList = this.sessionService.StatusList;
    // }
    
    //this.sessionService.scrollAdjust();
    this.ExpenseName.nativeElement.focus();
  }


 


  SubmitClick(isValid: boolean) {

    this.submitAttempt = true;

    if (isValid) {

      let req = new SaveExpenseRequest();
      req.Result = this.selectedDataGridItem;
      req.SaveType = this.Mode == 'ADD' ?  AppConfig.SaveType_Insert :  AppConfig.SaveType_Update

      this.apiService.postData("SaveExpense", req).subscribe((data: SaveReponse) => {
        if (data.SuccessCode == 1) {
          this.sessionService.showSuccess(this.Mode == 'ADD' ? "Expense added successfully" : "Expense updated successfully");

          console.log(data);
          this.selectedDataGridItem.ExpenseID = data.ID;
          this.saveCompleted.emit(this.selectedDataGridItem);
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
    this.submitAttempt = false;
    this.selectedDataGridItem = null;
    this.cancelClicked.emit();
  }


}