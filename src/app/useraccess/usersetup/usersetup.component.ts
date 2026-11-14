import { Component } from '@angular/core';
import { WebApiService } from "../../service/webapi.service";
import { SessionService } from "../../service/session.service";
import { CommonService } from "../../service/common.service";
import { AppConfig, logLevel, MasterStatus } from "../../const/app.config";
import { MatDialog  } from '@angular/material/dialog';
import { LoaderService } from '../../service/loader.service';
import { ConfirmDialogComponent } from "../../common/confirmdialog.component";
import { UserInfo, RoleInfo, Status, GenderInfo, ReportingManagerInfo, SiteInfo, AppsInfo, Master_Department_GetByCorpIDResult } from '../../model/shared.model';
import { Master_UserGetByCorpIDResponse, ServiceReponse, MasterData_SaveUser_GetAllResponse } from '../../model/response.model';
import { SaveUserRequest, ServiceRequest } from '../../model/request.model';

@Component({
    templateUrl: './usersetup.component.html',
    styleUrls: ['./usersetup.component.scss']
})

export class UserSetupComponent {

    public submitAttempt: boolean;

    public dataGridList: UserInfo[];
    public cols:any[];
    public Mode: string;

    public selectedDataGridItem: UserInfo;
    public selectedData: UserInfo;

    public SelectedRoles: RoleInfo[];
    public ManagerUserID: number;
    public StatusList:Status[];
    public GenderList:GenderInfo[];
    public DepartmentList:Master_Department_GetByCorpIDResult[]; 

    public RoleList: RoleInfo[];
    public ReportingManagerList: ReportingManagerInfo[];
    public ReportingManagerFiltered: ReportingManagerInfo[];

    public SelectedSites:SiteInfo[];
    public SelectedApps:AppsInfo[];
    public SiteList: SiteInfo[];
    public AppsList:AppsInfo[];

    public FormColumnsWidth : number;
    
    constructor(public dialog: MatDialog, private apiService: WebApiService,
        public sessionService: SessionService, 
        public commonService: CommonService,
        public loaderService: LoaderService
    ) 
    {

        this.selectedDataGridItem = new UserInfo();

        this.FormColumnsWidth = 600;
    }

    ngOnInit() {

        this.submitAttempt = false;
        
        this.cols = [     
            { field: 'UserName', header: "User Name", width: '15%',align: 'left',wrap: 'break-word'},
            { field: 'FirstName', header: "First Name", width: '20%',align: 'left',wrap: 'break-word'},
            { field: 'LastName', header: "Last Name", width: '20%',align: 'left',wrap: 'break-word'},
            { field: 'Mobile', header: "Mobile Number", width: '10%', align: 'left',wrap: 'break-word'},
            { field: 'Email', header: "Email ID", width: '15%',align: 'left',wrap: 'break-word'},
            { field: 'CorpName', header: "Organisation", width: '15%',align: 'left',wrap: 'break-word'},            
            { field: 'StatusMessage', header: "Status",  width: '8%', align: 'left',wrap: 'break-word'}
        ];
     
        this.Mode = 'HOME';

        this.loadDataGrid();
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
        this.selectedData = null;
    }	

    loadDataGrid() 
    {  
        this.apiService.postData("UserGetByCorpID", null).subscribe((data: Master_UserGetByCorpIDResponse) => {
              if (data.SuccessCode == 1) {
                this.dataGridList = data.ResultList;
                console.log(data.ResultList);
              }
            else
            {
                this.sessionService.showError(data.ErrorMessage);
            }
        });
    }

    loadAddEditData(mode: string)
    {

        if (mode == 'ADD') {
            this.StatusList = this.sessionService.StatusListAll.filter(x=> x.StatusCode==10);
          }
          else if (mode == 'EDIT')
          {      
            this.StatusList = this.sessionService.StatusListAll;
            this.selectedDataGridItem.Gender = this.selectedDataGridItem.Gender;
          }
        
        this.SelectedRoles =  new Array();
        this.SelectedApps =  new Array();
        this.SelectedSites =  new Array();

        this.ReportingManagerFiltered = [];
    
        //this.SiteList = this.sessionService.UserSiteInfo;

        if (this.commonService.getLength(this.RoleList) == 0 || this.commonService.getLength(this.ReportingManagerList) == 0 ||
        this.commonService.getLength(this.AppsList) == 0 )
        {

          this.apiService.postData("MasterData_SaveUser_GetAll", null).subscribe((data: MasterData_SaveUser_GetAllResponse) => {
            if (data.SuccessCode == 1) {

                this.GenderList = this.sessionService.GenderList;
                this.RoleList = data.RoleList;
                this.ReportingManagerList = data.ReportingManagerList;
                this.AppsList = data.AppsList;
                this.SiteList = data.SiteList;
                this.Mode = mode;

                this.fillData();
            }
            else
            {
                this.sessionService.showError(data.ErrorMessage);
                this.Mode = 'HOME';
            }
        });

    }
    else
    {   
        this.Mode = mode;
        this.fillData();
    }

        this.sessionService.scrollAdjust();
    
    }

