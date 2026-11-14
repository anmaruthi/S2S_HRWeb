import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AppConfig, MaterialTransferStatus } from '../../const/app.config';
import { WebApiService } from "../../service/webapi.service";
import {
  Status, Master_Item, PurchaseItemOrderInfo, PurchasePendingItemProjectWise, PurchasePendingItem,
  SupplierMasterInfo, PurchaseItemOrderInfoExtn, ReportsInfo, GstInfo, Master_Item_PUOM,
  PurchaseOrderItemProjectDetails, Master_LookUp, StageStatus, MasterTabView, BillingAddress,
  StockTransferDetail,
  SiteInfo,
  StockInfo,
} from "../../model/shared.model";
import { SessionService } from "../../service/session.service";
import { CommonService } from "../../service/common.service";
import { MatDialog } from '@angular/material/dialog';
import { ServiceReponse, MasterData_SaveStockOutwardTransaction_GetAllResponse, StockInwardReplaceTransactionGetAllBySiteIDResponse, SiteGetAllResponse, StockGetBySiteIDResponse, StockTransferGetBySiteIDResponse } from '../../model/response.model';
import { StockGetAllByCorpIDSiteIDRequest, SaveStockOutwardTransactionRequest, SaveStockTransferRequest, SiteGetAllRequest, PurchaseRequestListGetBySiteIDRequest } from '../../model/request.model';
import { ConfirmDialogComponent } from '../../common/confirmdialog.component';
import * as moment from 'moment';

import { MenuItem } from 'primeng/api';
import { TabView } from 'primeng/tabview';
import { ThisReceiver } from '@angular/compiler';


@Component({
  templateUrl: './stocktransfer.component.html',
  styleUrls: ['./stocktransfer.component.scss']
})

export class StockTransferComponent implements OnInit {

  public submitAttempt: boolean;
  public submitAttempt1: boolean;
  public selectedDataGridItem: StockTransferDetail;
  public selectedData: StockTransferDetail;
  public dataGridList: StockTransferDetail[];
  public PurchaseItemOrderList: PurchaseItemOrderInfo[];
  public SupplierTypeList: Master_LookUp[];
  public searchRequest: StockGetAllByCorpIDSiteIDRequest;
  public StageStatusList: StageStatus[];
  public PurchaseOrderList: StockTransferDetail[];
  public TabViewList: MasterTabView[];
  public selectedTab: string;
  public FormColumnsWidth: number;
  public cols: any[];
  public cols1: any[];
  public cols2: any[];
  public Mode: string;
  public StatusCode: number;
  public StatusList: Status[];
  public menuitems: MenuItem[];
  public activeitem: MenuItem;
  public SiteList: SiteInfo[];
  public ItemList: StockInfo[];
  public FromDate: string;
  public ToDate: string;
  public userStage: string;
  public IsSelectAll: boolean;



  constructor(public dialog: MatDialog, public sessionService: SessionService, private apiService: WebApiService,
    public commonService: CommonService, private sanitizer: DomSanitizer) {
    this.FormColumnsWidth = 600;
    // this.FormColumnsWidth = this.sessionService.getScreenWidth();
    this.setDefaultSearch();
    // this.searchRequest = new StockGetAllByCorpIDSiteIDRequest();
  }

  ngOnInit() {
    this.Mode = 'HOME';
    this.cancelClick();
    this.loadTabList();

    this.cols1 = [
      { field: 'ItemName', header: "Material", width: '30%', align: 'left', wrap: 'break-word' },
      { field: 'QuantityTransfer', header: "Transfer Qty", width: '10%', align: 'left', wrap: 'break-word' },
      { field: 'ToSite', header: "Transfer TO", width: '15%', align: 'left', wrap: 'break-word' },
      { field: 'FromSite', header: "Transfer By", width: '15%', align: 'left', wrap: 'break-word' },
      { field: 'FromDateStr', header: "Transfer Date", width: '10%', align: 'left', wrap: 'break-word' },
      { field: 'StatusMessage', header: "Status", width: '20%', align: 'left', wrap: 'break-word' },
    ];

    this.cols2 = [
      { field: 'ItemName', header: "Material", width: '20%', align: 'left', wrap: 'break-word' },
      { field: 'QuantityTransfer', header: "Transfer Qty", width: '5%', align: 'left', wrap: 'break-word' },
      { field: 'QuantityReceived', header: "Received Qty", width: '5%', align: 'left', wrap: 'break-word' },
      { field: 'FromSite', header: "Transfer From", width: '13%', align: 'left', wrap: 'break-word' },
      { field: 'TransBy', header: "Transfer By", width: '13%', align: 'left', wrap: 'break-word' },
      { field: 'RecdBy', header: "Received By", width: '13%', align: 'left', wrap: 'break-word' },
      { field: 'FromDateStr', header: "Transfer Date", width: '10%', align: 'left', wrap: 'break-word' },
      { field: 'ToDateStr', header: "Received Date", width: '10%', align: 'left', wrap: 'break-word' },
      { field: 'StatusMessage', header: "Status", width: '11%', align: 'left', wrap: 'break-word' },
    ];

    this.selectedTab = "OUTWARD";    
    this.onTabChange();
  }



