import { Component, ViewChild, ElementRef } from '@angular/core';
import { WebApiService } from "../../service/webapi.service";
import { SessionService } from "../../service/session.service";
import { CommonService } from "../../service/common.service";
import { AppConfig, MaterialReturnStatus} from "../../const/app.config";
import { LoaderService } from '../../service/loader.service';
import { FormGroup} from '@angular/forms';
import { Master_Item, PurchaseOrderInfo, Status, StockInwardTransactionList, SupplierMasterInfo, 
         StockInwardTransactionItemDetail, StockInwardTransactionProjectDetail, StockInwardPurchasePendingList, 
         StockInwardPurchasePendingProjectList, Master_UOM, InwardDCInfo, StockReplaceTransactionItemDetail } from "../../model/shared.model";
import { MatDialog } from "@angular/material/dialog";
import { ServiceReponse, StockInwardTransactionGetBySiteIDResponse,  StockInwardTransactionGetByTransactionIDResponse, 
         Master_SupplierGetByCorpIDResponse, 
         StockInwardReplaceTransactionGetAllBySiteIDResponse} from "../../model/response.model";
import { SaveStockInwardTransactionRequest, ServiceRequest, StockGetAllByCorpIDSiteIDRequest, SaveStockInwardReplaceTransactionRequest, DeleteStockInwardTransactionRequest } from "../../model/request.model";
import { ConfirmDialogComponent } from '../../common/confirmdialog.component';
import * as moment from 'moment';


@Component({
    templateUrl: './stockcancel.component.html',
    styleUrls: ['./stockcancel.component.scss']
})

export class StockCancelComponent {

    public formGroup: FormGroup;
    public submitAttempt: boolean;
    public dataGridList: StockReplaceTransactionItemDetail[];
    public cols:any[];
    public newStockCols:any[];
    public newStockCols1:any[];
    public newStockCols2:any[];

    public Mode: string;    
    public InwardList:StockInwardTransactionList[];
    public selectedDCs:StockInwardTransactionList[];
    public InwardDCList:InwardDCInfo[];
    public InwardDCListFiltered:StockInwardTransactionList[];
    public InwardGRNList:StockInwardTransactionList[];
    public selectedDataGridItem: StockReplaceTransactionItemDetail;
    public selectedDataGridItemDetail: StockReplaceTransactionItemDetail[];
    public selectedDataGridItemProjectDetail: StockInwardTransactionProjectDetail[];

    public requestDataGridItemDetail:StockReplaceTransactionItemDetail[];
    public selectedData: StockReplaceTransactionItemDetail;
    public selectedDataGridItemTemp: StockReplaceTransactionItemDetail;
    
    public PurchasePendingList:StockInwardPurchasePendingList[];

    public ProjectDetail:StockInwardPurchasePendingProjectList[];   
    public PurchaseOrderList:PurchaseOrderInfo[];
    public PurchaseOrderListFiltered:PurchaseOrderInfo[];
    public StatusList:Status[];
    public SupplierList: SupplierMasterInfo[];    
    public ItemList:Master_Item[];
    public UOMList:Master_UOM[];

    public searchRequest : StockGetAllByCorpIDSiteIDRequest;
    public CanEdit:boolean;
    public showApprove:boolean;
    public submitApproved:boolean;
    public replacementMode:boolean;

    public FormColumnsWidth : number;

    userMode:string;
    transactionDetailID:number;

    expandedRowsNewStock:{};
    returnType:string[];
    dcNumber:string;
    grnNumber:string;
    supplierID:number;

    @ViewChild('dialogForm') dialogForm:FormGroup;
    
    constructor(public dialog: MatDialog,  private apiService: WebApiService,
        public sessionService: SessionService, 
        public commonService: CommonService,
        public loaderService: LoaderService
    ) 
    {
        //this.FormColumnsWidth = 600; 
        this.FormColumnsWidth = this.sessionService.getScreenWidth();
        console.log(this.sessionService.getScreenWidth());
        this.setDefaultSearch();
        this.returnType = ['Cancel','Replacement'];
    }

