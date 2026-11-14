import { Component } from '@angular/core';
import { WebApiService } from "../../service/webapi.service";
import { SessionService } from "../../service/session.service";
import { CommonService } from "../../service/common.service";
import { AppConfig, MasterStatus, MaterialRequestStatus, OutwardType, ReturnType } from "../../const/app.config";
import { LoaderService } from '../../service/loader.service';
import { FormGroup } from '@angular/forms';
import { Status, StockOutwardTransactionInfo, Master_Department, Master_UserList, ProjectInfo, ProjectAccessoriesInfo, Master_Item, CustomerMasterInfo, ReportsInfo, StockOutwardTransactionItemDetail } from "../../model/shared.model";
import { MatDialog } from "@angular/material/dialog";
import { ServiceReponse, StockOutwardTransactionGetBySiteIDResponse, ProjectAccessoriesDetailsGetByProjectIDRespone, MasterData_SaveStockOutwardTransaction_GetAllResponse, GetReportGuikeyByParametersResponse, StockOutwardTransactionGetByTransactionIDResponse } from "../../model/response.model";
import { GetReportGuikeyByParametersRequest, SaveStockOutwardTransactionRequest, ServiceRequest, StockGetAllByCorpIDSiteIDRequest } from "../../model/request.model";
import { ConfirmDialogComponent } from 'src/app/common/confirmdialog.component';
import * as moment from 'moment';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
    templateUrl: './stockoutward.component.html',
    styleUrls: ['./stockoutward.component.scss']
})

export class StockOutwardComponent {
    public formGroup: FormGroup;
    public submitAttempt: boolean;
    public submitAttempt1: boolean;
    public searchSubmitAttempt: boolean;
    public dataGridList: StockOutwardTransactionInfo[];
    public cols: any[];
    public newStockCols: any[];
    public Mode: string;
    public Mode1: string;
    public selectedDataGridItem: StockOutwardTransactionInfo;
    public selectedData: StockOutwardTransactionInfo;
    public selectedDataGridItemDetail: StockOutwardTransactionItemDetail[];
    public deletedItemDetail: StockOutwardTransactionItemDetail[];
    public selectedOWItem: StockOutwardTransactionItemDetail;
    public dialogItem: StockOutwardTransactionItemDetail;
    public DepartmentList: Master_Department[];
    public UserList: Master_UserList[];
    public UserListAll: Master_UserList[];
    public ProjectList: ProjectInfo[];
    public StatusList: Status[];
    public ItemList: Master_Item[];
    public CanEdit: boolean;
    public searchRequest: StockGetAllByCorpIDSiteIDRequest;
    public FormColumnsWidth: number;
    public CustomerList: CustomerMasterInfo[];

    public SelectedReport:ReportsInfo;
    public showReport:boolean;
    public reportPage:string;
    public reportUrl:SafeResourceUrl;

    RwID: number;
    
    constructor(public dialog: MatDialog, private apiService: WebApiService,
        public sessionService: SessionService,
        public commonService: CommonService,
        public loaderService: LoaderService,
        private sanitizer: DomSanitizer
    ) {
        //this.FormColumnsWidth = 600;
        this.FormColumnsWidth = this.sessionService.getScreenWidth();
        this.setDefaultSearch();
    }

