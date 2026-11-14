import { Component, OnInit } from '@angular/core';
import { AppConfig, MasterStatus} from '../../const/app.config';
import { WebApiService } from "../../service/webapi.service";
import { Status, State, Country, BuyerMasterInfo, ConsigneeMasterInfo} from "../../model/shared.model";
import { SessionService } from "../../service/session.service";
import { CommonService } from "../../service/common.service";
import { MatDialog } from '@angular/material/dialog';
import { MasterData_RegisterCorp_GetAllResponse, ServiceReponse, Master_BuyerGetByCorpIDResponse, Master_ConsigneeGetByCorpIDResponse } from '../../model/response.model';
import { SaveBuyerRequest } from '../../model/request.model';
import { ConfirmDialogComponent } from '../../common/confirmdialog.component';

@Component({
  templateUrl: './consigneemaster.component.html',
  styleUrls: ['./consigneemaster.component.scss']
})

export class ConsigneeMasterComponent implements OnInit {

  public submitAttempt: boolean;
  public selectedDataGridItem: ConsigneeMasterInfo;
  public selectedData: ConsigneeMasterInfo;
  public dataGridList: ConsigneeMasterInfo[];
  public buyerList:ConsigneeMasterInfo[];
  public cols: any[];

  public Mode: string;
  
  public StatusList: Status[];
  public StateList: State[];
  public StateListFiltered: State[];
  public CountryList: Country[];

  public FormColumnsWidth : number;

  constructor(public dialog: MatDialog, public sessionService: SessionService, private apiService: WebApiService,
    public commonService: CommonService) {
  
    this.StateList = [];
    this.StateListFiltered = [];
    this.CountryList = [];

    this.FormColumnsWidth = 600;

  }

  ngOnInit() {
    
    this.Mode = 'HOME';
    this.loadDataGrid();

    this.cols = [
      { field: 'ConsigneeName', header: 'Consignee Name', width: '20%', align: 'left', wrap: 'break-word' },
      { field: 'BuyerName', header: 'Buyer Name', width: '19%', align: 'left', wrap: 'break-word' },
      { field: 'SPOC', header: 'SPOC', width: '15%', align: 'left', wrap: 'break-word' },
      { field: 'MobileNumber', header: 'Mobile', width: '9%', align: 'left', wrap: 'break-word' },
      { field: 'Email', header: 'Email', width: '22%', align: 'left', wrap: 'break-word' },
      { field: 'City', header: 'City', width: '10%', align: 'left', wrap: 'break-word' },
      { field: 'StatusMessage', header: 'Status', width: '8%', align: 'left', wrap: 'break-word' }
    ];

  }
  
  loadDataGrid() {

    this.apiService.postData("Master_ConsigneeGetByCorpID", null).subscribe((data: Master_ConsigneeGetByCorpIDResponse) => {
      if (data.SuccessCode == 1) {
        this.dataGridList = data.ResultList;
        
      }
      else
      {
        this.sessionService.showError(data.ErrorMessage);
      }
    });

  }

  onCountrySelect() {

    this.StateListFiltered = [];

    if (this.commonService.getLengthNA(this.selectedDataGridItem.CountryCode) > 0) {
        if (this.commonService.getLength(this.StateList) > 0) 
        {
          this.StateListFiltered = this.StateList.filter(itm => itm.CountryCode == this.selectedDataGridItem.CountryCode);
        }
    }
    else
    {
      this.selectedDataGridItem.StateID = null;
    }

  }

  
  loadMasterData(Mode: string)
  {

    if (Mode == 'ADD') {
        this.StatusList = this.sessionService.ActiveStatusList;
    }
    else
    {
      this.StatusList = this.sessionService.StatusList;
    }

    this.CountryList = this.sessionService.CountryList;
    this.StateList = this.sessionService.StateList;

    if (Mode != 'ADD') {
      this.onCountrySelect();
    }

    this.Mode = Mode;
    
   

    this.sessionService.scrollAdjust();
  }

  addClick() {
    this.selectedDataGridItem = new ConsigneeMasterInfo();
    this.selectedDataGridItem.StatusCode = MasterStatus.Active;
    this.loadMasterData('ADD');
  }

  editClick() {
      this.onDoubleClick(this.selectedData);
  }

  onDoubleClick(rowData: ConsigneeMasterInfo) {
    if (rowData != null) {
      this.selectedDataGridItem = Object.assign({}, rowData);
      this.loadMasterData('EDIT');
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

          let req = new SaveBuyerRequest();

          req.Result = new BuyerMasterInfo();

          req.Result.BuyerID = this.selectedData.BuyerID;
          req.SaveType = AppConfig.SaveType_Delete;

          this.apiService.postData("SaveBuyer", req).subscribe((data: ServiceReponse) => {
            if (data.SuccessCode == 1) {
              this.sessionService.showSuccess("Buyer Master deleted sucessfully..");
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

  // SubmitClick(isValid: boolean) {

  //   this.submitAttempt = true;

  //   if (isValid) {

  //     if (this.selectedDataGridItem.CountryCode == 'IND')
  //     {
  //       if (this.commonService.getLengthNA(this.selectedDataGridItem.Pincode) != 6)
  //       {
  //           this.sessionService.showError("Invalid pincode");
  //           return;
  //       }
  //     }

  //     let req = new SaveBuyerRequest();
  //     req.Result = this.selectedDataGridItem;     
  //     req.SaveType = this.Mode == 'ADD' ? AppConfig.SaveType_Insert : AppConfig.SaveType_Update;

  //     this.apiService.postData("SaveBuyer", req).subscribe((data: ServiceReponse) => {
  //       if (data.SuccessCode == 1) {
  //         this.sessionService.showSuccess(this.Mode == 'ADD' ? "Buyer Master added successfully" : "Buyer Master updated successfully");
  //         this.Mode = 'HOME';
  //         this.RefreshClick();       
  //       }
  //       else
  //       {
  //         this.sessionService.showError(data.ErrorMessage);
  //       }
  //     });
  //   }
  //   else {
  //     this.sessionService.showError('Some mandatory informations are missing, please check');
  //     return;
  //   }
  // }

  finishAddEdit()
  {
    this.Mode = 'HOME';
    this.RefreshClick();   
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