  addClick() {
    this.selectedDataGridItem = new StockTransferDetail();
    this.selectedDataGridItem.StatusCode = MaterialTransferStatus.Pending;
    this.selectedDataGridItem.FromSiteID = this.sessionService.SiteID;
    this.selectedDataGridItem.FromDate = moment().format();
    this.Mode = 'ADD';

    //this.loadMasterData('ADD');
  }

  editClick() {
    if (this.selectedData != null) {
      this.onDoubleClick(this.selectedData);
    }
  }

  onDoubleClick(rowData: StockTransferDetail) {
    this.Mode = 'EDIT';
    this.selectedDataGridItem = Object.assign({}, rowData);
    if (this.selectedDataGridItem != null && (this.selectedDataGridItem.ToDate == null || this.selectedDataGridItem.ToDate == undefined))
    {
      this.selectedDataGridItem.ToDate = moment().format();
    }
    //this.loadMasterData('EDIT');
  }

  loadMasterData() {

    let req = new SiteGetAllRequest();
    if(this.sessionService.RoleID ==1){
      req.IsAdmin =true;
    }
    this.apiService.postData("SiteGetAll", req).subscribe((data: SiteGetAllResponse) => {
      if (data.SuccessCode == 1) {
        this.SiteList = data.ResultList;
      }
      else
      {
        this.sessionService.showError(data.ErrorMessage);
      }
    });

    if (this.selectedTab == 'OUTWARD') 
    {
      this.apiService.postData("StockGetBySiteID", null).subscribe((data: StockGetBySiteIDResponse) => {
        if (data.SuccessCode == 1) {
            this.ItemList = data.ResultList;
            console.log(this.ItemList);
        }
        else
        {
            this.sessionService.showError(data.ErrorMessage);
        }
      });
    }
    else 
    {
      this.apiService.postData("FromSiteStockGetBySiteID", null).subscribe((data: StockGetBySiteIDResponse) => {
        if (data.SuccessCode == 1) {
            this.ItemList = data.ResultList;
            console.log(this.ItemList);
        }
        else
        {
            this.sessionService.showError(data.ErrorMessage);
        }
      });      
    }



    //this.Mode = Mode;
    //this.onDepartmentChange(false);
    this.sessionService.scrollAdjust();
  }


  cancelClick() {
    this.Mode = 'HOME';
    this.submitAttempt = false;
    this.selectedDataGridItem = null;
    this.selectedData = null;
  }

  onSelectTab(info: any)
  {
    console.log(info.tab.textLabel);
    if (info.tab.textLabel != undefined && info.tab.textLabel != null) {
      this.selectedTab = info.tab.textLabel.toUpperCase();
      console.log(this.selectedTab);
      this.onTabChange();
    }
    else {
      this.selectedTab = "";
    }
  }

  onTabChange() {
    if (this.selectedTab == "OUTWARD") {
      this.cols = this.cols1;
    }
    if (this.selectedTab == "INWARD") {
      this.cols = this.cols2;
    }
    this.loadMasterData();
    this.loadDataGrid();
  }

  refreshClick() {
    this.cancelClick();
    this.setDefaultSearch();
    this.loadDataGrid();
  }

  loadDataGrid() {
    let req = new PurchaseRequestListGetBySiteIDRequest();
    req.StartDate = null;
    req.EndDate = null;

    console.log(this.searchRequest);

    if (this.searchRequest.FromDate != null ) { 
      req.StartDate = moment(this.searchRequest.FromDate).format(); 
      req.StartDate = moment(req.StartDate).add(-1,'days').format();
    }
    if (this.searchRequest.ToDate != null ) { 
        req.EndDate = moment(this.searchRequest.ToDate).format(); 
        req.EndDate = moment(req.EndDate).add(1,'days').format();
    }
    req.Stage = this.selectedTab;    

    this.apiService.postData("StockTransferGetBySiteID", req).subscribe((data: StockTransferGetBySiteIDResponse) => {
      if (data.SuccessCode == 1) {
        this.dataGridList = data.ResultList;

        console.log(this.dataGridList);
        if (this.commonService.getLength(this.dataGridList) > 0) {
          this.dataGridList.forEach(itm => {
            itm.FromApproveUserDtTm = moment(itm.FromApproveUserDtTm).format(AppConfig.GRID_DATETIME_FORMAT);
            itm.ToApproveUserDtTm = moment(itm.ToApproveUserDtTm).format(AppConfig.GRID_DATETIME_FORMAT);
            itm.FromDateStr = moment(itm.FromDate).format(AppConfig.GRID_DATE_FORMAT);
            itm.ToDateStr = moment(itm.ToDate).format(AppConfig.GRID_DATE_FORMAT);

          });
        }
      }
      else {
        this.sessionService.showError(data.ErrorMessage);
      }
    });
  }