    ngOnInit() {
    
        this.transactionDetailID = 0;
        this.Mode = 'HOME';
        this.replacementMode = false;
        this.PurchaseOrderList =[];
        this.loadSupplierList();
        this.loadDataGrid();
    
        this.cols = [     
            { field: 'SupplierName', header: "Supplier Name", width: '15%', align: 'left',wrap: 'break-word'},
            { field: 'InwardIDText', header: "Inward Number", width: '8%',align: 'left',wrap: 'break-word'},           
            { field: 'GRNIDText', header: "GRN Number", width: '8%', align: 'left',wrap: 'break-word'},                                   
            { field: 'ItemName', header: "Material", width: '17%', align: 'right',wrap: 'break-word'},
            { field: 'QuantityReceivedInDC', header: "Qty. Recd. In DC", width: '8%', align: 'right',wrap: 'break-word'},
            { field: 'QuantityReturn', header: "Qty. Return", width: '8%', align: 'right',wrap: 'break-word'},
            { field: 'ReplacementType', header: "Return Type", width: '10%', align: 'right',wrap: 'break-word'},
            { field: 'QuantityReceived', header: "Qty. Recd.", width: '8%', align: 'right',wrap: 'break-word'},
            { field: 'UOM', header: "UOM", width: '8%', align: 'right',wrap: 'break-word'},
            { field: 'StatusMessage', header: "Status", width: '10%', align: 'left',wrap: 'break-word'},
        ];

        this.newStockCols = [

            { field: 'PurchaseOrderNumberString', secfield: '', header: "PO No.", width: '7%',align: 'left',wrap: 'break-word'},
            { field: 'ItemName',secfield: '', header: "Material", width: '25%',align: 'left',wrap: 'break-word'},
            //{ field: 'ConvertedOrderQuantity',secfield: 'OrderQuantity', header: "Ordered Qty.", width: '10%',align: 'right',wrap: 'break-word'},
            { field: 'QuantityReceivedInDC',secfield: 'QuantityReceivedInDC', header: "Qty. Recd. In DC", width: '10%',align: 'right',wrap: 'break-word'},
            { field: 'UOM', secfield: '',header: " ", width: '8%', align: 'left',wrap: 'break-word'},   
            { field: 'QuantityReturn', secfield: 'QuantityReturn',header: "Qty. Return", width: '10%',align: 'right',wrap: 'break-word'},         
            { field: 'ReplacementType', secfield: '',header: "Return Type", width: '10%',align: 'right',wrap: 'break-word'},
            { field: 'Reason',secfield: '', header: "Reason", width: '20%', align: 'right',wrap: 'break-word'},
            { field: 'QuantityReceived', header: "Qty. Recd.", width: '10%', align: 'right',wrap: 'break-word'},

        ];


    }

    isRowSelected(): boolean {

        if (this.selectedData != null) {
            if (this.selectedData.StatusCode == 700 )
            {
                return true;
            }
            else
            {
                return false; 
            }
        }
        else {
            return false;        
        }
    }

    isRowSelectedForDelete(): boolean {

        if (this.selectedData != null) {
            if (this.selectedData.StatusCode == 700 || this.selectedData.StatusCode == 710 )
            {
                return true;
            }
            else
            {
                return false; 
            }
        }
        else {
            return false;        
        }
    }

    onKeyUp(){
        this.selectedDataGridItem = null;
    }	


    loadSupplierList()
    {
        this.apiService.postData("SupplierGetByCorpID", null).subscribe((data: Master_SupplierGetByCorpIDResponse) => {
            if (data.SuccessCode == 1) {
                this.SupplierList = data.ResultList;
    
                if (this.commonService.getLength(this.SupplierList) >0)
                {
                  this.SupplierList.forEach(x=> {
                    x.SupplierIDString = x.SupplierID.toString();
                  });
                }
            }
            else
            {
              this.sessionService.showError(data.ErrorMessage);
            }
          });
    }

    SelectSupplier(SupplierListInfo: any) {

        if (SupplierListInfo != null) {
            this.onSupplierSelection( Number(SupplierListInfo.ID), null);
        }

    }

