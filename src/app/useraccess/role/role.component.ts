import { Component } from '@angular/core';
import { WebApiService } from "../../service/webapi.service";
import { SessionService } from "../../service/session.service";
import { CommonService } from "../../service/common.service";
import { AppConfig, MasterStatus } from "../../const/app.config";
import { LoaderService } from '../../service/loader.service';
import { FormGroup} from '@angular/forms';
import { RoleInfo, Status, MasterMenuGetbyRoleidresult, 
         MasterRoleFunctionidsGetbyRoleidResult, RoleMenu, RoleFunction, MasterRoleReports, RoleReport } from "../../model/shared.model";
import { MatDialog } from "@angular/material/dialog";
import { RoleGetByCorpIDResponse, ServiceReponse, MasterData_RoleMenu_GetAllResponse } from "../../model/response.model";
import { SaveRoleRequest, ServiceRequest } from "../../model/request.model";
import { ConfirmDialogComponent } from '../../common/confirmdialog.component';

@Component({
    templateUrl: './role.component.html',
    styleUrls: ['./role.component.scss']
})

export class RoleComponent {

    public formGroup: FormGroup;
    public submitAttempt: boolean;
    public dataGridList: RoleInfo[];
    public cols:any[];
    public Mode: string;
    public selectedDataGridItem: RoleInfo;
    public selectedData: RoleInfo;

    public StatusList:Status[];
    public RoleList: RoleInfo[];
    public ReportingRoleList: RoleInfo[];

    public MenuList: MasterMenuGetbyRoleidresult[];
    public FunctionList: MasterRoleFunctionidsGetbyRoleidResult[];
    public ReportsList: MasterRoleReports[];
    
    public AvailableMenus: MasterMenuGetbyRoleidresult[];
    public TaggedMenus: MasterMenuGetbyRoleidresult[];

    public AvailableReports: MasterRoleReports[];
    public TaggedReports: MasterRoleReports[];

    public FormColumnsWidth : number;
    
    constructor(public dialog: MatDialog,  private apiService: WebApiService,
        public sessionService: SessionService, 
        public commonService: CommonService,
        public loaderService: LoaderService
    ) 
    {
        this.FormColumnsWidth = 700;
    }

