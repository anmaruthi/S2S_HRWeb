import { Component, OnInit, ɵConsole } from '@angular/core';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { AppConfig, PurchaseRequestStatus } from '../../const/app.config';
import { WebApiService } from "../../service/webapi.service";
import {
  Status, PurchaseRequestInfo, PurchaseItemRequestInfo, PurchasePendingItemProjectWise, PurchasePendingItem,
  SupplierMasterInfo, PurchaseItemOrderInfoExtn, ReportsInfo, ReportingManagerInfo, GstInfo, Master_Item_PUOM, PurchaseOrderItemProjectDetails, Master_LookUp, StageStatus, MasterTabView, BillingAddress, StockInfo
} from "../../model/shared.model";
import { SessionService } from "../../service/session.service";
import { CommonService } from "../../service/common.service";
import { MatDialog } from '@angular/material/dialog';
import { ServiceReponse, GetReportGuikeyByParametersResponse, MasterDataForPurchaseOrderGetByCorpIDResponse, PurchaseOrderListGetBySiteIDResponse, SaveReponse, PurchaseRequestListGetBySiteIDResponse, Master_SupplierGetByCorpIDResponse, BillingAddressGetAllByCorpIDResponse, PurchasePendingItemGetByCorpIDResponse } from '../../model/response.model';
import { PurchaseOrderDetailsRequest, PurchaseOrderSaveRequest, ServiceRequest, PurchaseRequestListGetBySiteIDRequest, PurchaseOrderStatusUpdateRequest, GetReportGuikeyByParametersRequest, ReportTestRequest, SubmitPurchaseRequestRequest, BillingAddressGetAllRequest, PurchaseRequestApprovalRequest } from '../../model/request.model';
import { ConfirmDialogComponent } from '../../common/confirmdialog.component';
import { FormGroup, FormControl } from '@angular/forms';
import * as moment from 'moment';
import { PurchaseRequestDialogComponent } from './purchaserequestdialog.component';
import { ThisReceiver } from '@angular/compiler';
import { MatTab } from '@angular/material/tabs';
import { MenuItem } from 'primeng/api';



@Component({
  templateUrl: './purchaserequest.component.html',
  styleUrls: ['./purchaserequest.component.scss']
})

export class PurchaserequestComponent implements OnInit {

  public submitAttempt: boolean;
  public submitAttempt1: boolean;
  public poSubmitAttempt: boolean;
  public selectedDataGridItem: PurchaseRequestInfo;
  public selectedData: PurchaseRequestInfo;
  public dataGridList: PurchaseRequestInfo[];
  public PurchaseItemOrderList: PurchaseItemRequestInfo[];
  public SupplierTypeList: Master_LookUp[];

  public StageStatusList: StageStatus[];
  public PurchaseOrderList: PurchaseRequestInfo[];
  public TabViewList: MasterTabView[];
  public selectedTab: string;

  public cols: any[];
  public colsA: any[];
  public cols1: any[];
  public cols2: any[];
  public poCols: any[];
  public poCols1: any[];
  public stkCols: any[];

  public Mode: string;
  public StatusCode: number;
  public StatusList: Status[];
  public menuitems: MenuItem[];
  public activeitem: MenuItem;

  public FromDate: string;
  public ToDate: string;

  public selectedPendigItemData: PurchasePendingItem;
  public PendingItemsList: PurchasePendingItem[];
  public PendingItemsProjectWiseList: PurchasePendingItemProjectWise[];
  public PurchaseUOMList: Master_Item_PUOM[];
  public BillingSAddressList: BillingAddress[];
  public TotalStockList: StockInfo[];
  public StockList: StockInfo[];
  public filteredStockList: StockInfo[];
  
  public canGenPO: boolean;
  public poMode: boolean;
  public userStage: string;

  public SupplierList: SupplierMasterInfo[];
  public SelectedSupplier: SupplierMasterInfo;

  currentPurchaseOrderItemList: PurchaseItemOrderInfoExtn[];
  currentPurchaseOrderItemDetails: PurchaseItemOrderInfoExtn[];
  currentPurchaseOrderItemProjectDetails: PurchaseOrderItemProjectDetails[];

  selectedPOItem: PurchaseItemOrderInfoExtn;
  totalPOCost: number;
  totalPOAmt: number;
  totalPOGst: number;
  thisGst: GstInfo;
  amtLabel: string;

