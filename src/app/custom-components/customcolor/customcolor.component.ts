import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit, ViewChild, ElementRef   } from '@angular/core';
import { AppConfig, MasterStatus } from '../../const/app.config';
import { WebApiService } from "../../service/webapi.service";
import { Status, Master_Color_GetAll_ByCorpIDResult, MasterColor } from "../../model/shared.model";
import { SessionService } from "../../service/session.service";
import { CommonService } from "../../service/common.service";
import { MatDialog } from '@angular/material/dialog';
import { ServiceReponse, ColorGetByCorpIDResponse, SaveReponse } from '../../model/response.model';
import { SaveColorRequest } from '../../model/request.model';
import { ConfirmDialogComponent } from '../../common/confirmdialog.component';

@Component({
  selector: 'custom-color',
  templateUrl: './customcolor.component.html',
  styleUrls: ['./customcolor.component.css']
})

export class CustomColorComponent implements OnInit {

    @Input('selectedColor')  selectedDataGridItem: MasterColor;
    @Input('Mode') Mode: string;
    public StatusList: Status[];
    public submitAttempt: boolean;

    @Output() public cancelClicked : EventEmitter<any> = new EventEmitter();
    @Output() public saveCompleted : EventEmitter<any> = new EventEmitter();

    @ViewChild('ColorName') colorName:ElementRef;

  constructor(public dialog: MatDialog, public sessionService: SessionService, private apiService: WebApiService,
    public commonService: CommonService) {

    }

  ngOnInit() {
    this.StatusList = this.sessionService.StatusList;
    this.submitAttempt = false;
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
    this.colorName.nativeElement.focus();
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

      this.apiService.postData("SaveColor", req).subscribe((data: SaveReponse) => {
        if (data.SuccessCode == 1) {

          if (this.Mode == 'ADD') {
            this.sessionService.showSuccess("Color added successfully");
          }

          else if (this.Mode == 'EDIT') {
            this.sessionService.showSuccess("Color updated successfully");
          }
          
          
          console.log(data);
          this.selectedDataGridItem.ColorID = data.ID;
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
