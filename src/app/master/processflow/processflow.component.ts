import { Component } from '@angular/core';
import { WebApiService } from "../../service/webapi.service";
import { SessionService } from "../../service/session.service";
import { CommonService } from "../../service/common.service";
import { AppConfig, MasterStatus} from "../../const/app.config";
import { LoaderService } from '../../service/loader.service';
import { FormGroup} from '@angular/forms';
import { Master_Item, PurchaseOrderInfo, StockInwardTransactionInfo, Status, ProjectProcessByDepartmentIDResult, ProcessInfo, Master_Department, 
        ProcessFlowInfo, Master_ExecutionMode, ProcessFlowTransactionInfo, ProcessFlowTransactionDetailsColorDetails, ProcessFlowTransactionDetails, ProcessFlowTransactionDetailsInfo, Master_Color, Master_Size, ProcessFlowTransactionDetailsSizeDetails } from "../../model/shared.model";
import { MatDialog } from "@angular/material/dialog";
import { Project_GetAll_ByCorpIDSiteIDResponse, MasterData_ProcessFlowSave_GetAllResponse, ProjectProcessFlowDetailGetAllByProjectIDResponse, ServiceReponse, Process_GetAll_ByDepartmentIDResponse, ProcessFlowDetailsGetAllByProjectProcessIDResponse } from "../../model/response.model";
import { ServiceRequest, ProjectProcessFlowDetailSaveRequest, ProjectGetAllByCorpIDSiteIDRequest } from "../../model/request.model";
import * as moment from 'moment';

@Component({
    templateUrl: './processflow.component.html',
    styleUrls: ['./processflow.component.scss']
})

export class ProcessFlowComponent {

    rowGroupMetadata: any;

    public submitAttempt: boolean;
    public processFlowSubmitAttempt:boolean;
    public dataGridList: ProjectProcessByDepartmentIDResult[];
    public cols:any[];
    public Mode: string;
    public selectedDataGridItem: ProjectProcessByDepartmentIDResult;
    public selectedData: ProjectProcessByDepartmentIDResult;
    public ProcessList:ProcessInfo[];
    public DepartmentList:Master_Department[];
    public ExecutionModeList:Master_ExecutionMode[]
    public StatusList:Status[];
    public ColorList:Master_Color[];
    public SizeList:Master_Size[];
    public ProcessFlowList:ProcessFlowInfo[]
    public newProcessFlow:ProcessFlowInfo;

    public ProcessFlowTransactionArray:ProcessFlowTransactionInfo[];
    public ProcessFlowTransaction:ProcessFlowTransactionInfo;
    public ProcessFlowListTransactions: ProcessFlowTransactionDetailsInfo[];
    public newProcessFlowTransaction:ProcessFlowTransactionDetails;
    public lastFlowTransactionID: number;
    public FormColumnsWidth : number;

    userMode:string;
    
    constructor(public dialog: MatDialog,  private apiService: WebApiService,
        public sessionService: SessionService, 
        public commonService: CommonService,
        public loaderService: LoaderService
    ) 
    {
        this.FormColumnsWidth = this.sessionService.getScreenWidth() - 100;
        this.newProcessFlow = new ProcessFlowInfo();
    }