    fillData()
    {

        if (this.Mode == 'EDIT') {

            if (this.commonService.getLengthNA(this.selectedDataGridItem.RoleList) > 0) {

                let roleList = this.selectedDataGridItem.RoleList.split(",");
                  for (let i of roleList) {
                  let selectedRole = this.RoleList.find(x => x.RoleID == Number(i));

                  if (selectedRole != undefined) {
                    this.SelectedRoles.push(selectedRole);
                  }

                }

                this.onRoleChange();
            }

            if (this.commonService.getLengthNA(this.selectedDataGridItem.AppIDs) > 0) {
    
                let appList = this.selectedDataGridItem.AppIDs.split(",");
                for (let i of appList) {
                let selectedApp = this.AppsList.find(x => x.AppID == Number(i));
                if (selectedApp != undefined) {
                    this.SelectedApps.push(selectedApp);
                }
                }
            }

            if (this.commonService.getLengthNA(this.selectedDataGridItem.SiteList) > 0) {
                let siteList = this.selectedDataGridItem.SiteList.split(",");
                for (let i of siteList) {
                let selectedSite = this.SiteList.find(x => x.SiteID == Number(i));
                if (selectedSite != undefined) {
                  this.SelectedSites.push(selectedSite);
                }
              }
            }

        }
    }
  
    onRoleChange(){

        this.ReportingManagerFiltered = [];

        if (this.commonService.getLength(this.SelectedRoles) > 0)
        {
            let hierarchyID = 0;

            this.SelectedRoles.forEach(itm => {

                if (itm.HierarchyID < hierarchyID || hierarchyID == 0) {
                    hierarchyID = itm.HierarchyID;
                }
            });

            this.ReportingManagerFiltered = this.commonService.cloneAnyArray(this.ReportingManagerList.filter(itm => itm.HierarchyID < hierarchyID));
    
            if (this.commonService.getLength(this.ReportingManagerFiltered) == 0)
            {
                this.ReportingManagerFiltered = this.commonService.cloneAnyArray(this.ReportingManagerList.filter(itm => itm.HierarchyID <= hierarchyID));
            }

            if (this.commonService.getLength(this.ReportingManagerFiltered) > 0) {
                if (this.selectedDataGridItem.ManagerUserID != null)
                {
                    if ((this.ReportingManagerFiltered.findIndex(itm => itm.UserID == this.selectedDataGridItem.ManagerUserID)) < 0) {
                        this.selectedDataGridItem.ManagerUserID = null;
                    }
                }
            }
            else {
                this.selectedDataGridItem.ManagerUserID = null;
            }

            // remove duplicate users if any
            if (this.commonService.getLength(this.ReportingManagerFiltered) > 0) {
                let unique_array = [];
                let findx = 0;
                for (let i = 0; i < this.ReportingManagerFiltered.length; i++) {
                    if (unique_array.findIndex(itm => itm.UserID == this.ReportingManagerFiltered[i].UserID) == -1) {
                        findx = 1;
                        unique_array.push(this.ReportingManagerFiltered[i]);
                    }
                }
                this.ReportingManagerFiltered = unique_array;
            }

        }
        else
        {
            this.selectedDataGridItem.ManagerUserID = null;
        }

    }
    
    onDoubleClick(rowData:UserInfo){
  
        if (rowData != null){
            this.selectedDataGridItem = new UserInfo();
            
            this.selectedDataGridItem = Object.assign({},rowData);      
            this.loadAddEditData('EDIT');
        }
        
    }
  
    
    addClick() 
    {
        this.selectedDataGridItem = new UserInfo();
        this.selectedDataGridItem.StatusCode = MasterStatus.Active;
        this.loadAddEditData('ADD');
    }
  