    onSupplierSelection(suppID:number,mode:string)
    {
        this.InwardList = new Array();
        this.InwardDCList = new Array();
        this.InwardGRNList = new Array();
        this.InwardDCListFiltered = new Array();
        this.requestDataGridItemDetail = new Array();

        console.log(suppID);

        if (suppID != null)
        {
            let req = new ServiceRequest();
            req.ID = suppID;

            this.apiService.postData("StockInwardTransactionGetAllBySupplierID", req).subscribe((data: StockInwardTransactionGetBySiteIDResponse) => {
                if (data.SuccessCode == 1) {
                    this.InwardList = data.ResultList;

                    if (this.commonService.getLength(this.InwardList) > 0)
                    {                    
                        let tmpList:StockInwardTransactionList[];
                        let tmpList1:StockInwardTransactionList[];

                        tmpList = new Array();
                        tmpList1 = new Array();

                        this.InwardList.forEach( itm => {                        
                            itm.GRNDateStr = moment(itm.GRNDate).format(AppConfig.GRID_DATE_FORMAT);
                            itm.DCDateStr = moment(itm.DCDate).format(AppConfig.GRID_DATE_FORMAT);

                            let tmp = this.InwardDCList.find(d=> d.toString() == itm.DCNumber);

                            if (tmp == null)
                            {
                                let nDC = new InwardDCInfo();
                                nDC.DCNumber = itm.DCNumber;
                                nDC.DCNumberText = itm.DCNumber;

                                this.InwardDCList.push(nDC);
                                tmpList.push(itm);
                            }
                            
                            tmpList1.push(itm);
                        });

                        this.InwardDCListFiltered = tmpList;
                        this.InwardGRNList = tmpList1;
                    }

                    if (mode == 'EDIT' && this.selectedDataGridItemTemp != null)
                    {
                        console.log('edit trigger')
                        //this.dcNumber = this.selectedDataGridItem.DCNumber;
                        //this.grnNumber = this.selectedDataGridItem.GRNIDText;
                        this.onGRNChange(mode);
                    }
                }
                else
                {
                    this.sessionService.showError(data.ErrorMessage);
                }
            });


        }

        

    }

    onDCSelect(dcNum:string)
    {
        if (this.Mode == 'ADD')
        {
            this.requestDataGridItemDetail = new Array();
            this.selectedDataGridItem = new StockReplaceTransactionItemDetail();
            this.selectedDataGridItem.ReplaceDate = moment().format();
        }

        this.InwardGRNList = new Array();

        if (dcNum != null)
        {
           let tmp = this.InwardList.filter(d=> d.DCNumber == dcNum);

           if(this.commonService.getLength(tmp) > 0)
           {
                tmp.forEach(d=> {

                    this.InwardGRNList.push(d);

                });

           }

        }

    }

    onGRNChange(mode:string)
    {
        console.log('On GRN Change');
        

        this.requestDataGridItemDetail = new Array();

        if ((this.selectedDataGridItem != null && this.selectedDataGridItem.GRNID != null && this.Mode == 'ADD') || 
            (this.selectedDataGridItemTemp != null && this.selectedDataGridItemTemp.GRNID != null && this.Mode != 'ADD'))
        {            
            if (mode =='ADD')
            {
                let tmp = this.InwardGRNList.find(d=> d.GRNID == this.selectedDataGridItem.GRNID);

                console.log(tmp);

                if (tmp != null)
                {
                    this.selectedDataGridItem.DCDate = tmp.DCDate;
                    this.selectedDataGridItem.GRNDate = tmp.GRNDate;
                    this.selectedDataGridItem.InvoiceNumber = tmp.InvoiceNumber;
                    this.selectedDataGridItem.ReplaceDate = moment().format();
                    this.selectedDataGridItem.StockInwardTransactionID = tmp.StockInwardTransactionID;
                }
                 
                this.loadTransactionData(this.selectedDataGridItem.StockInwardTransactionID,mode);
            }
            else
            {
                
                this.loadTransactionData(this.selectedDataGridItemTemp.StockInwardTransactionID,mode);
                this.selectedDataGridItem = this.selectedDataGridItemTemp;
            }
          

            
            
        }

    }

    addClick() 
    {
        this.dcNumber = null;
        this.grnNumber = null;
        this.supplierID = null;

        this.selectedDCs = new Array();
        this.InwardList = new Array();
        this.InwardDCList = new Array();
        this.InwardGRNList = new Array();
        this.InwardDCListFiltered = new Array();

        this.transactionDetailID = 0;
        this.CanEdit= true;
        this.showApprove = false;
        this.submitApproved = false;
        this.StatusList = this.sessionService.GetStatusByCategory('Stock').filter(x=>x.StatusCode == 600);
        this.expandedRowsNewStock = {};

        this.selectedDataGridItem = new StockReplaceTransactionItemDetail();
        this.selectedDataGridItem.ReplaceDate = moment().format();
        this.selectedDataGridItemDetail = new Array();
        this.requestDataGridItemDetail = new Array();
        this.Mode = 'ADD';
    }
  
    editClick() 
    {

        if (this.selectedData != null) {
            this.onDoubleClick(this.selectedData);
        }
    }

    setDefaultSearch()
    {
        this.searchRequest = new StockGetAllByCorpIDSiteIDRequest();
        this.searchRequest.FromDate = moment().add('months',-1).format();
        this.searchRequest.ToDate = moment().format();

    }

    
    cancelClick() {
        this.Mode = 'HOME';
        this.submitAttempt = false;
        this.selectedDataGridItem = null;
        this.selectedDataGridItemTemp = null;
        this.selectedData = null;
    }
    
