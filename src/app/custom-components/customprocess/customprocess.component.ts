import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { AppConfig, MasterStatus} from '../../const/app.config';
import { WebApiService } from "../../service/webapi.service";
import { Status, ProcessInfo, Master_UOM, Master_Item } from "../../model/shared.model";
import { SessionService } from "../../service/session.service";
import { CommonService } from "../../service/common.service";
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../common/confirmdialog.component';
import { ProcessGetAllByCorpIDRequest, SaveProcessRequest } from '../../model/request.model';
import { ProcessGetAllByCorpIDResponse, ServiceReponse, SaveReponse } from '../../model/response.model';

@Component({
  selector: 'custom-process',
  templateUrl: './customprocess.component.html',
  styleUrls: ['./customprocess.component.scss']
})

export class CustomProcessComponent implements OnInit {

  public submitAttempt: boolean;
  @Input('selectedProcess')  selectedDataGridItem: ProcessInfo;
  public UOMResultList: Master_UOM[];
  public ItemResultList: Master_Item[];
  @Input('Mode')  Mode: string; 
  public StatusList: Status[];

  @Output() public cancelClicked : EventEmitter<any> = new EventEmitter();
  @Output() public saveCompleted : EventEmitter<any> = new EventEmitter();

  @ViewChild('ProcessName') ProcessName:ElementRef; 

  categoryList:string[];

  constructor(public dialog: MatDialog, public sessionService: SessionService, private apiService: WebApiService,
    public commonService: CommonService) {
  
  }

  ngOnInit() {
    
    this.UOMResultList = [];
    this.ItemResultList = [];
    this.StatusList = this.sessionService.StatusList;
    this.categoryList = ['PROCESS','PRODUCTION'];
    this.loadMasterData();
  }
  
    
  loadMasterData()
  {

      this.apiService.postData("ProcessGetAllByCorpID", null).subscribe((data: ProcessGetAllByCorpIDResponse) => {
        if (data.SuccessCode == 1) {
          if (this.commonService.getLengthNA(data.UOMResult) && this.commonService.getLengthNA(data.ItemResult) > 0) {
            this.UOMResultList = data.UOMResult;``
            this.ItemResultList = data.ItemResult;
          }
        }
        else {
          this.sessionService.showError(data.ErrorMessage);
        }
      });
 

    // if (this.Mode == 'ADD') {
    //     this.StatusList = this.sessionService.ActiveStatusList;
    // }
    // else
    // {
    //   this.StatusList = this.sessionService.StatusList;
    // }

    //this.sessionService.scrollAdjust();
    this.ProcessName.nativeElement.focus();
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

      if (req.ResultList.CategoryName != null)
      {
        req.ResultList.CategoryName = req.ResultList.CategoryName + '';
      }

      this.apiService.postData("SaveProcess", req).subscribe((data: SaveReponse) => {
        if (data.SuccessCode == 1) {

          if (this.Mode == 'ADD') {
            this.sessionService.showSuccess("Process added successfully");
          }

          else if (this.Mode == 'EDIT') {
            this.sessionService.showSuccess("Process updated successfully");
          }

          console.log(data);
          this.selectedDataGridItem.ProcessID = data.ID;
          this.saveCompleted.emit(this.selectedDataGridItem);

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

  cancelClick() {
    this.submitAttempt = false;
    this.selectedDataGridItem = null;
    this.cancelClicked.emit();
  }

 
 

}
