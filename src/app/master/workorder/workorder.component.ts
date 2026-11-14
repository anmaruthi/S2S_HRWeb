import { Component } from '@angular/core';
import { WebApiService } from "../../service/webapi.service";
import { SessionService } from "../../service/session.service";
import { CommonService } from "../../service/common.service";
import { AppConfig, MasterStatus} from "../../const/app.config";
import { LoaderService } from '../../service/loader.service';
import { FormGroup} from '@angular/forms';
import { Status, ProcessInfo, Master_Department, 
        ProcessFlowInfo, Master_ExecutionMode, ProcessFlowTransactionInfo, ProcessFlowTransactionDetails, 
        ProcessFlowTransactionDetailsInfo, Master_Color, Master_Size, ProjectWorkOrderByDepartmentIDResult,
        VendorList, 
        ReportsInfo} from "../../model/shared.model";
import { MatDialog } from "@angular/material/dialog";
import { ServiceReponse, WorkOrder_GetAll_ByDepartmentIDResponse, MasterData_WorkOrder_GetAllResponse, WorkOrderSaveResponse, GetReportGuikeyByParametersResponse, WorkOrderGetAllByProjectProcessIDResponse } from "../../model/response.model";
import { ProjectProcessFlowDetailSaveRequest, ProjectGetAllByCorpIDSiteIDRequest, WorkOrderSaveRequest, GetReportGuikeyByParametersRequest, WorkOrderGetAllByProjectProcessIDRequest } from "../../model/request.model";
import { DomSanitizer, SafeResourceUrl, SafeUrl} from '@angular/platform-browser';
import * as moment from 'moment';

@Component({
    templateUrl: './workorder.component.html',
    styleUrls: ['./workorder.component.scss']
})

export class WorkOrderComponent {

    rowGroupMetadata: any;

    public submitAttempt: boolean;
    public processFlowSubmitAttempt:boolean;
    public dataGridList: ProjectWorkOrderByDepartmentIDResult[];
    public workOrderList: ProjectWorkOrderByDepartmentIDResult[];
    public cols:any[];
    public cols1:any[];
    public Mode: string;
    public selectedDataGridItem: ProjectWorkOrderByDepartmentIDResult;
    public selectedData: ProjectWorkOrderByDepartmentIDResult;
    public selectedData1: ProjectWorkOrderByDepartmentIDResult;
    public selectedDataItem: ProjectWorkOrderByDepartmentIDResult;

    public ProcessList:ProcessInfo[];
    public DepartmentList:Master_Department[];
    public ExecutionModeList:Master_ExecutionMode[]
    public StatusList:Status[];
    public ProcessStatusList:Status[];
    public ColorList:Master_Color[];
    public SizeList:Master_Size[];
    public VendorList:VendorList[];
    public workorderID: number;

    public ProcessFlowList:ProcessFlowInfo[]
    public newProcessFlow:ProcessFlowInfo;

    public ProcessFlowTransactionArray:ProcessFlowTransactionInfo[];
    public ProcessFlowTransaction:ProcessFlowTransactionInfo;
    public ProcessFlowListTransactions: ProcessFlowTransactionDetailsInfo[];
    public newProcessFlowTransaction:ProcessFlowTransactionDetails;
    public lastFlowTransactionID: number;
    public FormColumnsWidth : number;

    userMode:string;

    public SelectedReport:ReportsInfo;
    public showReport:boolean;
    public reportPage:string;
    public reportUrl:SafeResourceUrl;
    
    constructor(public dialog: MatDialog,  private apiService: WebApiService,
        public sessionService: SessionService, 
        public commonService: CommonService,
        public loaderService: LoaderService, private sanitizer: DomSanitizer
    ) 
    {   
        this.FormColumnsWidth = this.sessionService.getScreenWidth() - 500;
        this.newProcessFlow = new ProcessFlowInfo();
    }