    refreshClick(){
        this.cancelClick();
        this.loadDataGrid();
    }

    loadTransactionData(grnID:number, mode:string)
    {
        this.requestDataGridItemDetail = new Array();
        console.log(grnID);
        if (grnID != null)
        {
            let req = new ServiceRequest();
            req.ID = grnID; //stock inward transaction id

            if (mode == 'ADD')
            {
                req.Code = 'Pending';
            }
            else if (this.selectedDataGridItemTemp.StatusCode == MaterialReturnStatus.Pending ||
                     this.selectedDataGridItemTemp.StatusCode == MaterialReturnStatus.Submitted)
            {
                req.Code = 'Pending';
            }
            else
            {
                req.Code = 'Approved';
            }

            this.apiService.postData("StockInwardReplaceTransactionGetByGRNID", req).subscribe((data: StockInwardReplaceTransactionGetAllBySiteIDResponse) => {
                if (data.SuccessCode == 1) {    

                    if (this.commonService.getLength(data.ResultList)>0)
                    {
                        this.selectedDataGridItemDetail = data.ResultList;
                        //this.selectedDataGridItemDetail = data.ResultList;
                        //this.selectedDataGridItemProjectDetail = data.ProjectDetail;
                        console.log(this.selectedDataGridItemDetail);

                        if (this.commonService.getLength(this.selectedDataGridItemDetail)>0)
                        {
                           
                            this.selectedDataGridItemDetail.forEach(x=> {

                                if ((mode == 'ADD' && x.QuantityReceivedInDC > 0) || 
                                    (mode != 'ADD' && this.submitApproved != true  && x.QuantityReceivedInDC > 0) ||
                                    (this.submitApproved == true  && x.QuantityReturn > 0))

                                {
                                    let tItem = new StockReplaceTransactionItemDetail();                                   
        
                                    if (x.StockReplaceTransactionDetailID != null && x.StockReplaceTransactionDetailID > 0)
                                    {
                                        tItem.StockReplaceTransactionDetailID = x.StockReplaceTransactionDetailID;
                                    }
                                    else
                                    {
                                        this.transactionDetailID += -1;
                                        tItem.StockReplaceTransactionDetailID = this.transactionDetailID;
                                    }
                                   
                                    tItem.StockInwardTransactionID = x.StockInwardTransactionID;
                                    tItem.StockInwardTransactionDetailID = x.StockInwardTransactionDetailID;
                                    tItem.PurchaseOrderDetailID = x.PurchaseOrderDetailID;
                                    tItem.PurchaseOrderID = x.PurchaseOrderID;
                                    tItem.PurchaseOrderNumber = x.PurchaseOrderNumber;
                                    tItem.PurchaseOrderNumberString = x.PurchaseOrderNumberString;
    
                                    tItem.ItemID = x.ItemID;
                                    tItem.ItemName = x.ItemName;
                                    tItem.OrderQuantity = x.OrderQuantity;
                                    //tItem.ConvertedOrderQuantity = x.ConvertedOrderQuantity;
                                    tItem.UOMID = x.UOMID;
                                    //tItem.PUOMID = x.PUOMID;
                                    tItem.UOM = x.UOM;
                                    //tItem.PUOM = x.PUOM;
                                    //tItem.ConversionRate = x.ConversionRate;
                                    tItem.QuantityReceivedInDC = x.QuantityReceivedInDC;
                                    //tItem.QuantityPUOMReceivedInDC = x.QuantityPUOMReceivedInDC;

                                    //tItem.QuantityPUOMReturn = x.QuantityPUOMReturn;
                                    tItem.QuantityReturn = x.QuantityReturn;
                                    //tItem.QuantityPUOMReceived = x.QuantityPUOMReceived;
                                    tItem.QuantityReceived = x.QuantityReceived;

                                    tItem.ReplacementType = x.ReplacementType;
                                    tItem.Reason = x.Reason;
    
                                    tItem.TotalQtyReturned = x.TotalQtyReturned;
                                    tItem.TotalQtyReceived = x.TotalQtyReceived;
                                    
                                    tItem.totalReturnalbleQty = x.QuantityReceivedInDC - x.TotalQtyReturned;

                                    this.requestDataGridItemDetail.push(tItem);
    
                                }
                                
                            });
                           
                            console.log(this.requestDataGridItemDetail);
                        }

                    }
                    
                }
                else
                {
                    this.sessionService.showError(data.ErrorMessage);
                }
            });

        }
    }

      

