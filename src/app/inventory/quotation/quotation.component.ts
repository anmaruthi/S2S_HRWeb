import { Component, OnInit, ɵConsole } from '@angular/core';
import { AppConfig, QuotationStatus } from '../../const/app.config';
import { WebApiService } from "../../service/webapi.service";
import { Status, PurchaseOrderInfo, PurchaseItemOrderInfo, PurchasePendingItemProjectWise, PurchasePendingItem, SupplierMasterInfo, PurchaseItemOrderInfoExtn, QuotationDetails, QuotationItemDetails, QuotationCreateItemDetails, Master_Item_PUOM } from "../../model/shared.model";
import { SessionService } from "../../service/session.service";
import { CommonService } from "../../service/common.service";
import { MatDialog } from '@angular/material/dialog';
import { PurchaseOrderDetailsResponse, MasterDataGetAllResponse, ItemsToBePurchasedGetAllResponse, Master_SupplierGetByCorpIDResponse, PurchaseOrderSaveResponse, PurchaseOrderListResponse, QuotationDetailsGetBySiteIDResponse, QuotationSaveResponse, ServiceReponse, QuotationDetailsGetByQuotationIDResponse, PurchasePendingItemGetByCorpIDResponse, SaveReponse } from '../../model/response.model';
import { PurchaseOrderDetailsRequest, PurchaseOrderSaveRequest, ServiceRequest, PurchaseOrderListGetBySiteIDRequest, QuotationStatusUpdateRequest, QuotationDetailsGetBySiteIDRequest, PurchaseOrderStatusUpdateRequest, QuotationSaveRequest, QuotationCreateRequest, QuotationUpdateRequest, SavePurchaseQuoteRequest, UpdatePurchaseQuoteRequest } from '../../model/request.model';
import { ConfirmDialogComponent } from '../../common/confirmdialog.component';
import { FormGroup, FormControl } from '@angular/forms';
import * as moment from 'moment';
import { QuotationDialogComponent } from './quotationdialog.component';


@Component({
  templateUrl: './quotation.component.html',
  styleUrls: ['./quotation.component.scss']
})

export class QuotationComponent implements OnInit {
  public submitAttempt: boolean;
  public quoteSubmitAttempt: boolean;
  public selectedDataGridItem: QuotationDetails;
  public selectedData: QuotationDetails;

  public dataGridList: QuotationDetails[];
  public ItemDetails: PurchaseItemOrderInfo[];

  public cols: any[];
  public cols2: any[];
  public QuoteCols: any[];
  public QuoteCols1: any[];

  public Mode: string;
  public StatusCode: number;
  public StatusList: Status[];
  public StatusListFiltered: Status[];

  public FromDate: string;
  public ToDate: string;

  public selectedPendingItemData: PurchasePendingItem;
  public PendingItemsList: PurchasePendingItem[];
  public PendingItemsProjectWiseList: PurchasePendingItemProjectWise[];
  public PurchaseUOMList: Master_Item_PUOM[];

  public canGenQuote: boolean;
  public quoteMode: boolean;
  public PUOMList: Master_Item_PUOM[];
  public SupplierList: SupplierMasterInfo[];
  public SelectedSupplier: SupplierMasterInfo;
  public SelectedSupplierList: SupplierMasterInfo[];

  currentQuotationItemList: QuotationItemDetails[];
  currentQuotationItemDetails: QuotationItemDetails[];

  selectedQuotationItem: QuotationItemDetails;

  totalQuoteCost: number;
  amtLabel: string;

  expandedRows: {};

  showSubmit: boolean;
  showApprove: boolean;
  showReject: boolean;
  showCancel: boolean;

  supplierCount: number;
  rowGroupMetadata: any;
  IsSelectAll: boolean;
  value: number = 0;

  constructor(public dialog: MatDialog, public sessionService: SessionService, private apiService: WebApiService,
    public commonService: CommonService) {

  }

