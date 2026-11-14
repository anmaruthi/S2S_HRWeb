import { Component, OnInit } from '@angular/core';
import { AppConfig, MasterStatus } from '../../const/app.config';
import { WebApiService } from "../../service/webapi.service";
import { Status, State, Country, CustomerMasterInfo, CustomerItem } from "../../model/shared.model";
import { SessionService } from "../../service/session.service";
import { CommonService } from "../../service/common.service";
import { MatDialog } from '@angular/material/dialog';
import { ServiceReponse, Master_CustomerGetByCorpIDResponse } from '../../model/response.model';
import { CustomerItemGetByCorpIDRequest, SaveCustomerRequest } from '../../model/request.model';
import { ConfirmDialogComponent } from '../../common/confirmdialog.component';

@Component({
  templateUrl: './customermaster.component.html',
  styleUrls: ['./customermaster.component.scss']
})

export class CustomerMasterComponent implements OnInit {

  public submitAttempt: boolean;
  public selectedDataGridItem: CustomerMasterInfo;
  public selectedData: CustomerMasterInfo;
  public dataGridList: CustomerMasterInfo[];


  public cols: any[];

  public Mode: string;

  public StatusList: Status[];
  public StateList: State[];
  public StateListFiltered: State[];
  public CountryList: Country[];
  public FormColumnsWidth: number;


  public ItemList: CustomerItem[];


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
      { field: 'CustomerName', header: 'Customer Name', width: '25%', align: 'left', wrap: 'break-word' },
      { field: 'ContactPerson', header: 'Contact Person', width: '15%', align: 'left', wrap: 'break-word' },
      { field: 'MobileNumber', header: 'Mobile', width: '10%', align: 'left', wrap: 'break-word' },
      { field: 'Email', header: 'Email', width: '20%', align: 'left', wrap: 'break-word' },
      { field: 'City', header: 'City', width: '10%', align: 'left', wrap: 'break-word' },
      { field: 'StatusMessage', header: 'Status', width: '10%', align: 'left', wrap: 'break-word' }
    ];

  }

  loadDataGrid() {

    this.apiService.postData("CustomerGetByCorpID", null).subscribe((data: Master_CustomerGetByCorpIDResponse) => {
      if (data.SuccessCode == 1) {
        this.dataGridList = data.ResultList;


      }
      else {
        this.sessionService.showError(data.ErrorMessage);
      }
    });
   
  }

  onCountrySelect() {

    this.StateListFiltered = [];

    if (this.commonService.getLengthNA(this.selectedDataGridItem.CountryCode) > 0) {
      if (this.commonService.getLength(this.StateList) > 0) {

        this.StateListFiltered = this.StateList.filter(itm => itm.CountryCode == this.selectedDataGridItem.CountryCode);
        let currCountry = this.CountryList.find(itm => itm.CountryCode == this.selectedDataGridItem.CountryCode);

        this.selectedDataGridItem.CurrencyCode = currCountry.CurrencyCode;
      }
    }
    else {
      this.selectedDataGridItem.StateID = null;
    }
  }


  loadMasterData(Mode: string) {

    if (Mode == 'ADD') {
      this.StatusList = this.sessionService.StatusListAll.filter(x => x.StatusCode == 10);
    }
    else if (Mode == 'EDIT') {
      this.StatusList = this.sessionService.StatusListAll;
    }

    this.CountryList = this.sessionService.CountryList;
    this.StateList = this.sessionService.StateList;


    if (Mode != 'ADD') {
      this.onCountrySelect();
    }

    this.Mode = Mode;

    let req = new CustomerItemGetByCorpIDRequest();
    req.CustomerID = null;
    if (this.selectedDataGridItem != null) {
      req.CustomerID = this.selectedDataGridItem.CustomerID;
    }


  }

  addClick() {
    this.selectedDataGridItem = new CustomerMasterInfo();
    this.selectedDataGridItem.StatusCode = MasterStatus.Active;
    this.Mode = 'ADD';
    this.loadMasterData('ADD');
  }

  editClick() {
    this.onDoubleClick(this.selectedData);
  }

  onDoubleClick(rowData: CustomerMasterInfo) {
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

          let req = new SaveCustomerRequest();

          req.Result = this.selectedData;


          req.SaveType = AppConfig.SaveType_Delete;

          this.apiService.postData("SaveCustomerMaster", req).subscribe((data: ServiceReponse) => {
            if (data.SuccessCode == 1) {
              this.sessionService.showSuccess("Customer Master deleted sucessfully..");
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

      if (this.selectedDataGridItem.CountryCode == 'IND') {
        if (this.selectedDataGridItem.CurrencyCode != 'INR') {
          this.sessionService.showError("Invalid currency code for selected country");
          return;
        }
        if (this.commonService.getLengthNA(this.selectedDataGridItem.Pincode) != 6) {
          this.sessionService.showError("Invalid pincode");
          return;
        }
      }

      if (this.selectedDataGridItem.CountryCode == 'USA') {
        if (this.selectedDataGridItem.CurrencyCode != 'USD') {
          this.sessionService.showError("Invalid currency code for selected country");
          return;
        }
      }

      let req = new SaveCustomerRequest();
      req.Result = this.selectedDataGridItem;
      req.ItemList = new Array();


      if (req.Result.GSTIN != null && req.Result.GSTIN.length > 0) {

        req.Result.GSTIN = req.Result.GSTIN.toUpperCase();

        if (req.Result.GSTIN.substring(0, 2) != this.StateList.find(itm => itm.StateID == req.Result.StateID).TIN) {
          this.sessionService.showError("Invalid GST Number. Please check state code.");
          return;
        }

        // if (req.Result.GSTIN.substring(2, 12) != req.Result.PAN) {
        //     this.sessionService.showError("Invalid GST Number. Please check PAN and GST Number.");
        //     return;
        // }

      }

      req.SaveType = this.Mode == 'ADD' ? AppConfig.SaveType_Insert : AppConfig.SaveType_Update;
      console.log(req);

      this.apiService.postData("SaveCustomerMaster", req).subscribe((data: ServiceReponse) => {
        if (data.SuccessCode == 1) {
          this.sessionService.showSuccess(this.Mode == 'ADD' ? "Customer Master added successfully" : "Customer Master updated successfully");
          this.Mode = 'HOME';
          this.RefreshClick();
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
