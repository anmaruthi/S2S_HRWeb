import { Component, Inject, OnInit, AfterViewInit } from '@angular/core';
import { WebApiService } from "../../service/webapi.service";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SessionService } from "../../service/session.service";
import { CommonService } from "../../service/common.service";
import { AppConfig, logLevel, PurchaseRequestStatus, BillGstType, } from "../../const/app.config";
import { BillingAddress, Currency, DeliveryAddress, FieldMasterInfo, GstType, ItemCategoryTaxDetails, Master_Item, Master_LookUp, Master_UOM, PurchaseItemRequestInfo, PurchaseRequestInfo, PurchaseOrderList, StageStatus, Status, SupplierItem, SupplierMasterInfo, TaxmasterInfo } from 'src/app/model/shared.model';
import { PurchaseRequestDetailRequest, SavePurchaseRequestRequest, ServiceRequest, SubmitPurchaseRequestRequest, TaxMasterGetAllRequest } from 'src/app/model/request.model';
import { MasterDataForPurchaseOrderGetByCorpIDResponse, PurchaseRequestDetailGetByPurchaseRequestIDResponse, SaveReponse, ServiceReponse, TaxMasterGetAllByCorpIDResponse } from 'src/app/model/response.model';
import { ConfirmDialogComponent } from '../../common/confirmdialog.component';
import * as moment from 'moment';

// import {MatCardModule} from '@angular/material/card';
@Component({
    templateUrl: './purchaserequestdialog.component.html',
    styleUrls: ['./purchaserequestdialog.component.css']
})

export class PurchaseRequestDialogComponent implements OnInit {
    cols1: any[];
    cols: any[];
    GstTypeList: GstType[];
    defaultTaxCode = 'GST';
    public Mode1: string;
    public txtMessage: string;
    public Mode: string;
    public dialogItem: PurchaseRequestInfo;
    public dialogItemBase: PurchaseRequestInfo;
    public dialogItemDetailList: PurchaseItemRequestInfo[];
    public dialogItemDetail: PurchaseItemRequestInfo;
    public selectedPOItem: PurchaseItemRequestInfo;
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
    public userStage: string;
    public userScreen: string;
    public skipVerification: boolean;

    Amount: number;
    isOpen: boolean;
    RwID: number;

    displayResponsive: boolean;

    constructor(public dialogRef: MatDialogRef<PurchaseRequestDialogComponent>, public dialog: MatDialog,
        @Inject(MAT_DIALOG_DATA) public DialogInputData: any, public sessionService: SessionService,
        public commonService: CommonService, private apiService: WebApiService) {
        this.FormColumnsWidth = 600;

    }

    ngOnInit() {
        this.cols1 = [
            { field: 'ItemName', header: 'Material', width: '40%', align: 'left', wrap: 'break-word' },
            { field: 'RequestQuantity', header: 'Request Qty', width: '30%', align: 'right', wrap: 'break-word' },
            { field: 'UOM', header: 'UOM', width: '10%', align: 'right', wrap: 'break-word' },
            { field: 'ExpectedDeliveryDateStr', header: 'Exp.Del.Dt.', width: '20%', align: 'right', wrap: 'break-word' },
        ];
        this.cols = [
            { field: 'SupplierName', header: 'Supplier', width: '30%', align: 'left', wrap: 'break-word' },
            { field: 'ItemPrice', header: 'Rate', width: '7%', align: 'right', wrap: 'break-word' },
        ]

        this.displayResponsive = false;
        this.skipVerification = true;



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
            this.dialogItem = new PurchaseRequestInfo();
            this.dialogItemDetail = new PurchaseItemRequestInfo();
            this.dialogItem.EntryUserID = this.sessionService.UserID;
            console.log(this.dialogItem);
        }
        else {
            this.dialogItem = Object.assign({}, this.DialogInputData.selectedItem);
            this.dialogItemBase = Object.assign({}, this.DialogInputData.selectedItem);
            this.dialogItemDetail = Object.assign({}, this.DialogInputData.selectedItemDetail);

        }