    ngOnInit() {

        this.Mode = 'HOME';
        this.showReport = false ;
        this.selectedDataGridItem = new StockOutwardTransactionInfo();
        this.dialogItem = new StockOutwardTransactionItemDetail();

        this.cancelClick();

        this.loadDataGrid('');
        this.loadMasterData();

        this.cols = [
            { field: 'CreatedDtTm', header: "Req. Date", width: '8', align: 'left', wrap: 'break-word' },           
            { field: 'CustomerName', header: "Customer", width: '10%', align: 'left', wrap: 'break-word' },
            { field: 'DepartmentName', header: "Department", width: '10%', align: 'left', wrap: 'break-word' },
            { field: 'RequestedUserName', header: "User Name", Width: '10%', align: 'left', wrap: 'break-word' },
            //{ field: 'RequestedQuantity', header: "Req.  Qty", width: '8%', align: 'right', wrap: 'break-word' },
            { field: 'OutwardType', header: "Outward Type", Width: '10%', align: 'left', wrap: 'break-word' },
            { field: 'ReturnType', header: "Return Type", Width: '10%', align: 'left', wrap: 'break-word' },
            { field: 'ItemName', header: "Material", width: '20%', align: 'left', wrap: 'break-word' },
            { field: 'DeliveredQuantity', header: "Del. Qty", width: '8%', align: 'right', wrap: 'break-word' },
            { field: 'UOM', header: "UOM", width: '6%', align: 'left', wrap: 'break-word' },            
            { field: 'StatusMessage', header: "Status", width: '8%', align: 'left', wrap: 'break-word' }
        ];

        this.newStockCols = [            
            { field: 'ItemName', header: "Item Name", width: '70%',align: 'left',wrap: 'break-word'},
            { field: 'DeliveredQuantity', header: "Delivered Qty.", width: '25%',align: 'right',wrap: 'break-word'}
        ];

        this.RwID = 0;
        this.selectedDataGridItemDetail = new Array();
        
        this.cancelMaterialForm();
    }

    addMaterialclick() {
        this.dialogItem = new StockOutwardTransactionItemDetail();
        this.Mode1 = 'ADD';
    }

    editMaterialclick() {
        this.Mode1 = 'EDIT';
        if (this.selectedOWItem != null) {
            this.dialogItem = this.commonService.cloneAny(this.selectedOWItem);

            let itm = this.selectedDataGridItemDetail.find(x => x.ItemID == this.dialogItem.ItemID);
            if (itm != null) {
                this.dialogItem = this.commonService.cloneAny(itm);
            }

            this.Mode1 = 'EDIT';
        }

    }
    
    
    deleteMaterialDetail() {
        if (this.selectedOWItem != null) {
            let dialogRef = this.dialog.open(ConfirmDialogComponent, {
                data: {
                    DialogHeader: 'Alert',
                    DialogMessage: 'Are you sure you want to delete?'
                },
                disableClose: true,
            });

            dialogRef.afterClosed().subscribe(result => {

                if (result == 1) {
                    let idx = this.selectedDataGridItemDetail.findIndex(d => d.StockOutwardTransactionDetailID == this.selectedOWItem.StockOutwardTransactionDetailID);
                    if (idx != null) {
                        this.selectedDataGridItemDetail.splice(idx, 1);
                    }
                }
                else {
                    this.selectedOWItem = null;
                }
            });
        }
    }



    cancelMaterialForm() {
        this.Mode1 = 'HOME';
        this.submitAttempt1 = false;
        this.dialogItem = null;        
    }

    updateMaterialDetails(isValid: boolean) {
        this.submitAttempt1 = true;

        if (isValid) {

            let itm = this.selectedDataGridItemDetail.find(x => x.ItemID == this.dialogItem.ItemID && x.StockOutwardTransactionDetailID != this.dialogItem.StockOutwardTransactionDetailID);
            if (itm != null) {
                this.sessionService.showError('Material already exists in the list...!');
                return;
            }

            if (this.Mode1 == 'ADD') {
                this.RwID = this.RwID - 1;
                this.dialogItem.StockOutwardTransactionDetailID = this.RwID;
                
                let nItm = this.commonService.cloneAny(this.dialogItem);   
                nItm.ItemName = this.ItemList.find(x=> x.ItemID == nItm.ItemID).ItemName;
                this.selectedDataGridItemDetail.push(nItm);
                this.selectedOWItem = null;
                this.dialogItem = null;
            }
            if (this.Mode1 == 'EDIT') {

                let nList: StockOutwardTransactionItemDetail[];
                nList = new Array();
                this.selectedDataGridItemDetail.forEach(x => {
                    if (x.StockOutwardTransactionDetailID == this.dialogItem.StockOutwardTransactionDetailID) {
                        nList.push(this.commonService.cloneAny(this.dialogItem));
                    }
                    else {
                        nList.push(x);
                    }
                });

                this.selectedDataGridItemDetail = new Array();
                this.selectedDataGridItemDetail = this.commonService.cloneAnyArray(nList);
                this.selectedOWItem = null;
                this.dialogItem = null;

                console.log(this.selectedDataGridItemDetail);
            }


        }
        else {
            this.sessionService.showError('Some mandatory informations are missing, please check');
            return;
        }
        this.Mode1 = 'HOME';

    }