  expandedRows: {};

  showSubmit: boolean;
  showApprove: boolean;
  showReject: boolean;
  showCancel: boolean;

  public SelectedReport: ReportsInfo;
  public showReport: boolean;
  public reportPage: string;
  public reportUrl: SafeResourceUrl;

  public IsSelectAll: boolean;
  value: number = 0;

  displayResponsive: boolean;

  constructor(public dialog: MatDialog, public sessionService: SessionService, private apiService: WebApiService,
    public commonService: CommonService, private sanitizer: DomSanitizer) {

  }

  ngOnInit() {


    this.Mode = 'HOME';
    this.canGenPO = false;
    this.poMode = false;
    this.totalPOCost = 0;
    this.totalPOAmt = 0;
    this.totalPOGst = 0;
    this.selectedTab = "";

    this.thisGst = new GstInfo();
    this.displayResponsive = false;

    this.thisGst.GST = 0;
    this.thisGst.GSTAmt = 0;
    this.thisGst.SGST = 0;
    this.thisGst.CGST = 0;
    this.thisGst.IGST = 0;
    this.thisGst.SGSTAmt = 0;
    this.thisGst.CGSTAmt = 0;
    this.thisGst.IGSTAmt = 0;

    this.amtLabel = 'Amount';
    this.poSubmitAttempt = false;

    this.loadMastersData();
    this.loadTabList();
    //this.loadDataGrid();
    this.SupplierList = new Array();
    this.SelectedSupplier = new SupplierMasterInfo();

    this.showApprove = false;
    this.showReject = false;
    this.showCancel = false;
    this.showSubmit = false;

    this.cols2 = [
      { field: 'PurchaseRequestNumberString', header: 'Request Number', width: '5%', align: 'left', wrap: 'break-word' },
      // { field: 'RequestAddrID', header: 'Request ID', width: '5%', align: 'left', wrap: 'break-word' },
      { field: 'PurchaseRequestDateStr', header: 'Date', width: '10%', align: 'left', wrap: 'break-word' },
      { field: 'ReqRefCode', header: 'Request From', width: '10%', align: 'left', wrap: 'break-word' },
      { field: 'StatusMessage', header: 'Status', width: '10%', align: 'left', wrap: 'break-word' },
      { field: 'ExpectedDeliveryDateStr', header: 'Due Date', width: '10%', align: 'left', wrap: 'break-word' },
      { field: 'EntryUser', header: 'Done By', width: '10%', align: 'left', wrap: 'break-word' },
      { field: 'ApproveUser', header: 'Approved', width: '10%', align: 'left', wrap: 'break-word' }
    ];

    this.cols1 = [
      { field: 'ProjectID', header: 'Project ID' },
      { field: 'ProjectName', header: 'Project Name' },
      { field: 'StyleName', header: 'Style Name' },
      { field: 'StyleDescription', header: 'Style Description' }
    ];

    this.cols = [
      // { field: 'IsSelected', header: '', width: '3%', align: 'center', wrap: 'break-word' },
      { field: 'ReqRefCode', header: 'Request From',  width: '10%',  align: 'left', wrap: 'break-word' },
      { field: 'PurchaseRequestDateStr', header: 'Request Date',  width: '12%',  align: 'left', wrap: 'break-word' },
      { field: 'StatusMessage', header: 'Status',  width: '14%',  align: 'left', wrap: 'break-word' },
      { field: 'ItemName', dispfield: 'ItemName', header: 'Material', width: '25%', align: 'left', wrap: 'break-word'},
      { field: 'RequestQuantity', dispfield: 'req', header: 'Requested Qty.', hwidth: '0%', width: '12%', align: 'right', wrap: 'break-word'},          
      { field: 'ApprovedQuantity', dispfield: 'appr', header: 'Approved Qty.', hwidth: '0%', width: '12%', align: 'right', wrap: 'break-word'},
      { field: 'StockQuantity', dispfield: 'ord', header: 'Stock Qty.', hwidth: '0%', width: '12%', align: 'right', wrap: 'break-word'}
      // { field: 'BalanceQty', dispfield: 'bal', header: 'Balance Qty.', hwidth: '0%', width: '11%', align: 'right', wrap: 'break-word'},
      // { field: 'OrderQuantity', dispfield: 'ord', header: 'Ordered Qty.', hwidth: '0%', width: '11%', align: 'right', wrap: 'break-word'}          
    ];


    this.colsA = [
      { field: 'ProjectName', dispfield: 'ProjectName', header: 'Project', hwidth: '25%', width: '25%', align: 'left', wrap: 'break-word' },
      { field: 'StyleName', dispfield: 'StyleName', header: 'Style', hwidth: '20%', width: '20%', align: 'left', wrap: 'break-word' },
      { field: 'StyleDescription', dispfield: 'StyleDescription', header: 'Style Description', hwidth: '25%', width: '25%', align: 'left', wrap: 'break-word' },
      { field: 'OrderQuantity', dispfield: 'req', header: 'Required', hwidth: '10%', width: '10%', align: 'right', wrap: 'break-word' },
      { field: 'AlreadyOrderedQty', dispfield: 'ord', header: 'Ordered', hwidth: '10%', width: '10%', align: 'right', wrap: 'break-word' },
      { field: 'BalanceQty', dispfield: 'bal', header: 'Balance', hwidth: '10%', width: '10%', align: 'right', wrap: 'break-word' },
    ];

    this.poCols = [

      { field: 'ItemName', subfield: 'ProjectName', header: 'Item', hwidth: '23%', width: '23%', align: 'left', wrap: 'break-word', edit: 'no' },

      { field: 'OrderQuantity', subfield: 'OrderQuantity', header: 'Present Reqd. Qty.', hwidth: '7%', width: '7%', align: 'right', wrap: 'break-word', edit: 'yes' },
      { field: 'UOM', subfield: '', header: 'UOM', hwidth: '4%', width: '4%', align: 'left', wrap: 'break-word', edit: 'no' },

    ];

    this.poCols1 = [

      { field: 'ItemName', header: 'Item', width: '28%', align: 'left', wrap: 'break-word' },
      { field: 'OrderQuantity', header: 'Order Qty.', width: '12%', align: 'right', wrap: 'break-word' },
      { field: 'ConvertedOrderQuantity', header: 'Pur. Order Qty.', width: '12%', align: 'right', wrap: 'break-word' },

    ];

    this.stkCols = [
      { field: 'SiteCode', header: 'Site Code', width: '30%', align: 'left', wrap: 'break-word' },
      { field: 'QuantityOnHand', header: 'Stock Qty.', width: '10%', align: 'right', wrap: 'break-word' },
    ];

  }

