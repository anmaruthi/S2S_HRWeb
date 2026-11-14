import { Component } from '@angular/core';
import { WebApiService } from "../../service/webapi.service";
import { SessionService } from "../../service/session.service";
import { CommonService } from "../../service/common.service";
import { AppConfig, MasterStatus } from "../../const/app.config";
import { LoaderService } from '../../service/loader.service';
import { FormGroup } from '@angular/forms';
import { Status, Master_Department, Master_UserList } from "../../model/shared.model";
import { MatDialog } from "@angular/material/dialog";
import { ServiceReponse, DepartmentGetByCorpIDResponse, MasterData_SaveDepartment_GetAllResponse } from "../../model/response.model";
import { SaveDepartmentRequest } from "../../model/request.model";
import { ConfirmDialogComponent } from '../../common/confirmdialog.component';

@Component({
    templateUrl: './department.component.html',
    styleUrls: ['./department.component.scss']
})

export class DepartmentComponent {

    public formGroup: FormGroup;
    public submitAttempt: boolean;
    public dataGridList: Master_Department[];
    public cols:any[];
    public Mode: string;
    public selectedDataGridItem: Master_Department;
    public selectedData: Master_Department;
    public SelectedRoleList: Master_Department[];
    public StatusList:Status[];
    public SelectedUsers: Master_UserList[];  
    public UserList: Master_UserList[];

    public FormColumnsWidth : number;

    constructor(public dialog: MatDialog,  private apiService: WebApiService,
        public sessionService: SessionService, 
        public commonService: CommonService,
        public loaderService: LoaderService
    ) 
    {

    this.FormColumnsWidth = 600;
    }

    ngOnInit() {
        this.Mode = 'HOME';
    
        this.loadDataGrid();
    
        this.cols = [     
            { field: 'DepartmentName', header: "Department Name", width: '40%',align: 'left',wrap: 'break-word'},
            { field: 'UserList', header: "Point Of Contacts", width: '40%',align: 'left',wrap: 'break-word'},
            { field: 'StatusMessage', header: "Status",  width: '8%', align: 'left',wrap: 'break-word'}
        ];
        this.SelectedUsers = new Array();
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
        this.StatusList = this.sessionService.GetStatusByMode(this.Mode);
        this.apiService.postData("DepartmentGetByCorpID", null).subscribe((data: DepartmentGetByCorpIDResponse) => {
            if (data.SuccessCode == 1) {
                this.dataGridList = data.ResultList;
            }
            else
            {
                this.sessionService.showError(data.ErrorMessage);
            }
        });
          this.selectedDataGridItem = null;

          console.log(this.sessionService.FunctionList);
    }


    loadMasterData(Mode: string) {

        if (Mode == 'ADD'){
            this.StatusList = this.sessionService.ActiveStatusList;
        }
        else{
            this.StatusList = this.sessionService.StatusList;
        }

        this.SelectedUsers =  new Array();

        this.apiService.postData("MasterData_Department_GetAll", null).subscribe((data: MasterData_SaveDepartment_GetAllResponse) => {
            if (data.SuccessCode == 1) {
                this.UserList = data.UserList;
                console.log(this.UserList);
                this.Mode = Mode;
                this.fillData();
            }
            else
            {
                this.sessionService.showError(data.ErrorMessage);
                this.cancelClick();
            }
        });

        this.sessionService.scrollAdjust();
    }
    
  
    onDoubleClick(rowData:Master_Department){
  
        if (rowData != null){
            this.selectedDataGridItem = Object.assign({},rowData);      
            this.loadMasterData('EDIT');
        }
    }
  
    addClick() 
    {
        this.selectedDataGridItem = new Master_Department();
        this.selectedDataGridItem.StatusCode = MasterStatus.Active;
        this.loadMasterData('ADD');
    }
  
    editClick() 
    {
        if (this.selectedData != null) {
            this.onDoubleClick(this.selectedData);
        }
    }


    fillData()
    {

        if (this.Mode == 'EDIT') {

            if (this.commonService.getLengthNA(this.selectedDataGridItem.UserList) > 0) {

                console.log(this.selectedDataGridItem.UserList);

                let UserList = this.selectedDataGridItem.UserList.split(",");
                console.log(UserList);
                  for (let i of UserList) {
                    console.log(this.UserList);
                    let selectedUser = this.UserList.find(x => x.UserName == String(i));
                    console.log(selectedUser);
                    if (selectedUser != undefined) {
                        this.SelectedUsers.push(selectedUser);
                    }
                    console.log( this.SelectedUsers);

                }
            }
        }
    }
    deleteClick(){

        if (this.selectedData != null) {
            console.log(this.selectedData);
            let dialogRef = this.dialog.open(ConfirmDialogComponent, {
                data: {
                    DialogHeader: 'Alert',
                    DialogMessage: 'Are you sure you want to delete?'
                },
                disableClose: true,
            });

            dialogRef.afterClosed().subscribe(result => {
                if (result == 1) {

                    let req = new SaveDepartmentRequest();
                    req.Result = new Master_Department();
                    req.Result.DepartmentID = this.selectedData.DepartmentID;
                    req.Result.StatusCode = 50;
                    req.SaveType = AppConfig.SaveType_Delete;

                    this.apiService.postData("SaveDepartment",req).subscribe((data: ServiceReponse) => {
                        if (data.SuccessCode == 1) {

                            this.sessionService.showSuccess("Department deleted sucessfully..");                               
                            this.refreshClick();
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

    SubmitClick(isValid:boolean) {
        
        this.submitAttempt = true;

        if (isValid) 
        {
            let req = new SaveDepartmentRequest();
            req.Result = this.selectedDataGridItem;

            req.SaveType = this.Mode == 'ADD' ? AppConfig.SaveType_Insert : AppConfig.SaveType_Update;

            req.Result.UserList = null;

            if (this.commonService.getLength(this.SelectedUsers) > 0) 
            {
                this.SelectedUsers.forEach(x=> {
                    if (req.Result.UserList == null)
                    {
                        req.Result.UserList = x.UserID.toString();
                    }
                    else
                    {
                        req.Result.UserList = req.Result.UserList + ',' + x.UserID.toString();
                    }
                });
            }

            this.apiService.postData("SaveDepartment",req).subscribe((data: ServiceReponse) => {
                if (data.SuccessCode == 1) {

                    if(this.Mode == 'ADD') {
                        this.sessionService.showSuccess("Department added successfully");
                    }

                    else if(this.Mode == 'EDIT') {
                        this.sessionService.showSuccess("Department updated successfully");
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

}
