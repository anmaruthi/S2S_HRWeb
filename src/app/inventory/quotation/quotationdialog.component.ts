import { Component, Inject, OnInit, AfterViewInit } from '@angular/core';
import { WebApiService } from "../../service/webapi.service";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SessionService } from "../../service/session.service";
import { CommonService } from "../../service/common.service";
import { AppConfig, logLevel, QuotationStatus } from "../../const/app.config";
import { BillingAddress, DeliveryAddress, FieldMasterInfo, ItemCategoryTaxDetails, Master_Item, Master_LookUp, Master_UOM, PurchaseItemOrderInfo, PurchaseItemOrderInfoExtn, PurchaseOrderInfo, PurchaseOrderList, QuotationCreateItemDetails, QuotationDetails, QuotationInfo, QuotationItemDetails, StageStatus, Status, SupplierMasterInfo, TaxmasterInfo } from 'src/app/model/shared.model';
import { QuotationCreateRequest, QuotationDetailGetByQuoteIDRequest, SavePurchaseQuoteRequest, ServiceRequest, SubmitPurchaseOrderRequest, TaxMasterGetAllRequest } from 'src/app/model/request.model';
import { MasterDataForPurchaseOrderGetByCorpIDResponse, QuotationDetailsGetByQuotationIDResponse, SaveReponse, ServiceReponse, TaxMasterGetAllByCorpIDResponse } from 'src/app/model/response.model';
import { ConfirmDialogComponent } from '../../common/confirmdialog.component';
import { FormGroup, FormControl } from '@angular/forms';
import * as moment from 'moment';
@Component({
    templateUrl: './quotationdialog.component.html',
    styleUrls: ['./quotationdialog.component.css']
})

export class QuotationDialogComponent implements OnInit {

    cols1: any[];
    public submitAttempt: boolean;
    public quoteSubmitAttempt: boolean;
    public selectedDataGridItem: QuotationDetails;
    public dialogItemBase: QuotationDetails;

    public selectedData: QuotationDetails;
    public FilteredMaterialList: Master_Item[];
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

    //   public selectedPendingItemData: PurchasePendingItem;
    //   public PendingItemsList: PurchasePendingItem[];
    //   public PendingItemsProjectWiseList: PurchasePendingItemProjectWise[];
    //   public PurchaseUOMList: Master_Item_PUOM[];

    public canGenQuote: boolean;
    public quoteMode: boolean;

    public SupplierList: SupplierMasterInfo[];
    public SelectedSupplier: SupplierMasterInfo;
    public SelectedSupplierList: SupplierMasterInfo[];
    public FormColumnsWidth: number;
    public RwID: number;
    public dialogItemDetailList: QuotationItemDetails[];
    public txtMessage: any;
    public dialogItemDetail: QuotationItemDetails;
    public SelectedMaterial: Master_Item;
    public Mode1: string;
    public dialogItem: QuotationDetails;
    public StatusList1: Status[];
    public submitAttempt1: boolean;
    public Date: string;
    public LookUpList: Master_LookUp[];
    public FieldList: FieldMasterInfo[];
    public MaterialList: Master_Item[];
    public UOMList: Master_UOM[];
    public StageStatusList: StageStatus[];
    public RequestFlag: boolean;
    public ReceiveFlag: boolean;

    currentQuotationItemList: QuotationItemDetails[];
    currentQuotationItemDetails: QuotationItemDetails[];
    supplierCount: number;
    rowGroupMetadata: any;
    value: number = 0;

    constructor(public dialogRef: MatDialogRef<QuotationDialogComponent>, public dialog: MatDialog,
        @Inject(MAT_DIALOG_DATA) public DialogInputData: any, public sessionService: SessionService,
        public commonService: CommonService, private apiService: WebApiService) {
        this.FormColumnsWidth = 600;

    }

