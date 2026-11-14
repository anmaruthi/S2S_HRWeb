import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { AppConfig, MasterStatus} from '../../const/app.config';
import { WebApiService } from "../../service/webapi.service";
import { Status, State, Country, BuyerMasterInfo, ConsigneeMasterInfo } from "../../model/shared.model";
import { SessionService } from "../../service/session.service";
import { CommonService } from "../../service/common.service";
import { MatDialog } from '@angular/material/dialog';
import { ServiceReponse, Master_BuyerGetByCorpIDResponse, SaveReponse } from '../../model/response.model';
import { SaveBuyerRequest, SaveConsigneeRequest } from '../../model/request.model';
import { ConfirmDialogComponent } from '../../common/confirmdialog.component';

@Component({
  selector: 'custom-consignee',
  templateUrl: './customconsignee.component.html',
  styleUrls: ['./customconsignee.component.scss']
})

export class CustomConsigneeComponent implements OnInit {

  
  @Input('selectedConsigneeItem') selectedConsigneeItem: ConsigneeMasterInfo;
  @Input('Mode') Mode: string;
  
  public submitAttempt: boolean;
  public StatusList: Status[];
  public StateList: State[];
  public CountryList: Country[];
  public StateListFiltered: State[];
  public buyerList: BuyerMasterInfo[];
  public FormColumnsWidth : number;
  
  public alsoBuyer:boolean;

  @Output() public cancelClicked : EventEmitter<any> = new EventEmitter();
  @Output() public saveCompleted : EventEmitter<any> = new EventEmitter();
  
  @ViewChild('ConsigneeName') ConsigneeName:ElementRef; 

  constructor(public dialog: MatDialog, public sessionService: SessionService, private apiService: WebApiService,
    public commonService: CommonService) {
  

  }

  ngOnInit() {
    
    this.StateList = [];
    this.StateListFiltered = [];
    this.CountryList = [];
    this.StatusList = this.sessionService.StatusList;

    this.loadMasterData(this.Mode);
  }

  ngAfterViewInit()
  {
      console.log(this.Mode);
      console.log(this.selectedConsigneeItem);

      // if (this.Mode == 'ADD') {
      //   this.StatusList = this.sessionService.ActiveStatusList;
      // }
      // else
      // {
      //   this.StatusList = this.sessionService.StatusList;
      // }

      this.FormColumnsWidth = 600;
     

  }

  onCountrySelect() {

    this.StateListFiltered = [];

    if (this.commonService.getLengthNA(this.selectedConsigneeItem.CountryCode) > 0) {
        if (this.commonService.getLength(this.StateList) > 0) 
        {
          this.StateListFiltered = this.StateList.filter(itm => itm.CountryCode == this.selectedConsigneeItem.CountryCode);
        }
    }
    else
    {
      this.selectedConsigneeItem.StateID = null;
    }

  }

  
  loadMasterData(Mode: string)
  {

    this.CountryList = this.sessionService.CountryList;
    this.StateList = this.sessionService.StateList;

    if (Mode != 'ADD') {
      this.onCountrySelect();
    }

    this.Mode = Mode;

      this.apiService.postData("Master_BuyerGetByCorpID", null).subscribe((data: Master_BuyerGetByCorpIDResponse) => {
      if (data.SuccessCode == 1) {
      
          this.buyerList = data.ResultList;
           
          let tmp = this.buyerList.find(d=> d.BuyerID == this.selectedConsigneeItem.BuyerID);

          if (tmp != null && tmp.BuyerName == this.selectedConsigneeItem.ConsigneeName)
          {
              this.alsoBuyer = true;
          }
          
          this.Mode = Mode;
        }
        else
        {
          this.sessionService.showError(data.ErrorMessage);
          this.cancelClick();
        }
      });

    //this.sessionService.scrollAdjust();
    this.ConsigneeName.nativeElement.focus();
  }

  SubmitClick(isValid: boolean) {

    this.submitAttempt = true;

    if (isValid) {

      if (this.selectedConsigneeItem.CountryCode == 'IND')
      {
        if (this.commonService.getLengthNA(this.selectedConsigneeItem.Pincode) != 6)
        {
            this.sessionService.showError("Invalid pincode");
            return;
        }
      }

      let req = new SaveConsigneeRequest();
      req.Result = this.selectedConsigneeItem;  
      req.alsoBuyer = this.alsoBuyer;   
      req.SaveType = this.Mode == 'ADD' ? AppConfig.SaveType_Insert : AppConfig.SaveType_Update;

      this.apiService.postData("SaveConsignee", req).subscribe((data: SaveReponse) => {
        if (data.SuccessCode == 1) {
          this.sessionService.showSuccess(this.Mode == 'ADD' ? "Consignee Master added successfully" : "Consignee Master updated successfully");

          console.log(data);
          this.selectedConsigneeItem.ConsigneeID = data.ID;

          if (this.selectedConsigneeItem.ConsigneeName == this.selectedConsigneeItem.BuyerName)
          {
            this.selectedConsigneeItem.BuyerID = data.ID0;
            this.selectedConsigneeItem.AgentID = data.ID00;
          }
         
          this.saveCompleted.emit(this.selectedConsigneeItem);

          //this.Mode = 'HOME';
          //this.RefreshClick();       
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
    //this.Mode = 'HOME';
    this.submitAttempt = false;
    this.selectedConsigneeItem = null;
    this.cancelClicked.emit();
  }

  onBuyerCheckbox()
  {
    if (this.alsoBuyer == true)
    {
        this.selectedConsigneeItem.BuyerID = -1;
        this.selectedConsigneeItem.BuyerName = this.selectedConsigneeItem.ConsigneeName;
    }
  }

}