  loadTabList() {
    this.TabViewList = new Array();
    let iList1 = this.sessionService.FunctionList.filter(x => (x.FunctionName == 'ADD_PURCHASEREQUEST' || x.FunctionName == 'EDIT_PURCHASEREQUEST' || x.FunctionName == 'VIEW_PURCHASEREQUEST') && x.IsTagged == 'Y');
    let iList2 = this.sessionService.FunctionList.filter(x => x.FunctionName == 'VERIFY_PURCHASEORDER' && x.IsTagged == 'Y');
    let iList3 = this.sessionService.FunctionList.filter(x => x.FunctionName == 'APPROVE_PURCHASEREQUEST' && x.IsTagged == 'Y');

    if (this.commonService.getLength(iList3) > 0) {
      let nTab = new MasterTabView();
      nTab.TabID = 3;
      nTab.TabName = "poapprove";
      nTab.TabTitle = 'Approval';
      this.TabViewList.push(nTab);
    }

    // if (this.commonService.getLength(iList2) > 0) {
    //   let nTab = new MasterTabView();
    //   nTab.TabID = 2;
    //   nTab.TabName = "poverify";
    //   nTab.TabTitle = 'Verification';
    //   this.TabViewList.push(nTab);
    // }

    if (this.commonService.getLength(iList1) > 0) {
      let nTab = new MasterTabView();
      nTab.TabID = 1;
      nTab.TabName = "poentry";
      nTab.TabTitle = 'Entry';
      this.TabViewList.push(nTab);
    }

    if (this.commonService.getLength(this.TabViewList) > 0) {
      this.selectedTab = this.TabViewList[0].TabTitle.toUpperCase();
      this.userStage = this.TabViewList[0].TabTitle.toUpperCase();
    }

    this.menuitems = [
      { label: 'Approval', icon: 'pi pi-fw pi-home' },
      { label: 'Verify', icon: 'pi pi-fw pi-calendar' },
      { label: 'Entry', icon: 'pi pi-fw pi-pencil' }
    ];

    this.activeitem = this.menuitems[0];
    if (this.selectedTab == 'ENTRY')
    {
      this.Mode = 'HOME';
      this.loadDataGrid();
    }
    else if(this.selectedTab == 'APPROVAL')
    {
      this.Mode = 'POREQ';
      this.LoadPORequestPendingList();
    }


  }