  ngOnInit() {

    this.Mode = 'HOME';
    this.canGenQuote = false;
    this.quoteMode = false;
    this.totalQuoteCost = 0;
    this.amtLabel = 'Amount';
    this.quoteSubmitAttempt = false;
    this.supplierCount = 0;

    this.loadMastersData();
    this.loadDataGrid();
    this.SupplierList = new Array();
    this.PUOMList = new Array();
    this.SelectedSupplier = new SupplierMasterInfo();
    this.SelectedSupplierList = new Array;
    this.showApprove = false;
    this.showReject = false;
    this.showCancel = false;
    this.showSubmit = false;

    this.cols2 = [
      { field: 'QuotationNumberString', header: 'Quotation No.', width: '10%', align: 'left', wrap: 'break-word' },
      { field: 'QuotationDateTxt', header: 'Quotation Date', width: '13%', align: 'left', wrap: 'break-word' },
      { field: 'SupplierName', header: 'Supplier', width: '20%', align: 'left', wrap: 'break-word' },
      { field: 'MobileNumber', header: 'Contact Number', width: '10%', align: 'left', wrap: 'break-word' },
      { field: 'Email', header: 'Email', width: '20%', align: 'left', wrap: 'break-word' },
      { field: 'StatusMessage', header: 'Status', width: '12%', align: 'left', wrap: 'break-word' }
    ];

    this.cols = [
      { field: 'ItemName', header: 'Item', hwidth: '73%', width: '70%', align: 'left', wrap: 'break-word' },
      { field: 'BalanceQty', header: 'Quantity', hwidth: '24%', width: '24%', align: 'right', wrap: 'break-word' },
    ];

    this.QuoteCols = [

      { field: 'ItemName', header: 'Item', width: '30%', align: 'left', wrap: 'break-word', edit: 'no' },
      { field: 'SupplierName', header: 'Supplier', width: '20%', align: 'left', wrap: 'break-word', edit: 'no' },
      { field: 'OrderQuantity', header: 'Quantity', width: '15%', align: 'right', wrap: 'break-word', edit: 'yes' },
      { field: 'UOM', header: 'UOM', width: '7%', align: 'left', wrap: 'break-word', edit: 'no' },
      { field: 'PUOM', header: 'Purchase UOM', width: '8%', align: 'left', wrap: 'break-word', edit: 'yes' },
      { field: 'ConvertedOrderQuantity', header: 'Purchase Qty.', hwidth: '8%', width: '7%', align: 'right', wrap: 'break-word', edit: 'yes' },
      { field: 'ExpectedDeliveryinDays', header: 'Expected Delivery in Days', width: '9%', align: 'right', wrap: 'break-word', edit: 'yes' },
    ];

    this.QuoteCols1 = [

      { field: 'ItemName', dispfield: 'ItemName', header: 'Item', width: '30%', align: 'left', wrap: 'break-word', edit: 'no' },
      { field: 'OrderQuantity', dispfield: 'OrderQuantityTxt', header: 'Quantity', width: '10%', align: 'right', wrap: 'break-word', edit: 'no' },
      { field: 'UOMID', dispfield: 'UOM', header: 'UOM', width: '10%', align: 'left', wrap: 'break-word', edit: 'no' },
      { field: 'PUOM', dispfield: 'PUOM', header: 'Purchase UOM', width: '10%', align: 'left', wrap: 'break-word', edit: 'no' },
      { field: 'ConvertedOrderQuantity', dispfield: 'ConvertedOrderQuantity', header: 'Purchase Qty.', width: '10%', align: 'right', wrap: 'break-word', edit: 'no' },
      { field: 'Rate', dispfield: 'Rate', header: 'Rate', width: '10%', align: 'right', wrap: 'break-word', edit: 'yes', format: 'rate' },
      { field: 'ExpectedDeliveryinDays', dispfield: 'ExpectedDeliveryinDays', header: 'Expected Delivery in Days', width: '10%', align: 'right', wrap: 'break-word', edit: 'no' },
      { field: 'AcceptedDeliveryinDays', dispfield: 'AcceptedDeliveryinDays', header: 'Accepted Delivery in Days', width: '10%', align: 'right', wrap: 'break-word', edit: 'yes', format: 'qty' },
    ];

  }