  isRowSelected(): boolean {

    if (this.selectedData != null) {
      return true;
    }
    else {
      return false;
    }
  }

  SubmitClick(isValid: boolean,ch: string) {

    this.submitAttempt = true;
    let req = new SaveStockTransferRequest();
    req.ResultInfo = this.selectedDataGridItem;
    req.Stage = this.selectedTab;


    if (isValid) {

      if (req.ResultInfo != null && req.ResultInfo.FromSiteID == req.ResultInfo.ToSiteID)
      {
        this.sessionService.showError('From and To Sites are same....!');
        return;
      }

      if (this.Mode == 'ADD')
      {
        req.ResultInfo.StatusCode = MaterialTransferStatus.Pending;
      }
      else
      {
        if (this.selectedTab == 'OUTWARD')
        {
          if (ch == 'save')
          {
            req.ResultInfo.StatusCode = MaterialTransferStatus.Pending;
          }
          else if (ch == 'submit')
          {
            req.ResultInfo.StatusCode = MaterialTransferStatus.Submitted;
          }
          else if (ch == 'approve')
          {
            req.ResultInfo.StatusCode = MaterialTransferStatus.Approved;
          }
          else if (ch == 'reject')
          {
            req.ResultInfo.StatusCode = MaterialTransferStatus.Rejected;
          }                    
        }
        else if (this.selectedTab == 'INWARD')
        {
          if (ch == 'submit')
          {
            req.ResultInfo.StatusCode = MaterialTransferStatus.Received;
          }
          else if (ch == 'approve')
          {
            req.ResultInfo.StatusCode = MaterialTransferStatus.Accepted;
          }
          else if (ch == 'reject')
          {
            req.ResultInfo.StatusCode = MaterialTransferStatus.Returned;
          }   
        }
      }

      if (this.Mode == 'ADD') {
        req.SaveType = AppConfig.SaveType_Insert
      }
      else {
        req.SaveType = AppConfig.SaveType_Update
      }

      let dialogRef = this.dialog.open(ConfirmDialogComponent, {
        data: {
          DialogHeader: 'Stock Transfer',
          DialogMessage: "Are you sure ?"
        },
        disableClose: true,
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result == 1) {

          this.apiService.postData("SaveStockTransfer", req).subscribe((data: ServiceReponse) => {
            if (data.SuccessCode == 1) {

              this.sessionService.showSuccess("Stock transfer saved successfully");
              this.refreshClick();
              this.Mode = 'HOME';
            }
            else {
              this.sessionService.showError(data.ErrorMessage);
            }
          });

        }
      });

    }
    else {
      this.sessionService.showError('Some mandatory informations are missing please check');
      return;
    }
  }

  setDefaultSearch() {
    this.searchRequest = new StockGetAllByCorpIDSiteIDRequest();
    this.searchRequest.FromDate = moment().add('months', -1).format();
    this.searchRequest.ToDate = moment().format();

  }

  loadTabList() {
    this.TabViewList = new Array();

    let nTab = new MasterTabView();
    nTab.TabID = 3;
    nTab.TabName = "Outward";
    nTab.TabTitle = 'OutWard';
    this.TabViewList.push(nTab);

    let nTab1 = new MasterTabView();
    nTab1.TabID = 1;
    nTab1.TabName = "InWard";
    nTab1.TabTitle = 'InWard';
    this.TabViewList.push(nTab1);

    // if (this.commonService.getLength(this.TabViewList) > 0) {
    //   this.selectedTab = this.TabViewList[0].TabTitle.toUpperCase();
    //   this.userStage = this.TabViewList[0].TabTitle.toUpperCase();
    // }

    this.menuitems = [
      { label: 'Approval', icon: 'pi pi-fw pi-home' },
      { label: 'Verify', icon: 'pi pi-fw pi-calendar' },
      { label: 'Entry', icon: 'pi pi-fw pi-pencil' }
    ];

    this.activeitem = this.menuitems[0];

    this.loadDataGrid();

  }

}