    ngOnInit() {
        
        this.cols1 = [
            { field: 'ItemName', header: 'Material', width: '40%', align: 'left', wrap: 'break-word' },
            { field: 'OrderQuantity', header: 'Quantity', width: '30%', align: 'left', wrap: 'break-word' },
            { field: 'UOM', header: 'UOM', width: '7%', align: 'left', wrap: 'break-word' },
            { field: 'ExpectedDeliveryinDays', header: 'Exp.Delivery In Days ', width: '30%', align: 'right', wrap: 'break-word' },

        ];

        this.QuoteCols = [

            { field: 'ItemName', header: 'Material', width: '50%', align: 'left', wrap: 'break-word', edit: 'no' },
            { field: 'OrderQuantity', header: 'Quantity', width: '15%', align: 'right', wrap: 'break-word', edit: 'yes' },
            { field: 'UOM', header: 'UOM', width: '15%', align: 'left', wrap: 'break-word', edit: 'no' },
            { field: 'ExpectedDeliveryinDays', header: 'Exp.Delivery in Days', width: '15%', align: 'right', wrap: 'break-word', edit: 'yes' },
        ];


        this.RwID = 0;
        this.Mode = this.DialogInputData.Mode;
        this.txtMessage = this.DialogInputData.txtMessage;
        this.submitAttempt = false;
        this.submitAttempt1 = false;

        this.RequestFlag = false;
        this.ReceiveFlag = false;   
        
        this.dialogItemDetailList = new Array();
        this.SelectedSupplierList = new Array();
        this.SelectedSupplier = new SupplierMasterInfo();

        if (this.Mode == 'ADD') {
            this.selectedDataGridItem = new QuotationDetails();           
            this.dialogItemDetail = new QuotationItemDetails();   
            this.RequestFlag = true;         
        }
        else {
            this.selectedDataGridItem = Object.assign({}, this.DialogInputData.selectedItem);
            this.dialogItemBase = Object.assign({}, this.DialogInputData.selectedItem);
            //this.dialogItemDetail = Object.assign({}, this.DialogInputData.selectedItemDetail);
            this.FilteredMaterialList = new Array();
            this.selectedDataGridItem.StatusCode = this.DialogInputData.selectedItem.StatusCode;

        }
        
        this.loadMasterData();

    }

