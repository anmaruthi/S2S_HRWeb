import { Component, Inject, OnInit, AfterViewInit } from '@angular/core';
import { WebApiService } from "../../service/webapi.service";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SessionService } from "../../service/session.service";
import { CommonService } from "../../service/common.service";
import { AppConfig, logLevel, PurchaseOrderStatus, BillGstType } from "../../const/app.config";
import { BillingAddress, Currency, DeliveryAddress, FieldMasterInfo, GstType, ItemCategoryTaxDetails, Master_Item, Master_LookUp, Master_UOM, PurchaseItemOrderInfo, PurchaseOrderInfo, PurchaseOrderList, StageStatus, Status, SupplierItem, SupplierMasterInfo, TaxmasterInfo } from 'src/app/model/shared.model';
import { PurchaseOrderDetailRequest, SavePurchaseOrderRequest, ServiceRequest, SubmitPurchaseOrderRequest, TaxMasterGetAllRequest } from 'src/app/model/request.model';
import { MasterDataForPurchaseOrderGetByCorpIDResponse, PurchaseOrderDetailGetByPurchaseOrderIDResponse, SaveReponse, ServiceReponse, TaxMasterGetAllByCorpIDResponse } from 'src/app/model/response.model';
import { ConfirmDialogComponent } from '../../common/confirmdialog.component';
import * as moment from 'moment';

// import {MatCardModule} from '@angular/material/card';
@Component({
    templateUrl: './purchasedialog.component.html',
    styleUrls: ['./purchasedialog.component.css']
})

export class PurchaseDialogComponent implements OnInit {
    cols1: any[];
    cols: any[];
    GstTypeList: GstType[];
    defaultTaxCode = 'GST';
    public Mode1: string;
    public txtMessage: string;
    public Mode: string;
    public dialogItem: PurchaseOrderInfo;
    public dialogItemBase: PurchaseOrderInfo;
    public dialogItemDetailList: PurchaseItemOrderInfo[];
    public dialogItemDetail: PurchaseItemOrderInfo;
    public selectedPOItem: PurchaseItemOrderInfo;
    public submitAttempt: boolean;
    public submitAttempt1: boolean;
    public StatusList: Status[];
    public StatusList1: Status[];
    public TaxList: TaxmasterInfo[];
    public FormColumnsWidth: number;
    public selectedItemCategoryTax: ItemCategoryTaxDetails;
    public SupplierTypeList: Master_LookUp[];
    public SelectedSupplierTypeList: Master_LookUp;
    public LookUpList: Master_LookUp[];
    public PayTermList: Master_LookUp[];
    public DeliveryAddressList: DeliveryAddress[];
    public SelectedDeliveryAddress: DeliveryAddress;
    public BillingAddressList: BillingAddress[];
    public SelectedBillingAddress: BillingAddress;
    public MaterialList: Master_Item[];
    public FilteredMaterialList: Master_Item[];
    public SelectedMaterial: Master_Item;
    public FieldList: FieldMasterInfo[];
    public supplierList: SupplierMasterInfo[];
    public SupplierItemList: SupplierItem[];
    public SupplierItemFilteredList: SupplierItem[];
    public SelectedSupplier: SupplierMasterInfo;
    public FromDate: string;
    public StageStatusList: StageStatus[];
    public TaxDetailList: ItemCategoryTaxDetails[];
    public UOMList: Master_UOM[];
    public CurrencyList: Currency[];
    public userStage:string;
    public userScreen:string;
    public skipVerification:boolean;
    
    Amount: number;
    isOpen: boolean;
    RwID: number;

    displayResponsive: boolean;

    constructor(public dialogRef: MatDialogRef<PurchaseDialogComponent>, public dialog: MatDialog,
        @Inject(MAT_DIALOG_DATA) public DialogInputData: any, public sessionService: SessionService,
        public commonService: CommonService, private apiService: WebApiService) {
        this.FormColumnsWidth = 600;

    }

    ngOnInit() {
        this.cols1 = [
            { field: 'ItemName', header: 'Material', width: '30%', align: 'left', wrap: 'break-word' },
            { field: 'OrderQuantity', header: 'Quantity', width: '7%', align: 'right', wrap: 'break-word' },
            { field: 'PUOM', header: 'UOM', width: '7%', align: 'left', wrap: 'break-word' },
            { field: 'Rate', header: 'Rate', width: '7%', align: 'right', wrap: 'break-word' },
            { field: 'ItemValue', header: 'Amount', width: '7%', align: 'right', wrap: 'break-word' },
            { field: 'TaxPercentage', header: 'GST %', width: '5%', align: 'right', wrap: 'break-word' },
            { field: 'TaxAmount', header: 'GST Amt', width: '5%', align: 'right', wrap: 'break-word' },
            { field: 'DiscountPercentage', header: 'Dis %', width: '5%', align: 'right', wrap: 'break-word' },
            { field: 'DiscountAmount', header: 'Discount', width: '5%', align: 'right', wrap: 'break-word' },
            { field: 'TotalItemValue', header: 'Total', width: '10%', align: 'right', wrap: 'break-word' },           
            { field: 'ExpectedDeliveryDateStr', header: 'Exp.Del.Dt.', width: '10%', align: 'right', wrap: 'break-word' },
        ];
        this.cols = [
            { field: 'SupplierName', header: 'Supplier', width: '30%', align: 'left', wrap: 'break-word' },
            { field: 'ItemPrice', header: 'Rate', width: '7%', align: 'right', wrap: 'break-word' },
        ]

        this.displayResponsive = false;
        this.skipVerification = true;

        this.pushGstTypes();

        this.RwID = 0;
        this.dialogItemDetailList = new Array();

        this.isOpen = false;
        this.Mode = this.DialogInputData.Mode;
        this.txtMessage = this.DialogInputData.txtMessage;
        this.userScreen = this.DialogInputData.screen;
        this.userStage = this.DialogInputData.stage;
        this.submitAttempt = false;
        this.submitAttempt1 = false;

        this.loadMasterData();

        if (this.Mode == 'ADD') {
            this.dialogItem = new PurchaseOrderInfo();
            this.dialogItemDetail = new PurchaseItemOrderInfo();    
            this.dialogItem.EntryUserID = this.sessionService.UserID;
            console.log(this.dialogItem);
        }
        else {
            this.dialogItem = Object.assign({}, this.DialogInputData.selectedItem);
            this.dialogItemBase = Object.assign({}, this.DialogInputData.selectedItem);
            this.dialogItemDetail = Object.assign({}, this.DialogInputData.selectedItemDetail);
            this.calculatePOAmountTotal();
        }

        this.TaxList = Object.assign([], this.DialogInputData.TaxList);
        this.StatusList = Object.assign([], this.DialogInputData.StatusList);
        this.FilteredMaterialList = new Array();
        

      
    }


