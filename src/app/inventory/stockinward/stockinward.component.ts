import { Component, ViewChild, ElementRef } from '@angular/core';
import { WebApiService } from "../../service/webapi.service";
import { SessionService } from "../../service/session.service";
import { CommonService } from "../../service/common.service";
import { AppConfig, StockStatus } from "../../const/app.config";
import { LoaderService } from '../../service/loader.service';
import { FormGroup} from '@angular/forms';
import { Master_Item, PurchaseOrderInfo, StockInwardTransactionInfo, Status, StockInwardTransactionList, SupplierMasterInfo, StockInwardTransactionItemDetail, StockInwardTransactionProjectDetail, StockInwardPurchasePendingList, StockInwardPurchasePendingProjectList, Master_UOM, ReportsInfo } from "../../model/shared.model";
import { MatDialog } from "@angular/material/dialog";
import { ServiceReponse, MasterData_SaveStockInwardTransaction_GetAllResponse, StockInwardTransactionGetBySiteIDResponse, PurchaseOrderItemDetailsGetByPurchaseOrderIDRespone, PurchaseOrderDetailsResponse, StockInwardTransactionPendingListGetAllResponse, StockInwardTransactionGetByTransactionIDResponse, GetReportGuikeyByParametersResponse } from "../../model/response.model";
import { GetReportGuikeyByParametersRequest, PurchaseOrderListGetBySiteIDRequest, SaveStockInwardTransactionRequest, ServiceRequest, StockGetAllByCorpIDSiteIDRequest, UpdateStockInwardTransactionRequest } from "../../model/request.model";
import { ConfirmDialogComponent } from '../../common/confirmdialog.component';
import * as moment from 'moment';
import { DomSanitizer, SafeResourceUrl, SafeUrl} from '@angular/platform-browser';

@Component({
    templateUrl: './stockinward.component.html',
    styleUrls: ['./stockinward.component.scss']
})

export class StockInwardComponent {

    public formGroup: FormGroup;
    public submitAttempt: boolean;
    public dataGridList: StockInwardTransactionList[];
    public cols:any[];
    public newStockCols:any[];
    public newStockCols1:any[];
    public newStockCols2:any[];

    public Mode: string;
    public selectedDataGridItem: StockInwardTransactionList;
    public selectedDataGridItemTemp: StockInwardTransactionList;
    public selectedDataGridItemDetail: StockInwardTransactionItemDetail[];
    public selectedDataGridItemProjectDetail: StockInwardTransactionProjectDetail[];

    public selectedData: StockInwardTransactionList;
    public PurchasePendingList:StockInwardPurchasePendingList[];

    public ProjectDetail:StockInwardPurchasePendingProjectList[];   
    public PurchaseOrderList:PurchaseOrderInfo[];
    public selectedPOs:PurchaseOrderInfo[];
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

    public SelectedReport:ReportsInfo;
    public showReport:boolean;
    public reportPage:string;
    public reportUrl:SafeResourceUrl;

    userMode:string;
    transactionDetailID:number;

    expandedRowsNewStock:{};
    returnType:string[];

    @ViewChild('dialogForm') dialogForm:FormGroup;
    
    constructor(public dialog: MatDialog,  private apiService: WebApiService,
        public sessionService: SessionService, 
        public commonService: CommonService,
        public loaderService: LoaderService, 
        private sanitizer: DomSanitizer
    ) 
    {
        //this.FormColumnsWidth = 600; 
        this.FormColumnsWidth = this.sessionService.getScreenWidth();
        this.setDefaultSearch();
        this.returnType = ['Cancel','Replacement'];
    }