    onQtyChange(itm:StockReplaceTransactionItemDetail)
    {
        console.log(itm);

        if (itm != null)
        {
            if (itm.QuantityReturn != null)
            {
                //if (itm.ConversionRate == null) { itm.ConversionRate = 1; }

                //itm.QuantityReturn = Math.round(itm.QuantityPUOMReturn * itm.ConversionRate);

            }

        }

    }

    SubmitClick(isValid:boolean,opt:string) {
        
        this.submitAttempt = true;
        let itemsFound:number;
        console.log('Submit Clicked');

        isValid = true;
        let reqData:StockReplaceTransactionItemDetail[];

        itemsFound = 0;
        if (this.commonService.getLength(this.requestDataGridItemDetail)>0)
        {
            reqData = new Array();

            this.requestDataGridItemDetail.forEach(x=> {

                if (x.QuantityReturn != null && x.QuantityReturn > 0)
                {
                    if (x.ReplacementType == null || x.ReplacementType == undefined) 
                    {
                        isValid = false;
                    }
                    else
                    {
                        if (x.QuantityReturn > x.totalReturnalbleQty)
                        {
                            isValid = false;
                        }
                        else
                        {
                            itemsFound += 1;
                            reqData.push(x);
                        }
                    }

                }

            });

            if (this.commonService.getLength(reqData) == 0)
            {               
                isValid = false;
            }

        }
        else
        {
            isValid = false;
        }


        if (itemsFound == 0)
        {
            this.sessionService.showError('Atleast one item need to be filled...!');
            return;
        }

        if (isValid)
        {
            console.log('True');
            console.log(opt);

            let req = new SaveStockInwardReplaceTransactionRequest();
            
            req.GRNID = this.selectedDataGridItem.GRNID;
            req.ReplaceDate = this.selectedDataGridItem.ReplaceDate;
            
            if (opt == 'save')
            {
                console.log('1');
                req.StatusCode = MaterialReturnStatus.Pending;                
            }
            else if (opt == 'submit')
            {
                console.log('2');
                req.StatusCode = MaterialReturnStatus.Submitted;
            }
            else if (opt == 'approve')
            {
                console.log('3');
                req.StatusCode = MaterialReturnStatus.Approved;
            }
            else if (opt == 'reject')
            {
                console.log('4');
                req.StatusCode = MaterialReturnStatus.Rejected;
            }

            req.StockReplaceItemDetails = reqData;         
            if (this.commonService.getLength(req.StockReplaceItemDetails)>0)
            {
                req.StockReplaceItemDetails.forEach(x=> {
                    if (x.QuantityReceived == undefined || x.QuantityReceived == null)
                    { x.QuantityReceived = 0; }
                });
            }
            console.log(req);

            this.apiService.postData("SaveStockInwardReplaceTransaction",req).subscribe((data: ServiceReponse) => {
                if (data.SuccessCode == 1) {

                    if(this.Mode == 'ADD') {
                        this.sessionService.showSuccess("Stock Cancel / Replacement request placed successfully");
                    }

                    else if(this.Mode == 'EDIT') {
                        this.sessionService.showSuccess("Stock  Cancel / Replacement request updated successfully");
                    }

                    this.refreshClick();
                    this.Mode = 'HOME';
                }
                else {
                    this.sessionService.showError(data.ErrorMessage);
                }
            });


        }
        

        // let req = new SaveStockInwardTransactionRequest();
 
        // req.StockInwardInfo =  this.selectedDataGridItem;
        // req.StockInwardItemDetails = new Array();
        // req.StockInwardProjectDetails = new Array();

        // if (this.commonService.getLength(this.selectedDataGridItemDetail))
        // {
        //     this.selectedDataGridItemDetail.forEach(d=> {

        //         req.StockInwardItemDetails.push(d);

        //         if (this.commonService.getLength(d.ProjectItemDetail)>0)
        //         {
        //             d.ProjectItemDetail.forEach(lx=> {
        //                 req.StockInwardProjectDetails.push(lx);
        //             });
                    
        //         }


        //     });

        // }

        // if (isValid) 
        // {

        //     if(this.Mode == 'ADD'){
        //         req.SaveType = AppConfig.SaveType_Insert
        //     }
        //     else{
        //         req.SaveType = AppConfig.SaveType_Update
        //     }

        //     if (opt == 'submit')
        //     {
        //         req.StockInwardInfo.StatusCode = 605;
        //     }
        //     else if (opt == 'approve')
        //     {
        //         if (req.StockInwardInfo.QualityRating == null || req.StockInwardInfo.QualityRating == 0)
        //         {
        //             this.sessionService.showError('Quality rating is required...');
        //             return;
        //         }
                
        //         req.StockInwardInfo.StatusCode = 610;
        //     }
        //     else if (opt == 'reject')
        //     {
        //         req.StockInwardInfo.StatusCode = 620;
        //     }
   
        //     this.apiService.postData("SaveStockInwardTransaction",req).subscribe((data: ServiceReponse) => {
        //         if (data.SuccessCode == 1) {

        //             if(this.Mode == 'ADD') {
        //                 this.sessionService.showSuccess("Stock Inward added successfully");
        //             }

        //             else if(this.Mode == 'EDIT') {
        //                 this.sessionService.showSuccess("Stock Inward updated successfully");
        //             }

        //             this.refreshClick();
        //             this.Mode = 'HOME';
        //         }
        //         else {
        //             this.sessionService.showError(data.ErrorMessage);
        //         }
        //     });
        // }

        // else
        // {
        //     this.sessionService.showError('Some mandatory informations are missing please check');
        //     return;
        // }

    }