    ngOnInit() {
            
        this.showReport = false; 
        this.Mode = 'HOME';
        this.ProcessList =[];
        this.DepartmentList =[];
        this.StatusList = this.sessionService.GetStatusByCategory('WorkOrder');
        this.ProcessStatusList = this.sessionService.GetStatusByCategory('Process');
        this.loadDataGrid();
     
        this.workorderID = 0;

        this.cols = [     
            //{ field: 'ProjectName', header: "Project Name", width: '10%',align: 'left',wrap: 'break-word',rwspan: 'yes'},
            //{ field: 'StyleName', header: "Style Name", width: '8%',align: 'left',wrap: 'break-word',rwspan: 'yes'},
            //{ field: 'BuyerName', header: "Buyer Name", width: '8%', align: 'left',wrap: 'break-word',rwspan: 'yes'},
            { field: 'ProcessName', header: "Process Name", width: '12%', align: 'left',wrap: 'break-word',rwspan: 'no'},
            { field: 'ExecutionModeName', header: "Execution Mode", width: '10%', align: 'left',wrap: 'break-word',rwspan: 'no'},
            //{ field: 'TotalOrderQuantity', header: "Quantity", width: '8%', align: 'right',wrap: 'break-word',rwspan: 'no'},
            //{ field: 'AdditionalQuantityPercentage', header: "Addl. Qty %", width: '8%', align: 'right',wrap: 'break-word',rwspan: 'no'},
            { field: 'FinalOrderQuantity', header: "Process Quantity", width: '8%', align: 'right',wrap: 'break-word',rwspan: 'no'},
            { field: 'TentativeProcessStartDate1', header: "Start Date", width: '12%', align: 'right',wrap: 'break-word',rwspan: 'no'},
            { field: 'ProcessCompletionDate1', header: "Completion Date", width: '12%', align: 'right',wrap: 'break-word',rwspan: 'no'},
            { field: 'StatusMessage', header: "Process Status", width: '12%', align: 'left',wrap: 'break-word',rwspan: 'no'},
            { field: 'Quantity', header: "WO Qty", width: '8%', align: 'right',wrap: 'break-word',rwspan: 'no'},

        ];


        this.cols1 = [     
            { field: 'WorkOrderNumber', header: "Work Order Number", width: '10%', align: 'left',wrap: 'break-word',rwspan: 'no'},
            { field: 'WorkOrderDate1', header: "Work Order Date", width: '15%', align: 'left',wrap: 'break-word',rwspan: 'no'},
            { field: 'VendorName', header: "Vendor Name", width: '30%', align: 'left',wrap: 'break-word',rwspan: 'no'},
            { field: 'Quantity', header: "Quantity", width: '15%', align: 'right',wrap: 'break-word',rwspan: 'no'},
            { field: 'WorkOrderStatusMessage', header: "Status", width: '20%', align: 'right',wrap: 'break-word',rwspan: 'no'}, 
        ];

        this.loadMasterData();
    }


