import { Component, OnInit, ɵConsole } from '@angular/core';
import { DomSanitizer, SafeResourceUrl, SafeUrl} from '@angular/platform-browser';
import { AppConfig, PurchaseOrderStatus } from '../../const/app.config';
import { WebApiService } from "../../service/webapi.service";
import { Status, PurchaseOrderInfo, PurchaseItemOrderInfo, PurchasePendingItemProjectWise, 
         PurchasePendingItem, SupplierMasterInfo, PurchaseItemOrderInfoExtn, ReportsInfo, 
         ReportingManagerInfo, GstInfo, Master_Item_PUOM, PurchaseOrderItemProjectDetails, 
         Master_LookUp, StageStatus, MasterTabView, PurchaseRequestInfo, BillingAddress } from "../../model/shared.model";
import { SessionService } from "../../service/session.service";
import { CommonService } from "../../service/common.service";
import { MatDialog } from '@angular/material/dialog';
import { PurchaseOrderDetailsResponse, MasterDataGetAllResponse, ItemsToBePurchasedGetAllResponse, Master_SupplierGetByCorpIDResponse, PurchaseOrderSaveResponse, PurchaseOrderListResponse, ServiceReponse, GetReportGuikeyByParametersResponse, MasterDataForPurchaseOrderGetByCorpIDResponse, PurchaseOrderListGetBySiteIDResponse, SaveReponse, PurchasePendingItemGetByCorpIDResponse, BillingAddressGetAllByCorpIDResponse } from '../../model/response.model';
import { PurchaseOrderDetailsRequest, PurchaseOrderSaveRequest, ServiceRequest, PurchaseOrderListGetBySiteIDRequest, PurchaseOrderStatusUpdateRequest, GetReportGuikeyByParametersRequest, ReportTestRequest, SubmitPurchaseOrderRequest, PurchaseRequestApprovalRequest, ConvertPORequestToPORequest, BillingAddressGetAllRequest } from '../../model/request.model';
import { ConfirmDialogComponent } from '../../common/confirmdialog.component';
import { FormGroup, FormControl } from '@angular/forms';
import * as moment from 'moment';
import { PurchaseDialogComponent } from './purchasedialog.component';
import { ThisReceiver } from '@angular/compiler';
import { MatTab } from '@angular/material/tabs';
import { MenuItem } from 'primeng/api';


@Component({
  templateUrl: './purchase.component.html',
  styleUrls: ['./purchase.component.scss']
})

export class PurchaseComponent implements OnInit {

  public submitAttempt: boolean;
  public submitAttempt1: boolean;
  public poSubmitAttempt: boolean;
  public selectedDataGridItem: PurchaseOrderInfo;
  public selectedData: PurchaseOrderInfo;
  public dataGridList: PurchaseOrderInfo[];
  public PurchaseItemOrderList: PurchaseItemOrderInfo[];
  public SupplierTypeList:Master_LookUp[];
  public BillingSAddressList: BillingAddress[];
  
  public StageStatusList: StageStatus[];
  public PurchaseOrderList: PurchaseOrderInfo[];
  public TabViewList: MasterTabView[];
  public selectedTab:string;
  
  public cols: any[];
  public colsA: any[];
  public cols1: any[];
  public cols2: any[]; 
  public poCols: any[]; 
  public poCols1: any[]; 
  public Mode: string; 
  public StatusCode: number;
  public StatusList: Status[];
  public menuitems: MenuItem[];
  public activeitem: MenuItem;

  public FromDate:string;
  public ToDate:string;

  public selectedPendigItemData: PurchasePendingItem;
  public PendingItemsList: PurchasePendingItem[];
  public PendingItemsProjectWiseList: PurchasePendingItemProjectWise[];
  public PurchaseUOMList: Master_Item_PUOM[];
  
  public canGenPO:boolean;
  public poMode: boolean;
  public userStage:string;

  public SupplierList:SupplierMasterInfo[];
  public SelectedSupplier:SupplierMasterInfo;

  currentPurchaseOrderItemList:PurchaseItemOrderInfoExtn[];
  currentPurchaseOrderItemDetails:PurchaseItemOrderInfoExtn[];
  currentPurchaseOrderItemProjectDetails:PurchaseOrderItemProjectDetails[];

  selectedPOItem:PurchaseItemOrderInfoExtn;
  totalPOCost:number;
  totalPOAmt:number;
  totalPOGst:number;
  thisGst:GstInfo;
  amtLabel:string;

  expandedRows:{};

  showSubmit:boolean;
  showApprove:boolean;
  showReject:boolean;
  showCancel:boolean;

  public SelectedReport:ReportsInfo;
  public showReport:boolean;
  public reportPage:string;
  public reportUrl:SafeResourceUrl;