    loadDataGrid() 
    {   
        let req = new StockGetAllByCorpIDSiteIDRequest();
        req.FromDate = moment(this.searchRequest.FromDate).add('day',-1).format();
        req.ToDate =  moment(this.searchRequest.ToDate).add('day',1).format();


        this.apiService.postData("StockInwardReplaceTransactionGetAllBySiteID", req).subscribe((data: StockInwardReplaceTransactionGetAllBySiteIDResponse) => {
            if (data.SuccessCode == 1) {
                this.dataGridList = data.ResultList;

                if (this.commonService.getLength(this.dataGridList) > 0)
                {
                    this.dataGridList.forEach( itm => {
                        
                        itm.GRNDateStr = moment(itm.GRNDate).format(AppConfig.GRID_DATE_FORMAT);
                        itm.DCDateStr = moment(itm.DCDate).format(AppConfig.GRID_DATE_FORMAT);
                        
                    });
                }
            }
            else
            {
                this.sessionService.showError(data.ErrorMessage);
            }
        });
    }



    
    // loadMasterData(Mode: string) {
                
       
    //     console.log(this.selectedDataGridItem);

    //     this.apiService.postData("StockInwardTransactionPendingListGetAll", null).subscribe((data: StockInwardTransactionPendingListGetAllResponse) => {
    //         if (data.SuccessCode == 1) {

    //             console.log(data);
                
    //             this.PurchasePendingList = data.ResultList;
    //             this.ProjectDetail = data.ProjectDetail;
    //             this.SupplierList = data.SupplierList;       
                
    //             this.PurchaseOrderList = new Array();

    //             if (this.commonService.getLength(data.PurchaseOrdersList)>0)
    //             {
    //                 data.PurchaseOrdersList.forEach(d=> {
    //                     let nPur = new PurchaseOrderInfo();
    //                     nPur.PurchaseOrderID = d.PurchaseOrderID;
    //                     nPur.PurchaseOrderNumberString = d.PurchaseOrderNumber.toString();
    //                     nPur.PurchaseOrderDate = moment(d.PurchaseOrderDate).format(AppConfig.GRID_DATE_FORMAT);

    //                     this.PurchaseOrderList.push(nPur);
    //                 });
    //             }

    //             if (Mode == 'EDIT')
    //             {
    //                 this.loadTransactionData(Mode);    
    //                 this.onSupplierSelection(this.selectedDataGridItemTemp.SupplierID);                
    //             }
    //             else
    //             {
    //                 this.Mode = Mode;
    //             }
                

                
    //         }
    //         else
    //         {
    //             this.sessionService.showError(data.ErrorMessage);
    //             this.cancelClick();
    //         }
    //     });


    //     this.sessionService.scrollAdjust();
    // }




    // onSelectionPurchaseOrders()
    // {
    //     console.log(this.selectedDataGridItem);

    //     if (this.selectedDataGridItem != null && this.selectedDataGridItem.PurchaseOrderNumbers != null)
    //     {
    //         console.log("1");
    //         console.log(this.selectedDataGridItem.PurchaseOrderNumbers);

    //         let xNos:string[];            
    //         this.selectedDataGridItem.PurchaseOrderNumbers = this.selectedDataGridItem.PurchaseOrderNumbers + '';

        
    //         xNos = [];
    //         this.selectedDataGridItem.PurchaseOrderNumbers.split(',').forEach(x=> {
    //             xNos.push(x.toString());

    //             let poNum = x.toString();

    //             let ptmp = this.PurchaseOrderList.find(d=> d.PurchaseOrderNumberString == poNum);