    ngOnInit() {
    
        this.transactionDetailID = 0;
        this.Mode = 'HOME';
        this.replacementMode = false;
        this.showReport = false;
        this.PurchaseOrderList =[];
        this.loadDataGrid();
    
        this.cols = [     
            { field: 'SupplierName', header: "Supplier Name", width: '30%', align: 'left',wrap: 'break-word'},
            { field: 'InwardIDText', header: "Inward Number", width: '10%',align: 'left',wrap: 'break-word'},           
            { field: 'DCNumber', header: "DC Number", width: '10%',align: 'left',wrap: 'break-word'},
            { field: 'DCDateStr', header: "DC Date", width: '10%', align: 'right',wrap: 'break-word'},
            { field: 'GRNIDText', header: "GRN Number", width: '10%', align: 'left',wrap: 'break-word'},                                   
            { field: 'GRNDateStr', header: "GRN Date", width: '10%', align: 'right',wrap: 'break-word'},
            { field: 'InvoiceNumber', header: "Invoice Number", width: '10%', align: 'right',wrap: 'break-word'},
            { field: 'StatusMessage', header: "Status", width: '10%', align: 'left',wrap: 'break-word'},
        ];

        this.newStockCols = [

            { field: 'PurchaseOrderNumberString', secfield: '', header: "PO No.", width: '10%',align: 'left',wrap: 'break-word'},
            { field: 'ItemName',secfield: '', header: "Item Name", width: '25%',align: 'left',wrap: 'break-word'},
            { field: 'OrderQuantity',secfield: 'OrderQuantity', header: "Ordered Qty.", width: '10%',align: 'right',wrap: 'break-word'},
            { field: 'AlreadyReceivedQuantity',secfield: 'AlreadyReceivedQuantity', header: "Already Recd. Qty.", width: '10%',align: 'right',wrap: 'break-word'},
            //{ field: 'BalancePUOMToBeReceived', secfield: 'BalanceToBeReceived',header: "Qty. Yet To Be Recd.", width: '10%',align: 'right',wrap: 'break-word'},
            { field: 'UOM', secfield: '',header: " ", width: '5%', align: 'left',wrap: 'break-word'},            
            { field: 'QuantityReceived', secfield: 'QuantityReceived',header: "Qty. Recd.", width: '10%',align: 'right',wrap: 'break-word'},
            { field: 'BalanceQuantity', secfield: 'BalanceQuantity',header: "Balance Qty.", width: '10%', align: 'right',wrap: 'break-word'},
            { field: 'ExcessQuantityReceived',secfield: 'ExcessQuantityReceived', header: "Excess Qty.", width: '10%', align: 'right',wrap: 'break-word'},

        ];

        this.newStockCols2 = [

            { field: 'PurchaseOrderNumberString', secfield: '', header: "PO No.", width: '10%',align: 'left',wrap: 'break-word'},
            { field: 'ItemName',secfield: '', header: "Item Name", width: '35%',align: 'left',wrap: 'break-word'},
            { field: 'OrderQuantity',secfield: 'OrderQuantity', header: "Ordered Qty.", width: '15%',align: 'right',wrap: 'break-word'},
            { field: 'UOM', secfield: '',header: " ", width: '10%', align: 'left',wrap: 'break-word'},            
            { field: 'QuantityReceived', secfield: 'QuantityReceived',header: "Qty. Recd.", width: '15%',align: 'right',wrap: 'break-word'},
            { field: 'ExcessQuantityReceived',secfield: 'ExcessQuantityReceived', header: "Excess Qty.", width: '15%', align: 'right',wrap: 'break-word'},

        ];

        this.newStockCols1 = [

            { field: 'PurchaseOrderNumber', secfield: '', header: "PO No.", width: '10%',align: 'left',wrap: 'break-word'},
            { field: 'ItemName',secfield: '', header: "Item Name", width: '30%',align: 'left',wrap: 'break-word'},
            { field: 'QuantityPUOMReceived', secfield: 'QuantityReceived',header: "Qty. Recd.", width: '10%',align: 'right',wrap: 'break-word'},
            { field: 'PUOM', secfield: '',header: " ", width: '5%', align: 'left',wrap: 'break-word'},            
            { field: 'QuantityPUOManCcelled', secfield: 'QuantityCancelled',header: "Return Qty.", width: '10%',align: 'right',wrap: 'break-word'},           
            { field: 'RequestType', secfield: '',header: "Request Type", width: '10%', align: 'right',wrap: 'break-word'},
            { field: 'Comments',secfield: '', header: "Comments", width: '20%', align: 'right',wrap: 'break-word'},

        ];


    }