    isRowSelected(): boolean {

        if (this.selectedData != null) {
            return true;
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

        let req = new ProjectGetAllByCorpIDSiteIDRequest();
                
        req.DepartmentID  = -1;
        req.StatusCode = -1;     
        req.Options = 1;   

        this.apiService.postData("WorkOrderGetAllByDepartmentID", req).subscribe((data: WorkOrder_GetAll_ByDepartmentIDResponse) => {
            if (data.SuccessCode == 1) 
            {
                this.dataGridList = data.WorkOrderList;
                console.log(this.dataGridList);

                if (this.commonService.getLength(this.dataGridList) > 0)
                {

                    let cRw = 0;

                    this.dataGridList.forEach( itm => {


                        if (itm.ExecutionModeName.toLowerCase() != 'outsource')
                        {
                            itm.bgColor = '#DDDD';
                        }                        

                        if (this.commonService.getLengthNA(itm.TentativeProcessStartDate) > 0)
                        {
                            itm.TentativeProcessStartDate1 = moment(itm.TentativeProcessStartDate).format(AppConfig.GRID_DATE_FORMAT);
                        }
                        if (this.commonService.getLengthNA(itm.ProcessCompletionDate) > 0)
                        {
                            itm.ProcessCompletionDate1 = moment(itm.ProcessCompletionDate).format(AppConfig.GRID_DATE_FORMAT);
                        }

                        let tmp = data.ProjectList.find(d => d.ProjectID == itm.ProjectID);

                        if (tmp != null && tmp.GridRow == null)
                        {
                            itm.sizeCount = tmp.ProcessCount;
                            data.ProjectList.find(d => d.ProjectID == itm.ProjectID).GridRow = cRw;
                        }

                        let aq = 0;

                        if (itm.TotalOrderQuantity > 0 && itm.AdditionalQuantityPercentage >0 )
                        {
                            aq = Number(Math.round((itm.TotalOrderQuantity / 100 ) * itm.AdditionalQuantityPercentage).toFixed(0));
                        }

                        itm.FinalOrderQuantity = itm.TotalOrderQuantity + aq;

                        cRw = cRw + 1;

                    });

                    
                }

            }
            else
            {
                this.sessionService.showError(data.ErrorMessage);
                return;
            }
        });
    }
 
    loadMasterData() {        
        this.apiService.postData("MasterData_WorkOrder_GetAll", null).subscribe((data: MasterData_WorkOrder_GetAllResponse) => {
            if (data.SuccessCode == 1) {
                this.DepartmentList = data.DepartmentList;
                this.ProcessList = data.ProcessList;
                this.ExecutionModeList = data.ExecutionModeList;
                this.VendorList = data.VendorList;
            }
            else
            {
                this.sessionService.showError(data.ErrorMessage);
                this.cancelClick();
            }
        });
        
        this.sessionService.scrollAdjust();
    }

    cloneWorkOrderDetails(c: ProjectWorkOrderByDepartmentIDResult): ProjectWorkOrderByDepartmentIDResult {
        let data = new ProjectWorkOrderByDepartmentIDResult();
        for (let prop in c) {
            data[prop] = c[prop];
        }
        return data;
    }

    workorderEditClick(rowData: ProjectWorkOrderByDepartmentIDResult)
    {
        if (rowData != null)
        {
            this.selectedDataItem = this.cloneWorkOrderDetails(rowData);
            this.Mode = 'EDIT';
        }
    }

    workorderEditCancelClick()
    {
        this.processFlowSubmitAttempt = false;
        this.selectedDataItem = new ProjectWorkOrderByDepartmentIDResult();
        this.selectedDataItem.WorkOrderStatusCode = this.StatusList.find(x=> x.StatusMessage.toLowerCase() == 'new').StatusCode;
        this.Mode == 'WORKORDER';
    }

    workorderDeleteClick(rowData: ProjectWorkOrderByDepartmentIDResult)
    {
        if (rowData != null)
        {
            let index = this.workOrderList.findIndex( itm => itm.WorkOrderID == rowData.WorkOrderID);
            this.workOrderList = this.workOrderList.filter((val, i) => i != index);

            this.processFlowSubmitAttempt = false;
            this.selectedDataItem = new ProjectWorkOrderByDepartmentIDResult();
            this.selectedDataItem.WorkOrderStatusCode = this.StatusList.find(x=> x.StatusMessage.toLowerCase() == 'new').StatusCode;
            this.Mode == 'WORKORDER';
        }
    }

    workorderAddEdit(formStatus)
    {
        console.log('aaaa');
        this.processFlowSubmitAttempt = true;

        if (formStatus) {           
            
            console.log('bbbb');

            if (this.selectedDataItem.WorkOrderID == null){
                    this.workorderID += -1;
                    this.selectedDataItem.WorkOrderID = this.workorderID;
            }

            let index = this.workOrderList.findIndex(itm => itm.WorkOrderDate == this.selectedDataItem.WorkOrderDate
                && itm.VendorID == this.selectedDataItem.VendorID && this.selectedDataItem.WorkOrderID != itm.WorkOrderID);
            if (index != -1)
            {
                this.sessionService.showError('Duplicate entry not allowed (Vendor and date)');
                this.selectedDataItem.WorkOrderID = null;
                return;
            }

            if (moment(this.selectedDataItem.WorkOrderDate).isBefore(moment(this.selectedDataGridItem.TentativeProcessStartDate))){
                this.sessionService.showError('Work Order Date must be after Project Process Start Date');
                return;
            }

            if (moment(this.selectedDataItem.WorkOrderDate).isAfter(moment(this.selectedDataGridItem.ProcessCompletionDate))){
                this.sessionService.showError('Work Order Date must be before Project Process Completion Date');
                return;
            }
 
            console.log(this.StatusList);
            
            this.selectedDataItem.VendorName = this.VendorList.find(d=> d.VendorID == this.selectedDataItem.VendorID).VendorName;
            this.selectedDataItem.WorkOrderStatusMessage = this.StatusList.find(d=> d.StatusCode == this.selectedDataItem.WorkOrderStatusCode).StatusMessage;            
            if (this.commonService.getLengthNA(this.selectedDataItem.WorkOrderDate) > 0)
            {
                this.selectedDataItem.WorkOrderDate1 = moment(this.selectedDataItem.WorkOrderDate).format(AppConfig.GRID_DATE_FORMAT);
            }

            console.log('cccc');

            if (this.commonService.getLength(this.workOrderList) <= 0)
            {
                this.workOrderList = new Array();
            }

            //if (this.commonService.getLength(this.workOrderList) > 0){

                let tQty = 0;

                this.workOrderList.forEach(x=> {
                    if (x.Quantity != null)
                    {
                        tQty = tQty + x.Quantity;
                    }
                });

                if (this.Mode != 'EDIT')
                {
                    tQty = tQty + this.selectedDataItem.Quantity;
                }
            
                if (this.selectedDataGridItem.FinalOrderQuantity < tQty)
                {
                    this.sessionService.showError('Total work order quantity should not be greater than Order quantity');
                    return;
                }


                let index1 = this.workOrderList.findIndex( itm => itm.WorkOrderID == this.selectedDataItem.WorkOrderID);
                if (index1 != -1)
                {
                    let info = this.workOrderList;
                    let x = this.cloneWorkOrderDetails(this.selectedDataItem);
                    info[index1] = x;
                    
                    this.workOrderList = info;
                }
                else
                {
                    this.workOrderList.push(this.selectedDataItem);
                }
            //}
            
 
            this.processFlowSubmitAttempt = false;
            this.selectedDataItem = new ProjectWorkOrderByDepartmentIDResult();
            this.selectedDataItem.WorkOrderStatusCode = this.StatusList.find(x=> x.StatusMessage.toLowerCase() == 'new').StatusCode;
            this.Mode == 'WORKORDER';
        }

    }


    onDoubleClick(rowData:ProjectWorkOrderByDepartmentIDResult){
        if (rowData != null){
            this.lastFlowTransactionID = 0;
            this.newProcessFlowTransaction = new ProcessFlowTransactionDetails();
            this.StatusList = this.sessionService.GetStatusByCategory('WorkOrder');
            this.selectedDataGridItem = Object.assign({},rowData);              
            this.processFlowSubmitAttempt = false;

            if (this.selectedDataGridItem != null && this.selectedDataGridItem.ExecutionMode != null && this.selectedDataGridItem.ExecutionMode == 2)
            {
                return;
            }

            let req = new WorkOrderGetAllByProjectProcessIDRequest();
            
            req.ProjectID = this.selectedDataGridItem.ProjectID;
            req.ProjectProcessID = this.selectedDataGridItem.ProjectProcessID;

            this.workOrderList = new Array();
            this.selectedDataItem = new ProjectWorkOrderByDepartmentIDResult();
            this.selectedDataItem.WorkOrderStatusCode = this.StatusList.find(x=> x.StatusMessage.toLowerCase() == 'new').StatusCode;
            this.workorderID = 0;

            this.apiService.postData("WorkOrderGetAllByProjectProcessID", req).subscribe((data: WorkOrderGetAllByProjectProcessIDResponse) => {
                if (data.SuccessCode == 1) {
                    this.workOrderList = data.WorkOrderDetailList;

                    if (this.commonService.getLength(this.workOrderList)>0)
                    {
                        this.workOrderList.forEach(d=> {
                            if (this.commonService.getLengthNA(d.WorkOrderDate) > 0)
                            {
                                d.WorkOrderDate1 = moment(d.WorkOrderDate).format(AppConfig.GRID_DATE_FORMAT);
                            }
                        });
                    }

                    console.log(this.workOrderList);
                }
                else
                {
                    this.sessionService.showError(data.ErrorMessage);
                    this.cancelClick();
                }
            });

            this.Mode = 'WORKORDER';               
        }
    }  

    editClick() 
    {       
        if (this.selectedData != null) {
            this.Mode = 'WORKORDER';
            this.onDoubleClick(this.selectedData);
        }
    }
    
 
    SubmitClick() {
        
        this.processFlowSubmitAttempt = true;

        let req = new WorkOrderSaveRequest();

        if (this.selectedDataGridItem != null && this.commonService.getLength(this.workOrderList)>0) 
        {
            req.ProjectProcessID = this.selectedDataGridItem.ProjectProcessID;
            req.ProjectID = this.selectedDataGridItem.ProjectID;
            req.workOrderList = this.workOrderList;

            this.apiService.postData("SaveWorkOrder",req).subscribe((data: WorkOrderSaveResponse) => {
                if (data.SuccessCode == 1) {
                    this.sessionService.showSuccess("Work order information updated successfully");

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
            this.sessionService.showError('Some mandatory informations are missing');
            return;
        }
    }


    cancelClick() {
        this.Mode = 'HOME';
        this.submitAttempt = false;
        this.selectedDataGridItem = null;
        this.selectedData = null;
    }
    
    refreshClick(){
        this.cancelClick();
        this.loadDataGrid();
    }

    printWorkOrder()
    {        
        this.SelectedReport = new ReportsInfo();
        this.SelectedReport.ReportID = 4;

        let req = new GetReportGuikeyByParametersRequest();
        req.SelectedReport = this.SelectedReport;
        req.ParameterDataList = 'WorkOrderID:' + this.selectedData1.WorkOrderID;

        this.apiService.postData("GetReportGuikeyByParameters", req).subscribe((data: GetReportGuikeyByParametersResponse) => { 
            if (data.ReportTransanctionID != null && data.SuccessCode == 1) 
            {
                console.log(data);

                this.reportPage = AppConfig.REPORTPAGE_PATH + '?reportid=' + this.SelectedReport.ReportID + '&reportkey=' + data.ReportTransanctionID.toString().trim();
                this.reportUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.reportPage);     
                this.showReport = true; 
            }
            else if (data.SuccessCode == 0) 
            {
                this.sessionService.showError(data.ErrorMessage);
            }
        });
    }

    cancelReportClick()
    {
        this.showReport = false;
    }

    isWorkOrderReady(): boolean {

        // if (this.commonService.getLength(this.workOrderList)>0) {
        //     return true;
        // }
        // else {
        //     return false;        
        // }

        if (this.selectedData1 != null)
        {
            return true;
        }
        else
        {
            return false;       
        }
    }
}

