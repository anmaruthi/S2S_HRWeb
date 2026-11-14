import { Component } from '@angular/core';
import { WebApiService } from "../../service/webapi.service";
import { SessionService } from "../../service/session.service";
import { CommonService } from "../../service/common.service";
import { AppConfig, logLevel } from "../../const/app.config";
import { MatDialog } from '@angular/material/dialog';
import { LoaderService } from '../../service/loader.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ConfirmDialogComponent } from "../../common/confirmdialog.component";
import { Master_LookUp, Master_LookUp_Domain } from '../../model/shared.model';
import { MasterLookUpDataGetAllByCorpIDResponse, ServiceReponse } from '../../model/response.model';
import { SaveLookUpRequest } from '../../model/request.model';


@Component({
    templateUrl: './lookup.component.html',
    styleUrls: ['./lookup.component.scss']
})

export class LookupComponent {

    public formGroup: FormGroup;
    public submitAttempt: boolean;
    public dataGridList: Master_LookUp[];
    public dataGridListAll: Master_LookUp[];
    public cols:any[];
    public Mode: string;
    public selectedDataGridItem: Master_LookUp;
    public selectedData: Master_LookUp;
    public DomainList:Master_LookUp_Domain[];
    public selectedDomain:Master_LookUp_Domain;

    public FormColumnsWidth : number;

    constructor(public dialog: MatDialog, private apiService: WebApiService,
        public sessionService: SessionService,
        public commonService: CommonService,
        public loaderService: LoaderService
    ) 

    {
        this.FormColumnsWidth = 600; 
    }
    
    ngOnInit() {

        this.selectedDomain = new Master_LookUp_Domain();
        this.submitAttempt = false;

        this.loadDataGrid();

        this.cols=[
            {field:'Description', header:'Description', width: '50%',align: 'left',wrap: 'break-word' },
            {field:'SortOrder', header:'Sort Order', width: '25%',align: 'left',wrap: 'break-word' },
            {field:'IsDefaultText', header:'Is Default', width: '25%',align: 'left',wrap: 'break-word' }
        ];

        this.Mode = 'HOME';

        this.selectedDataGridItem = new Master_LookUp();

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
        this.apiService.postData("LookupGetByCorpID",null).subscribe((data: MasterLookUpDataGetAllByCorpIDResponse) => {
            if (data.SuccessCode == 1) {
                this.DomainList = data.LookupDomainList;
                this.dataGridListAll = data.ResultList;

                if (this.dataGridListAll != null && this.dataGridListAll.length>0)
                {
                    this.dataGridListAll.forEach(x=> {
                        if (x.IsDefault == true)
                        {
                            x.IsDefaultText = 'Yes';
                        }
                        else
                        {
                             x.IsDefaultText = 'No';
                        }
                    });
                }

                if(this.DomainList.length > 0){
                    if (this.selectedDomain.DomainID == null)
                    {
                        this.selectedDomain.DomainID  = this.DomainList[0].DomainID;
                    }
                    this.onDomainChange();
                }

            }
            else
            {
                this.sessionService.showError(data.ErrorMessage);
            }
        });
      
        this.selectedDataGridItem = null;

    }

    onDoubleClick(rowData:Master_LookUp){

        if (rowData != null){
            this.selectedDataGridItem = Object.assign({},rowData);
            this.Mode = 'EDIT';
            this.sessionService.scrollAdjust();
        }
    }

    addClick()
    {
            this.Mode = 'ADD';
            this.selectedDataGridItem = new Master_LookUp();
            this.selectedDataGridItem.StatusCode = 10;
            this.selectedDataGridItem.IsDefault = false;
            this.selectedDataGridItem.DomainID = this.selectedDomain.DomainID;
            this.sessionService.scrollAdjust();
    }

    editClick()
    {
        if (this.selectedData != null) {
            this.onDoubleClick(this.selectedData);
        }
    }

    deleteClick(){

        if (this.selectedData != null) {

            let dialogRef = this.dialog.open(ConfirmDialogComponent, {
                data: {
                    DialogHeader: 'Alert',
                    DialogMessage: 'Are you sure you want to delete?'
                },
                disableClose: true,
            });

            dialogRef.afterClosed().subscribe(result => {
                if (result == 1) {

                    let req = new SaveLookUpRequest();
                    req.Result = new Master_LookUp();
                    req.Result.LookupID = this.selectedData.LookupID;
                    req.Result.StatusCode = 50;
                    req.SaveType = AppConfig.SaveType_Delete;

                    this.apiService.postData("SaveLookUp",req).subscribe((data: ServiceReponse) => {
                        if (data.SuccessCode == 1) {
                                this.sessionService.showSuccess("Lookup deleted sucessfully..");
                                this.refreshClick();
                                this.Mode = 'HOME';
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

            let req = new SaveLookUpRequest();
                req.Result = this.selectedDataGridItem;
                req.SaveType = this.Mode == 'ADD' ? AppConfig.SaveType_Insert : AppConfig.SaveType_Update;

                this.apiService.postData("SaveLookUp",req).subscribe((data: ServiceReponse) => {
                    if (data.SuccessCode == 1) {
                        if(this.Mode == 'ADD'){
                            this.sessionService.showSuccess("Lookup added successfully");
                            this.selectedDataGridItem.Description = null;
                            this.selectedDataGridItem.SortOrder = null;
                            this.selectedDataGridItem.IsDefault = false;

                            this.refreshClick();
                            this.Mode = 'HOME';
                        }
                        else if(this.Mode == 'EDIT'){
                            this.sessionService.showSuccess("Lookup updated successfully");
                            this.refreshClick();
                            this.Mode = 'HOME';
                        }
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

    onDomainChange(){

        if(this.selectedDomain != undefined){
            this.dataGridList = this.dataGridListAll.filter(x=>x.DomainID == this.selectedDomain.DomainID)
        }

    }

    refreshClick(){
        this.cancelClick();
        this.loadDataGrid();
    }

    lookupSaved()
    {
        this.refreshClick();
        this.Mode = 'HOME'; 
    }
}