    showBasicDialog()
    {
        this.displayResponsive = true;
    }

    SetDefaultValues()
    {
        if (this.dialogItem != null)
        {
            this.dialogItem.StatusCode = PurchaseOrderStatus.Initiated;
            this.dialogItem.PurchaseOrderDate = moment().format();
            this.dialogItem.PurchaseOrderNumber = 0;
            this.dialogItem.PurchaseOrderNumberString = 'New';           
            this.dialogItem.GstTypeID = BillGstType.GST;
            this.dialogItem.EntryUserID == this.sessionService.UserID;

            if (this.commonService.getLength(this.PayTermList)>0)
            {
                let itm = this.PayTermList.find(x=> x.IsDefault == true);

                if (itm != null)
                {
                    this.dialogItem.PaymentTermID = itm.LookupID;
                    this.dialogItem.PaymentTerm = itm.Description;
                }
            }
        }
    }

    SetDefaultMaterialValues()
    {
        if (this.dialogItem != null && this.dialogItem.ExpectedDeliveryDate != null)            
        {
            this.dialogItemDetail.ExpectedDeliveryDate = moment(this.dialogItem.ExpectedDeliveryDate).format();
        }
    }

    radioChange()
    {
        this.onChangeDialogItemValue();
        this.calculatePOAmountTotal();

    }

    showNote():boolean
    {
        if (this.userScreen == 'ENTRY' && this.dialogItem.StatusCode == PurchaseOrderStatus.RedirectedToEntry)
        {
            return true;
        }
        else if (this.userScreen == 'VERIFICATION' && this.dialogItem.StatusCode < PurchaseOrderStatus.SubmittedToApproval )
        {
            return true;
        }
        else if (this.userScreen == 'VERIFICATION' && this.dialogItem.StatusCode >= PurchaseOrderStatus.SubmittedToApproval 
                                                   && this.dialogItem.NoteToUser != null )
        {
            return true;
        }
        else if (this.userScreen == 'APPROVAL' && this.dialogItem.StatusCode == PurchaseOrderStatus.SubmittedToApproval )
        {
            return true;
        }
        else if (this.userScreen == 'APPROVAL' && this.dialogItem.StatusCode > PurchaseOrderStatus.SubmittedToApproval 
                                                   && this.dialogItem.NoteToUser != null )
        {
            return true;
        }
        else {
            return false;
        }
    }