    canSubmit():boolean {
        if (this.selectedDataGridItem != null && this.commonService.getLength(this.dialogItemDetailList)>0) {
            if ((this.Mode == 'EDIT' && this.selectedDataGridItem.StatusCode == QuotationStatus.QuoteResponseReceived ))
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

    canSave():boolean {
        if (this.selectedDataGridItem != null && this.commonService.getLength(this.dialogItemDetailList)>0) {
            if ((this.Mode == 'ADD' && this.selectedDataGridItem.StatusCode == QuotationStatus.New) ||
                (this.Mode == 'EDIT' && (this.selectedDataGridItem.StatusCode == QuotationStatus.QuoteRedirectedToEntry || 
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

    submitClick(isValid: boolean, choice:string)
    {
        this.submitAttempt = true;

        if (isValid && this.commonService.getLength(this.dialogItemDetailList) > 0) {
            if (this.Mode1 == 'ADD' || this.Mode1 == 'EDIT') {
                this.submitAttempt = false;
                this.sessionService.showError('Kindly Close Material Dialog ..!');
                return;
            }
            let poID: number;

            if (this.commonService.getLength(this.SelectedSupplierList) > 0) {
                let mVal = 0;
                let cVal = 0;
                let l = 0;
                mVal = Math.floor(100/this.SelectedSupplierList.length);

                console.log(this.SelectedSupplierList);
                this.SelectedSupplierList.forEach(x => {
                    l = l + 1;

                    let req = new SavePurchaseQuoteRequest();
                    req.Result = new QuotationDetails();

                    req.Result.SupplierID = Number(x.SupplierID.toString());                            
                    req.Result.QuotationID = this.selectedDataGridItem.QuotationID;
                    req.Result.QuotationNumber = this.selectedDataGridItem.QuotationNumber;
                    req.Result.QuotationNumberString = this.selectedDataGridItem.QuotationNumberString;
                   
                    if (this.Mode == 'ADD')
                    {
                        req.Result.QuoteTypeID = 1;
                    }
                    else
                    {
                        req.Result.QuoteTypeID = this.selectedDataGridItem.QuoteTypeID;

                    }
                    

                    req.Result.QuotationDate = this.selectedDataGridItem.QuotationDate;
                    req.Result.QuotationDateTxt = this.selectedDataGridItem.QuotationDateTxt;
                    req.Result.ExpectedResponseDate = this.selectedDataGridItem.ExpectedResponseDate;
                    req.Result.ExpectedResponseDateTxt = this.selectedDataGridItem.ExpectedResponseDateTxt;
                    req.Result.StatusCode = this.selectedDataGridItem.StatusCode;
                    req.Result.StatusMessage = this.selectedDataGridItem.StatusMessage;
                    req.Result.Remarks = this.selectedDataGridItem.Remarks;
                    req.Result.NoteToUser = this.selectedDataGridItem.NoteToUser;        
                    
                    if (this.Mode == 'ADD') {
                        req.Result.StatusCode = QuotationStatus.QuoteRequestPlaced;
                        req.SaveType = AppConfig.SaveType_Insert;
                        poID = -1;
                    }
                    else {
                        req.SaveType = AppConfig.SaveType_Update;
                        poID = this.selectedDataGridItem.QuotationID;

                        if (choice == 'SUBMIT')
                        {
                            req.Result.StatusCode = QuotationStatus.QuoteResponseReceived;
                        }
                        else if (choice == 'APPROVE')
                        {
                            req.Result.StatusCode = QuotationStatus.QuoteApproved;
                        }
                        else if (choice == 'REJECT')
                        {
                            req.Result.StatusCode = QuotationStatus.QuoteRejected;
                        }

                        req.Result.QuotationReceivedDate = this.selectedDataGridItem.QuotationReceivedDate;
                        req.Result.QuotationReceivedDateTxt = this.selectedDataGridItem.QuotationReceivedDateTxt
                    }
                
                    req.PurchaseItemDetailList = new Array();

                    if (this.commonService.getLength(this.dialogItemDetailList) > 0) {
                        this.dialogItemDetailList.forEach(d => {        

                            if (d.Rate == undefined || d.Rate == null) { d.Rate = 0; }          
                            if (d.AcceptedDeliveryinDays == undefined || d.AcceptedDeliveryinDays == null)  { d.AcceptedDeliveryinDays = 0; }
                            if (d.AcceptedQuantity == undefined || d.AcceptedQuantity == null) { d.AcceptedQuantity = 0; }
                            if (d.ItemValue == undefined || d.ItemValue == null) { d.ItemValue = 0; }
                            if (d.TaxAmount == undefined || d.TaxAmount == null) { d.TaxAmount = 0; }
                            if (d.TaxPercentage == undefined || d.TaxPercentage == null) { d.TaxPercentage = 0; }
                            if (d.DiscountAmount == undefined || d.DiscountAmount == null) { d.DiscountAmount = 0; }
                            if (d.DiscountPercentage == undefined || d.DiscountPercentage == null) { d.DiscountPercentage = 0; }
                            if (d.TotalItemValue == undefined || d.TotalItemValue == null) { d.TotalItemValue = 0; }

                            let itm = new QuotationItemDetails();
                            itm.QuotationDetailID =  d.QuotationDetailID;
                            itm.QuotationID =  poID;
                            itm.ItemID =  d.ItemID;
                            itm.OrderQuantity =  d.OrderQuantity;
			                itm.AcceptedQuantity = d.AcceptedQuantity;
                            itm.Rate =  d.Rate;
                            itm.ItemValue =  d.ItemValue;
                            itm.UOMID = d.UOMID;
                            itm.TaxPercentage =  d.TaxPercentage;
                            itm.TaxAmount =  d.TaxAmount;
                            itm.DiscountPercentage = d.DiscountPercentage;
                            itm.DiscountAmount = d.DiscountAmount;
                            itm.TotalItemValue = d.TotalItemValue;
                            itm.ItemRemarks = d.ItemRemarks;                    
                            itm.StatusCode = d.StatusCode;
                            itm.ExpectedDeliveryinDays = d.ExpectedDeliveryinDays;
                            itm.AcceptedDeliveryinDays = d.AcceptedDeliveryinDays;
                           
                            req.PurchaseItemDetailList.push(itm);
                        });
        
        
                    }
        
                    if (req.Result != null)
                    {
                        req.Result.QuotationDate = moment(req.Result.QuotationDate).format(AppConfig.UPDATE_DATE_FORMAT);
                        req.Result.ExpectedResponseDate = moment(req.Result.ExpectedResponseDate).format(AppConfig.UPDATE_DATE_FORMAT);
                    }
        
                    console.log(req);
                    this.CreatePurchaseQuotaion(req).then((success)=> {
                        this.value = Math.floor(l * mVal);
  
                        if (l == this.SelectedSupplierList.length) 
                        { 
                          this.sessionService.showSuccess("Quotation request created successfully");
                          this.dialogRef.close(1);
                          this.value = 0;
                        }
  
                      }).catch((error) => {
                        console.log(error);
                  });
                    

        
                });
              }

        }
        else {
            this.sessionService.showError('Some mandatory informations are missing, please check');
            return;
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

 
    closeClick() {
        this.dialogRef.close(0);
    }

    addQuotationclick() {
        this.submitAttempt = false;
        this.StatusList = this.sessionService.StatusListAll.filter(x => x.StatusCode == 10);
        this.dialogItemDetail = new QuotationItemDetails();
        this.SelectedMaterial = new Master_Item();
        this.Mode1 = 'ADD';

    }

    editQuotationclick() {
        if (this.dialogItem != null) {
            this.StatusList1 = this.sessionService.StatusListAll.filter(x => x.StatusCode == 10 || x.StatusCode == 20);
            this.dialogItemDetail = this.commonService.cloneAny(this.dialogItem);
            // this.MaterialList.forEach(x => {
            //     if (x.ItemID == this.dialogItem.ItemID) {
            //         this.SelectedMaterial = this.commonService.cloneAny(x);

            //     }
            // });
            this.Mode1 = 'EDIT';
        }
    }

    deleteQutationDetail() {

        if (this.dialogItemDetail != null) {
            let dialogRef = this.dialog.open(ConfirmDialogComponent, {
                data: {
                    DialogHeader: 'Alert',
                    DialogMessage: 'Are you sure you want to delete?'
                },
                disableClose: true,
            });

            dialogRef.afterClosed().subscribe(result => {
                if (result == 1) {
                    let idx = this.dialogItemDetailList.findIndex(d => d.RwID == this.dialogItem.RwID);
                    if (idx != null) {
                        this.dialogItemDetailList.splice(idx, 1);
                    }
                }
                else {
                    this.selectedData = null;
                }
            });
        }
    }

    updateQuotationDetails(isValid: boolean) {
        this.submitAttempt1 = true;
        if (isValid) {

            if (this.Mode1 == 'ADD') {
                let nItm = new QuotationItemDetails();
                nItm = this.commonService.cloneAny(this.dialogItemDetail);
                nItm.ItemName = this.SelectedMaterial.ItemName;

                let yItm = this.dialogItemDetailList.find(x => x.ItemName == nItm.ItemName && x.ItemID == nItm.ItemID);

                if (yItm == null || yItm == undefined) {
                    this.RwID = this.RwID + 1;
                    nItm.RwID = this.RwID;
                    this.dialogItemDetailList.push(nItm);

                }
                else {
                    this.sessionService.showError('Material is already exists ')
                }
            }
            else if (this.Mode1 == 'EDIT') {
                let nItm = new QuotationItemDetails();
                nItm = this.commonService.cloneAny(this.dialogItemDetail);

                let yFlag: boolean;
                yFlag = false;

                let yItm1 = this.dialogItemDetailList.filter(x => x.ItemID == nItm.ItemID && x.RwID != nItm.RwID);
                if (yItm1 != null && yItm1 != undefined && yItm1.length > 0) {
                    yFlag = true;
                }

                if (yFlag == true) {
                    this.sessionService.showError('Material is already exists ')


                }
                else {
                    this.dialogItemDetailList.forEach(x => {
                        if (x.RwID == nItm.RwID && x.ItemID == nItm.ItemID) {
                            x.ItemName = nItm.ItemName;
                            x.OrderQuantity = nItm.OrderQuantity;
                            x.AcceptedQuantity = nItm.AcceptedQuantity;
                            x.UOM = nItm.UOM;
                            x.ExpectedDeliveryinDays = nItm.ExpectedDeliveryinDays;
                            x.AcceptedDeliveryinDays = nItm.AcceptedDeliveryinDays;

                        }
                    });

                }
            }
            this.cancelQuotationForm();
        }

    }

    cancelQuotationForm() {
        this.Mode1 = 'HOME';
        this.submitAttempt1 = false;

    }

    loadMasterData() {
        
        this.Date = moment().format();
        let req = new ServiceRequest();

        this.apiService.postData("MasterDataForPurchaseOrderGetByCorpID", req).subscribe((data: MasterDataForPurchaseOrderGetByCorpIDResponse) => {
            if (data.SuccessCode == 1) {
                this.SupplierList = data.SupplierList;
                this.LookUpList = data.LookupList;
                this.MaterialList = data.MaterialList;
                this.UOMList = data.UOMList
                this.FieldList = data.FieldList;
                this.StageStatusList = data.StageStatusList;
        
                if (this.Mode == 'ADD') {
                    this.selectedDataGridItem.StatusCode = QuotationStatus.New; 
                    this.selectedDataGridItem.QuotationNumberString = 'New';    
                    this.selectedDataGridItem.QuotationDate = moment().format();
                    this.selectedDataGridItem.QuoteTypeID = 1;
                }
                else
                {
                    if (this.selectedDataGridItem != null && this.selectedDataGridItem.SupplierID != null)
                    {
                        let tSupp = this.SupplierList.find(x=> x.SupplierID == this.selectedDataGridItem.SupplierID);

                        if (tSupp != null)
                        {
                            this.SelectedSupplier = this.commonService.cloneAny(tSupp);
                            this.SelectedSupplierList.push(tSupp);
        
                        }

                       
                    }

        
                    this.loadEditQuoteValues();
                }

            }
            else {
                this.sessionService.showError(data.ErrorMessage);
            }
        });

        // if (this.Mode == 'ADD') {
        //     this.StatusList = this.sessionService.StatusListAll.filter(x => x.StatusCode == 10);
        // }
        // else {
        //     this.StatusList = this.sessionService.StatusListAll;

           
        // }

        
       
    }

    DisableEdit1(): boolean {

        if (this.dialogItem != null) {
            return false;
        }
        else {
            return true;
        }
    }

    onSelectMaterial(MaterialInfo: any) {
        if (MaterialInfo != null) {
            this.MaterialList.forEach(x => {
                if (x.ItemID == Number(MaterialInfo.ID)) {
                    this.SelectedMaterial = this.commonService.cloneAny(x);

                }
            });
        }

    }

    SelectUOM(UomInfo: any) {
        if (UomInfo != null) {
            let itm = this.UOMList.find(x => x.UOMID == Number(UomInfo.ID));
            if (itm != null) {
                // this.dialogItemDetail.PUOMID = itm.UOMID;
                this.dialogItemDetail.UOM = itm.UOM;
            }
        }
    }

    onSupplierChange() {      
        
        //this.SelectedSupplier = null;
        if (this.SelectedSupplier && this.SelectedSupplier.SupplierID != null) {
            //this.SelectedSupplier = this.SupplierList.find(x => x.SupplierID == this.SelectedSupplier.SupplierID);
            let tmpSupp = this.SupplierList.find(x => x.SupplierID == this.SelectedSupplier.SupplierID);

            const index = this.SelectedSupplierList.indexOf(tmpSupp);

            if (index < 0) {
                               
                if (this.Mode == 'ADD')
                {
                    this.SelectedSupplierList.push(tmpSupp);
                    this.SelectedSupplier = new SupplierMasterInfo();                    
                }
                else
                {
                    this.SelectedSupplier = this.commonService.cloneAny(tmpSupp);
                    this.SelectedSupplierList = new Array();
                    this.SelectedSupplierList.push(tmpSupp);
                }
            }

            //   this.supplierCount = this.commonService.getLength(this.SelectedSupplierList);
            //   this.updateSupplierOnQuotationItemDetails();
   
        }

    }


    remove(supp: SupplierMasterInfo) {

        const index = this.SelectedSupplierList.indexOf(supp);

        if (index >= 0) {
            this.SelectedSupplierList.splice(index, 1);
        }

        this.supplierCount = this.commonService.getLength(this.SelectedSupplierList);
        this.updateSupplierOnQuotationItemDetails();
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

    onCompleteColorSelectionPUOM(itm: PurchaseItemOrderInfoExtn) {
        // if (itm != null) {
        //     if (itm.PUOMID != null) {
        //         let tmp = itm.PUOMList.find(d => d.PUOMID == itm.PUOMID);

        //         if (tmp != null) {
        //             itm.PUOM = tmp.UOM;
        //             itm.ConversionRate = tmp.BaseConversionRate;
        //         }
        //         else if (itm.PUOMID == itm.UOMID) {
        //             itm.ConversionRate = 1;
        //         }

        //         if (itm.OrderQuantity != null) {
        //             let cq = itm.OrderQuantity / itm.ConversionRate;
        //             cq = Math.round(cq);
        //             itm.ConvertedOrderQuantity = cq;
        //         }



        //     }
        // }
    }

    loadEditQuoteValues()
    {
     
        let req = new QuotationDetailGetByQuoteIDRequest();
        req.QuotationID = this.selectedDataGridItem.QuotationID;

        this.apiService.postData("QuotationDetailsGetByQuotationID", req).subscribe((data: QuotationDetailsGetByQuotationIDResponse) => {
            if (data.SuccessCode == 1) {
        
                this.dialogItemDetailList = data.ResultList;

            }
            else {
                this.sessionService.showError(data.ErrorMessage);
            }
        });

        this.selectedDataGridItem = this.commonService.cloneAny(this.dialogItemBase);

        this.selectedDataGridItem.QuotationDateTxt = moment(this.selectedDataGridItem.QuotationDate).format();
        this.selectedDataGridItem.ExpectedResponseDateTxt = moment(this.selectedDataGridItem.ExpectedResponseDate).format();
        this.selectedDataGridItem.QuotationReceivedDateTxt = moment(this.selectedDataGridItem.QuotationReceivedDate).format();

        if (this.selectedDataGridItem.StatusCode == QuotationStatus.QuoteRequestPlaced)
        {
            this.ReceiveFlag = true;
        }

        this.onSupplierChange();
        if (this.Mode = 'EDIT') {
            this.QuoteCols = [
                { field: 'ItemName', header: 'Material', width: '40%', align: 'left', wrap: 'break-word', edit: 'no' },
                { field: 'OrderQuantity', header: 'Req Quantity', width: '10%', align: 'right', wrap: 'break-word', edit: 'yes' },
                { field: 'AcceptedQuantity', header: 'Accepted Qty', width: '10%', align: 'right', wrap: 'break-word', edit: 'yes' },
                { field: 'UOM', header: 'UOM', width: '15%', align: 'left', wrap: 'break-word', edit: 'no' },
                { field: 'ExpectedDeliveryinDays', header: 'Exp.Delivery In Days', width: '10%', align: 'right', wrap: 'break-word', edit: 'yes' },
                { field: 'AcceptedDeliveryinDays', header: 'Accept. Delivery In Days', width: '10%', align: 'right', wrap: 'break-word', edit: 'yes' },
            ];

            this.selectedDataGridItem.QuotationReceivedDate = moment(this.selectedDataGridItem.QuotationReceivedDate).format();
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

}