    isRowSelected(): boolean {

        if (this.selectedData != null) {
            if (this.selectedData.StatusCode == 600  )
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
            if (this.selectedData.StatusCode == 600 || this.selectedData.StatusCode == 605  )
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

    isPrintReady(): boolean {

        if (this.selectedData != null) {
            if (this.selectedData.StatusCode == 630  )
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

    loadDataGrid() 
    {   
        this.selectedDataGridItem = new StockInwardTransactionList();
        this.selectedDataGridItemDetail = new Array();
        this.selectedPOs = new Array();


        let req = new PurchaseOrderListGetBySiteIDRequest();
        req.StartDate = null;
        req.EndDate = null;
        
        if (this.searchRequest.FromDate != null ) { 
            req.StartDate = moment(this.searchRequest.FromDate).format(); 
            req.StartDate = moment(req.StartDate).add(-1,'days').format();
        }
        if (this.searchRequest.ToDate != null ) { 
            req.EndDate = moment(this.searchRequest.ToDate).format(); 
            req.EndDate = moment(req.EndDate).add(1,'days').format();
        }

        console.log(req);

        this.apiService.postData("StockInwardTransactionGetBySiteID", req).subscribe((data: StockInwardTransactionGetBySiteIDResponse) => {
            if (data.SuccessCode == 1) {
                this.dataGridList = data.ResultList;

                if (this.commonService.getLength(this.dataGridList) > 0)
                {
                    this.dataGridList.forEach( itm => {
                        
                        itm.GRNDateStr = moment(itm.GRNDate).format(AppConfig.GRID_DATE_FORMAT);
                        itm.DCDateStr = moment(itm.DCDate).format(AppConfig.GRID_DATE_FORMAT);
                        //itm.GRNDate = moment(itm.GRNDate).format(AppConfig.GRID_DATE_FORMAT);
                        
                    });
                }
            }
            else
            {
                this.sessionService.showError(data.ErrorMessage);
            }
        });

        //this.loadMasterData(null);
    }

    loadMasterData(Mode: string) {
                

        this.apiService.postData("StockInwardTransactionPendingListGetAll", null).subscribe((data: StockInwardTransactionPendingListGetAllResponse) => {
            if (data.SuccessCode == 1) {

                console.log(data);
                
                this.PurchasePendingList = data.ResultList;
                //this.ProjectDetail = data.ProjectDetail;
                this.SupplierList = data.SupplierList;                       
                this.PurchaseOrderList = new Array();

                if (this.commonService.getLength(data.PurchaseOrdersList)>0)
                {
                    data.PurchaseOrdersList.forEach(d=> {
                        let nPur = new PurchaseOrderInfo();
                        nPur.PurchaseOrderID = d.PurchaseOrderID;
                        nPur.PurchaseOrderNumberString = d.PurchaseOrderNumberString;
                        nPur.PurchaseOrderDate = moment(d.PurchaseOrderDate).format(AppConfig.GRID_DATE_FORMAT);

                        this.PurchaseOrderList.push(nPur);
                    });
                }

                if (Mode == 'EDIT')
                {
                    this.loadTransactionData(Mode);    
                    this.onSupplierSelection(this.selectedDataGridItemTemp.SupplierID,'EDIT');                
                }
                else
                {
                    this.Mode = Mode;
                }
                

                
            }
            else
            {
                this.sessionService.showError(data.ErrorMessage);
                this.cancelClick();
            }
        });


        this.sessionService.scrollAdjust();
    }

    loadTransactionData(Mode:string)
    {
        console.log(this.selectedDataGridItemTemp);

        if (this.selectedDataGridItemTemp != null && this.selectedDataGridItemTemp.StockInwardTransactionID != null)
        {
            let req = new ServiceRequest();
            req.ID = this.selectedDataGridItemTemp.StockInwardTransactionID;

            this.apiService.postData("StockInwardTransactionGetByTransactionID", req).subscribe((data: StockInwardTransactionGetByTransactionIDResponse) => {
                if (data.SuccessCode == 1) {    

                    if (this.commonService.getLength(data.ItemDetail)>0)
                    {
                        //this.selectedDataGridItem = data.ResultList[0];
                        this.selectedDataGridItemDetail = data.ItemDetail;
                        //this.selectedDataGridItemProjectDetail = data.ProjectDetail;
                        //this.PurchaseOrderList = data.PurchaseOrdersList;

                        if (this.commonService.getLength(this.selectedDataGridItemDetail)>0)
                        {
                            this.selectedDataGridItemDetail.forEach(x=> {

                                let tmp = this.selectedDataGridItemProjectDetail.filter(d=> d.StockInwardTransactionID == x.StockInwardTransactionID &&
                                                            d.StockInwardTransactionDetailID == x.StockInwardTransactionDetailID &&
                                                            d.PurchaseOrderID == x.PurchaseOrderID && d.PurchaseOrderDetailID && x.PurchaseOrderDetailID);

                                x.BalanceToBeReceived = 0;
                                //x.BalancePUOMToBeReceived = 0;

                                let xtmp = this.PurchasePendingList.find(d=> d.PurchaseOrderID == x.PurchaseOrderID && d.PurchaseOrderDetailID == x.PurchaseOrderDetailID && x.ItemID == d.ItemID);
                                console.log(this.PurchasePendingList);
                                console.log(x);
                                if (xtmp != null)
                                {
                                    let arq = 0;
                                    arq = x.OrderQuantity - xtmp.BalanceToBeReceived;
                                    if (arq < 0) { arq = 0; }                                   
                                    x.AlreadyReceivedQuantity = arq;                                    
                                    x.BalanceToBeReceived = xtmp.BalanceToBeReceived;

                                    if (x.QuantityReceived != null && x.BalanceToBeReceived != null)
                                    {
                                        let brq = 0;
                                        let brq1 = 0;
                                        let xq = 0;
                                        let xq1 = 0;
                        
                                        brq = x.BalancePUOMToBeReceived - x.QuantityPUOMReceived;
                                        brq1 = x.BalanceToBeReceived - x.QuantityReceived;        
                        
                                        if (brq1 < 0)
                                        {
                                            brq = 0;
                                            brq1 = 0;
                                            xq = x.QuantityPUOMReceived - x.BalancePUOMToBeReceived;
                                            xq1 = x.QuantityReceived - x.BalanceToBeReceived;
                                        }
                                        
                                        x.BalanceQuantityConverted = brq;
                                        x.BalanceQuantity = brq1;
                        
                                        x.ExcessPUOMQuantityReceived = xq;
                                        x.ExcessQuantityReceived = xq1;
                                    }                        

                                }

                                x.ProjectItemDetail = new Array();

                                // if (this.commonService.getLength(tmp)>0)
                                // {
                                //     console.log(tmp);

                                //     tmp.forEach(lx=> {

                                //         let xtmp1 = this.ProjectDetail.find(d=> d.PurchaseOrderID == lx.PurchaseOrderID && d.ItemID == lx.ItemID && d.ProjectID == lx.ProjectID);
                                //         let arq2 = 0;
                                //         if (xtmp1 != null)
                                //         {               
                                //             //lx.OrderQuantity =   xtmp1.OrderQuantity;   
                                //             lx.BalanceToBeReceived = xtmp1.BalanceToBeReceived;                                             
                                //             arq2 = lx.OrderQuantity - xtmp1.BalanceToBeReceived;                                            
                                //             if (arq2 <0) { arq2 = 0; }                                          
                                //         }
                                //         lx.AlreadyReceivedQuantity = arq2;
                                        

                                //         x.ProjectItemDetail.push(lx);

                                //     });
                                    
                                    
                                // }
                                
                                //this.onQtyChange(x);

                            });

                            //this.onSelectionPurchaseOrders();
                           
                        }

                        if (this.commonService.getLength(data.PurchaseOrdersList)>0)
                        {
                            let newList:PurchaseOrderInfo[];
                            newList = new Array();

                            console.log('po list');

                            data.PurchaseOrdersList.forEach(x=> {
                                console.log(x);

                                let newPur = new PurchaseOrderInfo();
                                newPur.PurchaseOrderID = x.PurchaseOrderID;
                                newPur.PurchaseOrderDate = x.PurchaseOrderDate;
                                newPur.PurchaseOrderNumber = x.PurchaseOrderNumber;
                                newPur.PurchaseOrderNumberString = x.PurchaseOrderNumberString;
                                newPur.SupplierID = x.SupplierID;

                                this.PurchaseOrderList.push(newPur);
                                newList.push(newPur);
                                this.selectedPOs.push(newPur);

                            });

                            console.log(newList);

                            let oldData = this.commonService.cloneAny(this.selectedDataGridItemTemp);
                            let oldList = this.commonService.cloneAnyArray(this.PurchaseOrderListFiltered);
                            this.PurchaseOrderListFiltered = new Array();
                            //this.selectedDataGridItem = new StockInwardTransactionList();

                            oldList.forEach(d=> {
                                this.PurchaseOrderListFiltered.push(d);
                            });

                            newList.forEach(d=> {
                                this.PurchaseOrderListFiltered.push(d);
                            });


                            this.onSelectionPurchaseOrders();

                        }
                        

                        this.Mode = Mode;
                        
                    }

                    
                }
                else
                {
                    this.sessionService.showError(data.ErrorMessage);
                }
            });

        }
    }
 
    SelectSupplier(SupplierListInfo: any) {

        if (SupplierListInfo != null) {
            this.onSupplierSelection( Number(SupplierListInfo.ID), null);
        }

    }

    onSupplierSelection(suppID:number,mode:string)
    {  
        //this.selectedPOs = new Array();   

        if (suppID != null)
        {
            console.log(this.PurchasePendingList);
            console.log(suppID);
            let tmp = this.PurchasePendingList.filter(d=> d.SupplierID == suppID);

            if (this.commonService.getLength(tmp)>0)
            {
                tmp.forEach(x=> {
                    let tmp1 = this.PurchaseOrderList.find(p=> p.PurchaseOrderID == x.PurchaseOrderID);
                    let tmp2 = this.PurchaseOrderListFiltered.find(p=> p.PurchaseOrderID == x.PurchaseOrderID);

                    if (tmp1 != null && tmp2 == null)
                    {
                        this.PurchaseOrderListFiltered.push(tmp1);
                        console.log(tmp1);
                    }
                });
                
                if (mode == 'EDIT')
                {
                    console.log(this.selectedDataGridItemTemp);
                    //this.selectedDataGridItem = this.commonService.cloneAny(this.selectedDataGridItemTemp);                    
                }
                
            }
        }

    }

    onSelectionPurchaseOrders()
    {
        //this.selectedDataGridItemDetail = new Array();
        console.log(this.selectedDataGridItem);
        console.log(this.selectedPOs);

        if (this.selectedPOs != null && this.selectedDataGridItem != null)
        {

            let xNos:number[];            

            xNos = [];
            this.selectedPOs.forEach(x=> {
                xNos.push(x.PurchaseOrderID);

                let ptmp = this.PurchaseOrderList.find(d=> d.PurchaseOrderID == x.PurchaseOrderID);
                
                if (ptmp != null)
                {
                    let tData = this.PurchasePendingList.filter(lx=> lx.PurchaseOrderID == ptmp.PurchaseOrderID);

                    if (this.commonService.getLength(tData)>0)
                    {
                        //prepare for stock inward
                        tData.forEach(lx=> {

                            console.log(lx);

                            //whether already available in the list
                            let xtmp = this.selectedDataGridItemDetail.find(f=> f.PurchaseOrderID == lx.PurchaseOrderID && 
                                f.PurchaseOrderDetailID == lx.PurchaseOrderDetailID && f.ItemID == lx.ItemID);

                            //if not already available in the list  
                            if (xtmp == null && this.submitApproved != true)
                            {
                                console.log('not available');
                                this.transactionDetailID += -1;

                                let nStkItem = new StockInwardTransactionItemDetail();
                                nStkItem.StockInwardTransactionDetailID = this.transactionDetailID;
                                nStkItem.PurchaseOrderID = lx.PurchaseOrderID;
                                nStkItem.PurchaseOrderDetailID = lx.PurchaseOrderDetailID;
                                nStkItem.PurchaseOrderNumber = lx.PurchaseOrderNumber;
                                nStkItem.PurchaseOrderNumberString = lx.PurchaseOrderNumberString;
                                nStkItem.ItemID = lx.ItemID;
                                nStkItem.ItemName = lx.ItemName;
                                nStkItem.OrderQuantity = lx.OrderQuantity;                                
                                nStkItem.ConvertedOrderQuantity = lx.ConvertedOrderQuantity;
                                nStkItem.BalanceToBeReceived = lx.BalanceToBeReceived;
                                nStkItem.BalancePUOMToBeReceived = lx.BalancePUOMToBeReceived;
                                nStkItem.UOMID = lx.UOMID;
                                nStkItem.PUOMID = lx.PUOMID;
                                nStkItem.UOM = lx.UOM;
                                nStkItem.PUOM = lx.PUOM;
                                nStkItem.ConversionRate = lx.ConversionRate;

                                let arq = 0;
                                let arq1 = 0;
                                arq = nStkItem.OrderQuantity - nStkItem.BalanceToBeReceived;
                                arq1 = nStkItem.ConvertedOrderQuantity - nStkItem.BalancePUOMToBeReceived;

                                if (arq < 0) { arq = 0; }
                                if (arq1 < 0) { arq1 = 0; }
                                
                                nStkItem.AlreadyReceivedQuantity = arq;
                                nStkItem.AlreadyReceivedQuantityConverted = arq1;

                                let rq = 0;
                                let cq = 0;
                                let rq1 = 0;
                                let cq1 = 0;
    
                                nStkItem.ProjectItemDetail = new Array();

                                if (this.commonService.getLength(this.ProjectDetail)>0)
                                {
                                    let tmp = this.ProjectDetail.filter(f=> f.PurchaseOrderID == nStkItem.PurchaseOrderID && f.ItemID == nStkItem.ItemID);

                                    if (this.commonService.getLength(tmp)>0)
                                    {
                                        tmp.forEach(l=> {

                                            let nStkPrjItem = new StockInwardTransactionProjectDetail();
                                            
                                            nStkPrjItem.StockInwardTransactionDetailID = this.transactionDetailID;
                                            nStkPrjItem.PurchaseOrderID = lx.PurchaseOrderID;
                                            nStkPrjItem.PurchaseOrderDetailID = lx.PurchaseOrderDetailID;
                                            nStkPrjItem.ItemID = lx.ItemID;
                                            nStkPrjItem.ItemName = lx.ItemName;
                                            nStkPrjItem.ProjectID = l.ProjectID;
                                            nStkPrjItem.OrderQuantity = l.OrderQuantity;
                                            nStkPrjItem.BalanceToBeReceived = l.BalanceToBeReceived;
                                            nStkPrjItem.OrderIDText = l.OrderIDText;
                                            nStkPrjItem.StyleName = l.StyleName;
                                            nStkPrjItem.StyleDescription = l.StyleDescription;

                                            let arq2 = 0;
                                            arq2 = nStkPrjItem.OrderQuantity - nStkPrjItem.BalanceToBeReceived;
                                            if (arq2 <0) { arq2 = 0; }
                                            nStkPrjItem.AlreadyReceivedQuantity = arq2;

                                            nStkItem.ProjectItemDetail.push(nStkPrjItem);


                                        });
                                    }
                                    
                                }

                                console.log(nStkItem);
                                this.selectedDataGridItemDetail.push(nStkItem);
    

                            }


                        });



                    }
                }

            });

            console.log(this.selectedDataGridItemDetail);

            if (this.commonService.getLength(this.selectedDataGridItemDetail)>0)
            {
                let nNos:number[];
                nNos = [];

                console.log("kk");

                this.selectedDataGridItemDetail.forEach(x=> {

                    console.log(x);

                    let ltmp = xNos.find(d=> d == x.PurchaseOrderID);
                    let ltmp1 = nNos.find(d=> d == x.PurchaseOrderID);

                    console.log(ltmp);
                    console.log(ltmp1);

                    if (ltmp == null && ltmp1 == null)
                    //if (ltmp == null && x.QuantityReceived != null && x.QuantityReceived > 0 && ltmp1 == null)
                    {                        
                        nNos.push(x.PurchaseOrderID);
                    }                   

                });

                console.log(xNos);
                console.log(nNos);

                if (this.commonService.getLength(nNos)>0)
                {
                    nNos.forEach(d=> {

                        console.log(d);
                        // if (this.selectedDataGridItem.PurchaseOrderNumbers == null || this.selectedDataGridItem.PurchaseOrderNumbers.length <= 0)
                        // {
                        //     this.selectedDataGridItem.PurchaseOrderNumbers = d.toString();
                        // }
                        // else
                        // {
                        //     this.selectedDataGridItem.PurchaseOrderNumbers = this.selectedDataGridItem.PurchaseOrderNumbers + ',' + d.toString();
                        // }

                        // this.sessionService.showError('Purchase order number ' + d.toString() + ' cannot be removed, because which has received qty values')

                        let poNum = d.toString();

                        this.selectedDataGridItemDetail = this.selectedDataGridItemDetail.filter(f=> f.PurchaseOrderID != d);


                    });

                   
                

                }
                
                console.log(this.selectedDataGridItemDetail);
             
            }
           
        }
        else
        {
            console.log("2");
            this.selectedDataGridItemDetail = new Array();
        }
    }
 
    
    
    onDoubleClick(rowData:StockInwardTransactionList){
        this.replacementMode = false;
        this.CanEdit= false;
        this.showApprove =false;
        this.submitApproved = false;

        this.selectedDataGridItemDetail = new Array();
        this.selectedDataGridItemProjectDetail = new Array();
        this.selectedPOs = new Array();
        this.PurchaseOrderListFiltered = new Array();

        if (rowData != null){

            this.StatusList = this.sessionService.GetStatusByCategory('Stock');
            this.selectedDataGridItem = Object.assign({},rowData);    
            this.selectedDataGridItemTemp = Object.assign({},rowData);    

            if (this.selectedDataGridItemTemp.StatusCode == 600 ){
                this.CanEdit= true;
            }
            else if (this.selectedDataGridItemTemp.StatusCode == 605)
            {
                this.CanEdit= true;
                this.showApprove=true;
            }
            else if ( this.selectedDataGridItemTemp.StatusCode == 610 || 
                      this.selectedDataGridItemTemp.StatusCode == 620 || 
                      this.selectedDataGridItemTemp.StatusCode == 630 )
            {
                this.submitApproved = true;
            }

            this.expandedRowsNewStock = {};            
            this.loadMasterData('EDIT');
           
        }
    }
  
    addClick() 
    {
        this.replacementMode = false;
        this.transactionDetailID = 0;
        this.CanEdit= true;
        this.showApprove = false;
        this.submitApproved = false;
        this.StatusList = this.sessionService.GetStatusByCategory('Stock').filter(x=>x.StatusCode == 600);
        this.selectedDataGridItem = new StockInwardTransactionList();
        this.selectedDataGridItem.GRNDate = moment().format();
        this.selectedDataGridItem.DCDate = moment().format();
        this.selectedDataGridItem.GRNIDText = 'New';

        this.selectedDataGridItemDetail = new Array();
        this.selectedDataGridItemProjectDetail = new Array();
        this.selectedPOs = new Array();

        this.PurchaseOrderListFiltered = new Array();

        //this.expandedRowsNewStock = [];

        this.expandedRowsNewStock = {};

        this.selectedDataGridItem.StatusCode = 600;
        this.loadMasterData('ADD');
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

    onQtyChange(itm:StockInwardTransactionItemDetail)
    {
        console.log(itm);

        if (itm != null)
        {
            if (itm.QuantityPUOMReceived != null)
            {
                if (itm.ConversionRate == null) { itm.ConversionRate = 1; }

                itm.QuantityReceived = Math.round(itm.QuantityPUOMReceived * itm.ConversionRate);

            }

            if (itm.QuantityReceived != null && itm.BalanceToBeReceived != null)
            {
                let brq = 0;
                let brq1 = 0;
                let xq = 0;
                let xq1 = 0;

                brq = itm.BalancePUOMToBeReceived - itm.QuantityPUOMReceived;
                brq1 = itm.BalanceToBeReceived - itm.QuantityReceived;        

                if (brq1 < 0)
                {
                    brq = 0;
                    brq1 = 0;
                    xq = itm.QuantityPUOMReceived - itm.BalancePUOMToBeReceived;
                    xq1 = itm.QuantityReceived - itm.BalanceToBeReceived;
                }
                
                itm.BalanceQuantityConverted = brq;
                itm.BalanceQuantity = brq1;

                itm.ExcessPUOMQuantityReceived = xq;
                itm.ExcessQuantityReceived = xq1;
            }
           

            if (this.commonService.getLength(itm.ProjectItemDetail) >0 && itm.QuantityReceived != null)
            {
                let tqr = itm.QuantityReceived;
                let oq = itm.BalanceToBeReceived;

                itm.ProjectItemDetail.forEach(lx=> {

                    let boq = 0;
                    let rqp = 0.00;
                    let prq = 0;
                    let brq = 0;

                    if (lx.BalanceToBeReceived != null)
                    {
                        boq = lx.BalanceToBeReceived;
                    }

                    rqp = (boq / oq) * 100;
                    prq = (tqr / 100) * rqp;
                    
                    if (prq > boq)
                    {
                        prq = boq;                        
                    }
                    else
                    {
                        brq = boq - prq;
                    }


                    lx.QuantityReceived = Number(prq.toFixed(0));
                    lx.BalanceQuantity = Number(brq.toFixed(0));

                    


                });
            }

        }

    }
    
    SubmitClick(isValid:boolean,opt:string) {
        
        this.submitAttempt = true;

        let itemsFound:number;
        let req = new SaveStockInwardTransactionRequest();
 
        req.StockInwardInfo =  this.selectedDataGridItem;
        req.StockInwardItemDetails = new Array();
        req.StockInwardProjectDetails = new Array();

        itemsFound = 0;
        if (this.commonService.getLength(this.selectedDataGridItemDetail))
        {
            this.selectedDataGridItemDetail.forEach(d=> {

                if (d.QuantityReceived != null && d.QuantityReceived > 0)
                {
                    itemsFound += 1;

                    if (d.QuantityAccepted == undefined || d.QuantityAccepted == null)
                    {
                        d.QuantityAccepted = 0;
                    }
                    if (d.QuantityCancelled == undefined || d.QuantityCancelled == null)
                    {
                        d.QuantityCancelled = 0;
                    }

                    req.StockInwardItemDetails.push(d);

                    if (this.commonService.getLength(d.ProjectItemDetail)>0)
                    {
                        d.ProjectItemDetail.forEach(lx=> {
                            req.StockInwardProjectDetails.push(lx);
                        });
                        
                    }
                }
               


            });

        }

        if (itemsFound == 0)
        {
            this.sessionService.showError('Atleast one item need to be filled...!');
            return;
        }

        if (isValid) 
        {

            if(this.Mode == 'ADD'){
                req.SaveType = AppConfig.SaveType_Insert
            }
            else{
                req.SaveType = AppConfig.SaveType_Update
            }

            if (opt == 'submit')
            {
                req.StockInwardInfo.StatusCode = StockStatus.Submitted;
                if (this.sessionService.actionAllowed('APPROVE_STOCKINWARD') == true)
                {
                    req.StockInwardInfo.StatusCode =  StockStatus.Approved;
                }
            }
            else if (opt == 'approve')
            {
                // if (req.StockInwardInfo.QualityRating == null || req.StockInwardInfo.QualityRating == 0)
                // {
                //     this.sessionService.showError('Quality rating is required...');
                //     return;
                // }
                
                req.StockInwardInfo.StatusCode =  StockStatus.Approved;
            }
            else if (opt == 'reject')
            {
                req.StockInwardInfo.StatusCode =  StockStatus.Rejected;
            }

            req.StockInwardInfo.PurchaseOrderNumbers = '';
            if (this.selectedPOs != null && this.commonService.getLength(this.selectedPOs) >0)
            {
                let poStr = '';

                this.selectedPOs.forEach(x=> {
                    if (poStr == '')
                    {
                        poStr = x.PurchaseOrderID.toString();
                    }
                    else
                    {
                        poStr = poStr + ',' + x.PurchaseOrderID.toString();
                    }
                    
                });

                req.StockInwardInfo.PurchaseOrderNumbers = poStr;
            }
   



            this.apiService.postData("SaveStockInwardTransaction",req).subscribe((data: ServiceReponse) => {
                if (data.SuccessCode == 1) {

                    if(this.Mode == 'ADD') {
                        this.sessionService.showSuccess("Stock Inward added successfully");
                    }

                    else if(this.Mode == 'EDIT') {
                        this.sessionService.showSuccess("Stock Inward updated successfully");
                    }

                    this.refreshClick();
                    this.Mode = 'HOME';
                }
                else {
                    this.sessionService.showError(data.ErrorMessage);
                }
            });
        }

        else
        {
            this.sessionService.showError('Some mandatory informations are missing please check');
            return;
        }
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


    deleteClick() {

        let isValid:boolean;

        if (this.selectedData != null) {
            if (this.selectedData.StatusCode == 600 || this.selectedData.StatusCode == 605  )
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
    
              let req = new UpdateStockInwardTransactionRequest();
              req.StockInwardTransactionID = this.selectedData.StockInwardTransactionID;
              req.StatusCode = StockStatus.Deleted;
    
              this.apiService.postData("UpdateStockInwardTransaction", req).subscribe((data: ServiceReponse) => {
                if (data.SuccessCode == 1) {
                  this.sessionService.showSuccess("Inward entry deleted sucessfully");
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

    reportCloseClick()
    {
      this.showReport = false;        
      this.selectedData = null;
    }

    printGRNReport()
    {   
      this.SelectedReport = new ReportsInfo();
  
      if (this.commonService.getLength(this.sessionService.ReportsList)>0)
      {
        let itm = this.sessionService.ReportsList.find(x=> x.ReportName == 'Goods Received Note');
  
        if (itm != null)
        {
          this.SelectedReport.ReportID = itm.ReportID;
  
          let req = new GetReportGuikeyByParametersRequest();
          req.SelectedReport = this.SelectedReport;
          req.ParameterDataList = 'GRN Number:' + this.selectedData.StockInwardTransactionID;
  
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
  
    
}