    canSave():boolean {
        if (this.dialogItem != null && this.commonService.getLength(this.dialogItemDetailList)>0) {
            if (this.userScreen == 'ENTRY' && this.dialogItem.EntryUserID ==  this.sessionService.UserID && 
                (this.dialogItem.StatusCode == PurchaseOrderStatus.Initiated ||
                 this.dialogItem.StatusCode == PurchaseOrderStatus.EntryInProgress || 
                 this.dialogItem.StatusCode == PurchaseOrderStatus.RedirectedToEntry))
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

    canSaveItem( ):boolean {
        if (this.dialogItemDetail != null && this.dialogItemDetail.ItemID != null && this.dialogItemDetail.OrderQuantity != null &&
            this.dialogItemDetail.Rate != null && this.dialogItemDetail.DiscountPercentage != null &&
            this.dialogItemDetail.TaxPercentage != null && this.dialogItemDetail.ExpectedDeliveryDate != null) {
            if (this.userScreen == 'ENTRY' && 
                (this.dialogItem.StatusCode == PurchaseOrderStatus.Initiated ||
                 this.dialogItem.StatusCode == PurchaseOrderStatus.EntryInProgress || 
                 this.dialogItem.StatusCode == PurchaseOrderStatus.RedirectedToEntry))
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

    canSubmit(): boolean {

        if (this.dialogItem != null && this.commonService.getLength(this.dialogItemDetailList)>0) {
            if (this.userScreen == 'ENTRY' && this.dialogItem.EntryUserID ==  this.sessionService.UserID && 
                (this.dialogItem.StatusCode == PurchaseOrderStatus.EntryInProgress || 
                 this.dialogItem.StatusCode == PurchaseOrderStatus.RedirectedToEntry))
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

    canApprove(): boolean {

        if (this.dialogItem != null && this.commonService.getLength(this.dialogItemDetailList)>0) {
            if (this.userScreen == 'VERIFICATION' && 
                (this.dialogItem.StatusCode == PurchaseOrderStatus.VerificationInProgress || 
                 this.dialogItem.StatusCode == PurchaseOrderStatus.RedirectedToVerification ||
                 this.dialogItem.StatusCode == PurchaseOrderStatus.SubmittedToVerification ))
            {
                return true;
            }
            else if (this.userScreen == 'APPROVAL' && this.dialogItem.StatusCode == PurchaseOrderStatus.SubmittedToApproval)
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

    pushGstTypes()
    {

        this.GstTypeList = new Array();
        let nGst = new GstType();
        nGst.GstType = 'GST';
        nGst.GstTypeID = 1;

        let nGst0 = new GstType();
        nGst0.GstType = 'Non-GST';
        nGst0.GstTypeID = 0;

        let nGst2 = new GstType();
        nGst2.GstType = 'Incl-GST';
        nGst2.GstTypeID = 2;

        this.GstTypeList.push(nGst);
        this.GstTypeList.push(nGst2);
        this.GstTypeList.push(nGst0);
    }


    calculatePOAmountTotal() {

        let iAmt = 0.00;
        let xAmt = 0.00;
        let tAmt = 0.00;
        let dAmt = 0.00;

        if (this.commonService.getLength(this.dialogItemDetailList)>0)
        {
            this.dialogItemDetailList.forEach(x=> {

                let itms = this.getCalculatedValues(x.Rate,x.OrderQuantity,x.TaxPercentage,x.DiscountPercentage,this.dialogItem.GstTypeID);
    
                if (this.commonService.getLength(itms)>0)
                {
                    x.TaxAmount = itms[1];
                    x.ItemValue = itms[0];
                    x.TotalItemValue = itms[2];
                    x.DiscountAmount = itms[3];
    
                    iAmt = iAmt +  itms[0];
                    xAmt = xAmt +  itms[1];
                    tAmt = tAmt +  itms[2];
                    dAmt = dAmt +  itms[3];
                }
    
            });

            if (this.dialogItem != null)
            {
                this.dialogItem.PurchaseOrderValue = Number(iAmt.toFixed(2));               
                this.dialogItem.TotalTaxValue = Number(xAmt.toFixed(2));
                this.dialogItem.TotalOrderValue = Number(tAmt.toFixed(2));
                this.dialogItem.TotalDiscountValue = Number(dAmt.toFixed(2));
            }

        }



       

    }



    ngAfterViewInit() {

        

    }

    showDialog()
    {
        this.isOpen = !this.isOpen;
    }


    loadMasterData() {

        this.CurrencyList = this.sessionService.CurrencyList;

        let req = new ServiceRequest();
        this.apiService.postData("MasterDataForPurchaseOrderGetByCorpID", req).subscribe((data: MasterDataForPurchaseOrderGetByCorpIDResponse) => {
            if (data.SuccessCode == 1) {
                this.supplierList = data.SupplierList;
                this.LookUpList = data.LookupList;
                this.DeliveryAddressList = data.DeliveryAddressList;
                this.BillingAddressList = data.BiilingAddressList;
                this.MaterialList = data.MaterialList;
                this.FieldList = data.FieldList;
                this.StageStatusList = data.StageStatusList;
                this.SupplierItemList = data.SupplierItemList;
                this.TaxDetailList = data.TaxDetailList;
                this.UOMList =data.UOMList;

                console.log(data);

                this.PayTermList = new Array();
                if (this.commonService.getLength(this.LookUpList)>0)
                {
                    this.PayTermList = this.LookUpList.filter(x=> x.DomainID == 2);
                }

                if (this.Mode == 'ADD') {
                    this.StatusList = this.sessionService.StatusListAll.filter(x => x.StatusCode == 10);
                    this.supplierList = this.supplierList.filter(x=> x.StatusCode == 10);
                    this.SetDefaultValues();
                }
                else {
                    this.StatusList = this.sessionService.StatusListAll;
    
                    if (this.dialogItem.StatusCode < 70)
                    {
                        this.supplierList = this.supplierList.filter(x=> x.StatusCode == 10);
                    }
        
                    this.dialogItem = this.commonService.cloneAny(this.dialogItemBase);
                    this.loadEditPOValues();
                }
            }
            else {
                this.sessionService.showError(data.ErrorMessage);
            }
        });


    }

    loadEditPOValues()
    {
        let req = new PurchaseOrderDetailRequest();
        req.PurchaseOrderID = this.dialogItemBase.PurchaseOrderID;

        this.apiService.postData("PurchaseOrderDetailGetByPurchaseOrderID", req).subscribe((data: PurchaseOrderDetailGetByPurchaseOrderIDResponse) => {
            if (data.SuccessCode == 1) {
                this.dialogItemDetailList = data.ResultList;

                if (this.commonService.getLength(this.dialogItemDetailList) > 0) {
                    this.dialogItemDetailList.forEach(x => {
                         x.ExpectedDeliveryDateStr = moment(x.ExpectedDeliveryDate).format(AppConfig.GRID_DATE_FORMAT);
                    });
                }

            }
            else {
                this.sessionService.showError(data.ErrorMessage);
            }
        });

        this.dialogItem.PurchaseOrderDate = moment(this.dialogItem.PurchaseOrderDate).format();
        this.dialogItem.ExpectedDeliveryDate = moment(this.dialogItem.ExpectedDeliveryDate).format();

        this.onSelectSupplier(this.dialogItem.SupplierID);
        this.onSelectBillingAddress(this.dialogItem.BillAddrID);
        this.onSelectDeliveryAddress(this.dialogItem.DelAddrID);
        //this.onSelectCurrency(this.dialogItem.CurrencyID);
    }

    onMaterialSelect()
    {
        if (this.SelectedMaterial != null)
        {
            this.dialogItemDetail.ItemName = this.SelectedMaterial.ItemName;
            this.dialogItemDetail.PUOM = this.SelectedMaterial.UOM;
            this.dialogItemDetail.PUOMID = this.SelectedMaterial.UOMID;
            this.getTaxPercentage(this.SelectedMaterial.ItemCategoryID, this.dialogItem.PurchaseOrderDate)
            this.getPriceBySupplier();
            this.onSelectUom();
        }
    }
    
    getPriceBySupplier()
    {
        this.SupplierItemFilteredList = new Array();
        if (this.dialogItemDetail.ItemID != null)
        {
            let iList = this.SupplierItemList.filter(d=> d.ItemID == this.dialogItemDetail.ItemID);

            if (this.commonService.getLength(iList)>0)
            {
                this.SupplierItemFilteredList = iList;
            }
        }
    }


    getTaxPercentage(itmCat:number,poDt:string)
    {
        if (this.dialogItemDetail != null)
        {
            let txPer = 0.00;
            let dsPer = 0.00;
            let txDet: ItemCategoryTaxDetails[];
            txDet = new Array();

            if (poDt == undefined || poDt == null) 
            {
                poDt = moment().format();
            }

            txDet = this.TaxDetailList.filter(x=> x.ItemCategoryID == itmCat && x.TaxCode == this.defaultTaxCode);
            if (this.commonService.getLength(txDet)>0)
            {
                txDet.forEach(x=> {
                    if (moment(x.EffectiveDateFrom).format() <= moment(poDt).format() )
                    {
                        txPer = x.TaxValue;               
                        return;
                    }                
                });
            }

            this.dialogItemDetail.TaxPercentage = txPer;
            if (this.dialogItemDetail.DiscountPercentage == null) { 
                this.dialogItemDetail.DiscountPercentage = dsPer; 
            }
            this.onChangeDialogItemValue();

        }
    }

    onChangeDialogItemValue()
    {
        if (this.dialogItemDetail != null)
        {
            this.calculateItemAmout(this.dialogItemDetail.Rate, this.dialogItemDetail.OrderQuantity, this.dialogItemDetail.TaxPercentage,this.dialogItemDetail.DiscountPercentage , this.dialogItem.GstTypeID);
        }

    }

    loadTaxType()
    {
        if (this.dialogItem != null && this.SelectedBillingAddress != null && this.SelectedSupplier != null )
        {
            if (this.SelectedBillingAddress.CountryCode != this.SelectedSupplier.CountryCode)
            {
                this.dialogItem.TaxTypeID = 3;
            }
            else if (this.SelectedBillingAddress.StateID != this.SelectedSupplier.StateID)
            {
                this.dialogItem.TaxTypeID = 2;
            }
            else if (this.SelectedBillingAddress.StateID == this.SelectedSupplier.StateID)
            {
                this.dialogItem.TaxTypeID = 1;
            }

            
        }



    }

    loadTaxBreakupValues()
    {
        let tx1 = "";
        let tx2 = "";
        let txAmt1 = 0.00;
        let txAmt2 = 0.00;
        let txPer1 = 0.00
        let txPer2 = 0.00

        if (this.dialogItemDetail != null && this.SelectedMaterial != null && this.dialogItemDetail.TaxPercentage != null)
        {
           if (this.dialogItem.TaxTypeID == 1)
           {
                this.dialogItemDetail.TaxBreakupLabel1 = 'CGST';
                this.dialogItemDetail.TaxBreakupLabel2 = 'SGST';
                txPer1 = this.dialogItemDetail.TaxPercentage;
                txAmt1 = this.dialogItemDetail.TaxAmount;
                if (txPer1 >0 )
                {
                    txPer2 = Number((txPer1/2).toFixed(2));                    
                }
                if (txAmt1 >0 )
                {
                    txAmt2 = Number((txAmt1/2).toFixed(2));                    
                }
                this.dialogItemDetail.TaxBreakup1 = txPer2;
                this.dialogItemDetail.TaxBreakup2 = txPer2;
                this.dialogItemDetail.TaxBreakAmount1 = txAmt2;
                this.dialogItemDetail.TaxBreakAmount2 = txAmt2;
           }
           else if (this.dialogItem.TaxTypeID == 2 || this.dialogItem.TaxTypeID == 3)
           {
                this.dialogItemDetail.TaxBreakupLabel1 = 'IGST';
                txPer1 = this.dialogItemDetail.TaxPercentage;
                txAmt1 = this.dialogItemDetail.TaxAmount;
                this.dialogItemDetail.TaxBreakup1 = Number(txPer1.toFixed(2));
                this.dialogItemDetail.TaxBreakAmount1 = Number(txAmt1.toFixed(2));
           }


        }



    }

    calculateItemAmout(iRate:number,iQty:number,iTax:number,dPer:number,taxFlag:number)
    {
        let iAmt: number;
        let txAmt: number;
        let dAmt: number;
        let totAmt: number;

        iAmt = 0.00;
        txAmt = 0.00;
        totAmt = 0.00;
        dAmt = 0.00;

        // if (iRate >0 && iQty > 0 )
        // {
        //     iAmt = Number((iRate * iQty).toFixed(2));

        //     //non-gst   0
        //     //do nothing

        //     if (iTax > 0)
        //     {
        //         //gst   1
        //         if (taxFlag == 1)
        //         {
        //             txAmt = Number(((iAmt/100) * iTax).toFixed(2));
        //             totAmt= Number((iAmt + txAmt).toFixed(2));
        //         }
        //         else if (taxFlag == 2) // including gst
        //         {
        //             totAmt = Number(iAmt.toFixed(2));
        //             iAmt = Number((totAmt * (100/(100 + iTax))).toFixed(2));
        //             txAmt = Number((totAmt - iAmt).toFixed(2));
        //         }

        //     }
        // }

        console.log(taxFlag);
        let itms = this.getCalculatedValues(iRate,iQty,iTax,dPer,taxFlag);

        if (this.commonService.getLength(itms)>0 && this.dialogItemDetail != null)
        {
            // this.dialogItemDetail.TaxAmount = txAmt;
            // this.dialogItemDetail.ItemValue = iAmt;
            // this.dialogItemDetail.TotalItemValue = totAmt;

            this.dialogItemDetail.TaxAmount = itms[1];
            this.dialogItemDetail.ItemValue = itms[0];
            this.dialogItemDetail.TotalItemValue = itms[2];
            this.dialogItemDetail.DiscountAmount = itms[3];
            this.loadTaxBreakupValues();
        }

    }

    discountPerCalc(ch:number)
    {
        let iAmt = 0.00;
        let dAmt = 0.00;
        let dPer = 0.00;

        if (ch==1 && this.dialogItemDetail != null && this.dialogItemDetail.DiscountPercentage != null)
        {
            if (this.dialogItemDetail.OrderQuantity != null && this.dialogItemDetail.Rate != null)
            {
                iAmt = Number((this.dialogItemDetail.OrderQuantity * this.dialogItemDetail.Rate).toFixed(2));
                dAmt = Number((iAmt/100 * this.dialogItemDetail.DiscountPercentage).toFixed(2));
                this.dialogItemDetail.DiscountAmount = dAmt;
            }
        }
        else if (ch == 2 && this.dialogItemDetail != null && this.dialogItemDetail.DiscountAmount != null)
        {
            if (this.dialogItemDetail.OrderQuantity != null && this.dialogItemDetail.Rate != null)
            {
                iAmt = Number((this.dialogItemDetail.OrderQuantity * this.dialogItemDetail.Rate).toFixed(2));
                dAmt = Number(this.dialogItemDetail.DiscountAmount.toFixed(2));
                dPer = Number((dAmt/iAmt * 100).toFixed(2));
                this.dialogItemDetail.DiscountPercentage = dPer;
            }
        }
    }

    getCalculatedValues(iRate:number,iQty:number,iTax:number,dPer:number,taxFlag:number):any
    {
        let res = [];

        let iAmt: number;
        let iAmt1: number;
        let txAmt: number;
        let totAmt: number;
        let dsAmt: number;

        iAmt = 0.00;
        iAmt1 = 0.00;
        txAmt = 0.00;
        totAmt = 0.00;
        dsAmt = 0.00;

        if (iRate >0 && iQty > 0 )
        {
            iAmt = Number((iRate * iQty).toFixed(2));
            if (dPer > 0) {
                dsAmt = Number(((iAmt/100) * dPer).toFixed(2));
                iAmt1 = Number((iAmt - dsAmt).toFixed(2));
            }
            else
            {
                dsAmt = 0.00;
                iAmt1 = iAmt;
            }

            //non-gst   0
            //do nothing

            if (iTax > 0)
            {
                //gst   1
                if (taxFlag == 1)
                {
                    txAmt = Number(((iAmt1/100) * iTax).toFixed(2));                   
                    totAmt= Number((iAmt1 + txAmt).toFixed(2));
                }
                else if (taxFlag == 2) // including gst
                {
                    console.log('including tax');
                    totAmt = Number(iAmt1.toFixed(2));
                    console.log(totAmt);
                    iAmt = Number((totAmt * (100/(100 + iTax))).toFixed(2));
                    console.log(iAmt);
                    txAmt = Number((totAmt - iAmt).toFixed(2));
                    console.log(txAmt);
                }
                else if (taxFlag == 0) // non gst
                {
                    txAmt = 0.00;
                    totAmt= Number((iAmt1 + txAmt).toFixed(2));
                }
            }
            else
            {
                txAmt = 0.00;
                totAmt= Number((iAmt1 + txAmt).toFixed(2));
            }
            
        }

        res[0]=iAmt;
        res[1]=txAmt;
        res[2]=totAmt;
        res[3]=dsAmt;


        return res;
    }





    closeClick() {
        this.dialogRef.close(0);
    }

    saveClick(isValid: boolean)
    {
        this.submitAttempt = true;

        if (isValid && this.commonService.getLength(this.dialogItemDetailList) > 0) {

            if (this.Mode1 == 'ADD' || this.Mode1 == 'EDIT') {
                this.submitAttempt = false;
                this.sessionService.showError('Kindly Close Material Dialog ..!');
                return;
            }

            let req = new SavePurchaseOrderRequest();
            let poID : number;

            req.Result = new PurchaseOrderInfo();
            //req.Result = this.dialogItem;

            req.Result.PurchaseOrderID = this.dialogItem.PurchaseOrderID;
            req.Result.CorpID = this.dialogItem.CorpID;
            req.Result.SiteID = this.dialogItem.SiteID;
            req.Result.GstTypeID = this.dialogItem.GstTypeID;
            req.Result.PurchaseOrderNumber = this.dialogItem.PurchaseOrderNumber;
            req.Result.PurchaseOrderNumberString = this.dialogItem.PurchaseOrderNumberString;
            req.Result.SupplierID = this.dialogItem.SupplierID;
            req.Result.SupplierName = this.dialogItem.SupplierName;
            req.Result.BillAddrID = this.dialogItem.BillAddrID;
            req.Result.BillRefCode = this.dialogItem.BillRefCode;
            req.Result.DelAddrID = this.dialogItem.DelAddrID;
            req.Result.DelRefCode = this.dialogItem.DelRefCode;
            req.Result.MobileNumber = this.dialogItem.MobileNumber;
            req.Result.Email = this.dialogItem.Email;
            req.Result.PurchaseOrderDate = this.dialogItem.PurchaseOrderDate;
            req.Result.PurchaseOrderDateStr = this.dialogItem.PurchaseOrderDateStr;
            req.Result.ExpectedDeliveryDate = this.dialogItem.ExpectedDeliveryDate;
            req.Result.ExpectedDeliveryDateStr = this.dialogItem.ExpectedDeliveryDateStr;
            req.Result.PurchaseOrderValue = this.dialogItem.PurchaseOrderValue;
            req.Result.StatusCode = this.dialogItem.StatusCode;
            req.Result.StatusMessage = this.dialogItem.StatusMessage;
            req.Result.CurrencyCode = this.dialogItem.CurrencyCode;
            req.Result.CurrencyID = this.dialogItem.CurrencyID;
            req.Result.PaymentTermID = this.dialogItem.PaymentTermID;
            req.Result.PaymentTerm = this.dialogItem.PaymentTerm;
            req.Result.TaxTypeID = this.dialogItem.TaxTypeID;
            req.Result.TotalTaxValue = this.dialogItem.TotalTaxValue;
            req.Result.TotalOrderValue = this.dialogItem.TotalOrderValue;
            req.Result.TotalDiscountValue = this.dialogItem.TotalDiscountValue;
            req.Result.Remarks = this.dialogItem.Remarks;
            req.Result.NoteToUser = this.dialogItem.NoteToUser;

            if (this.Mode == 'ADD') {
                req.SaveType = AppConfig.SaveType_Insert;
                poID = -1;

                let resItm = this.CurrencyList.find(f=> f.CurrencyID == req.Result.CurrencyID);
                if (resItm != null)
                {
                    req.Result.CurrencyCode = resItm.CurrencyCode;
                }
            }
            else {
                req.SaveType = AppConfig.SaveType_Update;
                poID = this.dialogItem.PurchaseOrderID;
            }

           
            req.PurchaseItemDetailList = new Array();

            if (this.commonService.getLength(this.dialogItemDetailList) > 0) {
                //req.PurchaseItemDetailList = this.dialogItemDetailList;
                this.dialogItemDetailList.forEach(d => {
                    //let itm = this.commonService.cloneAny(d);

                    let itm = new PurchaseItemOrderInfo();
                    itm.PurchaseOrderDetailID =  d.PurchaseOrderDetailID;
                    itm.PurchaseOrderID =  poID;
                    itm.ItemID =  d.ItemID;
                    itm.OrderQuantity =  d.OrderQuantity;
                    itm.Rate =  d.Rate;
                    itm.TotalItemValue =  d.TotalItemValue;
                    itm.PUOMID =  d.PUOMID;
                    itm.UOMID = d.PUOMID;
                    itm.ItemValue =  d.ItemValue;
                    itm.TaxPercentage =  d.TaxPercentage;
                    itm.TaxBreakup1 =  d.TaxBreakup1;
                    itm.TaxBreakup2 = d.TaxBreakup2;
                    itm.TaxAmount =  d.TaxAmount;
                    itm.TaxBreakAmount1 = d.TaxBreakAmount1;
                    itm.TaxBreakAmount2 = d.TaxBreakAmount2;
                    itm.StatusCode = d.StatusCode;
                    itm.ExpectedDeliveryDate = moment(d.ExpectedDeliveryDate).format(AppConfig.UPDATE_DATE_FORMAT);
                    itm.PurchaseOrderID = poID;                   
                    itm.ConvertedOrderQuantity = d.OrderQuantity;
                    itm.ConversionRate = d.ConversionRate;
                    itm.ReceivedQuantity = d.ReceivedQuantity;
                    itm.CancelledQuantity = d.CancelledQuantity;
                    itm.ReceivedUOMQuantity = d.ReceivedUOMQuantity
                    itm.CancelledUOMQuantity = d.CancelledUOMQuantity;
                    itm.DiscountPercentage = d.DiscountPercentage;
                    itm.DiscountAmount = d.DiscountAmount;
                    itm.ItemRemarks = d.ItemRemarks;

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
                   
                    req.PurchaseItemDetailList.push(itm);
                });


            }

            if (req.Result != null)
            {
                req.Result.PurchaseOrderDate = moment(req.Result.PurchaseOrderDate).format(AppConfig.UPDATE_DATE_FORMAT);
                req.Result.ExpectedDeliveryDate = moment(req.Result.ExpectedDeliveryDate).format(AppConfig.UPDATE_DATE_FORMAT);

                if (req.Result.StatusCode == PurchaseOrderStatus.Initiated || req.Result.StatusCode == PurchaseOrderStatus.SubmittedToVerification)
                {
                    req.Result.StatusCode = req.Result.StatusCode + PurchaseOrderStatus.NextStage;
                }

            }

            console.log(req);
            this.apiService.postData("SavePurchaseOrder", req).subscribe((data: ServiceReponse) => {
                if (data.SuccessCode == 1) {

                    if (this.Mode == 'ADD') {
                        this.sessionService.showSuccess("Purchase Order added successfully");
                    }

                    else if (this.Mode == 'EDIT') {
                        this.sessionService.showSuccess("Purchase Order  updated successfully");
                    }

                    this.dialogRef.close(1);
                    //this.Mode = 'HOME';
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

    getSubmitStatus(ch:string):number
    {
        console.log(this.dialogItem);
        let res = 0;
        if (ch == 'SUBMIT')
        {
            if (this.userScreen == 'ENTRY' && this.userStage == 'ENTRY')
            {
                if (this.skipVerification == true)
                {
                    res = PurchaseOrderStatus.SubmittedToApproval;
                }
                else
                {
                    res = PurchaseOrderStatus.SubmittedToVerification;
                }            
            }
            else if (this.userScreen == 'ENTRY' && this.userStage == 'VERIFICATION')
            {
                res = PurchaseOrderStatus.SubmittedToApproval;
            }
            else if (this.userScreen == 'ENTRY' && this.userStage == 'APPROVAL')
            {
                res = PurchaseOrderStatus.Approved;
            }    
        }
        else if (ch == 'APPROVE' && this.userScreen == 'VERIFICATION')
        {
            res = PurchaseOrderStatus.SubmittedToApproval;
        }
        else if (ch == 'REJECT' && this.userScreen == 'VERIFICATION')
        {
            res = PurchaseOrderStatus.RedirectedToEntry;
        }
        else if (ch == 'APPROVE' && this.userScreen == 'APPROVAL')
        {
            res = PurchaseOrderStatus.Approved;
        }
        else if (ch == 'REJECT' && this.userScreen == 'APPROVAL')
        {
            console.log('inside reject');
            if (this.dialogItem.VerifyUserID != null && this.dialogItem.VerifyUserID > 0)
            {
                res = PurchaseOrderStatus.RedirectedToVerification;
            }
            else
            {
                res = PurchaseOrderStatus.RedirectedToEntry;
            }
            
        }
        return res;
    }


    submitClick(isValid: boolean, usrLevel:string) {
        this.submitAttempt = true;

        if (isValid) {

            if (this.Mode1 == 'ADD' || this.Mode1 == 'EDIT') {
                this.submitAttempt = false;
                this.sessionService.showError('Kindly Close Material Dialog ..!');
                return;
            }

            let req = new SubmitPurchaseOrderRequest();
            req.PurchaseOrderID = this.dialogItem.PurchaseOrderID;
            req.NoteToUser = this.dialogItem.NoteToUser;
            req.Stage = this.userScreen;
            req.StatusCode = this.getSubmitStatus(usrLevel);

            console.log(req);

            this.apiService.postData("SubmitPurchaseOrder", req).subscribe((data: SaveReponse) => {
                if (data.SuccessCode == 1) {

                    this.sessionService.showSuccess("Purchase Order submitted successfully");
                    this.dialogRef.close(1);
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

    addMaterialclick() {
        this.StatusList1 = this.sessionService.StatusListAll.filter(x => x.StatusCode == 10);
        this.SelectedMaterial = new Master_Item();
        this.dialogItemDetail = new PurchaseItemOrderInfo();
        this.SetDefaultMaterialValues();
        this.Mode1 = 'ADD';

    }

    editMaterialclick() {
        this.Mode1 = 'EDIT';
        if (this.selectedPOItem   != null) {
            this.StatusList1 = this.sessionService.StatusListAll.filter(x => x.StatusCode == 10 || x.StatusCode == 20);
            this.dialogItemDetail = this.commonService.cloneAny(this.selectedPOItem);
            
            let itm = this.MaterialList.find(x=> x.ItemID ==  this.dialogItemDetail.ItemID);
            if (itm != null)
            {
                this.SelectedMaterial = this.commonService.cloneAny(itm);
                this.onMaterialSelect();
            }
            
            this.Mode1 = 'EDIT';
        }

    }

    deleteMaterialDetail() {
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
                    let idx = this.dialogItemDetailList.findIndex(d => d.PurchaseOrderDetailID == this.selectedPOItem.PurchaseOrderDetailID);
                    if (idx != null) {
                        this.dialogItemDetailList.splice(idx, 1);
                    }
                }
                else {
                    this.selectedPOItem = null;
                }
                this.calculatePOAmountTotal();
            });


        }

    }

    cancelMaterialForm() {
        this.Mode1 = 'HOME';
        this.submitAttempt1 = false;
        this.selectedPOItem = null;


    }

    updateMaterialDetails(isValid: boolean) {
        this.submitAttempt1 = true;

        if (isValid) {

            let itm = this.dialogItemDetailList.find(x=> x.ItemID == this.dialogItemDetail.ItemID && x.PurchaseOrderDetailID != this.dialogItemDetail.PurchaseOrderDetailID);
            if (itm != null)
            {
                this.sessionService.showError('Material already exists in the list...!');
                return;
            }

            if (this.Mode1 == 'ADD')
            {
                this.RwID = this.RwID - 1;
                this.dialogItemDetail.PurchaseOrderDetailID = this.RwID;

                this.dialogItemDetail.ExpectedDeliveryDateStr = moment(this.dialogItemDetail.ExpectedDeliveryDate).format(AppConfig.GRID_DATE_FORMAT);
                
                let nItm = this.commonService.cloneAny(this.dialogItemDetail);
                this.dialogItemDetailList.push(nItm);
                this.selectedPOItem = null;
                this.calculatePOAmountTotal();
                 //this.dialogItemDetail.ItemName = this.SelectedMaterial.ItemName
                 this.dialogItemDetail = null;
            }
            if (this.Mode1 == 'EDIT')
            {
                
                let nList:PurchaseItemOrderInfo[];
                nList = new Array();

                this.dialogItemDetailList.forEach(x=> {
                    if (x.PurchaseOrderDetailID == this.dialogItemDetail.PurchaseOrderDetailID)
                    {
                        
                        nList.push(this.commonService.cloneAny(this.dialogItemDetail));
                    }
                    else
                    {
                        nList.push(x);
                    }
                });

                this.dialogItemDetailList = new Array();
                this.dialogItemDetailList = this.commonService.cloneAnyArray(nList);
                this.selectedPOItem = null;
                this.calculatePOAmountTotal();
            }
           

        }
        else {
            this.sessionService.showError('Some mandatory informations are missing, please check');
            return;
        }
        this.Mode1 = 'HOME';

    }

    DisableEdit1(): boolean {

        if (this.selectedPOItem != null) {
            return false;
        }
        else {
            return true;
        }

    }

    SelectSupplier(SupplierListInfo: any) {

        if (SupplierListInfo != null) {
            this.onSelectSupplier( Number(SupplierListInfo.ID));
        }

    }

    onSelectSupplier(suppID:number)
    {
        console.log('on select supp');
        if (this.commonService.getLength(this.supplierList)>0)
        {
            console.log('adsada');
            this.supplierList.forEach(x => {
                if (x.SupplierID == Number(suppID)) {
                    this.SelectedSupplier = this.commonService.cloneAny(x);
                    this.SelectedSupplier.StateName = this.sessionService.StateList.find(d => d.StateID == x.StateID).StateName;
                    this.SelectedSupplier.CountryName = this.sessionService.CountryList.find(d => d.CountryCode == x.CountryCode).CountryName;
                }
            });
        }
      
    }

    SelectBillingAddress(BillingAddressInfo: any) {
        if (BillingAddressInfo != null) {
           this.onSelectBillingAddress(Number(BillingAddressInfo.ID));
        }

    }

    onSelectBillingAddress(billID:number)
    {
        if (this.commonService.getLength(this.BillingAddressList)>0)
        {
            this.BillingAddressList.forEach(x => {
                if (x.BillAddrID == billID) {
                    this.SelectedBillingAddress = this.commonService.cloneAny(x);
                    this.SelectedBillingAddress.StateName = this.sessionService.StateList.find(d => d.StateID == x.StateID).StateName;
                    this.SelectedBillingAddress.CountryName = this.sessionService.CountryList.find(d => d.CountryCode == x.CountryCode).CountryName;
                    this.loadTaxType();
                    return;
                }
            });
        }

    }

    SelectDeliveryAddress(DeliveryAddressInfo: any) {
        if (DeliveryAddressInfo != null) {
           this.onSelectDeliveryAddress( Number(DeliveryAddressInfo.ID));
        }

    }

    onSelectDeliveryAddress(delID:number)
    {
        if (this.commonService.getLength(this.DeliveryAddressList)>0)
        {
            this.DeliveryAddressList.forEach(x => {
                if (x.DelAddrID == delID) {
                    this.SelectedDeliveryAddress = this.commonService.cloneAny(x);
                    this.SelectedDeliveryAddress.StateName = this.sessionService.StateList.find(d => d.StateID == x.StateID).StateName;
                    this.SelectedDeliveryAddress.CountryName = this.sessionService.CountryList.find(d => d.CountryCode == x.CountryCode).CountryName;
                    this.loadTaxType();
                    return;
                }
            });
        }        
    }

    onSelectUom()
    {
        if (this.dialogItemDetail != null && this.dialogItemDetail.PUOMID != null)
        {
            let itm = this.UOMList.find(x=> x.UOMID == this.dialogItemDetail.PUOMID);
            if (itm != null)
            {
                this.dialogItemDetail.PUOM = itm.UOM;
            }
        }
    }

    SelectUOM(UomInfo:any)
    {
        if (UomInfo != null)
        {
            let itm = this.UOMList.find(x=> x.UOMID == Number(UomInfo.ID));
            if (itm != null)
            {
                this.dialogItemDetail.PUOMID = itm.UOMID;
                this.dialogItemDetail.PUOM = itm.UOM;
            }
        }
    }

    SelectMaterial(MaterialInfo: any) {
        if (MaterialInfo != null) {

            let itm = this.MaterialList.find(x=> x.ItemID == Number(MaterialInfo.ID));
            if (itm != null) 
            {
                this.SelectedMaterial = this.commonService.cloneAny(itm);
                this.onMaterialSelect();
            }

        }

    }

    SelectCurrency(currInfo:any)
    {
        console.log(currInfo);
        console.log(this.dialogItem);
        this.onSelectCurrency( Number(currInfo.ID));
    }

    onSelectCurrency(nid:number)
    {
        let citm = this.sessionService.CurrencyList.find(x=> x.CurrencyID == nid);
        if (citm != null && this.dialogItem != null)
        {
            this.dialogItem.CurrencyCode = citm.CurrencyCode;
        }

    }

    cancelDialogForm() {
        this.displayResponsive = false;

    }

}