  onTabChange(info: any) {
    console.log(info.tab.textLabel);

    if (info.tab.textLabel != undefined && info.tab.textLabel != null) {
      this.selectedTab = info.tab.textLabel.toUpperCase();
      if (this.selectedTab == 'ENTRY')
      {
        this.Mode = 'HOME';
        this.loadDataGrid();
      }
      else if(this.selectedTab == 'APPROVAL')
      {
        this.Mode = 'POREQ';
        this.LoadPORequestPendingList();
      }
    }
    else {
      this.selectedTab = "";
    }
  }

  loadMastersData() {
    this.currentPurchaseOrderItemDetails = new Array();
    this.currentPurchaseOrderItemList = new Array();
    this.selectedDataGridItem = new PurchaseRequestInfo();
    this.selectedPOItem = new PurchaseItemOrderInfoExtn();

    this.StatusList = this.sessionService.StatusListAll.filter(x => x.Category == 'Purchase');

    this.ToDate = moment().format();
    this.FromDate = moment().add('months', -3).format();

    let req = new ServiceRequest();
    this.apiService.postData("MasterDataForBasePurchaseOrderGetByCorpID", req).subscribe((data: MasterDataForPurchaseOrderGetByCorpIDResponse) => {
      if (data.SuccessCode == 1) {
        this.StageStatusList = data.StageStatusList;
        let allSts = new StageStatus();
        //allSts.Category = 'Purchase';
        allSts.StageStatusCode = -1;
        allSts.StatusMessage = 'All';

        this.StageStatusList.unshift(allSts);

        //loading default search values
        this.StatusCode = allSts.StageStatusCode;
      }
      else {
        this.sessionService.showError(data.ErrorMessage);
      }
    });






  }

  loadDataGrid() {

    let req = new PurchaseRequestListGetBySiteIDRequest();
    req.StartDate = null;
    req.EndDate = null;

    if (this.FromDate != null) { req.StartDate = moment(this.FromDate).format(); }
    if (this.ToDate != null) { req.EndDate = moment(this.ToDate).format(); }
    req.StatusCode = this.StatusCode;
    req.Stage = this.selectedTab;

    this.apiService.postData("PurchaseRequestListGetBySiteID", req).subscribe((data: PurchaseRequestListGetBySiteIDResponse) => {
      if (data.SuccessCode == 1) {
        this.dataGridList = data.ResultList;

        if (this.commonService.getLength(this.dataGridList) > 0) {
          this.dataGridList.forEach(x => {
            x.ExpectedDeliveryDateStr = moment(x.ExpectedDeliveryDate).format(AppConfig.GRID_DATE_FORMAT);
            x.PurchaseRequestDateStr = moment(x.PurchaseRequestDate).format(AppConfig.GRID_DATE_FORMAT);
          });
        }
      }
      else {
        this.sessionService.showError(data.ErrorMessage);
      }
    });

    this.selectedData = null;
  }




  searchClick(IsValid: boolean, searchForm: FormGroup) {
    this.submitAttempt = true;

    if (IsValid) {
      this.loadDataGrid();
    }

  }

  refreshClick() {
    this.Mode = 'HOME'
    this.loadDataGrid();
  }

  onKeyUp() {
    this.selectedData = null;
  }

  addClick() {
    this.openPurchaseOrderDialog('ADD');
  }