  public IsSelectAll: boolean;
  value: number = 0;

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
          { field: 'PurchaseOrderNumberString', header: 'Order Number', width: '5%', align: 'left', wrap: 'break-word' },
          { field: 'PurchaseOrderDateStr', header: 'Date', width: '10%', align: 'left', wrap: 'break-word' },
          { field: 'TotalOrderValue', header: 'Value', width: '10%', align: 'right', wrap: 'break-word' },
          { field: 'SupplierName', header: 'Supplier Name', width: '15%', align: 'left', wrap: 'break-word' },
          { field: 'BillRefCode', header: 'Billing', width: '10%', align: 'left', wrap: 'break-word' },
          { field: 'DelRefCode', header: 'Delivery', width: '10%', align: 'left', wrap: 'break-word' },
          { field: 'StatusMessage', header: 'Status', width: '10%', align: 'left', wrap: 'break-word' },
          { field: 'ExpectedDeliveryDateStr', header: 'Due Date', width: '10%', align: 'left', wrap: 'break-word' },
          { field: 'EntryUser', header: 'Done By', width: '10%', align: 'left', wrap: 'break-word' },
          { field: 'ApproveUser', header: 'Approved', width: '10%', align: 'left', wrap: 'break-word' }
        ];

        this.cols1 = [
          { field: 'ProjectID', header: 'Project ID' },
          { field: 'ProjectName', header: 'Project Name' },
          { field: 'StyleName', header: 'Style Name'},
          { field: 'StyleDescription', header: 'Style Description'}
        ];

        this.cols = [
          // { field: 'IsSelected', header: '', width: '3%', align: 'center', wrap: 'break-word' },
          { field: 'ReqRefCode', header: 'Request From',  width: '11%',  align: 'left', wrap: 'break-word' },
          { field: 'PurchaseRequestDateStr', header: 'Request Date',  width: '14%',  align: 'left', wrap: 'break-word' },
          { field: 'StatusMessage', header: 'Status',  width: '14%',  align: 'left', wrap: 'break-word' },
          { field: 'ItemName', dispfield: 'ItemName', header: 'Material', width: '30%', align: 'left', wrap: 'break-word'},
          { field: 'RequestQuantity', dispfield: 'req', header: 'Requested Qty.', hwidth: '0%', width: '14%', align: 'right', wrap: 'break-word'},          
          { field: 'ApprovedQuantity', dispfield: 'appr', header: 'Approved Qty.', hwidth: '0%', width: '14%', align: 'right', wrap: 'break-word'}
          // { field: 'AlreadyOrderedQty', dispfield: 'ord', header: 'Already Ordered Qty.', hwidth: '0%', width: '11%', align: 'right', wrap: 'break-word'},
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
          
          { field: 'ItemName', subfield: 'ProjectName', header: 'Item', hwidth: '23%', width: '23%', align: 'left', wrap: 'break-word',edit: 'no' },
          { field: 'RequiredQuantity', subfield: 'RequiredQuantity', header: 'Curr. Reqd. Qty.', hwidth: '7%', width: '7%', align: 'right', wrap: 'break-word',edit: 'no' },          
          { field: 'OrderQuantity', subfield: 'OrderQuantity', header: 'Present Reqd. Qty.', hwidth: '7%', width: '7%', align: 'right', wrap: 'break-word',edit: 'yes' },
          { field: 'UOM', subfield: '', header: 'UOM', hwidth: '4%', width: '4%', align: 'left', wrap: 'break-word',edit: 'no' },   
          { field: 'PUOM', subfield: '', header: 'Pur. UOM', hwidth: '5%', width: '5%', align: 'left', wrap: 'break-word',edit: 'yes' },  
          { field: 'ConvertedOrderQuantity', subfield: 'ConvertedOrderQuantity', header: 'Pur. Qty.', hwidth: '6%', width: '6%', align: 'right', wrap: 'break-word',edit: 'yes' },
          { field: 'Rate', subfield: '', header: 'Rate', hwidth: '4%', width: '4%', align: 'right', wrap: 'break-word',edit: 'yes' },            
          { field: 'Amt', subfield: '', header: 'Amount', hwidth: '8%', width: '8%', align: 'right', wrap: 'break-word',edit: 'no' },   
          { field: 'SGST', subfield: '', header: 'SGST %', hwidth: '4%', width: '4%', align: 'right', wrap: 'break-word',edit: 'yes' },   
          { field: 'CGST', subfield: '', header: 'CGST %', hwidth: '4%', width: '4%', align: 'right', wrap: 'break-word',edit: 'yes' },   
          { field: 'GST', subfield: '', header: 'GST %', hwidth: '4%', width: '4%', align: 'right', wrap: 'break-word',edit: 'yes' },   
          { field: 'GSTAmt', subfield: '', header: 'GST Amount', hwidth: '7%', width: '7%', align: 'right', wrap: 'break-word',edit: 'no' },   
          { field: 'TotalCost', subfield: '', header: 'Total Amount', hwidth: '8%', width: '8%', align: 'right', wrap: 'break-word',edit: 'no' },
          { field: 'QuoteRate', subfield: '', header: 'Quoted Rate', hwidth: '5%', width: '5%', align: 'right', wrap: 'break-word',edit: 'no' },
          { field: 'TotalDiff', subfield: '', header: 'Total Diff.', hwidth: '5%', width: '5%', align: 'right', wrap: 'break-word',edit: 'no' }
        ];  
        
        this.poCols1 = [
          
          { field: 'ItemName', header: 'Item', width: '28%', align: 'left', wrap: 'break-word' },
          { field: 'OrderQuantity', header: 'Order Qty.', width: '12%', align: 'right', wrap: 'break-word' },
          { field: 'ConvertedOrderQuantity', header: 'Pur. Order Qty.', width: '12%', align: 'right', wrap: 'break-word' },
          { field: 'Rate', header: 'Rate', width: '7%', align: 'right', wrap: 'break-word' },   
          { field: 'Amt', header: 'Amount', width: '9%', align: 'right', wrap: 'break-word' },
          { field: 'CGST', header: 'CGST', width: '5%', align: 'right', wrap: 'break-word' },
          { field: 'SGST', header: 'SGST', width: '5%', align: 'right', wrap: 'break-word' },
          { field: 'GST', header: 'GST', width: '5%', align: 'right', wrap: 'break-word' },
          { field: 'GSTAmt', header: 'GST', width: '7%', align: 'right', wrap: 'break-word' },    
          { field: 'TotalCost', header: 'Total Amount', width: '9%', align: 'right', wrap: 'break-word' }
        ];

        
        
    }

    loadTabList()
    {
      this.TabViewList = new Array();      
      let iList1 = this.sessionService.FunctionList.filter(x=> (x.FunctionName == 'ADD_PURCHASEORDER' || x.FunctionName == 'EDIT_PURCHASEORDER' || x.FunctionName == 'VIEW_PURCHASEORDER')  && x.IsTagged == 'Y');
      let iList2 = this.sessionService.FunctionList.filter(x=> x.FunctionName == 'VERIFY_PURCHASEORDER' && x.IsTagged == 'Y');
      let iList3 = this.sessionService.FunctionList.filter(x=> x.FunctionName == 'APPROVE_PURCHASEORDER' && x.IsTagged == 'Y');      
      // let iList4 = this.sessionService.FunctionList.filter(x=> (x.FunctionName == 'APPROVE_PURCHASEREQUEST')  && x.IsTagged == 'Y');

      // if (this.commonService.getLength(iList4)>0)
      // {
      //   let nTab = new MasterTabView();
      //   nTab.TabID = 4 ;
      //   nTab.TabName = "generate";
      //   nTab.TabTitle = 'Generate PO';
      //   this.TabViewList.push(nTab);
      // }

      if (this.commonService.getLength(iList3)>0)
      {
        let nTab = new MasterTabView();
        nTab.TabID = 3;
        nTab.TabName = "poapprove";
        nTab.TabTitle = 'Approval';
        this.TabViewList.push(nTab);
      }

      if (this.commonService.getLength(iList2)>0)
      {
        let nTab = new MasterTabView();
        nTab.TabID = 2;
        nTab.TabName = "poverify";
        nTab.TabTitle = 'Verification';
        this.TabViewList.push(nTab);
      }

      if (this.commonService.getLength(iList1)>0)
      {
        let nTab = new MasterTabView();
        nTab.TabID = 1;
        nTab.TabName = "poentry";
        nTab.TabTitle = 'Entry';
        this.TabViewList.push(nTab);
      }

      if (this.commonService.getLength(this.TabViewList)>0)
      {
        this.selectedTab = this.TabViewList[0].TabTitle.toUpperCase();
        this.userStage = this.TabViewList[0].TabTitle.toUpperCase();
      }

      this.menuitems = [
        {label: 'Approval', icon: 'pi pi-fw pi-home'},
        {label: 'Verify', icon: 'pi pi-fw pi-calendar'},
        {label: 'Entry', icon: 'pi pi-fw pi-pencil'}
      ];

      this.activeitem = this.menuitems[0];

      this.loadDataGrid();
      
    }

    onTabChange(info:any)
    {
      console.log(info.tab.textLabel);

      if (info.tab.textLabel != undefined && info.tab.textLabel != null)
      {
        this.selectedTab = info.tab.textLabel.toUpperCase();
        this.loadDataGrid();
      }
      else
      {
        this.selectedTab = "";
      }
    }

    loadMastersData()
    {
      this.currentPurchaseOrderItemDetails = new Array();
      this.currentPurchaseOrderItemList = new Array();
      this.selectedDataGridItem = new PurchaseOrderInfo();
      this.selectedPOItem = new PurchaseItemOrderInfoExtn();

      this.StatusList = this.sessionService.StatusListAll.filter(x=> x.Category == 'Purchase');

      this.ToDate = moment().format();
      this.FromDate = moment().add('months',-3).format();

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

        let req = new PurchaseOrderListGetBySiteIDRequest();
        req.StartDate = null;
        req.EndDate = null;
        
        if (this.FromDate != null ) { req.StartDate = moment(this.FromDate).format(); }
        if (this.ToDate != null ) { req.EndDate = moment(this.ToDate).format(); }
        //req.StatusCode = this.StatusCode;
        req.Stage = this.selectedTab;

        console.log(req);
        this.apiService.postData("PurchaseOrderListGetBySiteID", req).subscribe((data: PurchaseOrderListGetBySiteIDResponse) => {
            if (data.SuccessCode == 1) {
              this.dataGridList = data.ResultList;

              console.log(this.dataGridList);
                
              if (this.commonService.getLength(this.dataGridList) > 0)
              {
                this.dataGridList.forEach(x=> {
                  x.ExpectedDeliveryDateStr = moment(x.ExpectedDeliveryDate).format(AppConfig.GRID_DATE_FORMAT);
                  x.PurchaseOrderDateStr = moment(x.PurchaseOrderDate).format(AppConfig.GRID_DATE_FORMAT);
                });
              }
            }
            else
            {
              this.sessionService.showError(data.ErrorMessage);
            }
          }); 

      this.selectedData = null;
    }

    searchClick(IsValid:boolean,searchForm:FormGroup){
      this.submitAttempt = true;

      if (IsValid)
      {
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

    addClick(){
      this.openPurchaseOrderDialog('ADD');
    }

    
    openPurchaseOrderDialog(nMode:string)
    {
      console.log(this.selectedData);

      let dialogRef = this.dialog.open(PurchaseDialogComponent, {
          data: {
            Mode: nMode,
            // TaxList: this.TaxList,
            // StatusList: this.StatusList1,
            selectedItem: this.selectedData,
            stage: this.userStage,
            screen:this.selectedTab
          },
          height: '600px',
          width: '1200px',
          disableClose: false,
          hasBackdrop:false,
      });

      dialogRef.afterClosed().subscribe(result => {
          if (result == 1) {
            this.loadDataGrid();
          }
          else
          {
            // do nothing
          }
      });


    }

    onDoubleClick(PurchaseOrderID:number)
    {
      this.GetPurchaseOrderDetails(PurchaseOrderID);
    }

    GetPurchaseOrderDetails(ID:number)
    {

      if (this.commonService.getLength(this.dataGridList)>0)
      {
        this.selectedData = this.dataGridList.find(x=> x.PurchaseOrderID == ID);

        if (this.selectedData != null)
        {
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

    closeClick()
    {
      this.Mode = 'HOME';
      this.canGenPO = false;
      this.poMode = false;
      this.submitAttempt = false;

      this.showApprove = false;
      this.showReject = false;
      this.showCancel = false;
      this.showSubmit = false;
    }

    backClick()
    {
      // this.Mode = 'POREQ';
      // this.canGenPO = false;
      // this.poMode = false;
      // this.submitAttempt = false;

      // this.showApprove = false;
      // this.showReject = false;
      // this.showCancel = false;
      // this.showSubmit = false;
      this.closeClick();
    }


    LoadPORequestPendingList()
    {
      this.submitAttempt1 = false;

      let req = new ServiceRequest();
      this.PendingItemsList = new Array();
      this.apiService.postData("PurchaseRequestPendingListGetByCorpID", req).subscribe((data: PurchasePendingItemGetByCorpIDResponse) => {
          if (data.SuccessCode == 1) {
            this.PendingItemsList = data.ResultList;

            if (this.commonService.getLength(this.PendingItemsList) > 0)
            {
              this.PendingItemsList.forEach(x=> {
                x.ExpectedDeliveryDateStr = moment(x.ExpectedDeliveryDate).format(AppConfig.GRID_DATE_FORMAT);
                x.ItmExpectedDeliveryDateStr = moment(x.ItmExpectedDeliveryDate).format(AppConfig.GRID_DATE_FORMAT);
                x.PurchaseRequestDateStr = moment(x.PurchaseRequestDate).format(AppConfig.GRID_DATE_FORMAT);
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

    LoadPOGeneratePendingList()
    {
      //   let interval = setInterval(() => {
      //     this.value = this.value + Math.floor(Math.random() * 10) + 1;
      //     if (this.value >= 100) {
      //         this.value = 100;
      //         //this.messageService.add({severity: 'info', summary: 'Success', detail: 'Process Completed'});
      //         clearInterval(interval);
      //     }
      // }, 2000);

      this.submitAttempt1 = false;

      this.loadBillingAddressList();
      this.loadSupplierList();

      let req = new ServiceRequest();
      this.PendingItemsList = new Array();
      this.apiService.postData("POGeneratePendingListGetByCorpID", req).subscribe((data: PurchasePendingItemGetByCorpIDResponse) => {
          if (data.SuccessCode == 1) {
            this.PendingItemsList = data.ResultList;

            if (this.commonService.getLength(this.PendingItemsList) > 0)
            {
              this.PendingItemsList.forEach(x=> {
                x.ExpectedDeliveryDateStr = moment(x.ExpectedDeliveryDate).format(AppConfig.GRID_DATE_FORMAT);
                x.ItmExpectedDeliveryDateStr = moment(x.ItmExpectedDeliveryDate).format(AppConfig.GRID_DATE_FORMAT);
                x.PurchaseRequestDateStr = moment(x.PurchaseRequestDate).format(AppConfig.GRID_DATE_FORMAT);
                x.OrderQuantity = x.BalanceQty;
              });

              console.log(this.PendingItemsList);
             
            }
          }
          else
          {
            this.sessionService.showError(data.ErrorMessage);
          }
        }); 

        this.Mode = 'POGEN';
      this.selectedPendigItemData = null;
    }

    generatePurchaseOrdersFromRequest()
    {
     
      let nReqList:PurchasePendingItem[];
      let nReqList1:PurchasePendingItem[];
      let nReqList2:PurchasePendingItem[];

      let nResList:PurchaseRequestInfo[];
      let nReqItemList:PurchaseItemOrderInfo[];

      let poID:number;
      let porId:number;
      let prvReqID:number;
      let nxtReqID:number;
      let prvSuppID:number;
      let nxtSuppID:number;
      let billAddrID:number;
      
      nReqList = new Array();
      nReqList1 = new Array();
      nReqList2 = new Array();

      nResList = new Array();
      nReqItemList = new Array();

      if (this.commonService.getLength(this.PendingItemsList)>0)
      {
        this.PendingItemsList.forEach(x=> {
          if (x.IsSelected == true)
          {
            if (x.SupplierID != null && x.OrderQuantity != null && x.OrderQuantity >0)
            {
              nReqList.push(x);
            }
            
          }
        });
      }

      console.log(nReqList);
      nReqList = nReqList.sort((a,b)=> (a.RequestAddrID > b.RequestAddrID) ? -1 : 1);

      if (this.commonService.getLength(nReqList)>0)
      {
        poID = 0;
        porId = 0;
        prvSuppID = 0;
        prvReqID  = 0;

        nReqList.forEach(x=> {

          let lst = nReqList1.filter(d=> d.RequestAddrID == x.RequestAddrID);
          console.log(this.commonService.getLength(lst));

          if (this.commonService.getLength(lst)==0)
          {
            let lst1 = nReqList.filter(d=> d.RequestAddrID == x.RequestAddrID);
            if (this.commonService.getLength(lst1)>0)
            {
              lst1 = lst1.sort((a,b)=> (a.SupplierID > b.SupplierID) ? 1: -1)

              lst1.forEach(z=> {  
                nReqList1.push(z);
              });
            }
          }

        });
 
        nReqList1.forEach(x=> {
          nxtReqID = x.RequestAddrID;
          nxtSuppID = x.SupplierID;

          if (nxtReqID != prvReqID || nxtSuppID != prvSuppID)
          {

            poID = poID - 1;
            let nReq = new PurchaseRequestInfo();
            nReq.PurchaseOrderID = poID;
            nReq.RequestAddrID = nxtReqID;
            nReq.PurchaseRequestDate = moment().format(AppConfig.UPDATE_DATE_FORMAT);
            nReq.ExpectedDeliveryDate = moment(x.ExpectedDeliveryDate).format(AppConfig.UPDATE_DATE_FORMAT);
            nReq.SupplierID = nxtSuppID;
            nReq.StatusCode = PurchaseOrderStatus.Initiated;

            nResList.push(nReq);
            
          }
          
          prvSuppID = nxtSuppID;
          prvReqID = nxtReqID;

        });

        if (this.commonService.getLength(nResList)>0)
        {
          nResList.forEach(x=> {

            let xList = nReqList1.filter(d=> d.SupplierID == x.SupplierID && d.RequestAddrID == x.RequestAddrID);

            if (this.commonService.getLength(xList)>0)
            {

              xList.forEach(d=> {

                let itm = new PurchaseItemOrderInfo();

                porId = porId - 1;
              
                itm.PurchaseOrderDetailID = d.PurchaseRequestDetailID;
                itm.PurchaseOrderID = d.PurchaseRequestID;
                itm.PurchaseRequestID = x.PurchaseOrderID;
                itm.ItemID =  d.ItemID;
                itm.OrderQuantity =  d.OrderQuantity;
                itm.Rate =  0;
                itm.TotalItemValue =  0;
                itm.PUOMID =  d.UOMID;
                itm.UOMID = d.UOMID;
                itm.ItemValue =  0;
                itm.TaxPercentage =  0;
                itm.TaxBreakup1 =  0;
                itm.TaxBreakup2 = 0;
                itm.TaxAmount =  0;
                itm.TaxBreakAmount1 = 0;
                itm.TaxBreakAmount2 = 0;
                itm.StatusCode = d.StatusCode;
                itm.ExpectedDeliveryDate = moment(d.ExpectedDeliveryDate).format(AppConfig.UPDATE_DATE_FORMAT);                 
                itm.ConvertedOrderQuantity = d.OrderQuantity;
                itm.ConversionRate = 1;
                itm.ReceivedQuantity = 0;
                itm.CancelledQuantity = 0;
                itm.ReceivedUOMQuantity = 0;
                itm.CancelledUOMQuantity = 0;
                itm.DiscountPercentage = 0;
                itm.DiscountAmount = 0;
                itm.ItemRemarks = '';
      
                if (itm.TaxPercentage == undefined || itm.TaxPercentage == null) { itm.TaxPercentage = 0; }
                if (itm.TaxBreakup1 == undefined || itm.TaxBreakup1 == null) { itm.TaxBreakup1 = 0; }
                if (itm.TaxBreakup2 == undefined || itm.TaxBreakup2 == null) { itm.TaxBreakup2 = 0; }
                if (itm.TaxAmount == undefined || itm.TaxAmount == null) { itm.TaxAmount = 0; }
                if (itm.TaxBreakAmount1 == undefined || itm.TaxBreakAmount1 == null) { itm.TaxBreakAmount1 = 0; }
                if (itm.TaxBreakAmount2 == undefined || itm.TaxBreakAmount2 == null) { itm.TaxBreakAmount2 = 0; }
                if (itm.DiscountPercentage == undefined || itm.DiscountPercentage == null) { itm.DiscountPercentage = 0; }
                if (itm.DiscountAmount == undefined || itm.DiscountAmount == null) { itm.DiscountAmount = 0; }
                if (itm.ItemRemarks == undefined || itm.ItemRemarks == null) { itm.ItemRemarks = ''; }
      
                if (itm.StatusCode == undefined || itm.StatusCode == null) { itm.StatusCode = 110; }
                if (itm.ConversionRate == undefined || itm.ConversionRate == null) { itm.ConversionRate = 1; }
                if (itm.ReceivedQuantity == undefined || itm.ReceivedQuantity == null) { itm.ReceivedQuantity = 0; }
                if (itm.CancelledQuantity == undefined || itm.CancelledQuantity == null) { itm.CancelledQuantity = 0; }
                if (itm.ReceivedUOMQuantity == undefined || itm.ReceivedUOMQuantity == null) { itm.ReceivedUOMQuantity = 0; }
                if (itm.CancelledUOMQuantity == undefined || itm.CancelledUOMQuantity == null) { itm.CancelledUOMQuantity = 0; }
            
                nReqItemList.push(itm);

              });
  
            }
          });
        }

      }

      if (this.commonService.getLength(nResList)>0) {
        let dialogRef = this.dialog.open(ConfirmDialogComponent, {
            data: {
                DialogHeader: 'Alert',
                DialogMessage: 'Are you sure ?'
            },
            disableClose: true,
        });

        dialogRef.afterClosed().subscribe(result => {

            if (result == 1) {
            
              let mVal = 0;
              let cVal = 0;
              let l = 0;
              mVal = Math.floor(100/nResList.length);

              if (this.commonService.getLength(this.BillingSAddressList)>0)
              {
                billAddrID = this.BillingSAddressList[0].BillAddrID;
              }

              nResList.forEach(x=> {
                l = l + 1;
                let req = new ConvertPORequestToPORequest();
                req.ResultInfo = x;
                req.ResultInfo.BillAddrID = billAddrID;
                req.PurchaseItemDetailList = nReqItemList.filter(d=> d.PurchaseRequestID == x.PurchaseOrderID);
                req.SaveType = AppConfig.SaveType_Insert;

                this.CreatePOFromRequest(req).then((success)=> {
                      this.value = Math.floor(l * mVal);

                      if (l == nResList.length) 
                      {
                        this.sessionService.showSuccess("Purchase order converted successfully");
                        this.LoadPOGeneratePendingList();
                        this.value = 0;
                      }

                    }).catch((error) => {
                      console.log(error);
                });
                  

              });



            }
            else {
                this.selectedPOItem = null;
            }
            
        });


      }

    }

    CreatePOFromRequest(rq:ConvertPORequestToPORequest)
    {
      return new Promise<ServiceReponse>((resolve, reject) => {
        this.apiService.postData("ConvertPurchaseRequestToPurchaseOrder", rq).subscribe((data: ServiceReponse) => {
          if (data.SuccessCode == 1) {
            resolve(data);
            //success                   
          }
          else {
            reject(data.ErrorMessage);
             // this.sessionService.showError(data.ErrorMessage);
          }        
        });
      })      
    }


    reportCloseClick()
    {
      this.showReport = false;        
      this.selectedData = null;
    }

    cancelPOClick()
    {
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
              let req = new SubmitPurchaseOrderRequest();
              req.PurchaseOrderID = this.selectedData.PurchaseOrderID;
              req.Stage = "";
              req.StatusCode = PurchaseOrderStatus.Cancelled;
    
              console.log(req);
    
              this.apiService.postData("SubmitPurchaseOrder", req).subscribe((data: SaveReponse) => {
                  if (data.SuccessCode == 1) {
    
                      this.sessionService.showSuccess("Purchase Order cancelled successfully");
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

    cancelClick()
    {
      if (this.showReport == true)
      {
        this.showReport = false;        
      }
      else
      {
        this.showApprove = false;
        this.showReject = false;
        this.showCancel = false;
        this.showSubmit = false;
  
        this.poMode = false;
        this.submitAttempt = false;
  
        if (this.Mode == 'EDIT')
        {
          this.closeClick();
        }  
      }
    }

    itemRowExpansionDetails(item: number):PurchasePendingItemProjectWise[]{

        let xList = this.PendingItemsProjectWiseList.filter(x=>x.ItemID == item);

        if (this.commonService.getLength(xList)>0)
        {
          xList.forEach(x=> {
            x.BalanceQty = x.OrderQuantity - x.AlreadyOrderedQty;

            x.req = x.OrderQuantity.toString() + ' ' + x.UOM;
            x.ord = x.AlreadyOrderedQty.toString() + ' ' + x.UOM;
            x.bal = x.BalanceQty.toString() + ' ' + x.UOM;
          });

          return xList;
        }

    }

    onSelectAll() {
      if (this.commonService.getLength(this.PendingItemsList) > 0) {
        this.PendingItemsList.forEach(x => {
          x.IsSelected = this.IsSelectAll
        });
      }

      if (this.IsSelectAll == false)
      {
        this.canGenPO = false;
      }
      else
      {
        this.canGenPO = true;
      }
    }

    onSelectItem()
    {
      let selected:boolean;
      selected = false;

      if (this.commonService.getLength(this.PendingItemsList)>0)
      {
        this.PendingItemsList.forEach(x=> {
          if (x.IsSelected == true)
          {
            selected = true;
          }
        });        
      }

      if (selected == false)
      {
        this.canGenPO = false;
      }
      else
      {
        this.canGenPO = true;
      }
    }

    switchToPOMode()
    {
      this.poMode = true;
      this.selectedDataGridItem = new PurchaseOrderInfo();
      this.poSubmitAttempt = false;
    }

    onCompleteSelectionPUOM(itm:PurchaseItemOrderInfoExtn)
    {

    }

    QuantityReverseUpdate(itm:PurchaseItemOrderInfoExtn)
    {
      if (itm != null && itm.ConvertedOrderQuantity != null && itm.ConversionRate != null)
      {
        let cq = itm.ConvertedOrderQuantity * itm.ConversionRate;
        cq = Math.round(cq);
        itm.OrderQuantity = cq;

        this.onItemValueChange(itm);
      }
    }

    newPurchaseOrder()
    {


    }


    viewPurchaseOrder()
    {

    }

    GetPOItemDetails(item: number):PurchaseItemOrderInfoExtn[]
    {

      let xList = this.currentPurchaseOrderItemDetails.filter(x=> x.ItemID == item);      

      if (this.commonService.getLength(xList) > 0 )
      {
        if (this.Mode == 'ADD' && xList.length > 1)
        {          
          xList.forEach(z=> { z.OrderQuantity = 0; });
        }
        else if (this.Mode == 'EDIT')
        {
          //do nothing
        }
        else
        {
          xList = new Array();
        }
        
      }
      else
      {
        xList = new Array();
      }
      return xList;
    }

    onValueChanges(rowData1:PurchaseItemOrderInfoExtn,fldName:string)
    {
      if (rowData1 != null && fldName == 'OrderQuantity')
      {
        this.onCompleteSelectionPUOM(rowData1);
      }
      else  if (rowData1 != null && fldName == 'ConvertedOrderQuantity')
      {
        this.QuantityReverseUpdate(rowData1);
      }
      else
      {
        this.onItemValueChange(rowData1);
      }      
    }

    onItemDetailValueChange(rowData1:PurchaseItemOrderInfoExtn,itm1:PurchaseItemOrderInfoExtn)
    {

      if (rowData1 != null && itm1 != null )
      {
        if (itm1.OrderQuantity != null)
        {
          itm1.Rate = rowData1.Rate;
          itm1.UOMID = rowData1.UOMID;
          itm1.PUOMID = rowData1.PUOMID;
          itm1.ConversionRate = rowData1.ConversionRate;
         
          if (itm1.ConversionRate != null && itm1.OrderQuantity)
          {
            itm1.ConvertedOrderQuantity = Math.round((itm1.OrderQuantity / itm1.ConvertedOrderQuantity));
          }


        }

      }
    }

    onItemValueChange(rowData1:PurchaseItemOrderInfoExtn)
    {
            
    }
 
    onPOItemValueChange(rowData:PurchaseItemOrderInfoExtn,itm1:PurchaseItemOrderInfoExtn)
    {

    }

    onSupplierChange()
    {
      this.SelectedSupplier = null;
      if (this.selectedDataGridItem && this.selectedDataGridItem.SupplierID != null)
      {
        this.SelectedSupplier = this.SupplierList.find(x=> x.SupplierID == this.selectedDataGridItem.SupplierID);

        // if (this.SelectedSupplier != null)
        // {
        //   this.amtLabel = 'Amount (' + this.SelectedSupplier.CurrencyCode + ')';
        // }
      }
    }

    hasError(form:FormGroup, control: any, errorCode: any): boolean
    {

        try{
            if (form != null){
                if (control != null){
                    if (errorCode != null){
                        return form.controls[control].hasError(errorCode);
                    }
                    else
                    {
                        return false;
                    }
                }
                else
                {
                    return false;
                }
            }
            else{
                return false;
            }
        }
        catch{
            //console.log(form);
            //console.log(control);
        }
    }

    validateSubTotalsOfPO():boolean
    {      
      let result:boolean;
      result = true;


      return result;
    }

    addPurchaseOrderSubmit(isValid:boolean, dialogform:any, action: string)
    {

    }

    editPurchaseOrderSubmit(ActionType:string,POInfo:PurchaseOrderInfo)
    {
      
      
    }

    onSearchKeyUp(){
      this.selectedDataGridItem = null;
    }	

    rowSelected(): boolean {

      if (this.selectedData != null) {
        return true;
      }
      else
      {
          return false;
      }
      
    }

    isPrintable(): boolean {
      if (this.selectedData != null && this.selectedData.StatusCode >= PurchaseOrderStatus.Approved ) {
          return true;
      }
      else {
          return false;        
      }
    }

  getIframHeight(): string
  {
    return (this.sessionService.getDataTableHeight(20) + 'px');
  }  

  printPurchaseOrder()
  {   
    this.SelectedReport = new ReportsInfo();

    if (this.commonService.getLength(this.sessionService.ReportsList)>0)
    {
      let itm = this.sessionService.ReportsList.find(x=> x.ReportName == 'Purchase Order');

      if (itm != null)
      {
        this.SelectedReport.ReportID = itm.ReportID;

        let req = new GetReportGuikeyByParametersRequest();
        req.SelectedReport = this.SelectedReport;
        req.ParameterDataList = 'PO Number:' + this.selectedData.PurchaseOrderID;

        this.apiService.postData("GetReportGuikeyByParameters", req).subscribe((data: GetReportGuikeyByParametersResponse) => { 
            if (data.ReportTransanctionID != null && data.SuccessCode == 1) 
            {
              //this.reportTest(data.ReportTransanctionID.toString().trim());
              this.reportPage = AppConfig.REPORTPAGE_PATH + '?reportid=' + this.SelectedReport.ReportID + '&reportkey=' + data.ReportTransanctionID.toString().trim() + 
              '&userid=' + this.sessionService.UserID + '&corpid=' + this.sessionService.CorpID + '&siteid=' + this.sessionService.SiteID +
              '&sessionid=' + this.sessionService.SessionID +  '&sendemail=true';
              this.reportUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.reportPage);     
              this.showReport = true; 
            }
            else if (data.SuccessCode == 0) 
            {
                this.sessionService.showError(data.ErrorMessage);
            }
        });

      }
    }

    


  }


  reportTest(rID:string)
  {
    let req = new ReportTestRequest();
    req.ReportTransanctionID = rID;

    this.apiService.postData("ReportTest", req).subscribe((data: ServiceReponse) => { 
      if (data.SuccessCode == 1) 
      {
        this.sessionService.showSuccess('Report Test is Ok');
      }
      else if (data.SuccessCode == 0) 
      {
          this.sessionService.showError(data.ErrorMessage);
      }
  });
  }

}