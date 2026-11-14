import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { AppConfig, MasterStatus } from '../../const/app.config';
import { WebApiService } from "../../service/webapi.service";
import { SizeInfo, Status } from "../../model/shared.model";
import { SessionService } from "../../service/session.service";
import { CommonService } from "../../service/common.service";
import { MatDialog } from '@angular/material/dialog';
import { SizeGetAllByCorpIDResponse, ServiceReponse, SaveReponse } from '../../model/response.model';
import { SizeGetAllRequest, SaveSizeRequest } from '../../model/request.model';
import { ConfirmDialogComponent } from '../../common/confirmdialog.component';

@Component({
  selector: 'custom-size',
  templateUrl: './customsize.component.html',
  styleUrls: ['./customsize.component.css']
})

export class CustomSizeComponent implements OnInit {

  @Input('selectedSize')  selectedDataGridItem: SizeInfo;
  @Input('Mode') Mode: string;
  
  public StatusList: Status[];
  public submitAttempt: boolean;

  @Output() public cancelClicked : EventEmitter<any> = new EventEmitter();
  @Output() public saveCompleted : EventEmitter<any> = new EventEmitter();

  @ViewChild('SizeName') SizeName:ElementRef; 
  
  constructor(public dialog: MatDialog, public sessionService: SessionService, private apiService: WebApiService,
    public commonService: CommonService) {

  }

  ngOnInit() {
    
    this.StatusList = this.sessionService.StatusList;
    this.loadMasterData();
  }

  ngAfterViewInit()
  {
     

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
    this.SizeName.nativeElement.focus();
  }

  
  SubmitClick(isValid: boolean) {

    this.submitAttempt = true;

    if (isValid) {

      let req = new SaveSizeRequest();
      req.ResultList = this.selectedDataGridItem;

      if (this.Mode == 'ADD') {
        req.SaveType = AppConfig.SaveType_Insert
      }
      else {
        req.SaveType = AppConfig.SaveType_Update
      }

      this.apiService.postData("SaveSize", req).subscribe((data: SaveReponse) => {
        if (data.SuccessCode == 1) {

          if (this.Mode == 'ADD') {
            this.sessionService.showSuccess("Size added successfully");
          }

          else if (this.Mode == 'EDIT') {
            this.sessionService.showSuccess("Size updated successfully");
          }
         
          console.log(data);
          this.selectedDataGridItem.SizeID = data.ID;
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
    this.Mode = 'HOME';
    this.submitAttempt = false;
    this.selectedDataGridItem = null;
    this.cancelClicked.emit();
  }

}