    ngOnInit() {
            
        this.Mode = 'HOME';
        this.ProcessList =[];
        this.DepartmentList =[];
        this.StatusList = this.sessionService.GetStatusByCategory('Process');
        this.loadDataGrid();
    
        // this.cols = [     
        //     { field: 'StyleName', header: "Style Name", width: '12%',align: 'left',wrap: 'break-word'},
        //     { field: 'BuyerName', header: "Buyer Name", width: '12%', align: 'left',wrap: 'break-word'},
        //     { field: 'ProcessName', header: "Process Name", width: '12%', align: 'left',wrap: 'break-word'},
        //     { field: 'TotalOrderQuantity', header: "Quantity", width: '9%', align: 'right',wrap: 'break-word'},
        //     { field: 'AdditionalQuantityPercentage', header: "Addl. Qty %", width: '10%', align: 'right',wrap: 'break-word'},
        //     { field: 'TentativeProcessStartDate1', header: "Start Date", width: '10%', align: 'right',wrap: 'break-word'},
        //     { field: 'ProcessCompletionDate1', header: "Completion Date", width: '10%', align: 'right',wrap: 'break-word'},
        //     { field: 'StatusMessage', header: "Status", width: '10%', align: 'left',wrap: 'break-word'},
        // ];
 

        this.cols = [     
            //{ field: 'ProjectName', header: "Project Name", width: '10%',align: 'left',wrap: 'break-word',rwspan: 'yes'},
            //{ field: 'StyleName', header: "Style Name", width: '8%',align: 'left',wrap: 'break-word',rwspan: 'yes'},
            //{ field: 'BuyerName', header: "Buyer Name", width: '8%', align: 'left',wrap: 'break-word',rwspan: 'yes'},
            { field: 'ProcessName', header: "Process Name", width: '14%', align: 'left',wrap: 'break-word',rwspan: 'no'},
            { field: 'ExecutionModeName', header: "Execution Mode", width: '10%', align: 'left',wrap: 'break-word',rwspan: 'no'},
            //{ field: 'TotalOrderQuantity', header: "Quantity", width: '8%', align: 'right',wrap: 'break-word',rwspan: 'no'},
            //{ field: 'AdditionalQuantityPercentage', header: "Addl. Qty %", width: '8%', align: 'right',wrap: 'break-word',rwspan: 'no'},
            { field: 'TentativeProcessStartDate1', header: "Start Date", width: '9%', align: 'right',wrap: 'break-word',rwspan: 'no'},
            { field: 'ProcessCompletionDate1', header: "Completion Date", width: '9%', align: 'right',wrap: 'break-word',rwspan: 'no'},            
            { field: 'FinalOrderQuantity', header: "Required Qty.", width: '8%', align: 'right',wrap: 'break-word',rwspan: 'no'},
            { field: 'ProducedQuantity', header: "Prod. Qty.", width: '8%', align: 'right',wrap: 'break-word',rwspan: 'no'},
            { field: 'StatusMessage', header: "Process Status", width: '10%', align: 'left',wrap: 'break-word',rwspan: 'no'},
        ];
        
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

        this.apiService.postData("ProcessGetAllByDepartmentID", req).subscribe((data: Process_GetAll_ByDepartmentIDResponse) => {
            if (data.SuccessCode == 1) 
            {
                this.dataGridList = data.ProcessList;

                if (this.commonService.getLength(this.dataGridList) > 0)
                {

                    let cRw = 0;

                    this.dataGridList.forEach( itm => {


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
 
    loadMasterData(Mode: string) {
        this.Mode = Mode;
        this.apiService.postData("MasterData_ProcessFlowSave_GetAll", null).subscribe((data: MasterData_ProcessFlowSave_GetAllResponse) => {
            if (data.SuccessCode == 1) {
                this.DepartmentList = data.DepartmentList;
                this.ProcessList = data.ProcessList;
                this.ExecutionModeList = data.ExecutionModeList;
            }
            else
            {
                this.sessionService.showError(data.ErrorMessage);
                this.cancelClick();
            }
        });
        
        this.sessionService.scrollAdjust();
    }

    loadProcessFlow() {
        this.ProcessFlowTransactionArray = new Array();
        this.ProcessFlowTransaction = new ProcessFlowTransactionInfo();
        this.ProcessFlowListTransactions = new Array();
        this.ColorList = new Array();
        this.SizeList = new Array();

        let req = new ProjectProcessFlowDetailSaveRequest();
        req.ProjectID = this.selectedDataGridItem.ProjectID;
        req.ProjectProcessID = this.selectedDataGridItem.ProjectProcessID;

        this.apiService.postData("ProcessFlowDetailsGetAllByProjectProcessID", req).subscribe((data: ProcessFlowDetailsGetAllByProjectProcessIDResponse) => {
            if (data.SuccessCode == 1) {
                //this.ProcessFlowTransactionArray = data.ProcessFlowList;
                this.ProcessFlowListTransactions = data.ProcessFlowListTransactions;
                this.ColorList = data.ProjectColorList;
                this.SizeList = data.ProjectSizeList;

                let itm = new ProcessFlowTransactionInfo();
                itm.ProjectID = this.selectedDataGridItem.ProjectID;
                itm.ProjectProcessID = this.selectedDataGridItem.ProjectProcessID;
                itm.ExecutionMode = this.selectedDataGridItem.ExecutionMode;
                itm.StatusCode = this.selectedDataGridItem.StatusCode;                

                itm.FlowDetails = new Array();

                if (this.commonService.getLength(this.ProcessFlowListTransactions) > 0)
                {
                    let tmpList = this.ProcessFlowListTransactions.filter(d=> d.ProjectProcessID == itm.ProjectProcessID);

                    if (this.commonService.getLength(tmpList)>0)
                    {
                        //tmpList = tmpList.sort((a,b)=>(a.ProcessFlowTransactionID > b.ProcessFlowTransactionID) ? 1: -1);
                        let pf = 0;
                        var pdt;
                        var hid;
                        var emd;


                        tmpList.forEach(x=> {

                            if (pdt != x.ProcessingDate || hid != x.HourID || emd != x.ExecutionMode )
                            {
                                let flw = new ProcessFlowTransactionDetails();
                                flw.ProcessFlowTransactionID = x.ProcessFlowTransactionID;
                                flw.ProjectID = x.ProjectID;
                                flw.ProjectProcessID = x.ProjectProcessID;
                                flw.ProcessingDate = x.ProcessingDate;
                                flw.HourID = x.HourID;
                                
                                if (this.commonService.getLengthNA(flw.ProcessingDate) > 0)
                                {
                                    flw.ProcessingDate1 = moment(flw.ProcessingDate).format(AppConfig.GRID_DATE_FORMAT);
                                }

                                flw.ExecutionMode = x.ExecutionMode;
                                flw.ExecutionModeName = x.ExecutionModeName;
                                flw.StatusCode = x.StatusCode;
                                flw.StatusMessage = x.StatusMessage;
                                flw.TotalQuantity = 0;

                                flw.ProductionDetails = new Array();

                                if (this.commonService.getLength(this.ColorList)>0)
                                {
                                    this.ColorList.forEach(d=> {

                                        let tmp = new ProcessFlowTransactionDetailsColorDetails();
                                        tmp.ColorID = d.ColorID;
                                        tmp.ColorName = d.ColorName;
                                        tmp.ColorQuantity = 0;
                                        tmp.SizeDetails = [];
                    
                                        let cq = 0;

                                        if (this.commonService.getLength(this.SizeList)>0)
                                        {

                                            this.SizeList.forEach(f=> {
                                                let tmp1 = new ProcessFlowTransactionDetailsSizeDetails();
                                                tmp1.SizeID = f.SizeID;
                                                tmp1.SizeName = f.SizeName;
                                                tmp1.Quantity = 0;

                                                let sz = this.ProcessFlowListTransactions.find(r=> r.ProcessingDate == flw.ProcessingDate && r.HourID == flw.HourID &&
                                                                                        r.ExecutionMode == flw.ExecutionMode && r.ColorID == d.ColorID && r.SizeID == f.SizeID);                                                        

                                                if (sz != null)
                                                {
                                                    tmp1.Quantity = sz.Quantity;
                                                }
                    
                                                cq = cq + tmp1.Quantity;

                                                tmp.SizeDetails.push(tmp1);
                                            });

                                            tmp.ColorQuantity = cq;

                                        }

                                        flw.TotalQuantity = flw.TotalQuantity + tmp.ColorQuantity;
                                        flw.ProductionDetails.push(tmp);

                                    });

                                }

                                flw.ProcessingDate1 = moment(flw.ProcessingDate).format(AppConfig.GRID_DATE_FORMAT);
                                itm.FlowDetails.push(flw);

                            }


                            pf = x.ProcessFlowTransactionID;
                            pdt = x.ProcessingDate;
                            hid = x.HourID;
                            emd = x.ExecutionMode;


                        });
                    }

                    this.ProcessFlowTransactionArray.push(itm);                    
                    this.ProcessFlowTransaction = this.ProcessFlowTransactionArray[0];
                }
            
                this.addTransactionDetails();                            
            }
            else
            {
                this.sessionService.showError(data.ErrorMessage);
            }
        });
    }

    onDoubleClick(rowData:ProjectProcessByDepartmentIDResult){
        if (rowData != null){
            this.lastFlowTransactionID = 0;
            this.newProcessFlowTransaction = new ProcessFlowTransactionDetails();
            this.StatusList = this.sessionService.GetStatusByCategory('Process');
            this.selectedDataGridItem = Object.assign({},rowData);      
            this.loadMasterData('EDIT');
            this.loadProcessFlow();
        }
    }

    addTransactionDetails()
    {
        this.Mode = 'ADD';
        this.newProcessFlowTransaction = new ProcessFlowTransactionDetails();
        let sts = this.StatusList.find(x=> x.StatusMessage.toLowerCase()=='completed');   

        if (this.ProcessFlowTransaction != null)
        {
            this.newProcessFlowTransaction.ProjectID = this.ProcessFlowTransaction.ProjectID;
            this.newProcessFlowTransaction.ProjectProcessID = this.ProcessFlowTransaction.ProjectProcessID;
        }

        if (sts != null)
        {
            this.newProcessFlowTransaction.StatusCode =  sts.StatusCode;
            this.newProcessFlowTransaction.StatusMessage =  sts.StatusMessage;
        }              
        
        if (this.newProcessFlowTransaction != null)
        {
            this.newProcessFlowTransaction.ProductionDetails = new Array();

            if (this.commonService.getLength(this.ColorList)>0)
            {
                this.ColorList.forEach(d=> {
                    let tmp = new ProcessFlowTransactionDetailsColorDetails();
                    tmp.ColorID = d.ColorID;
                    tmp.ColorName = d.ColorName;
                    tmp.SizeDetails = [];

                    if (this.commonService.getLength(this.SizeList)>0)
                    {
                        this.SizeList.forEach(f=> {
                            let tmp1 = new ProcessFlowTransactionDetailsSizeDetails();
                            tmp1.SizeID = f.SizeID;
                            tmp1.SizeName = f.SizeName;
                            tmp1.Quantity = 0

                            tmp.SizeDetails.push(tmp1);
                        });
                    }
                    
                    this.newProcessFlowTransaction.ProductionDetails.push(tmp);

                });
            }

            this.onValueChange();
        }

    }
  
    editClick() 
    {
        if (this.selectedData != null) {
            this.onDoubleClick(this.selectedData);
        }
    }
    
    validateAllFields():boolean
    {
     
        return true;
    }

    onValueChange()
    {
        if (this.newProcessFlowTransaction != null && this.commonService.getLength(this.newProcessFlowTransaction.ProductionDetails)>0)
        {
            let tq = 0;

            this.newProcessFlowTransaction.ProductionDetails.forEach(d=> {

              let cq = 0;

              if (this.commonService.getLength(d.SizeDetails)>0)
              {
                  d.SizeDetails.forEach(f=> { if (f.Quantity != null) { cq = cq + f.Quantity } });
              }

              d.ColorQuantity = cq;

              tq = tq + cq;

            });

            this.newProcessFlowTransaction.TotalQuantity = tq;
        }
    }

    SubmitClick(isValid:boolean) {
        
        this.submitAttempt = true;

        let req = new ProjectProcessFlowDetailSaveRequest();

        if (isValid) 
        {

            if (!this.validateAllFields())
            {
                return;
            }

            req.ProjectID = this.selectedDataGridItem.ProjectID;   
            req.ProjectProcessID = this.selectedDataGridItem.ProjectProcessID;         
            req.ProcessFlowTransactions = new Array();
            req.StatusCode = this.selectedDataGridItem.StatusCode;
            req.SaveType = AppConfig.SaveType_Update

            let tq = 0;

            if (this.ProcessFlowTransaction != null && this.commonService.getLength(this.ProcessFlowTransaction.FlowDetails)>0)
            {
                this.ProcessFlowTransaction.FlowDetails.forEach(x=> {
                    if (this.commonService.getLength(x.ProductionDetails)>0)
                    {
                        x.ProductionDetails.forEach(d=> {
                            
                            if (this.commonService.getLength(d.SizeDetails)>0)
                            {
                                d.SizeDetails.forEach(f=> {
                                    let itm = new ProcessFlowTransactionDetailsInfo();

                                    itm.ProjectID =  this.selectedDataGridItem.ProjectID;   
                                    itm.ProjectProcessID = this.selectedDataGridItem.ProjectProcessID;        
                                    itm.ProcessFlowTransactionID = x.ProcessFlowTransactionID;
                                    itm.ProcessingDate = x.ProcessingDate;
                                    itm.HourID = x.HourID;
                                    itm.ExecutionMode = x.ExecutionMode;
                                    itm.StatusCode = x.StatusCode;
                                    itm.ColorID = d.ColorID;
                                    itm.SizeID = f.SizeID;
                                    itm.Quantity = f.Quantity;


                                    tq = tq + f.Quantity;

                                    req.ProcessFlowTransactions.push(itm);
                                });
 
                            }
                        });
                    }
                });
            }

            if (tq > this.selectedDataGridItem.FinalOrderQuantity)
            {
                this.sessionService.showError('Total quantity mismatch...!');
                return;
            }


            this.apiService.postData("ProjectProcessFlowTransactionDetailSave",req).subscribe((data: ServiceReponse) => {
                if (data.SuccessCode == 1) {

                    this.sessionService.showSuccess("Process flow updated successfully");

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

    processFlowEditCancelClick()
    {
        this.processFlowSubmitAttempt = false;
        this.addTransactionDetails();
    }

    processFlowAddEdit(formName: any, formStatus:boolean){
        this.processFlowSubmitAttempt = true;  

        if (formStatus)
        {

            let startDate = moment(this.selectedDataGridItem.TentativeProcessStartDate).add('days',-1).format();
            let endDate = moment(this.selectedDataGridItem.ProcessCompletionDate).add('days',1).format();

            if (moment(this.newProcessFlowTransaction.ProcessingDate).isSameOrBefore(moment(startDate))){
                this.sessionService.showError('Flow Processing Date must be after Process Start Date');
                return;
            }

            if (moment(this.newProcessFlowTransaction.ProcessingDate).isSameOrAfter(moment(endDate))){
                this.sessionService.showError('Flow Processing Date must be before Process Completion Date');
                return;
            }

            if (this.newProcessFlowTransaction.TotalQuantity <= 0 )
            {
                this.sessionService.showError('Flow production quantity is required');
                return;
            }

            this.newProcessFlowTransaction.ExecutionModeName = this.ExecutionModeList.find(sitm => sitm.ExecutionModeID == this.newProcessFlowTransaction.ExecutionMode).ExecutionModeName;
            this.newProcessFlowTransaction.StatusMessage = this.StatusList.find(sitm => sitm.StatusCode == this.newProcessFlowTransaction.StatusCode).StatusMessage;

            if (this.Mode == 'ADD')
            {
                this.lastFlowTransactionID = this.lastFlowTransactionID - 1;
                this.newProcessFlowTransaction.ProcessFlowTransactionID = this.lastFlowTransactionID;                                  
            }

            if (this.ProcessFlowTransaction != null)
            {
                if (this.commonService.getLength(this.ProcessFlowTransaction.FlowDetails)<=0)
                {
                    this.ProcessFlowTransaction.FlowDetails = new Array();                        
                }

                let xTmp = this.ProcessFlowTransaction.FlowDetails.find(d=> d.ExecutionMode == this.newProcessFlowTransaction.ExecutionMode && 
                                                                            d.HourID == this.newProcessFlowTransaction.HourID && 
                                                                            d.ProcessingDate == this.newProcessFlowTransaction.ProcessingDate);

                if (xTmp != null && this.Mode == 'ADD')
                {
                    this.sessionService.showError('Flow entry (Execution Mode, Hour ID and Processing Date) is already exists');
                    return;
                }

                if (this.Mode == 'ADD')
                {
                    this.ProcessFlowTransaction.FlowDetails.push(this.newProcessFlowTransaction);
                }
                else
                {


                    this.ProcessFlowTransaction.FlowDetails.forEach(d=> {
                     

                        if (d.ProcessFlowTransactionID == this.newProcessFlowTransaction.ProcessFlowTransactionID)
                        {
                            d.ExecutionMode = this.newProcessFlowTransaction.ExecutionMode;
                            d.ExecutionModeName = this.newProcessFlowTransaction.ExecutionModeName;
                            d.HourID = this.newProcessFlowTransaction.HourID;
                            d.ProcessFlowTransactionID = this.newProcessFlowTransaction.ProcessFlowTransactionID;
                            d.ProcessingDate = this.newProcessFlowTransaction.ProcessingDate;
                            d.ProcessingDate1 = moment(this.newProcessFlowTransaction.ProcessingDate).format(AppConfig.GRID_DATE_FORMAT);
                            d.ProductionDetails = this.newProcessFlowTransaction.ProductionDetails;
                            d.ProjectID = this.newProcessFlowTransaction.ProjectProcessID;
                            d.ProjectProcessID = this.newProcessFlowTransaction.ProjectProcessID;
                            d.StatusCode = this.newProcessFlowTransaction.StatusCode;
                            d.StatusMessage = this.newProcessFlowTransaction.StatusMessage;
                            d.TotalQuantity = this.newProcessFlowTransaction.TotalQuantity;                        

                        }

                    });
                }
            }

            this.processFlowSubmitAttempt = false;
            this.addTransactionDetails();
        }
        else
        {
            console.log(formName);
        }
    }

    addClick()
    {
        this.lastFlowTransactionID = 0;
        this.newProcessFlowTransaction = new ProcessFlowTransactionDetails();
        this.ProcessFlowTransactionArray = new Array();
        this.StatusList = this.sessionService.GetStatusByCategory('Stock');
        this.loadMasterData('ADD');

    }

    processFlowEditClick(rowData:ProcessFlowTransactionDetails){
        if (rowData != null)
        {
            this.newProcessFlowTransaction = this.cloneProcessFlow(rowData);
            this.Mode = 'EDIT';
        }
    }

    processFlowDeleteClick(rowData:ProcessFlowTransactionDetails){
        if (rowData != null)
        {
            this.ProcessFlowTransactionArray[0].FlowDetails = this.ProcessFlowTransactionArray[0].FlowDetails.filter(x=> x!= rowData);
            this.newProcessFlowTransaction = new ProcessFlowTransactionDetails();
            this.processFlowSubmitAttempt = false;
        }
    }

    cloneProcessFlow(c: ProcessFlowTransactionDetails): ProcessFlowTransactionDetails {
        let data = new ProcessFlowTransactionDetails();
        for (let prop in c) {
            data[prop] = c[prop];
        }
        return data;
    }
}