        this.TaxList = Object.assign([], this.DialogInputData.TaxList);
        this.StatusList = Object.assign([], this.DialogInputData.StatusList);
        this.FilteredMaterialList = new Array();



    }


    showBasicDialog() {
        this.displayResponsive = true;
    }


    SetDefaultValues() {
        if (this.dialogItem != null) {
            this.dialogItem.StatusCode = PurchaseRequestStatus.New;
            this.dialogItem.PurchaseRequestDate = moment().format();
            this.dialogItem.PurchaseRequestNumber = 0;
            this.dialogItem.PurchaseRequestNumberString = 'New';
            this.dialogItem.EntryUserID == this.sessionService.UserID;


        }
    }


    SetDefaultMaterialValues() {
        if (this.dialogItem != null && this.dialogItem.ExpectedDeliveryDate != null) {
            this.dialogItemDetail.ExpectedDeliveryDate = moment(this.dialogItem.ExpectedDeliveryDate).format();
        }
    }

    radioChange() {



    }

    showNote(): boolean {
        if (this.userScreen == 'ENTRY' && this.dialogItem.StatusCode == PurchaseRequestStatus.RedirectedToRequest) {
            return true;
        }

        else if (this.userScreen == 'APPROVAL' && this.dialogItem.StatusCode == PurchaseRequestStatus.RequestPlaced) {
            return true;
        }
        else if (this.userScreen == 'APPROVAL' && this.dialogItem.StatusCode > PurchaseRequestStatus.RequestPlaced
            && this.dialogItem.NoteToUser != null) {
            return true;
        }
        else {
            return false;
        }
    }

    canSave(): boolean {
        if (this.dialogItem != null && this.commonService.getLength(this.dialogItemDetailList) > 0) {
            if (this.userScreen == 'ENTRY' && this.dialogItem.EntryUserID == this.sessionService.UserID &&
                (this.dialogItem.StatusCode == PurchaseRequestStatus.New ||

                    this.dialogItem.StatusCode == PurchaseRequestStatus.RedirectedToRequest)) {
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

    canSaveItem(): boolean {
        if (this.dialogItemDetail != null && this.dialogItemDetail.ItemID != null && this.dialogItemDetail.RequestQuantity != null &&
            null &&
            this.dialogItemDetail.ExpectedDeliveryDate != null) {
            if (this.userScreen == 'ENTRY' &&
                (this.dialogItem.StatusCode == PurchaseRequestStatus.New ||

                    this.dialogItem.StatusCode == PurchaseRequestStatus.RedirectedToRequest)) {
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

    canSubmit(): boolean {

        if (this.dialogItem != null && this.commonService.getLength(this.dialogItemDetailList) > 0) {
            if (this.userScreen == 'ENTRY' && this.dialogItem.EntryUserID == this.sessionService.UserID &&
                (this.dialogItem.StatusCode == PurchaseRequestStatus.New ||
                    this.dialogItem.StatusCode == PurchaseRequestStatus.RedirectedToRequest)) {
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

    canApprove(): boolean {

        if (this.dialogItem != null && this.commonService.getLength(this.dialogItemDetailList) > 0) {

            if (this.userScreen == 'APPROVAL' && this.dialogItem.StatusCode == PurchaseRequestStatus.RequestPlaced) {
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



    ngAfterViewInit() {

        console.log(this.StageStatusList);

    }

    showDialog() {
        this.isOpen = !this.isOpen;
    }


    loadMasterData() {

        this.CurrencyList = this.sessionService.CurrencyList;

        let req = new ServiceRequest();
        this.apiService.postData("MasterDataForPurchaseOrderGetByCorpID", req).subscribe((data: MasterDataForPurchaseOrderGetByCorpIDResponse) => {
            if (data.SuccessCode == 1) {

                this.DeliveryAddressList = data.DeliveryAddressList;
                this.MaterialList = data.MaterialList;
                this.StageStatusList = data.StageStatusList;
                this.UOMList = data.UOMList;

                console.log(data);

                if (this.commonService.getLength(this.StageStatusList) > 0) {
                    this.StageStatusList = this.StageStatusList.filter(x => x.StageID == 4);
                    
                }


                if (this.Mode == 'ADD') {
                    this.StatusList = this.sessionService.StatusListAll.filter(x => x.StatusCode == 10);
                    // this.DeliveryAddressList = this.DeliveryAddressList.filter(x => x.StatusCode == 10);
                    this.SetDefaultValues();
                }
                else {
                    this.StatusList = this.sessionService.StatusListAll;

                    if (this.dialogItem.StatusCode < 240) {
                        this.DeliveryAddressList = this.DeliveryAddressList.filter(x => x.StatusCode == 10);
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

    loadEditPOValues() {
        let req = new PurchaseRequestDetailRequest();
        req.PurchaseRequestID = this.dialogItemBase.PurchaseRequestID;

        this.apiService.postData("PurchaseRequestDetailGetByPurchaseOrderID", req).subscribe((data: PurchaseRequestDetailGetByPurchaseRequestIDResponse) => {
            if (data.SuccessCode == 1) {
                this.dialogItemDetailList = data.ResultList;

                if (this.commonService.getLength(this.dialogItemDetailList) > 0) {
                    this.dialogItemDetailList.forEach(x => {
                        x.ExpectedDeliveryDateStr = moment(x.ExpectedDeliveryDate).format(AppConfig.GRID_DATE_FORMAT);
                        x.ModifiedDtTm = moment(this.dialogItem.ApproveUserDtTm).format(AppConfig.GRID_DATETIME_FORMAT);
                    });
                }

            }
            else {
                this.sessionService.showError(data.ErrorMessage);
            }
        });

        this.dialogItem.PurchaseRequestDate = moment(this.dialogItem.PurchaseRequestDate).format();
        this.dialogItem.ExpectedDeliveryDate = moment(this.dialogItem.ExpectedDeliveryDate).format();

        this.onSelectDeliveryAddress(this.dialogItem.RequestAddrID);

        if (this.userScreen == 'ENTRY' && this.dialogItem.StatusCode == PurchaseRequestStatus.RequestApproved) {
            this.cols1 = [
                { field: 'ItemName', header: 'Material', width: '30%', align: 'left', wrap: 'break-word' },
                { field: 'RequestQuantity', header: 'Request Qty', width: '15%', align: 'right', wrap: 'break-word' },
                { field: 'ApprovedQuantity', header: 'Approved Qty', width: '15%', align: 'right', wrap: 'break-word' },
                { field: 'UOM', header: 'UOM', width: '10%', align: 'right', wrap: 'break-word' },
                { field: 'ExpectedDeliveryDateStr', header: 'Exp.Del.Dt.', width: '15%', align: 'right', wrap: 'break-word' },
                { field: 'ModifiedDtTm', header: 'Approved Time', width: '15%', align: 'right', wrap: 'break-word' },
            ];

        }
    }

    onMaterialSelect() {
        if (this.SelectedMaterial != null) {
            this.dialogItemDetail.ItemName = this.SelectedMaterial.ItemName;
            this.dialogItemDetail.UOM = this.SelectedMaterial.UOM;
            this.dialogItemDetail.UOMID = this.SelectedMaterial.UOMID;

        }
    }

    closeClick() {
        this.dialogRef.close(0);
    }

    saveClick(isValid: boolean) {
        this.submitAttempt = true;

        if (isValid && this.commonService.getLength(this.dialogItemDetailList) > 0) {

            if (this.Mode1 == 'ADD' || this.Mode1 == 'EDIT') {
                this.submitAttempt = false;
                this.sessionService.showError('Kindly Close Material Dialog ..!');
                return;
            }
            let req = new SavePurchaseRequestRequest();
            let poID: number;

            req.Result = new PurchaseRequestInfo();
            //req.Result = this.dialogItem;

            req.Result.PurchaseRequestID = this.dialogItem.PurchaseRequestID;
            req.Result.CorpID = this.dialogItem.CorpID;
            req.Result.SiteID = this.dialogItem.SiteID;
            req.Result.GstTypeID = this.dialogItem.GstTypeID;
            req.Result.PurchaseRequestNumber = this.dialogItem.PurchaseRequestNumber;
            req.Result.PurchaseRequestNumberString = this.dialogItem.PurchaseRequestNumberString;
            req.Result.RequestAddrID = this.dialogItem.RequestAddrID;
            req.Result.PurchaseRequestDate = this.dialogItem.PurchaseRequestDate;
            req.Result.PurchaseRequestDateStr = this.dialogItem.PurchaseRequestDateStr;
            req.Result.ExpectedDeliveryDate = this.dialogItem.ExpectedDeliveryDate;
            req.Result.ExpectedDeliveryDateStr = this.dialogItem.ExpectedDeliveryDateStr;
            req.Result.StatusCode = this.dialogItem.StatusCode;
            req.Result.StatusMessage = this.dialogItem.StatusMessage;
            req.Result.Remarks = this.dialogItem.Remarks;
            req.Result.NoteToUser = this.dialogItem.NoteToUser;

            if (this.Mode == 'ADD') {
                req.SaveType = AppConfig.SaveType_Insert;
                poID = -1;

            }
            else {
                req.SaveType = AppConfig.SaveType_Update;
                poID = this.dialogItem.PurchaseRequestID;
            }


            req.PurchaseItemDetailList = new Array();

            if (this.commonService.getLength(this.dialogItemDetailList) > 0) {
                //req.PurchaseItemDetailList = this.dialogItemDetailList;
                this.dialogItemDetailList.forEach(d => {
                    //let itm = this.commonService.cloneAny(d);

                    let itm = new PurchaseItemRequestInfo();
                    itm.PurchaseRequestDetailID = d.PurchaseRequestDetailID;
                    itm.PurchaseRequestID = poID;
                    itm.ItemID = d.ItemID;
                    itm.RequestQuantity = d.RequestQuantity;
                    itm.UOMID = d.UOMID;
                    itm.StatusCode = d.StatusCode;
                    itm.ExpectedDeliveryDate = moment(d.ExpectedDeliveryDate).format(AppConfig.UPDATE_DATE_FORMAT);
                    itm.PurchaseRequestID = poID;
                    itm.ApprovedQuantity = d.ApprovedQuantity
                    itm.ItemRemarks = d.ItemRemarks;



                    if (itm.ItemRemarks == undefined || itm.ItemRemarks == null) { itm.ItemRemarks = ''; }
                    if (itm.StatusCode == undefined || itm.StatusCode == null) { itm.StatusCode = PurchaseRequestStatus.New; }
                    if (itm.RequestQuantity == undefined || itm.RequestQuantity == null) { itm.RequestQuantity = 0; }
                    if (itm.ApprovedQuantity == undefined || itm.ApprovedQuantity == null) { itm.ApprovedQuantity = 0; }
                    req.PurchaseItemDetailList.push(itm);
                });


            }

            if (req.Result != null) {
                req.Result.PurchaseRequestDate = moment(req.Result.PurchaseRequestDate).format(AppConfig.UPDATE_DATE_FORMAT);
                req.Result.ExpectedDeliveryDate = moment(req.Result.ExpectedDeliveryDate).format(AppConfig.UPDATE_DATE_FORMAT);

                // if (req.Result.StatusCode == PurchaseRequestStatus.Initiated || req.Result.StatusCode == PurchaseRequestStatus.SubmittedToVerification) {
                //     req.Result.StatusCode = req.Result.StatusCode + PurchaseRequestStatus.NextStage;
                // }

            }

            console.log(req);
            this.apiService.postData("SavePurchaseRequest", req).subscribe((data: ServiceReponse) => {
                if (data.SuccessCode == 1) {

                    if (this.Mode == 'ADD') {
                        this.sessionService.showSuccess("Purchase Request added successfully");
                    }

                    else if (this.Mode == 'EDIT') {
                        this.sessionService.showSuccess("Purchase Request updated successfully");
                    }

                    this.dialogRef.close(1);
                    this.Mode = 'HOME';
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

    getSubmitStatus(ch: string): number {
        console.log(this.dialogItem);
        let res = 0;
        if (ch == 'SUBMIT') {
            if (this.userScreen == 'ENTRY') {
                res = PurchaseRequestStatus.RequestPlaced;
            }

        }
        else if (ch == 'APPROVE') {
            res = PurchaseRequestStatus.RequestApproved;
        }

        else if (ch == 'REJECT') {
            res = PurchaseRequestStatus.RedirectedToRequest;
        }
        return res;
    }


    submitClick(isValid: boolean, usrLevel: string) {
        this.submitAttempt = true;

        if (isValid) {
            if (this.Mode1 == 'ADD' || this.Mode1 == 'EDIT') {
                this.submitAttempt = false;
                this.sessionService.showError('Kindly Close Material Dialog ..!');
                return;
            }
            let req = new SubmitPurchaseRequestRequest();
            req.PurchaseRequestID = this.dialogItem.PurchaseRequestID;
            req.NoteToUser = this.dialogItem.NoteToUser;
            req.Stage = this.userScreen;
            req.StatusCode = this.getSubmitStatus(usrLevel);

            console.log(req);

            this.apiService.postData("SubmitPurchaseRequest", req).subscribe((data: SaveReponse) => {
                if (data.SuccessCode == 1) {

                    this.sessionService.showSuccess("Purchase Request submitted successfully");
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
        this.dialogItemDetail = new PurchaseItemRequestInfo();
        this.SetDefaultMaterialValues();
        this.Mode1 = 'ADD';

    }

    editMaterialclick() {
        this.Mode1 = 'EDIT';
        if (this.selectedPOItem != null) {
            this.StatusList1 = this.sessionService.StatusListAll.filter(x => x.StatusCode == 10 || x.StatusCode == 20);
            this.dialogItemDetail = this.commonService.cloneAny(this.selectedPOItem);

            let itm = this.MaterialList.find(x => x.ItemID == this.dialogItemDetail.ItemID);
            if (itm != null) {
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
                    let idx = this.dialogItemDetailList.findIndex(d => d.PurchaseRequestDetailID == this.selectedPOItem.PurchaseRequestDetailID);
                    if (idx != null) {
                        this.dialogItemDetailList.splice(idx, 1);
                    }
                }
                else {
                    this.selectedPOItem = null;
                }

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

            let itm = this.dialogItemDetailList.find(x => x.ItemID == this.dialogItemDetail.ItemID && x.PurchaseRequestDetailID != this.dialogItemDetail.PurchaseRequestDetailID);
            if (itm != null) {
                this.sessionService.showError('Material already exists in the list...!');
                return;
            }

            if (this.Mode1 == 'ADD') {
                this.RwID = this.RwID - 1;
                this.dialogItemDetail.PurchaseRequestDetailID = this.RwID;

                this.dialogItemDetail.ExpectedDeliveryDateStr = moment(this.dialogItemDetail.ExpectedDeliveryDate).format(AppConfig.GRID_DATE_FORMAT);

                let nItm = this.commonService.cloneAny(this.dialogItemDetail);
                this.dialogItemDetailList.push(nItm);
                this.selectedPOItem = null;

                //this.dialogItemDetail.ItemName = this.SelectedMaterial.ItemName
                this.dialogItemDetail = null;
            }
            if (this.Mode1 == 'EDIT') {

                let nList: PurchaseItemRequestInfo[];
                nList = new Array();
                this.dialogItemDetail.ExpectedDeliveryDateStr = moment(this.dialogItemDetail.ExpectedDeliveryDate).format(AppConfig.GRID_DATE_FORMAT);
                this.dialogItemDetailList.forEach(x => {
                    if (x.PurchaseRequestDetailID == this.dialogItemDetail.PurchaseRequestDetailID) {

                        nList.push(this.commonService.cloneAny(this.dialogItemDetail));
                    }
                    else {
                        nList.push(x);
                    }
                });

                this.dialogItemDetailList = new Array();
                this.dialogItemDetailList = this.commonService.cloneAnyArray(nList);
                this.selectedPOItem = null;

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

    SelectUOM(UomInfo: any) {
        if (UomInfo != null) {
            let itm = this.UOMList.find(x => x.UOMID == Number(UomInfo.ID));
            if (itm != null) {
                this.dialogItemDetail.UOMID = itm.UOMID;
                this.dialogItemDetail.UOM = itm.UOM;
            }
        }
    }

    SelectDeliveryAddress(DeliveryAddressInfo: any) {
        if (DeliveryAddressInfo != null) {
            this.onSelectDeliveryAddress(Number(DeliveryAddressInfo.ID));
        }

    }

    onSelectDeliveryAddress(delID: number) {
        if (this.commonService.getLength(this.DeliveryAddressList) > 0) {
            this.DeliveryAddressList.forEach(x => {
                if (x.DelAddrID == delID) {
                    this.SelectedDeliveryAddress = this.commonService.cloneAny(x);
                    this.SelectedDeliveryAddress.StateName = this.sessionService.StateList.find(d => d.StateID == x.StateID).StateName;
                    this.SelectedDeliveryAddress.CountryName = this.sessionService.CountryList.find(d => d.CountryCode == x.CountryCode).CountryName;

                    return;
                }
            });
        }
    }



    SelectMaterial(MaterialInfo: any) {
        if (MaterialInfo != null) {

            let itm = this.MaterialList.find(x => x.ItemID == Number(MaterialInfo.ID));
            if (itm != null) {
                this.SelectedMaterial = this.commonService.cloneAny(itm);
                this.onMaterialSelect();
            }

        }

    }

    cancelDialogForm() {
        this.displayResponsive = false;

    }

}
