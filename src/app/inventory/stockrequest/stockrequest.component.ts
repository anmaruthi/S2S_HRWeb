import { Component } from '@angular/core';
import { WebApiService } from "../../service/webapi.service";
import { SessionService } from "../../service/session.service";
import { CommonService } from "../../service/common.service";
import { AppConfig, MaterialRequestStatus } from "../../const/app.config";
import { LoaderService } from '../../service/loader.service';
import { FormGroup } from '@angular/forms';
import { Status, StockOutwardTransactionInfo, Master_Department, Master_UserList, ProjectInfo, ProjectAccessoriesInfo, Master_Item } from "../../model/shared.model";
import { MatDialog } from "@angular/material/dialog";
import { ServiceReponse, ProjectAccessoriesDetailsGetByProjectIDRespone, StockRequestGetBySiteIDResponse, MasterData_SaveStockRequest_GetAllResponse, MasterData_SaveStockOutwardTransaction_GetAllResponse, StockOutwardTransactionGetBySiteIDResponse } from "../../model/response.model";
import { SaveStockOutwardTransactionRequest, ServiceRequest, StockGetAllByCorpIDSiteIDRequest } from "../../model/request.model";
import { ConfirmDialogComponent } from '../../common/confirmdialog.component';
import * as moment from 'moment';

@Component({
    templateUrl: './stockrequest.component.html',
    styleUrls: ['./stockrequest.component.scss']
})

export class StockRequestComponent {

    public formGroup: FormGroup;
    public submitAttempt: boolean;
    public dataGridList: StockOutwardTransactionInfo[];
    public cols: any[];
    public Mode: string;
    public selectedDataGridItem: StockOutwardTransactionInfo;
    public selectedData: StockOutwardTransactionInfo;
    public DepartmentList: Master_Department[];
    public UserList: Master_UserList[];
    public UserListAll: Master_UserList[];
    public ProjectList: ProjectInfo[];
    public StatusList: Status[];
    public ItemList: Master_Item[];
    public searchRequest: StockGetAllByCorpIDSiteIDRequest;
    public CanEdit: boolean;


    public FormColumnsWidth: number;

    userMode: string;

    constructor(public dialog: MatDialog, private apiService: WebApiService,
        public sessionService: SessionService,
        public commonService: CommonService,
        public loaderService: LoaderService
    ) {
        this.FormColumnsWidth = 600;
        this.setDefaultSearch();
    }

    ngOnInit() {

        this.Mode = 'HOME';
        this.loadDataGrid('');
        this.cancelClick();

        this.cols = [
            { field: 'ItemName', header: "Material", width: '20%', align: 'left', wrap: 'break-word' },
            { field: 'UserName', header: "Requested By", Width: '16%', align: 'left', wrap: 'break-word' },
            { field: 'RequestedQuantity', header: "Requested Quantity", width: '12%', align: 'right', wrap: 'break-word' },
            { field: 'DeliveredQuantity', header: "Delivered Quantity", width: '12%', align: 'right', wrap: 'break-word' },
            { field: 'CreatedDtTm', header: "Requested DT", width: '12%', align: 'left', wrap: 'break-word' },
            { field: 'StatusMessage', header: "Status", width: '8%', align: 'left', wrap: 'break-word' }
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

    onKeyUp() {
        this.selectedDataGridItem = null;
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

        this.apiService.postData("StockRequestGetBySiteID", req).subscribe((data: StockOutwardTransactionGetBySiteIDResponse) => {
            if (data.SuccessCode == 1) {
                this.dataGridList = data.ResultList;

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

    loadMasterData(Mode: string) {

        this.apiService.postData("StockOutwardMastersGetAll", null).subscribe((data: MasterData_SaveStockOutwardTransaction_GetAllResponse) => {
            if (data.SuccessCode == 1) {
                this.ItemList = data.MaterialList;
                this.UserList = data.UserList;
                this.DepartmentList = data.DepartmentList;

                //this.onProjectChange(false, Mode);
                //this.onDepartmentChange(false);
            }
            else {
                this.sessionService.showError(data.ErrorMessage);
                this.cancelClick();
            }
        });


        this.Mode = Mode;
        //this.onDepartmentChange(false);
        this.sessionService.scrollAdjust();
    }

    onDoubleClick(rowData: StockOutwardTransactionInfo) {

        if (rowData != null) {
            this.StatusList = this.sessionService.GetStatusByCategory('Stock');
            this.selectedDataGridItem = Object.assign({}, rowData);
            this.loadMasterData('EDIT');
        }
    }

    addClick() {
        this.selectedDataGridItem = new StockOutwardTransactionInfo();
        this.selectedDataGridItem.StatusCode = 600;
        this.selectedDataGridItem.OutwardDate = moment().format();
        this.loadMasterData('ADD');
    }

    setDefaultSearch() {
        this.searchRequest = new StockGetAllByCorpIDSiteIDRequest();
        this.searchRequest.FromDate = moment().add('months', -1).format();
        this.searchRequest.ToDate = moment().format();

    }

    editClick() {
        if (this.selectedData != null) {
            this.onDoubleClick(this.selectedData);
        }
    }

    SubmitClick(isValid: boolean) {

        this.submitAttempt = true;
        let req = new SaveStockOutwardTransactionRequest();
        req.StockInwardInfo = this.selectedDataGridItem;


        if (isValid) {

            req.StockInwardInfo = this.selectedDataGridItem;
            req.StockInwardInfo.StatusCode = MaterialRequestStatus.Submitted;

            if (this.Mode == 'ADD') {
                req.StockInwardInfo.DeliveredQuantity = 0;
                req.StockInwardInfo.RequestedUserID = this.sessionService.UserID;
                req.StockInwardInfo.IsInternal = 1;
                req.SaveType = AppConfig.SaveType_Insert
            }
            else {
                req.SaveType = AppConfig.SaveType_Update
            }

            let dialogRef = this.dialog.open(ConfirmDialogComponent, {
                data: {
                    DialogHeader: 'Stock Request',
                    DialogMessage: "Are you sure ?"
                },
                disableClose: true,
            });

            dialogRef.afterClosed().subscribe(result => {
                if (result == 1) {
                    
                    this.apiService.postData("SaveStockOutwardTransaction",req).subscribe((data: ServiceReponse) => {
                        if (data.SuccessCode == 1) {
            
                            if(this.Mode == 'ADD') {
                                this.sessionService.showSuccess("Stock Request placed successfully");
                            }
                            else if(this.Mode == 'EDIT') {
                                this.sessionService.showSuccess("Stock Request updated successfully");
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

}