    DisableEdit1(): boolean {

        if (this.selectedOWItem != null) {
            return false;
        }
        else {
            return true;
        }

    }

    reportCloseClick()
    {
        this.showReport = false ;
    }

    onKeyUp() {
        this.selectedDataGridItem = null;
    }

    isRowSelected(): boolean {

        if (this.selectedData != null) {
            return true;
        }
        else {
            return false;
        }
    }

    loadDataGrid(mode: string) {
        let req = new StockGetAllByCorpIDSiteIDRequest();
        req.FromDate = moment(this.searchRequest.FromDate).format();

        if (mode == 'SEARCH') {
            req.ToDate = moment(this.searchRequest.ToDate).add(1, 'day').format();
        }
        else {
            req.ToDate = moment(this.searchRequest.ToDate).format();
        }

        this.apiService.postData("StockOutwardTransactionGetBySiteID", req).subscribe((data: StockOutwardTransactionGetBySiteIDResponse) => {
            if (data.SuccessCode == 1) {
                this.dataGridList = data.ResultList;
                console.log(this.dataGridList);
                if (this.commonService.getLength(this.dataGridList) > 0) {
                    this.dataGridList.forEach(itm => {
                        if (this.commonService.getLengthNA(itm.CreatedDtTm) > 0) {
                            itm.CreatedDtTm = moment(itm.CreatedDtTm).format(AppConfig.GRID_DATE_FORMAT);
                            // this.commonService.formatDate(itm.CreatedDtTm);
                        }
                    });
                }
            }
            else {
                this.sessionService.showError(data.ErrorMessage);
            }
        });
    }


    loadMasterData() {

        this.apiService.postData("StockOutwardMastersGetAll", null).subscribe((data: MasterData_SaveStockOutwardTransaction_GetAllResponse) => {
            if (data.SuccessCode == 1) {
                this.ItemList = data.MaterialList;
                this.UserList = data.UserList;
                this.DepartmentList = data.DepartmentList;
                this.CustomerList = data.CustomerList;


                //this.onProjectChange(false, Mode);
                //this.onDepartmentChange(false);
                console.log(this.ItemList);
            }
            else {
                this.sessionService.showError(data.ErrorMessage);
                this.cancelClick();
            }
        });

        //this.onDepartmentChange(false);
        this.sessionService.scrollAdjust();
    }


    setDefaultSearch() {
        this.searchRequest = new StockGetAllByCorpIDSiteIDRequest();
        this.searchRequest.FromDate = moment().add('months', -1).format();
        this.searchRequest.ToDate = moment().format();

    }

    onDepartmentChange(canClearItem: boolean) {
        // if(canClearItem){
        //     this.selectedDataGridItem.RequestedUserID = undefined;
        // }
        // if(this.selectedDataGridItem.RequestedDepartmentID > 0){
        //     this.UserList = this.UserListAll.filter(x=>x.DepartmentID == this.selectedDataGridItem.RequestedDepartmentID);
        // }
    }


    onDoubleClick(rowData: StockOutwardTransactionInfo) {
        this.CanEdit = false;
        if (rowData != null) {
            this.StatusList = this.sessionService.GetStatusByCategory('Stock');
            this.selectedDataGridItem = Object.assign({}, rowData);
            this.selectedDataGridItemDetail = new Array();

            let req = new ServiceRequest();
            req.ID = this.selectedDataGridItem.StockOutwardTransactionID;

            this.apiService.postData("StockOutwardTransactionGetByTransactionID", req).subscribe((data: StockOutwardTransactionGetByTransactionIDResponse) => {
                if (data.SuccessCode == 1) {
                    this.selectedDataGridItemDetail = data.ResultList;
                }
                else {
                    this.sessionService.showError(data.ErrorMessage);
                }
            });


            if (this.selectedDataGridItem.StatusCode == MaterialRequestStatus.Submitted) {
                this.CanEdit = true;
            }
            this.Mode = 'EDIT';
        }
    }

