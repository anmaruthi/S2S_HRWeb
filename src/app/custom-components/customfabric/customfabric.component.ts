import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { AppConfig, MasterStatus } from '../../const/app.config';
import { WebApiService } from "../../service/webapi.service";
import { FabricInfo, Status } from "../../model/shared.model";
import { SessionService } from "../../service/session.service";
import { CommonService } from "../../service/common.service";
import { MatDialog } from '@angular/material/dialog';
import { FabricGetAllByCorpIDResponse, ServiceReponse, SaveReponse } from '../../model/response.model';
import { FabricGetAllRequest, SaveFabricRequest } from '../../model/request.model';
import { ConfirmDialogComponent } from '../../common/confirmdialog.component';

@Component({
  selector: 'custom-fabric',
  templateUrl: './customfabric.component.html',
  styleUrls: ['./customfabric.component.css']
})

export class CustomFabricComponent implements OnInit {

  @Input('selectedFabricType')  selectedDataGridItem: FabricInfo;
  @Input('Mode')  Mode: string;
  
  public StatusList: Status[];
  public submitAttempt: boolean;

  @Output() public cancelClicked : EventEmitter<any> = new EventEmitter();
  @Output() public saveCompleted : EventEmitter<any> = new EventEmitter();

  @ViewChild('FabricName') FabricName:ElementRef; 

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
    this.FabricName.nativeElement.focus();
  }
  
  SubmitClick(isValid: boolean) {

    this.submitAttempt = true;

    if (isValid) {

      let req = new SaveFabricRequest();
      req.ResultList = this.selectedDataGridItem;

      if (this.Mode == 'ADD') {
        req.SaveType = AppConfig.SaveType_Insert
      }
      else {
        req.SaveType = AppConfig.SaveType_Update
      }

      this.apiService.postData("SaveFabric", req).subscribe((data: SaveReponse) => {
        if (data.SuccessCode == 1) {

          if (this.Mode == 'ADD') {
            this.sessionService.showSuccess("Fabric added successfully");
          }

          else if (this.Mode == 'EDIT') {
            this.sessionService.showSuccess("Fabric updated successfully");
          }
         
          console.log(data);
          this.selectedDataGridItem.FabricID = data.ID;
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