  loadMastersData() {
    // this.currentQuotationItemDetails = new Array();
    // this.currentQuotationItemList = new Array();
    this.selectedDataGridItem = new QuotationDetails();
    this.SelectedSupplier = new SupplierMasterInfo();
    // this.selectedQuotationItem = new QuotationItemDetails();

    // this.StatusList = this.sessionService.StatusListAll.filter(x=> x.Category == 'Quotation');
    // this.StatusListFiltered = this.commonService.cloneAnyArray(this.StatusList);

    // let allSts = new Status();
    // allSts.Category = 'Quotation';
    // allSts.StatusCode = -1;
    // allSts.StatusMessage = 'All';

    // this.StatusList.unshift(allSts);

    // //loading default search values

    // this.StatusCode = allSts.StatusCode;
    this.ToDate = moment().format();
    // this.QuotationDate =moment().add('months', -3).format();
    this.FromDate = moment().add('months', -3).format();

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

  loadDataGrid() {

    let req = new QuotationDetailsGetBySiteIDRequest();
    req.StartDate = null;
    req.EndDate = null;

    if (this.FromDate != null ) { req.StartDate = moment(this.FromDate).format(); }
    if (this.ToDate != null ) { req.EndDate = moment(this.ToDate).format(); }
    req.StatusCode = this.StatusCode;
    req.TypeID = 1;
    
    this.apiService.postData("QuotationListGetBySiteID", req).subscribe((data: QuotationDetailsGetBySiteIDResponse) => {
      if (data.SuccessCode == 1) {
        this.dataGridList = data.ResultList;

        console.log(data);
          if (this.commonService.getLength(this.dataGridList) > 0)
          {
            this.dataGridList.forEach(x => {
              x.QuotationDateTxt = moment(x.QuotationDate).format(AppConfig.GRID_DATE_FORMAT);
              x.ExpectedResponseDateTxt = moment(x.ExpectedResponseDate).format(AppConfig.GRID_DATE_FORMAT);
            });
          }
        }
        else
        {
          this.sessionService.showError(data.ErrorMessage);
        }
      }); 
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

  DisableEdit(): boolean {

    if (this.selectedData != null) {
      return false;
    }
    else {
      return true;
    }

  }

  addClick() {
    this.openCategoryDialog('ADD');
    // this.Mode = 'ADD';

    // this.apiService.postData("ItemsToBePurchasedGetAll_BySiteID", null).subscribe((data: ItemsToBePurchasedGetAllResponse) => {
    //   if (data.SuccessCode == 1) {
    //     this.PendingItemsList = data.PendigItems;
    //     this.PendingItemsProjectWiseList = data.PendigItemsProjectWise;
    //     this.PurchaseUOMList = data.PurchaseUOMList;

    //     if (this.commonService.getLength(this.PendingItemsList) > 0) {
    //       this.PendingItemsList.forEach(x => {
    //         x.BalanceQty = x.OrderQuantity - x.AlreadyOrderedQty;

    //         x.req = x.OrderQuantity.toString() + ' ' + x.UOM;
    //         x.ord = x.AlreadyOrderedQty.toString() + ' ' + x.UOM;
    //         x.bal = x.BalanceQty.toString() + ' ' + x.UOM;
    //       });
    //     }
    //   }
    //   else {
    //     this.sessionService.showError(data.ErrorMessage);
    //   }
    // });
  }

  openCategoryDialog(nMode: string) {
    console.log(this.selectedDataGridItem);
    let dialogRef = this.dialog.open(QuotationDialogComponent, {
      data: {
        Mode: nMode,
        // TaxList: this.TaxList
        // StatusList: this.StatusList1,
        selectedItem: this.selectedDataGridItem
      },
      height: '550px',
      width: '1000px',
      disableClose: false,
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


  closeClick() {
    this.Mode = 'HOME';
    this.canGenQuote = false;
    this.quoteMode = false;
    this.submitAttempt = false;

    this.showApprove = false;
    this.showReject = false;
    this.showCancel = false;
    this.showSubmit = false;
  }

  cancelClick() {
    this.showApprove = false;
    this.showReject = false;
    this.showCancel = false;
    this.showSubmit = false;

    this.quoteMode = false;
    this.submitAttempt = false;

    if (this.Mode == 'EDIT') {
      this.closeClick();
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

   this.canGen();
  }


  canGen() {
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
      this.canGenQuote = false;
    }
    else {
      if (this.commonService.getLength(this.SelectedSupplierList)>0 && this.selectedDataGridItem != null && this.selectedDataGridItem.ExpectedResponseDate != null)
      {
        this.canGenQuote = true;
      }
      else
      {
        this.canGenQuote = false;
      }
    }
  }

  newQuotation() {
    this.quoteMode = true;
    this.quoteSubmitAttempt = false;
    this.submitAttempt = false;
    this.amtLabel = 'Amount';
    this.selectedDataGridItem = new QuotationDetails();
    this.SelectedSupplierList = new Array();
    this.SelectedSupplier = new SupplierMasterInfo();
    this.currentQuotationItemDetails = new Array();
    this.currentQuotationItemList = new Array();
    this.totalQuoteCost = 0;
    this.supplierCount = 0;

    let id: number;
    id = 1;

    console.log(this.PurchaseUOMList);

    if (this.commonService.getLength(this.PendingItemsList) > 0) {
      this.PendingItemsList.forEach(x => {
        if (x.IsSelected == true) {
          let nItem = new QuotationItemDetails();

          nItem.QuotationDetailID = id;
          nItem.ItemID = x.ItemID;
          nItem.ItemName = x.ItemName;
          nItem.OrderQuantity = x.BalanceQty;
          nItem.UOM = x.UOM;
          nItem.UOMID = x.UOMID;


          let tmp = this.PurchaseUOMList.filter(d => d.ItemID == nItem.ItemID);

          console.log(tmp);

          if (this.commonService.getLength(tmp) > 0) {


            if (this.commonService.getLength(tmp) == 1) {

              nItem.ConvertedOrderQuantity = Math.round(nItem.OrderQuantity / nItem.ConversionRate);
            }

          }
          else {
            let nUOM = new Master_Item_PUOM();
            nUOM.PUOMID = nItem.UOMID;
            nUOM.UOM = nItem.UOM;
            nUOM.BaseConversionRate = 1;



            nItem.PUOMID = nItem.UOMID;
            nItem.PUOM = nItem.UOM;
            nItem.ConversionRate = 1;
            nItem.ConvertedOrderQuantity = nItem.OrderQuantity;
          }

          console.log(nItem);

          //nItem.OrderQuantityTxt = x.bal;
          this.currentQuotationItemDetails.push(nItem);
          this.currentQuotationItemList.push(nItem);

          id = id + 1;
        }
      });

      this.showSubmit = true;
      this.updateRowGroupMetaData();
    }


  }

  onCompleteColorSelectionPUOM(itm: PurchaseItemOrderInfoExtn) {
    // if (itm != null) {
    //   if (itm.PUOMID != null) {
    //     let tmp = itm.PUOMList.find(d => d.PUOMID == itm.PUOMID);

    //     if (tmp != null) {
    //       itm.PUOM = tmp.UOM;
    //       itm.ConversionRate = tmp.BaseConversionRate;
    //     }
    //     else if (itm.PUOMID == itm.UOMID) {
    //       itm.ConversionRate = 1;
    //     }

    //     if (itm.OrderQuantity != null) {
    //       let cq = itm.OrderQuantity / itm.ConversionRate;
    //       cq = Math.round(cq);
    //       itm.ConvertedOrderQuantity = cq;
    //     }



    //   }
    // }
  }

  onSort() {
    this.updateRowGroupMetaData();
  }

  updateRowGroupMetaData() {
    this.rowGroupMetadata = {};
    if (this.currentQuotationItemDetails) {
      for (let i = 0; i < this.currentQuotationItemDetails.length; i++) {
        let rowData = this.currentQuotationItemDetails[i];
        let ItemID = rowData.ItemID;
        if (i == 0) {
          this.rowGroupMetadata[ItemID] = { index: 0, size: 1 };
        }
        else {
          let previousRowData = this.currentQuotationItemDetails[i - 1];
          let previousRowGroup = previousRowData.ItemID;
          if (ItemID === previousRowGroup)
            this.rowGroupMetadata[ItemID].size++;
          else
            this.rowGroupMetadata[ItemID] = { index: i, size: 1 };
        }
      }
    }
  }

  updateSupplierOnQuotationItemDetails() {
    let tmp: QuotationItemDetails[];
    tmp = new Array();

    if (this.commonService.getLength(this.currentQuotationItemList) > 0) {
      this.currentQuotationItemList.forEach(x => {

        if (this.commonService.getLength(this.SelectedSupplierList) > 0) {
          this.SelectedSupplierList.forEach(y => {

            let d = this.currentQuotationItemDetails.find(r => r.ItemID == x.ItemID && r.SupplierID == y.SupplierID);

            if (d != null) {
              tmp.push(d);
            }
            else {
              let z = this.commonService.cloneAny(x);
              z.SupplierID = y.SupplierID;
              z.SupplierName = y.SupplierName;

              tmp.push(z);
            }

          });

        }
        else {
          tmp.push(x);
        }


      });

      this.currentQuotationItemDetails = tmp;
    }


  }

  
  onDoubleClick(QuotationDet: QuotationDetails) {
    
    this.selectedDataGridItem = this.commonService.cloneAny(QuotationDet);
    
    // this.GetQuotationDetails(QuotationDet.QuotationID);
    // if (QuotationDet != null) {
    //   this.selectedDataGridItem.QuotationDate = moment(QuotationDet.QuotationDate).format();
    //   this.selectedDataGridItem.ExpectedResponseDate = moment(QuotationDet.ExpectedResponseDate).format();
    // }

    if (this.selectedDataGridItem != null)
    {
      this.openCategoryDialog('EDIT');
    }

  }

  GetQuotationDetails(ID: number) {
    // this.currentQuotationItemDetails = new Array();
    // this.currentQuotationItemList = new Array();

    // this.submitAttempt = false;

    // let req = new ServiceRequest();
    // req.ID = ID;

    // this.apiService.postData("QuotationDetailsGetByQuotationID", req).subscribe((data: QuotationDetailsGetByQuotationIDResponse) => {
    //   if (data.SuccessCode == 1) {
    //     this.currentQuotationItemDetails = data.QuotationItemDetais;

    //     this.Mode = 'EDIT';
    //     this.quoteMode = true;
    //     this.quoteSubmitAttempt = false;

    //     if (this.commonService.getLength(this.currentQuotationItemDetails) > 0) {
    //       this.currentQuotationItemDetails.forEach(x => {
    //         x.OrderQuantityTxt = x.OrderQuantity + ' ' + x.UOM;
    //       });
    //     }

    //     console.log(this.currentQuotationItemDetails);

    //   }
    //   else {
    //     this.sessionService.showError(data.ErrorMessage);
    //   }
    // });
  }

  cancelQuoteClick()
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

            let req = new UpdatePurchaseQuoteRequest();
            req.Result = new QuotationDetails();
            req.Result.QuotationID = this.selectedData.QuotationID;
            req.Result.StatusCode = QuotationStatus.QuoteCancelled;
  
            this.apiService.postData("UpdatePurchaseQuotation", req).subscribe((data: SaveReponse) => {
                if (data.SuccessCode == 1) {
  
                    this.sessionService.showSuccess("Quotation cancelled successfully");
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

  onItemValueChange(rowData1: QuotationItemDetails) {
    let cq = 0;

    if (rowData1 != null && rowData1.OrderQuantity != null) {
      cq = rowData1.OrderQuantity / rowData1.ConversionRate;

      rowData1.ConvertedOrderQuantity = cq;

      let tmp = this.currentQuotationItemDetails.find(d => d.ItemID == rowData1.ItemID);

      if (tmp != null) {
        this.currentQuotationItemDetails.find(d => d.ItemID == rowData1.ItemID).ConvertedOrderQuantity = cq;
      }
    }
    // console.log(rowData1);

    // this.currentQuotationItemDetails.forEach(x=> {
    //   x.OrderQuantityTxt = null;

    //   if (x.SupplierID == rowData1.SupplierID && x.ItemID == rowData1.ItemID && rowData1.OrderQuantity != null)
    //   {
    //     x.OrderQuantityTxt = rowData1.OrderQuantity.toString();          
    //   }
    // });           
  }

  remove(supp: SupplierMasterInfo) {
    const index = this.SelectedSupplierList.indexOf(supp);

    if (index >= 0) {
      this.SelectedSupplierList.splice(index, 1);
    }

    this.supplierCount = this.commonService.getLength(this.SelectedSupplierList);
    this.updateSupplierOnQuotationItemDetails();
  }

  onSupplierChange() {
    //this.SelectedSupplier = null;
    if (this.SelectedSupplier && this.SelectedSupplier.SupplierID != null) {
      //this.SelectedSupplier = this.SupplierList.find(x=> x.SupplierID == this.selectedDataGridItem.SupplierID);
      let tmpSupp = this.SupplierList.find(x => x.SupplierID == this.SelectedSupplier.SupplierID);

      const index = this.SelectedSupplierList.indexOf(tmpSupp);

      if (index < 0) {
        this.SelectedSupplierList.push(tmpSupp);
      }

      this.supplierCount = this.commonService.getLength(this.SelectedSupplierList);
      this.updateSupplierOnQuotationItemDetails();

      this.SelectedSupplier = new SupplierMasterInfo();
      this.canGen();
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


  validateQuotationItemRequest(): boolean {

    let validateResult: boolean;
    validateResult = true;

    if (this.commonService.getLength(this.currentQuotationItemDetails) > 0) {
      this.currentQuotationItemDetails.forEach(x => {
        if (!x.ExpectedDeliveryinDays) {
          validateResult = false;
          return validateResult;
        }

      });
    }
    return validateResult;
  }

  quoteRequestSubmit(isValid: boolean, dialogform: any, action: string) {
    this.submitAttempt = true;
    this.quoteSubmitAttempt = true;

    let isValidQuotationItemRequest = this.validateQuotationItemRequest();

    if (isValid && isValidQuotationItemRequest) {
      let req = new QuotationCreateRequest();
      req.ItemDetails = new Array();
      req.QuotationDate = this.selectedDataGridItem.QuotationDate;
      req.ExpectedResponseDate = this.selectedDataGridItem.ExpectedResponseDate;


      if (this.commonService.getLength(this.currentQuotationItemDetails) > 0) {
        this.currentQuotationItemDetails.forEach(x => {
          let newTmp = new QuotationCreateItemDetails();

          newTmp.ItemID = x.ItemID;
          newTmp.ItemName = x.ItemName;
          newTmp.QuotationDetailID = x.QuotationDetailID;
          newTmp.OrderQuantity = x.OrderQuantity;
          newTmp.OrderQuantityTxt = x.OrderQuantityTxt;
          newTmp.SupplierID = x.SupplierID;
          newTmp.UOM = x.UOM;
          newTmp.ExpectedDeliveryinDays = x.ExpectedDeliveryinDays;
          newTmp.AcceptedDeliveryinDays=x.AcceptedDeliveryinDays;

          newTmp.UOMID = x.UOMID;
          newTmp.PUOMID = x.PUOMID;
          newTmp.ConversionRate = x.ConversionRate;
          newTmp.ConvertedOrderQuantity = x.ConvertedOrderQuantity;

          req.ItemDetails.push(newTmp);

        });
      }

      if (this.commonService.getLength(this.SelectedSupplierList) > 0) {
        this.SelectedSupplierList.forEach(x => {
          if (!req.SupplierList) {
            req.SupplierList = x.SupplierID.toString();
          }
          else {
            req.SupplierList = req.SupplierList + ',' + x.SupplierID.toString();
          }

        });
      }

      console.log(req);


      this.apiService.postData("QuotationCreate", req).subscribe((data: ServiceReponse) => {
        if (data.SuccessCode == 1) {
          this.sessionService.showSuccess('Quotation successfully created');
          this.closeClick();
          this.loadDataGrid();
        }
        else {
          this.sessionService.showError(data.ErrorMessage);
        }
      });

    }

  }

  validateQuotationItemUpdate(): boolean {
    let result: boolean;
    result = true;

    if (this.commonService.getLength(this.currentQuotationItemDetails) > 0) {
      this.currentQuotationItemDetails.forEach(x => {

        if (!x.Rate || !x.AcceptedDeliveryinDays) {
          result = false;
          return result;
        }

      });
    }

    return result;
  }

  quoteUpdateSubmit(isValid: boolean, dialogform: any, action: string) {
    this.submitAttempt = true;

    let isValidQuotationItemUpdate = this.validateQuotationItemUpdate();

    if (isValid && isValidQuotationItemUpdate) {
      let req = new QuotationUpdateRequest();
      req.ItemDetails = new Array();
      req.QuotationDate = this.selectedDataGridItem.QuotationDate;
      req.ExpectedResponseDate = this.selectedDataGridItem.ExpectedResponseDate;
      req.QuotationReceivedDate = this.selectedDataGridItem.QuotationReceivedDate;
      req.StatusCode = this.selectedDataGridItem.StatusCode;
      req.SupplierID = this.selectedDataGridItem.SupplierID;
      req.QuotationID = this.selectedDataGridItem.QuotationID;

      if (this.commonService.getLength(this.currentQuotationItemDetails) > 0) {

        this.currentQuotationItemDetails.forEach(x => {

          let newTmp = new QuotationCreateItemDetails();

          newTmp.ItemID = x.ItemID;
          newTmp.ItemName = x.ItemName;
          newTmp.QuotationDetailID = x.QuotationDetailID;
          newTmp.OrderQuantity = x.OrderQuantity;
          newTmp.OrderQuantityTxt = x.OrderQuantityTxt;
          newTmp.SupplierID = x.SupplierID;
          newTmp.UOM = x.UOM;
          newTmp.ExpectedDeliveryinDays = x.ExpectedDeliveryinDays;
          newTmp.AcceptedDeliveryinDays = x.AcceptedDeliveryinDays;
          newTmp.Rate = x.Rate;

          req.ItemDetails.push(newTmp);

        });
      }

      this.apiService.postData("QuotationUpdate", req).subscribe((data: ServiceReponse) => {
        if (data.SuccessCode == 1) {
          this.sessionService.showSuccess('Quotation successfully updated');
          this.closeClick();
          this.loadDataGrid();
        }
        else {
          this.sessionService.showError(data.ErrorMessage);
        }
      });

    }

  }

  onSearchKeyUp() {
    this.selectedDataGridItem = null;
  }

  rowSelected(): boolean {

    if (this.selectedData != null) {
      if (this.selectedData.StatusCode == QuotationStatus.New) {
        return true;
      }
      else {
        return false;
      }
    }
    else {
      return false;
    }

  }

  cancelClickButton() {

    if (this.selectedData != null) {

      let dialogRef = this.dialog.open(ConfirmDialogComponent, {
        data: {
          DialogHeader: 'Alert',
          DialogMessage: 'Are you sure you want to cancel'
        },
        disableClose: true,
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result == 1) {

          let req = new QuotationUpdateRequest();
          req.ItemDetails = new Array();
          req.QuotationDate = this.selectedData.QuotationDate;
          req.ExpectedResponseDate = this.selectedData.ExpectedResponseDate;
          req.StatusCode = 360;
          req.SupplierID = this.selectedData.SupplierID;
          req.QuotationID = this.selectedData.QuotationID;

          this.apiService.postData("QuotationUpdate", req).subscribe((data: ServiceReponse) => {
            if (data.SuccessCode == 1) {
              this.sessionService.showSuccess('Quotation successfully updated');
              this.closeClick();
              this.loadDataGrid();
            }
            else {
              this.sessionService.showError(data.ErrorMessage);
            }
          });

        }
        else {
          return;
        }
      });

    }

  }

  LoadQuoteGeneratePendingList() {

    this.submitAttempt = false;
    this.selectedDataGridItem = new QuotationDetails();
    this.SelectedSupplier =  new SupplierMasterInfo();
    this.SelectedSupplierList = new Array();

    let req = new ServiceRequest();
    this.PendingItemsList = new Array();
    this.apiService.postData("POGeneratePendingListGetByCorpID", req).subscribe((data: PurchasePendingItemGetByCorpIDResponse) => {
      if (data.SuccessCode == 1) {
        this.PendingItemsList = data.ResultList;

        if (this.commonService.getLength(this.PendingItemsList) > 0) {
          this.PendingItemsList.forEach(x => {
            x.ExpectedDeliveryDateStr = moment(x.ExpectedDeliveryDate).format(AppConfig.GRID_DATE_FORMAT);
            x.ItmExpectedDeliveryDateStr = moment(x.ItmExpectedDeliveryDate).format(AppConfig.GRID_DATE_FORMAT);
            x.PurchaseRequestDateStr = moment(x.PurchaseRequestDate).format(AppConfig.GRID_DATE_FORMAT);
          });

          console.log(this.PendingItemsList);

        }
      }
      else {
        this.sessionService.showError(data.ErrorMessage);
      }
    });

    this.Mode = 'QUOTGEN';

  }

  onSelectAll() {
    if (this.commonService.getLength(this.PendingItemsList) > 0) {
      this.PendingItemsList.forEach(x => {
        x.IsSelected = this.IsSelectAll
      });
    }
  }

  canSave():boolean {
    if (this.commonService.getLength(this.PendingItemsList)>0) {


        if ((this.Mode == 'QUOTGEN' && this.selectedDataGridItem.StatusCode == QuotationStatus.New) ||
            (this.Mode == 'EDIT' && (this.selectedDataGridItem.StatusCode == QuotationStatus.QuoteRedirectedToEntry || 
                                     this.selectedDataGridItem.StatusCode == QuotationStatus.QuoteResponseReceived || 
                                     this.selectedDataGridItem.StatusCode == QuotationStatus.QuoteRequestPlaced )
            ))
        {
            return true;
        }
        else {
            return false;
        }
    }
    else
    {
        return false;
    }
  }

  generateQuotationsFromRequest() {
    this.submitAttempt = true;

    if (this.commonService.getLength(this.PendingItemsList)>0 && this.canGenQuote == true)
    {
      let selected = 0;
      let okitems = 0;

      this.PendingItemsList.forEach(x=> {
        if (x.IsSelected == true)
        {
          selected = selected + 1;
          if (x.ExpectedDeliveryinDays != null && x.ExpectedDeliveryinDays > 0)
          {
            okitems = okitems + 1;
          }
        }

      });

      if (selected > 0 && selected == okitems)
      {

        let dialogRef = this.dialog.open(ConfirmDialogComponent, {
            data: {
                DialogHeader: 'Alert',
                DialogMessage: 'Are you sure ?'
            },
            disableClose: true,
        });

        dialogRef.afterClosed().subscribe(result => {

          if (result == 1) {
            this.proceedToPlaceQuoteRequest();
          }
          else {
               //do nothing
          }
          
      });


      }
      else
      {
        this.sessionService.showError('Some mandatory informations are missing, please check');
        return;  
      }
    }
 

  }

  proceedToPlaceQuoteRequest()
  {
    let reqList:SavePurchaseQuoteRequest[];

    if (this.commonService.getLength(this.SelectedSupplierList) > 0) {
      reqList = new Array();

      this.SelectedSupplierList.forEach(x => {         
          let req = new SavePurchaseQuoteRequest();
          req.Result = new QuotationDetails();

          req.Result.SupplierID = Number(x.SupplierID.toString());                            
          req.Result.QuoteTypeID = 1;
          req.Result.QuotationDate = moment().format();
          req.Result.ExpectedResponseDate = this.selectedDataGridItem.ExpectedResponseDate;
          req.Result.StatusCode = QuotationStatus.QuoteRequestPlaced;       
          req.SaveType = AppConfig.SaveType_Insert;

          req.PurchaseItemDetailList = new Array();

          if (this.commonService.getLength(this.PendingItemsList) > 0) {
              this.PendingItemsList.forEach(d => {      
                
                if (d.IsSelected == true)
                {
                  let itm = new QuotationItemDetails();
                  //itm.QuotationDetailID =  d.QuotationDetailID;
                  itm.QuotationID =  -1;
                  itm.ItemID =  d.ItemID;
                  itm.OrderQuantity =  d.ApprovedQuantity;                    
                  itm.UOMID = d.UOMID;
                  itm.ItemRemarks = d.ItemRemarks;                    

                  if (d.Rate == undefined || d.Rate == null) 
                  {
                    d.Rate = 0;
                  }

                  if (d.AcceptedDeliveryinDays == undefined || d.AcceptedDeliveryinDays == null) 
                  {
                    d.AcceptedDeliveryinDays = 0;
                  }

                  itm.Rate =  d.Rate;
                  itm.ExpectedDeliveryinDays = d.ExpectedDeliveryinDays;
                  itm.AcceptedDeliveryinDays = d.AcceptedDeliveryinDays;

                  itm.AcceptedQuantity = 0;
                  itm.ItemValue = 0;
                  itm.TaxAmount = 0;
                  itm.TaxPercentage = 0;
                  itm.DiscountAmount = 0;
                  itm.DiscountPercentage = 0;
                  itm.TotalItemValue = 0;

                  req.PurchaseItemDetailList.push(itm);

                }

              });
          }

          if (req.Result != null)
          {
              req.Result.QuotationDate = moment(req.Result.QuotationDate).format(AppConfig.UPDATE_DATE_FORMAT);
              req.Result.ExpectedResponseDate = moment(req.Result.ExpectedResponseDate).format(AppConfig.UPDATE_DATE_FORMAT);
          }

          reqList.push(req);
      
      });


      if (this.commonService.getLength(reqList)>0)
      {
        let mVal = 0;
        let cVal = 0;
        let l = 0;
        mVal = Math.floor(100/reqList.length);

        reqList.forEach(x=> {
          l = l + 1;
          
          console.log(x);
          
          this.CreatePurchaseQuotaion(x).then((success)=> {
              this.value = Math.floor(l * mVal);

              if (l == reqList.length) 
              { 
                this.sessionService.showSuccess("Quotation request created successfully");
                this.Mode = 'HOME';                    
                this.value = 0;
                this.loadDataGrid();
              }

            }).catch((error) => {
              console.log(error);
          });

        });

      }

    }

  }


  CreatePurchaseQuotaion(rq:SavePurchaseQuoteRequest)
  {
    return new Promise<ServiceReponse>((resolve, reject) => {
      this.apiService.postData("SavePurchaseQuotation", rq).subscribe((data: ServiceReponse) => {
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


}