  openPurchaseOrderDialog(nMode: string) {
    console.log(this.selectedData);

    let dialogRef = this.dialog.open(PurchaseRequestDialogComponent, {
      data: {
        Mode: nMode,
        // TaxList: this.TaxList,
        // StatusList: this.StatusList1,
        selectedItem: this.selectedData,
        stage: this.userStage,
        screen: this.selectedTab
      },
      height: '600px',
      width: '1200px',
      disableClose: false,
      hasBackdrop: false,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result == 1) {
        this.loadDataGrid();
      }
      else {
        // do nothing
      }
    });


  }

  onDoubleClick(PurchaseRequestID: number) {
    console.log('insideonDobleClick');
   console.log(PurchaseRequestID);
    
    this.GetPurchaseOrderDetails(PurchaseRequestID);

  }

  GetPurchaseOrderDetails(ID: number) {

    if (this.commonService.getLength(this.dataGridList) > 0) {
      this.selectedData = this.dataGridList.find(x => x.PurchaseRequestID == ID);

      if (this.selectedData != null) {
        this.openPurchaseOrderDialog('EDIT');
      }
    }


    // let req = new ServiceRequest();
    // req.ID = ID;

    // this.apiService.postData("PurchaseOrderDetailsGetByPurchaseOrderID", req).subscribe((data: PurchaseOrderDetailsResponse) => {
    //       if (data.SuccessCode == 1) {
    //         this.currentPurchaseOrderItemProjectDetails = data.ItemDetails;
    //         this.currentPurchaseOrderItemList = data.ItemList;
    //         this.selectedDataGridItem = data.PurchaseOrder[0];                

    //         if (this.selectedDataGridItem != null)
    //         {
    //           this.selectedDataGridItem.ExpectedDeliveryDate = moment(this.selectedDataGridItem.ExpectedDeliveryDate).format(AppConfig.GRID_DATE_FORMAT);
    //           this.selectedDataGridItem.PurchaseOrderDate = moment(this.selectedDataGridItem.PurchaseOrderDate).format(AppConfig.GRID_DATE_FORMAT);
    //         }


    //         this.viewPurchaseOrder();
    //       }
    //       else
    //       {
    //         this.sessionService.showError(data.ErrorMessage);
    //       }
    // }); 
  }


  closeClick() {
    this.Mode = 'HOME';
    this.canGenPO = false;
    this.poMode = false;
    this.submitAttempt = false;

    this.showApprove = false;
    this.showReject = false;
    this.showCancel = false;
    this.showSubmit = false;
  }


  reportCloseClick() {
    this.showReport = false;
    this.selectedData = null;
  }

  cancelPOClick() {
    if (this.selectedData != null) {
      let dialogRef = this.dialog.open(ConfirmDialogComponent, {
        data: {
          DialogHeader: 'Alert',
          DialogMessage: 'Are you sure you want to cancel?'
        },
        disableClose: true,
      });

      dialogRef.afterClosed().subscribe(result => {

        if (result == 1) {
          let req = new SubmitPurchaseRequestRequest();
          req.PurchaseRequestID = this.selectedData.PurchaseRequestID;
          req.Stage = "";
          req.StatusCode = PurchaseRequestStatus.RequestCancelled;

          console.log(req);

          this.apiService.postData("SubmitPurchaseRequest", req).subscribe((data: SaveReponse) => {
            if (data.SuccessCode == 1) {

              this.sessionService.showSuccess("Purchase Request Cancelled successfully");
              this.loadDataGrid();
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

  cancelClick() {
    if (this.showReport == true) {
      this.showReport = false;
    }
    else {
      this.showApprove = false;
      this.showReject = false;
      this.showCancel = false;
      this.showSubmit = false;

      this.poMode = false;
      this.submitAttempt = false;

      if (this.Mode == 'EDIT') {
        this.closeClick();
      }
    }
  }

  itemRowExpansionDetails(item: number): PurchasePendingItemProjectWise[] {

    let xList = this.PendingItemsProjectWiseList.filter(x => x.ItemID == item);

    if (this.commonService.getLength(xList) > 0) {
      xList.forEach(x => {
        x.BalanceQty = x.OrderQuantity - x.AlreadyOrderedQty;

        x.req = x.OrderQuantity.toString() + ' ' + x.UOM;
        x.ord = x.AlreadyOrderedQty.toString() + ' ' + x.UOM;
        x.bal = x.BalanceQty.toString() + ' ' + x.UOM;
      });

      return xList;
    }

  }



  onSelectItem() {
    let selected: boolean;
    selected = false;

    if (this.commonService.getLength(this.PendingItemsList) > 0) {
      this.PendingItemsList.forEach(x => {
        if (x.IsSelected == true) {
          selected = true;
        }
      });
    }

    if (selected == false) {
      this.canGenPO = false;
    }
    else {
      this.canGenPO = true;
    }
  }

  switchToPOMode() {
    this.poMode = true;
    this.selectedDataGridItem = new PurchaseRequestInfo();
    this.poSubmitAttempt = false;
  }



  QuantityReverseUpdate(itm: PurchaseItemOrderInfoExtn) {
    if (itm != null && itm.ConvertedOrderQuantity != null && itm.ConversionRate != null) {
      let cq = itm.ConvertedOrderQuantity * itm.ConversionRate;
      cq = Math.round(cq);
      itm.OrderQuantity = cq;


    }
  }



  GetPOItemDetails(item: number): PurchaseItemOrderInfoExtn[] {

    let xList = this.currentPurchaseOrderItemDetails.filter(x => x.ItemID == item);

    if (this.commonService.getLength(xList) > 0) {
      if (this.Mode == 'ADD' && xList.length > 1) {
        xList.forEach(z => { z.OrderQuantity = 0; });
      }
      else if (this.Mode == 'EDIT') {
        //do nothing
      }
      else {
        xList = new Array();
      }

    }
    else {
      xList = new Array();
    }
    return xList;
  }

  onValueChanges(rowData1: PurchaseItemOrderInfoExtn, fldName: string) {
    if (rowData1 != null && fldName == 'OrderQuantity') {

    }
    else if (rowData1 != null && fldName == 'ConvertedOrderQuantity') {
      this.QuantityReverseUpdate(rowData1);
    }
    else {

    }
  }


  hasError(form: FormGroup, control: any, errorCode: any): boolean {
    try {
      if (form != null) {
        if (control != null) {
          if (errorCode != null) {
            return form.controls[control].hasError(errorCode);
          }
          else {
            return false;
          }
        }
        else {
          return false;
        }
      }
      else {
        return false;
      }
    }
    catch {
      //console.log(form);
      //console.log(control);
    }
  }

  validateSubTotalsOfPO(): boolean {
    let result: boolean;
    result = true;


    return result;
  }


  onSearchKeyUp() {
    this.selectedDataGridItem = null;
  }

  rowSelected(): boolean {

    if (this.selectedData != null) {
      return true;
    }
    else {
      return false;
    }

  }

  LoadPORequestPendingList()
  {
    this.submitAttempt1 = false;

    let req = new ServiceRequest();
    this.PendingItemsList = new Array();
    this.apiService.postData("PurchaseRequestPendingListGetByCorpID", req).subscribe((data: PurchasePendingItemGetByCorpIDResponse) => {
        if (data.SuccessCode == 1) {
          this.PendingItemsList = data.ResultList;
          this.TotalStockList = data.TotalStockList;
          this.StockList = data.StockList;

          if (this.commonService.getLength(this.PendingItemsList) > 0)
          {
            this.PendingItemsList.forEach(x=> {
              x.ExpectedDeliveryDateStr = moment(x.ExpectedDeliveryDate).format(AppConfig.GRID_DATE_FORMAT);
              x.ItmExpectedDeliveryDateStr = moment(x.ItmExpectedDeliveryDate).format(AppConfig.GRID_DATE_FORMAT);
              x.PurchaseRequestDateStr = moment(x.PurchaseRequestDate).format(AppConfig.GRID_DATE_FORMAT);
              x.ApprovedQuantity = x.RequestQuantity;
            });

            console.log(this.PendingItemsList);
            this.Mode = 'POREQ';
            console.log(this.Mode);
          }
        }
        else
        {
          this.sessionService.showError(data.ErrorMessage);
        }
      }); 

    this.selectedPendigItemData = null;
    
  }

  approvePORequest()
  {
    let isValid:boolean;
    let req = new PurchaseRequestApprovalRequest();
    req.ResultList = new Array();
    this.submitAttempt1 = true;

    isValid = true
    
    if (this.commonService.getLength(this.PendingItemsList)>0)
    {
      this.PendingItemsList.forEach(x=> {
        if (x.IsSelected == true )
        {
          if (x.ApprovedQuantity == undefined || x.ApprovedQuantity == null )
          {
            isValid = false;
          }
          else if(x.ApprovedQuantity > x.RequestQuantity)
          {
            isValid = false;
          }
          else if (x.ApprovedQuantity <= 0)
          {
            isValid = false;
          }


        }
      });
    }
    else
    {
      isValid = false;  
    }

 
    if (isValid == true)
    {
      if (this.commonService.getLength(this.PendingItemsList)>0)
      {
        this.PendingItemsList.forEach(x=> {
          if (x.IsSelected == true)
          {
            req.ResultList.push(x);
          }
        });
      }
      
      if (this.commonService.getLength(req.ResultList)>0) {
        let dialogRef = this.dialog.open(ConfirmDialogComponent, {
            data: {
                DialogHeader: 'Alert',
                DialogMessage: 'Are you sure ?'
            },
            disableClose: true,
        });

        dialogRef.afterClosed().subscribe(result => {

            if (result == 1) {
              console.log(req);

              this.apiService.postData("SubmitPurchaseRequestApproval", req).subscribe((data: ServiceReponse) => {
                if (data.SuccessCode == 1) {
      
                  this.sessionService.showSuccess("Purchase request approved successfully");
                  this.LoadPORequestPendingList();
                }
                else {
                    this.sessionService.showError(data.ErrorMessage);
                }
              });

            }
            else {
                this.selectedPOItem = null;
            }
            
        });


      }

    }
    else
    {
      this.sessionService.showError('Some of the information is incorrect or null...!');        
    }
   

  }

  loadBillingAddressList() {

    let req = new BillingAddressGetAllRequest();
    if(this.sessionService.RoleID == 1){
      req.IsAdmin =true;
    }    
    
    this.apiService.postData("BillingAddressGetByCorpID", req).subscribe((data: BillingAddressGetAllByCorpIDResponse) => {
      if (data.SuccessCode == 1) { 
        this.BillingSAddressList = data.ResultList;
      }
      else
      {
        this.sessionService.showError(data.ErrorMessage);
      }
    });

  }

  loadSupplierList()
  {
    this.apiService.postData("SupplierGetByCorpID", null).subscribe((data: Master_SupplierGetByCorpIDResponse) => {
      if (data.SuccessCode == 1) {
        this.SupplierList = data.ResultList;
        // this.SupplierTypeList = data.SupplierTypeList;
        console.log(this.SupplierList);

      }
      else {
        this.sessionService.showError(data.ErrorMessage);
      }
    });
  }

  getStockByItemID(itm:number)
  {
      this.filteredStockList = new Array();
      if (itm != null)
      {
          let iList = this.StockList.filter(d=> d.ItemID == itm);

          if (this.commonService.getLength(iList)>0)
          {
              this.filteredStockList = iList;
          }

          this.displayResponsive = true;
      }
  }

  showBasicDialog(itm:number)
  {
      this.getStockByItemID(itm);
      
  }

  cancelDialogForm() {
    this.displayResponsive = false;
  }
  
  getIframHeight(): string {
    return (this.sessionService.getDataTableHeight(20) + 'px');
  }

  reportTest(rID: string) {
    let req = new ReportTestRequest();
    req.ReportTransanctionID = rID;

    this.apiService.postData("ReportTest", req).subscribe((data: ServiceReponse) => {
      if (data.SuccessCode == 1) {
        this.sessionService.showSuccess('Report Test is Ok');
      }
      else if (data.SuccessCode == 0) {
        this.sessionService.showError(data.ErrorMessage);
      }
    });
  }

  printPurchaseOrder() {
    this.SelectedReport = new ReportsInfo();

    if (this.commonService.getLength(this.sessionService.ReportsList) > 0) {
      let itm = this.sessionService.ReportsList.find(x => x.ReportName == 'Purchase Request');

      if (itm != null) {
        this.SelectedReport.ReportID = itm.ReportID;

        let req = new GetReportGuikeyByParametersRequest();
        req.SelectedReport = this.SelectedReport;
        req.ParameterDataList = 'PurchaseRequestID:' + this.selectedData.PurchaseRequestID;

        this.apiService.postData("GetReportGuikeyByParameters", req).subscribe((data: GetReportGuikeyByParametersResponse) => {
          if (data.ReportTransanctionID != null && data.SuccessCode == 1) {
            //this.reportTest(data.ReportTransanctionID.toString().trim());
            this.reportPage = AppConfig.REPORTPAGE_PATH + '?reportid=' + this.SelectedReport.ReportID + '&reportkey=' + data.ReportTransanctionID.toString().trim() +
              '&userid=' + this.sessionService.UserID + '&corpid=' + this.sessionService.CorpID + '&siteid=' + this.sessionService.SiteID +
              '&sessionid=' + this.sessionService.SessionID + '&sendemail=true';
            this.reportUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.reportPage);
            this.showReport = true;
          }
          else if (data.SuccessCode == 0) {
            this.sessionService.showError(data.ErrorMessage);
          }
        });

      }
    }




  }

}