    editClick() 
    {
        if (this.selectedData != null) {
            this.onDoubleClick(this.selectedData);
        }
    }

    deleteClick(){
        
        if (this.selectedData != null) {

            if (this.selectedData.UserID == this.sessionService.UserID)
            {
              this.sessionService.showError('Selected User is your current user. Could not be deleted....!');
              return;
            }
            

            let dialogRef = this.dialog.open(ConfirmDialogComponent, {
                data: {
                    DialogHeader: 'Alert',
                    DialogMessage: 'Are you sure you want to delete?'
                },
                disableClose: true,
            });

            dialogRef.afterClosed().subscribe(result => {
                if (result == 1) {
                    
                    let req = new SaveUserRequest();                 

                    req.Result = new UserInfo();
                    req.Result = this.selectedData;
                    req.SaveType = AppConfig.SaveType_Delete;

                    this.apiService.postData("SaveUser",req).subscribe((data: ServiceReponse) => {
                        if (data.SuccessCode == 1) {
                                this.sessionService.showSuccess("User deleted sucessfully..");
                                this.loadDataGrid();
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


    SubmitClickReaderCheck(isValid:boolean) {
    
        this.submitAttempt = true;

        let req = new ServiceRequest();

        this.apiService.postData("ReadDataFromReader", req).subscribe((data: ServiceReponse) => {
            if (data.SuccessCode == 1) {
                this.sessionService.showSuccess("Done  successfully");
               
            }
            else {
                this.sessionService.showError(data.ErrorMessage);
            }
        });


    }
    
    SubmitClick(isValid:boolean) {

        this.submitAttempt = true;

        if (isValid) {

            if (this.Mode == 'ADD' && this.selectedDataGridItem.Password != this.selectedDataGridItem.ConfirmPassword)
            {
                this.sessionService.showError('Password and Confirm password are not matched...');
                return;
            }

                let req = new SaveUserRequest();

                req.Result = this.selectedDataGridItem;

                req.SaveType = this.Mode == 'ADD' ? AppConfig.SaveType_Insert : AppConfig.SaveType_Update;
                
                req.Result.AppIDs = null;
                req.Result.SiteList = null;
                req.Result.RoleList = null;
             
                if (this.commonService.getLength(this.SelectedRoles) > 0) 
                {
                    this.SelectedRoles.forEach(x=> {
                        if (req.Result.RoleList == null)
                        {
                            req.Result.RoleList = x.RoleID.toString();
                        }
                        else
                        {
                            req.Result.RoleList = req.Result.RoleList + ',' + x.RoleID.toString();
                        }
                    });
                }

                if (this.commonService.getLength(this.SelectedSites) > 0) 
                {
                    this.SelectedSites.forEach(x=> {
                        if (req.Result.SiteList == null)
                        {
                            req.Result.SiteList = x.SiteID.toString();
                        }
                        else
                        {
                            req.Result.SiteList = req.Result.SiteList + ',' + x.SiteID.toString();
                        }
                    });
                }

                if (this.commonService.getLength(this.SelectedApps) > 0) 
                {
                    this.SelectedApps.forEach(itm => {
                        if (req.Result.AppIDs == null) {
                            req.Result.AppIDs = itm.AppID.toString();
                        }
                        else {
                            req.Result.AppIDs = req.Result.AppIDs + ',' + itm.AppID.toString();
                        }
                    });
                } 

                this.apiService.postData("SaveUser", req).subscribe((data: ServiceReponse) => {
                    if (data.SuccessCode == 1) {
                        this.sessionService.showSuccess(this.Mode == 'ADD' ? "User added successfully" : "User updated successfully");
                        this.cancelClick();
                        this.loadDataGrid();
                    }
                    else {
                        this.sessionService.showError(data.ErrorMessage);
                    }
                });
        }
        else
        {
            this.sessionService.showError('Some mandatory informations are missing, please check');
            return;
        }

    }

    cancelClick() {
        this.Mode = 'HOME';
        this.submitAttempt = false;
        this.selectedDataGridItem = null;
        this.selectedData = null;
    }
    
    RefreshClick() {
        this.cancelClick();
        this.loadDataGrid();
    
    }
    
}

