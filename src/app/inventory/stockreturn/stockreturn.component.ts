import { Component } from '@angular/core';
import { WebApiService } from "../../service/webapi.service";
import { SessionService } from "../../service/session.service";
import { CommonService } from "../../service/common.service";
import { AppConfig, MaterialRequestStatus} from "../../const/app.config";
import { LoaderService } from '../../service/loader.service';
import { FormGroup} from '@angular/forms';
import { MatDialog } from "@angular/material/dialog";
import { ServiceReponse, StockReturnTransactionGetBySiteIDResponse, MasterData_SaveStockReturnTransaction_GetAllResponse, ProjectAccessoriesDetailsGetByProjectIDRespone, MasterData_SaveStockOutwardTransaction_GetAllResponse } from "../../model/response.model";
import { StockReturnTransactionInfo, ProjectInfo, ProjectAccessoriesInfo, Master_Department, Master_UserList, Master_Item } from 'src/app/model/shared.model';
import { ServiceRequest, SaveStockReturnTransactionRequest, StockGetAllByCorpIDSiteIDRequest } from 'src/app/model/request.model';
import * as moment from 'moment';

@Component({
    templateUrl: './stockreturn.component.html',
    styleUrls: ['./stockreturn.component.scss']
})

export class StockReturnComponent {
    public formGroup: FormGroup;
    public submitAttempt: boolean;
    public dataGridList: StockReturnTransactionInfo[];
    public cols:any[];
    public Mode: string;
    public selectedDataGridItem: StockReturnTransactionInfo;
    public selectedData: StockReturnTransactionInfo;
    public ProjectList:ProjectInfo[];
    public ItemList:Master_Item[];
    public DepartmentList:Master_Department[];
    public UserList:Master_UserList[];
    public UserListAll:Master_UserList[];
    public searchRequest : StockGetAllByCorpIDSiteIDRequest;
    public FormColumnsWidth : number;

    userMode:string;
    
    constructor(public dialog: MatDialog,  private apiService: WebApiService,
        public sessionService: SessionService, 
        public commonService: CommonService,
        public loaderService: LoaderService
    ) 
    {
        this.FormColumnsWidth = 600; 
        this.setDefaultSearch();
    }

    ngOnInit() {
    
        this.Mode = 'HOME';
        this.loadDataGrid();
        this.cancelClick();
        
        this.cols = [     
            { field: 'ItemName', header: "Material", width: '15%',align: 'left',wrap: 'break-word'},
            { field: 'DepartmentName', header: "DepartmentName", width: '15%', align: 'left',wrap: 'break-word'},
            { field: 'UserName', header: "User Name", width: '15%', align: 'left',wrap: 'break-word'},
            { field: 'Quantity', header: "Quantity", width: '10%', align: 'right',wrap: 'break-word'},
            { field: 'Comments', header: "Comments", width: '25%', align: 'left',wrap: 'break-word'}
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
        let req = new StockGetAllByCorpIDSiteIDRequest();
        req.FromDate = moment(this.searchRequest.FromDate).format();
        req.ToDate =  moment(this.searchRequest.ToDate).format();

        this.apiService.postData("StockReturnTransactionGetBySiteID", req).subscribe((data: StockReturnTransactionGetBySiteIDResponse) => {
            if (data.SuccessCode == 1) {
                this.dataGridList = data.ResultList;
            }
            else
            {
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
            else
            {
                this.sessionService.showError(data.ErrorMessage);
                this.cancelClick();
            }
        });
        
        this.Mode = Mode;
        this.sessionService.scrollAdjust();
        
    }


    
    onDepartmentChange(canClearItem:boolean){
        // if(canClearItem){
        //     this.selectedDataGridItem.ReturnedUserID = undefined;
        // }
        // if(this.selectedDataGridItem.ReturnedDepartmentID>0){
        //     this.UserList = this.UserListAll.filter(x=>x.DepartmentID == this.selectedDataGridItem.ReturnedDepartmentID);
        // }
      
    }
    
    onDoubleClick(rowData:StockReturnTransactionInfo){

        if (rowData != null){
            this.selectedDataGridItem = Object.assign({},rowData);      
            this.loadMasterData('EDIT');  
        }
    }

    setDefaultSearch()
    {
        this.searchRequest = new StockGetAllByCorpIDSiteIDRequest();
        this.searchRequest.FromDate = moment().add('months',-1).format();
        this.searchRequest.ToDate = moment().format();

    }
  
    addClick() 
    {
        this.selectedDataGridItem = new StockReturnTransactionInfo();
        this.selectedDataGridItem.ReturnDate = moment().format();
        this.loadMasterData('ADD');
    }
  
    editClick() 
    {
        if (this.selectedData != null) {
            this.onDoubleClick(this.selectedData);
        }
    }

    SubmitClick(isValid:boolean) {
        
        this.submitAttempt = true;

        let req = new SaveStockReturnTransactionRequest();
 
        req.ResultList =  this.selectedDataGridItem;
       console.log(this.selectedDataGridItem);
        if (isValid) 
        {

            req.ResultList = this.selectedDataGridItem;
            req.ResultList.ReturnedDepartmentID = this.selectedDataGridItem.ReturnedDepartmentID;
            req.ResultList.ReturnedUserID = this.selectedDataGridItem.ReturnedUserID;
           
            if(this.Mode == 'ADD'){
                req.ResultList.Quantity = req.ResultList.Quantity;
                req.SaveType = AppConfig.SaveType_Insert
                req.ResultList.StatusCode = MaterialRequestStatus.Approved;
            }
   
            this.apiService.postData("SaveStockReturnTransaction",req).subscribe((data: ServiceReponse) => {
                if (data.SuccessCode == 1) {

                    if(this.Mode == 'ADD') {
                        this.sessionService.showSuccess("Stock Return added successfully");
                    }

                    else if(this.Mode == 'EDIT') {
                        this.sessionService.showSuccess("Stock Return updated successfully");
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
        this.selectedData = null;
    }
    
    refreshClick(){
        this.cancelClick();
        this.loadDataGrid();
    }

}
