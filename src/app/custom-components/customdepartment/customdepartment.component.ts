import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { WebApiService } from "../../service/webapi.service";
import { SessionService } from "../../service/session.service";
import { CommonService } from "../../service/common.service";
import { AppConfig, MasterStatus } from "../../const/app.config";
import { LoaderService } from '../../service/loader.service';
import { FormGroup } from '@angular/forms';
import { Status, Master_Department, Master_UserList } from "../../model/shared.model";
import { MatDialog } from "@angular/material/dialog";
import { ServiceReponse, DepartmentGetByCorpIDResponse, MasterData_SaveDepartment_GetAllResponse, SaveReponse } from "../../model/response.model";
import { SaveDepartmentRequest } from "../../model/request.model";
import { ConfirmDialogComponent } from '../../common/confirmdialog.component';

@Component({
    selector: 'custom-department',
    templateUrl: './customdepartment.component.html',
    styleUrls: ['./customdepartment.component.scss']
})

export class CustomDepartmentComponent {

    public formGroup: FormGroup;
    public submitAttempt: boolean;
    @Input('Mode') Mode: string;
    @Input('selectedDepartment') selectedDataGridItem: Master_Department;
    public SelectedRoleList: Master_Department[];
    public StatusList:Status[];
    public SelectedUsers: Master_UserList[];  
    public UserList: Master_UserList[];

    @Output() public cancelClicked : EventEmitter<any> = new EventEmitter();
    @Output() public saveCompleted : EventEmitter<any> = new EventEmitter();

    @ViewChild('departmentName') departmentName:ElementRef; 

    constructor(public dialog: MatDialog,  private apiService: WebApiService,
        public sessionService: SessionService, 
        public commonService: CommonService,
        public loaderService: LoaderService
    ) 
    {

    
    }

    ngOnInit() {
    
        this.loadMasterData(this.Mode);
        this.SelectedUsers = new Array();
    }

    loadMasterData(Mode: string) {

        if (Mode == 'ADD'){
            this.StatusList = this.sessionService.ActiveStatusList;
        }
        else{
            this.StatusList = this.sessionService.StatusList;
        }

        //this.SelectedUsers =  new Array();

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

        //this.sessionService.scrollAdjust();
        this.departmentName.nativeElement.focus();
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

            this.apiService.postData("SaveDepartment",req).subscribe((data: SaveReponse) => {
                if (data.SuccessCode == 1) {

                    if(this.Mode == 'ADD') {
                        this.sessionService.showSuccess("Department added successfully");
                    }

                    else if(this.Mode == 'EDIT') {
                        this.sessionService.showSuccess("Department updated successfully");
                    }
                    
                    console.log(data);
                    this.selectedDataGridItem.DepartmentID = data.ID;
                    this.saveCompleted.emit(this.selectedDataGridItem);
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
        this.cancelClicked.emit();
    }
    

}