    //             if (ptmp != null)
    //             {
    //                 let tData = this.PurchasePendingList.filter(lx=> lx.PurchaseOrderID == ptmp.PurchaseOrderID);

    //                 if (this.commonService.getLength(tData)>0)
    //                 {
    //                     tData.forEach(lx=> {

    //                         let xtmp = this.selectedDataGridItemDetail.find(f=> f.PurchaseOrderID == lx.PurchaseOrderID && 
    //                             f.PurchaseOrderDetailID == lx.PurchaseOrderDetailID && f.ItemID == lx.ItemID);

    //                         if (xtmp == null)
    //                         {

    //                             this.transactionDetailID += -1;

    //                             let nStkItem = new StockInwardTransactionItemDetail();
    //                             nStkItem.StockInwardTransactionDetailID = this.transactionDetailID;
    //                             nStkItem.PurchaseOrderID = lx.PurchaseOrderID;
    //                             nStkItem.PurchaseOrderDetailID = lx.PurchaseOrderDetailID;
    //                             nStkItem.PurchaseOrderNumber = lx.PurchaseOrderNumber;
    //                             nStkItem.ItemID = lx.ItemID;
    //                             nStkItem.ItemName = lx.ItemName;
    //                             nStkItem.OrderQuantity = lx.OrderQuantity;                                
    //                             nStkItem.ConvertedOrderQuantity = lx.ConvertedOrderQuantity;
    //                             nStkItem.BalanceToBeReceived = lx.BalanceToBeReceived;
    //                             nStkItem.BalancePUOMToBeReceived = lx.BalancePUOMToBeReceived;
    //                             nStkItem.UOMID = lx.UOMID;
    //                             nStkItem.PUOMID = lx.PUOMID;
    //                             nStkItem.UOM = lx.UOM;
    //                             nStkItem.PUOM = lx.PUOM;
    //                             nStkItem.ConversionRate = lx.ConversionRate;

    //                             let arq = 0;
    //                             let arq1 = 0;
    //                             arq = nStkItem.OrderQuantity - nStkItem.BalanceToBeReceived;
    //                             arq1 = nStkItem.ConvertedOrderQuantity - nStkItem.BalancePUOMToBeReceived;

    //                             if (arq < 0) { arq = 0; }
    //                             if (arq1 < 0) { arq1 = 0; }
                                
    //                             nStkItem.AlreadyReceivedQuantity = arq;
    //                             nStkItem.AlreadyReceivedQuantityConverted = arq1;

    //                             let rq = 0;
    //                             let cq = 0;
    //                             let rq1 = 0;
    //                             let cq1 = 0;
    
    //                             nStkItem.ProjectItemDetail = new Array();

    //                             if (this.commonService.getLength(this.ProjectDetail)>0)
    //                             {
    //                                 let tmp = this.ProjectDetail.filter(f=> f.PurchaseOrderID == nStkItem.PurchaseOrderID && f.ItemID == nStkItem.ItemID);

    //                                 if (this.commonService.getLength(tmp)>0)
    //                                 {
    //                                     tmp.forEach(l=> {

    //                                         let nStkPrjItem = new StockInwardTransactionProjectDetail();
                                            
    //                                         nStkPrjItem.StockInwardTransactionDetailID = this.transactionDetailID;
    //                                         nStkPrjItem.PurchaseOrderID = lx.PurchaseOrderID;
    //                                         nStkPrjItem.PurchaseOrderDetailID = lx.PurchaseOrderDetailID;
    //                                         nStkPrjItem.ItemID = lx.ItemID;
    //                                         nStkPrjItem.ItemName = lx.ItemName;
    //                                         nStkPrjItem.ProjectID = l.ProjectID;
    //                                         nStkPrjItem.OrderQuantity = l.OrderQuantity;
    //                                         nStkPrjItem.BalanceToBeReceived = l.BalanceToBeReceived;
    //                                         nStkPrjItem.OrderIDText = l.OrderIDText;
    //                                         nStkPrjItem.StyleName = l.StyleName;
    //                                         nStkPrjItem.StyleDescription = l.StyleDescription;

    //                                         let arq2 = 0;
    //                                         arq2 = nStkPrjItem.OrderQuantity - nStkPrjItem.BalanceToBeReceived;
    //                                         if (arq2 <0) { arq2 = 0; }
    //                                         nStkPrjItem.AlreadyReceivedQuantity = arq2;

    //                                         nStkItem.ProjectItemDetail.push(nStkPrjItem);


    //                                     });
    //                                 }
                                    
    //                             }

    //                             this.selectedDataGridItemDetail.push(nStkItem);
    

    //                         }


    //                     });



    //                 }