    addClick() {
        this.CanEdit = false;
        this.selectedDataGridItem = new StockOutwardTransactionInfo();
        this.selectedDataGridItemDetail = new Array();
        this.deletedItemDetail = new Array();
        this.selectedDataGridItem.IsInternal = OutwardType.Internal;
        this.selectedDataGridItem.IsReturnable = ReturnType.Returnable;
        this.selectedDataGridItem.OutwardDate = moment().format();
        this.Mode = 'ADD';
    }

    editClick() {
        if (this.selectedData != null) {
            this.onDoubleClick(this.selectedData);
        }
    }

    SubmitClick(isValid: boolean, ch: string) {

        this.submitAttempt = true;

        let req = new SaveStockOutwardTransactionRequest();

        req.StockInwardInfo = this.selectedDataGridItem;

        if (isValid) {

            if (this.commonService.getLength(this.selectedDataGridItemDetail) <= 0)
            {
                this.sessionService.showError('Outward material list is empty...!');
                return;
            }

            req.StockOutwardDetail = new Array();
            this.selectedDataGridItemDetail.forEach(x=> {
                let xItm = new StockOutwardTransactionItemDetail();
                xItm.StockOutwardTransactionDetailID = x.StockOutwardTransactionDetailID;
                xItm.ItemID = x.ItemID;
                xItm.DeliveredQuantity = x.DeliveredQuantity;

                req.StockOutwardDetail.push(xItm);
            });

            req.StockInwardInfo = this.selectedDataGridItem;
            if (ch == 'APPROVE') {
                req.StockInwardInfo.StatusCode = MaterialRequestStatus.Approved;
            }
            if (ch == 'REJECT') {
                req.StockInwardInfo.StatusCode = MaterialRequestStatus.Rejected;
            }

            if (this.Mode == 'ADD') {
                //req.ResultList.RequestedQuantity = req.ResultList.DeliveredQuantity;
                req.SaveType = AppConfig.SaveType_Insert
            }
            else {
                req.SaveType = AppConfig.SaveType_Update
            }

            let dialogRef = this.dialog.open(ConfirmDialogComponent, {
                data: {
                    DialogHeader: 'Stock Issue',
                    DialogMessage: "Are you sure ?"
                },
                disableClose: true,
            });

            dialogRef.afterClosed().subscribe(result => {
                if (result == 1) {

                    console.log(req);
                    this.apiService.postData("SaveStockOutwardTransaction", req).subscribe((data: ServiceReponse) => {
                        if (data.SuccessCode == 1) {

                            if (this.Mode == 'ADD') {
                                this.sessionService.showSuccess("Stock Outward added successfully");
                            }
                            else if (this.Mode == 'EDIT') {
                                this.sessionService.showSuccess("Stock Outward updated successfully");
                            }
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

    cancelClick() {
        this.Mode = 'HOME';
        this.submitAttempt = false;
        this.selectedDataGridItem = null;
        this.selectedData = null;       
    }

    refreshClick() {
        this.cancelClick();
        this.setDefaultSearch();
        this.loadDataGrid('');
    }

    


  printReport()
  {   
    this.SelectedReport = new ReportsInfo();

    console.log("1");

    if (this.commonService.getLength(this.sessionService.ReportsList)>0 && this.selectedDataGridItem != null)
    {
        console.log(this.selectedDataGridItem);
        
        let strItm = '';

        if (this.selectedDataGridItem.IsInternal == 1)
        {
            strItm = 'Material Issue Slip';
        }
        else
        {
            strItm = 'Delivery Challan';
        }
      
      let itm = this.sessionService.ReportsList.find(x=> x.ReportName == strItm);
      if (itm != null)
      {
        this.SelectedReport.ReportID = itm.ReportID;

        let req = new GetReportGuikeyByParametersRequest();
        req.SelectedReport = this.SelectedReport;
        req.ParameterDataList = 'Outward ID:' + this.selectedDataGridItem.StockOutwardTransactionID;

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
