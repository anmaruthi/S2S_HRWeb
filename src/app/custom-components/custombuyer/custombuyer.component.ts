import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit, ViewChild, ElementRef  } from '@angular/core';
import { AppConfig, MasterStatus} from '../../const/app.config';
import { WebApiService } from "../../service/webapi.service";
import { Status, State, Country, BuyerMasterInfo, HouseMasterInfo, AgentMasterInfo } from "../../model/shared.model";
import { SessionService } from "../../service/session.service";
import { CommonService } from "../../service/common.service";
import { MatDialog } from '@angular/material/dialog';
import { MasterData_RegisterCorp_GetAllResponse, ServiceReponse, Master_BuyerGetByCorpIDResponse, SaveReponse, AgentGetByCorpIDResponse } from '../../model/response.model';
import { SaveBuyerRequest } from '../../model/request.model';
import { ConfirmDialogComponent } from '../../common/confirmdialog.component';

@Component({
  selector: 'custom-buyer',
  templateUrl: './custombuyer.component.html',
  styleUrls: ['./custombuyer.component.scss']
})

export class CustomBuyerComponent implements OnInit {

  
  @Input('selectedBuyerItem') selectedBuyerItem: BuyerMasterInfo;
  @Input('Mode') Mode: string;
  
  public submitAttempt: boolean;
  public StatusList: Status[];
  public StateList: State[];
  public CountryList: Country[];
  public StateListFiltered: State[];
  public agentList: AgentMasterInfo[];
  public FormColumnsWidth : number;
  
  public alsoAgent:boolean;

  @Output() public cancelClicked : EventEmitter<any> = new EventEmitter();
  @Output() public saveCompleted : EventEmitter<any> = new EventEmitter();

  @ViewChild('BuyerName') buyerName:ElementRef;
  
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
      console.log(this.selectedBuyerItem);

      // if (this.Mode == 'ADD') {
      //   this.StatusList = this.sessionService.ActiveStatusList;
      // }
      // else
      // {
      //   this.StatusList = this.sessionService.StatusList;
      // }

      this.FormColumnsWidth = 600;
      
      //document.getElementsByName('BuyerName').focus();
      //this.loadMasterData(this.Mode);

  }

  onCountrySelect() {

    this.StateListFiltered = [];

    if (this.commonService.getLengthNA(this.selectedBuyerItem.CountryCode) > 0) {
        if (this.commonService.getLength(this.StateList) > 0) 
        {
          this.StateListFiltered = this.StateList.filter(itm => itm.CountryCode == this.selectedBuyerItem.CountryCode);
        }
    }
    else
    {
      this.selectedBuyerItem.StateID = null;
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

      this.apiService.postData("Master_AgentGetByCorpID", null).subscribe((data: AgentGetByCorpIDResponse) => {
      if (data.SuccessCode == 1) {
      
          this.agentList = data.ResultList;
           
          let tmp = this.agentList.find(d=> d.AgentID == this.selectedBuyerItem.AgentID);

          if (tmp != null && tmp.AgentName == this.selectedBuyerItem.AgentName)
          {
              this.alsoAgent = true;
          }
          
          this.Mode = Mode;
        }
        else
        {
          this.sessionService.showError(data.ErrorMessage);
          this.cancelClick();
        }
      });


    // if (this.commonService.getLength(this.CountryList) == 0 || this.commonService.getLength(this.StateList) == 0 )
    // {

    //   this.apiService.postData("MasterData_RegisterCorp_GetAll", null).subscribe((data: MasterData_RegisterCorp_GetAllResponse) => {
    //   if (data.SuccessCode == 1) {
      
    //       this.StateList = data.StateList;
    //       this.CountryList = data.CountryList;
    //       this.houseList = data.HouseList;
           
    //       if (Mode != 'ADD') {
    //         this.onCountrySelect();

    //         let tmp = this.houseList.find(d=> d.HouseID == this.selectedBuyerItem.HouseID);

    //         if (tmp != null && tmp.HouseName == this.selectedBuyerItem.BuyerName)
    //         {
    //           this.alsoBuyer = true;
    //         }
    //       }

          
    //       this.Mode = Mode;
    //     }
    //     else
    //     {
    //       this.sessionService.showError(data.ErrorMessage);
    //       this.cancelClick();
    //     }
    //   });

    // }
    // else
    // {
    //   if (Mode != 'ADD') {
    //     this.onCountrySelect();
    //   }

    //   this.Mode = Mode;     

    // }



    //this.sessionService.scrollAdjust();
    this.buyerName.nativeElement.focus();
  }

  SubmitClick(isValid: boolean) {

    this.submitAttempt = true;

    if (isValid) {

      if (this.selectedBuyerItem.CountryCode == 'IND')
      {
        if (this.commonService.getLengthNA(this.selectedBuyerItem.Pincode) != 6)
        {
            this.sessionService.showError("Invalid pincode");
            return;
        }
      }

      let req = new SaveBuyerRequest();
      req.Result = this.selectedBuyerItem;  
      req.alsoAgent = this.alsoAgent;   
      req.SaveType = this.Mode == 'ADD' ? AppConfig.SaveType_Insert : AppConfig.SaveType_Update;

      this.apiService.postData("SaveBuyer", req).subscribe((data: SaveReponse) => {
        if (data.SuccessCode == 1) {
          this.sessionService.showSuccess(this.Mode == 'ADD' ? "Buyer Master added successfully" : "Buyer Master updated successfully");

          console.log(data);
          this.selectedBuyerItem.BuyerID = data.ID;
          this.selectedBuyerItem.AgentID = data.ID0;
          this.saveCompleted.emit(this.selectedBuyerItem);

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
    this.selectedBuyerItem = null;
    this.cancelClicked.emit();
  }

  onAgentCheckbox()
  {
    if (this.alsoAgent == true)
    {
        this.selectedBuyerItem.AgentID = -1;
        this.selectedBuyerItem.AgentName = this.selectedBuyerItem.BuyerName;
    }
  }

}