    ngOnInit() {
        
        this.submitAttempt = false;
        this.loadDataGrid();
        this.Mode = 'HOME';

        this.cols = [     
            { field: 'RoleCode', header: "Role Code", width: '35%',align: 'left',wrap: 'break-word'},
            { field: 'RoleName', header: "Role Name", width: '35%',align: 'left',wrap: 'break-word'},
            { field: 'HierarchyID', header: "Hierarchy", width: '15%', align: 'right',wrap: 'break-word'},
            { field: 'StatusMessage', header: "Status",  width: '15%', align: 'left',wrap: 'break-word'}
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
        this.StatusList = this.sessionService.GetStatusByMode(this.Mode);
        this.apiService.postData("RoleGetByCorpID", null).subscribe((data: RoleGetByCorpIDResponse) => {
            if (data.SuccessCode == 1) {
                this.dataGridList = data.ResultList;
                this.ReportingRoleList = this.dataGridList.filter(x => x.StatusCode == MasterStatus.Active);
            }
            else
            {
                this.sessionService.showError(data.ErrorMessage);
            }
        });
          this.selectedDataGridItem = null;
    }


    loadMasterData(Mode: string) {

        if (Mode == 'ADD'){
            this.StatusList = this.sessionService.StatusListAll.filter(x=> x.StatusCode==10);
        }
        else{
            this.StatusList = this.sessionService.StatusListAll;
        }
        
        let req = new ServiceRequest();
        req.RoleID = this.selectedDataGridItem.RoleID;

        this.apiService.postData("RoleMenuGetAll", req).subscribe((data: MasterData_RoleMenu_GetAllResponse) => {
            if (data.SuccessCode == 1) {

              this.MenuList = data.MenuList;
              this.FunctionList = data.FunctionList;
              this.ReportsList = data.ReportsList;

              if (this.commonService.getLength(this.FunctionList)>0)
              {
                if(this.sessionService.RoleID != 1)
                {
                    let tmpList = this.FunctionList.filter(x=> x.MenuID == 1);
                    this.FunctionList = this.FunctionList.filter(x=> x.MenuID != 1);

                    if (this.commonService.getLength(tmpList)>0)
                    {
                        tmpList.forEach(d=> {
                            if (d.FunctionID != 1 && d.FunctionID !=3)
                            {
                                this.FunctionList.push(d);
                            }
                        });
                    }
                }
              }

              this.AvailableMenus = this.MenuList.filter(x => x.IsTagged == 'N');              
              this.TaggedMenus = this.MenuList.filter(x => x.IsTagged == 'Y');

              this.AvailableReports = this.ReportsList.filter(x => x.IsTagged == 'N');              
              this.TaggedReports = this.ReportsList.filter(x => x.IsTagged == 'Y');

                if(this.commonService.getLength(this.AvailableMenus) > 0){

                    for (let item of this.AvailableMenus) 
                    {
                        item.AssignedFunction = this.FunctionList.filter(x1 => x1.MenuID == item.MenuID);
                        item.AvailableFunction = this.FunctionList.filter(x1 => x1.MenuID == item.MenuID);
                    }

                }
                
                if(this.commonService.getLength(this.TaggedMenus) > 0){
                    for (let item of this.TaggedMenus)
                    {
                        item.IsSelected = true;

                        item.AssignedFunction = this.FunctionList.filter(x1 => x1.MenuID == item.MenuID && x1.IsTagged == 'Y');
                        item.AvailableFunction = this.FunctionList.filter(x1 => x1.MenuID == item.MenuID);

                    }

                }

                this.Mode = Mode;

            }
            else
            {
                this.sessionService.showError(data.ErrorMessage);
                this.cancelClick();
            }
        });

        this.sessionService.scrollAdjust();
    }

    onMoveToTarget() {
        
        if (this.TaggedMenus != null) {
            this.TaggedMenus.forEach(x => x.IsSelected = true);
        }
        
    }

    onMoveToSource() {
        
        if (this.AvailableMenus != null) {
            this.AvailableMenus.forEach(x => x.IsSelected = false);
        }
    }

    onMoveToTargetRpt() {
        
        if (this.TaggedReports != null) {
            this.TaggedReports.forEach(x => x.IsSelected = true);
        }
        
    }

    onMoveToSourceRpt() {
        
        if (this.AvailableReports != null) {
            this.AvailableReports.forEach(x => x.IsSelected = false);
        }
    }

    onDoubleClick(rowData:RoleInfo){
  
        if (rowData != null){
            this.selectedDataGridItem = Object.assign({},rowData);      
            this.loadMasterData('EDIT');
        }
    }
  
    addClick() 
    {
        this.selectedDataGridItem = new RoleInfo();
        this.selectedDataGridItem.StatusCode = MasterStatus.Active;
        this.loadMasterData('ADD');
    }
  
    editClick() 
    {
        if (this.selectedData != null) {
            this.onDoubleClick(this.selectedData);
        }
    }

    deleteClick(){

        if (this.selectedData != null) {

            if (this.selectedData.RoleID == this.sessionService.RoleID)
            {
              this.sessionService.showError('Selected Role is your current role. Could not be deleted....!');
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

                    let req = new SaveRoleRequest();
                    req.Result = new RoleInfo();
                    req.Result = this.selectedData;
                    req.SaveType = AppConfig.SaveType_Delete;

                    this.apiService.postData("SaveRole",req).subscribe((data: ServiceReponse) => {
                        if (data.SuccessCode == 1) {

                            this.sessionService.showSuccess("Role deleted sucessfully..");                               
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

    SubmitClick(isValid: boolean) {

        this.submitAttempt = true;

        let req = new SaveRoleRequest();

        req.Result = this.selectedDataGridItem;
        req.RoleMenuList = new Array();
        req.RoleFunctionList = new Array();
        req.RoleReportsList = new Array();

        if (isValid)
        {
            console.log(this.TaggedMenus);
            let FunctionInfo = new Array();

            for(let item of this.TaggedMenus){

                if (item.AvailableFunction != undefined && item.AvailableFunction.length > 0) {
                    for(let fn of item.AssignedFunction){
                        let nFunc  = new RoleFunction();
                        nFunc.FunctionID = fn.FunctionID;
                        nFunc.RoleID = req.Result.RoleID;
                        req.RoleFunctionList.push(nFunc);
                    }
                }

                let nMenu = new RoleMenu();
                nMenu.MenuID = item.MenuID;
                nMenu.RoleID = req.Result.RoleID;
                req.RoleMenuList.push(nMenu);
            }

            for(let item of this.TaggedReports){                
                let nRpt = new RoleReport();
                nRpt.ReportID = item.ReportID;
                nRpt.RoleID = req.Result.RoleID;
                req.RoleReportsList.push(nRpt);                
            }
         
            if(this.Mode == 'ADD'){
                req.SaveType = AppConfig.SaveType_Insert
            }
            else{
                req.SaveType = AppConfig.SaveType_Update
            }

            this.apiService.postData("SaveRole",req).subscribe((data: ServiceReponse) => {
                if (data.SuccessCode == 1) {

                    if(this.Mode == 'ADD') {
                        this.sessionService.showSuccess("Role added successfully");
                    }

                    else if(this.Mode == 'EDIT') {
                        this.sessionService.showSuccess("Role updated successfully");
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
    
    refreshClick(){
        this.cancelClick();
        this.loadDataGrid();
    }

}