    //             }



    //         });

    //         if (this.commonService.getLength(this.selectedDataGridItemDetail)>0)
    //         {
    //             let nNos:string[];
    //             nNos = [];

    //             console.log("kk");

    //             this.selectedDataGridItemDetail.forEach(x=> {

    //                 let ltmp = xNos.find(d=> d.toString() == x.PurchaseOrderNumber);
    //                 let ltmp1 = nNos.find(d=> d.toString() == x.PurchaseOrderNumber);

    //                 console.log(ltmp);
    //                 console.log(ltmp1);

    //                 if (ltmp == null && ltmp1 == null)
    //                 {                        
    //                     nNos.push(x.PurchaseOrderNumber);
    //                 }                   

    //             });

    //             console.log(xNos);
    //             console.log(nNos);

    //             if (this.commonService.getLength(nNos)>0)
    //             {
    //                 nNos.forEach(d=> {

    //                     let poNum = d.toString();

    //                     this.selectedDataGridItemDetail = this.selectedDataGridItemDetail.filter(f=> f.PurchaseOrderNumber != d);


    //                 });

                   
                

    //             }
                

             
    //         }
           
    //     }
    //     else
    //     {
    //         console.log("2");
    //         this.selectedDataGridItemDetail = new Array();
    //     }
    // }
 
    
    // cancelOrReplaceRequest()
    // {
    //     console.log("a");
    //     if (this.selectedData != null)
    //     {
    //         console.log("b");

    //         this.Mode = 'EDIT';
    //         this.selectedDataGridItem = Object.assign({},this.selectedData);  
    //         this.replacementMode = true;  
    //         this.selectedDataGridItemDetail = new Array();
    //         this.selectedDataGridItemProjectDetail = new Array();

    //         this.expandedRowsNewStock = {};
    //         this.loadMasterData('EDIT');
    //     }
    // }
    
    onDoubleClick(rowData:StockReplaceTransactionItemDetail){
        this.replacementMode = false;
        this.CanEdit= false;
        this.showApprove =false;
        this.submitApproved = false;

        this.selectedDataGridItem = new StockReplaceTransactionItemDetail();
        this.selectedDataGridItemTemp = new StockReplaceTransactionItemDetail();
        this.requestDataGridItemDetail = new Array();

        if (rowData != null){

            this.StatusList = this.sessionService.GetStatusByCategory('Stock');
            this.selectedDataGridItemTemp = Object.assign({},rowData);    

            if (this.selectedDataGridItemTemp.StatusCode == 800 ){
                this.CanEdit = true;
            }
            else if (this.selectedDataGridItemTemp.StatusCode == 810)
            {
                this.CanEdit = true;
                this.showApprove = true;
            }
            else if ( this.selectedDataGridItemTemp.StatusCode > 810 )
            // else if ( this.selectedDataGridItemTemp.StatusCode == 720 ||
            //           this.selectedDataGridItemTemp.StatusCode == 730 || 
            //           this.selectedDataGridItemTemp.StatusCode == 740 || 
            //           this.selectedDataGridItemTemp.StatusCode == 750 )
            {
                this.submitApproved = true;
            }

            console.log( this.selectedDataGridItem);

            this.supplierID = this.selectedDataGridItemTemp.SupplierID;
            this.onSupplierSelection(this.supplierID,'EDIT');
            this.Mode = 'EDIT';

            this.expandedRowsNewStock = {};      
           
        }
    }

    

    deleteClick() {

        let isValid:boolean;

        if (this.selectedData != null) {
            if (this.selectedData.StatusCode == 700 || this.selectedData.StatusCode == 710  )
            {
                isValid =  true;
            }
            else
            {
                isValid = false; 
            }
        }
        else {
            isValid = false;        
        }

        if (isValid) {
          
          let dialogRef = this.dialog.open(ConfirmDialogComponent, {
            data: {
              DialogHeader: 'Alert',
              DialogMessage: 'Are you sure you want to delete?'
            },
            disableClose: true,
          });
    
          dialogRef.afterClosed().subscribe(result => {
            if (result == 1) {
    
              let req = new DeleteStockInwardTransactionRequest();
              req.StockReplaceTransactionDetailID = this.selectedData.StockReplaceTransactionDetailID;
              req.StatusCode = MaterialReturnStatus.Cancelled;
    
              this.apiService.postData("DeleteStockInwardReplaceTransaction", req).subscribe((data: ServiceReponse) => {
                if (data.SuccessCode == 1) {
                  this.sessionService.showSuccess("Replacement/Cacel entry deleted sucessfully");
                  this.refreshClick();
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


}
