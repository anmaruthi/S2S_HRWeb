import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { WebApiService } from "../../service/webapi.service";
import { SessionService } from "../../service/session.service";
import { CommonService } from "../../service/common.service";
import { AppConfig, logLevel } from "../../const/app.config";
import { MatDialog } from '@angular/material/dialog';
import { LoaderService } from '../../service/loader.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ConfirmDialogComponent } from "../../common/confirmdialog.component";
import { Master_LookUp, Master_LookUp_Domain } from '../../model/shared.model';
import { MasterLookUpDataGetAllByCorpIDResponse, ServiceReponse, SaveReponse } from '../../model/response.model';
import { SaveLookUpRequest } from '../../model/request.model';


@Component({
    selector: 'custom-lookup',
    templateUrl: './customlookup.component.html',
    styleUrls: ['./customlookup.component.scss']
})

export class CustomLookupComponent {

    public formGroup: FormGroup;
    public submitAttempt: boolean;
    @Input('Mode') Mode: string;
    @Input('selectedLookup') selectedDataGridItem: Master_LookUp;
    public DomainList:Master_LookUp_Domain[];
    public selectedDomain:Master_LookUp_Domain;

    @Output() public cancelClicked : EventEmitter<any> = new EventEmitter();
    @Output() public saveCompleted : EventEmitter<any> = new EventEmitter();

    @ViewChild('description') Description:ElementRef;  
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
        
        this.submitAttempt = false;
        this.loadMasterData();
    }

    ngAfterViewInit()
    {       

       
         
    }



    loadMasterData()
    {

        this.apiService.postData("LookupGetByCorpID",null).subscribe((data: MasterLookUpDataGetAllByCorpIDResponse) => {
            if (data.SuccessCode == 1) {
                this.DomainList = data.LookupDomainList;

                if (this.selectedDataGridItem != null && this.selectedDataGridItem.DomainID != null)
                {
                    this.selectedDomain = this.DomainList.find(d=> d.DomainID == this.selectedDataGridItem.DomainID);
                }
            }
            else
            {
                this.sessionService.showError(data.ErrorMessage);
                this.cancelClick();
            }

            
        });
      
        //this.sessionService.scrollAdjust();        
        //this.setFocus2FirstElement();


    }

    //setFocus2FirstElement()
    //{
      //  this.Description.nativeElement.focus();
    //}
   
    SubmitClick(isValid:boolean) {

        this.submitAttempt = true;
        if (isValid) 
        {

            let req = new SaveLookUpRequest();
                req.Result = this.selectedDataGridItem;
                req.SaveType = this.Mode == 'ADD' ? AppConfig.SaveType_Insert : AppConfig.SaveType_Update;

                this.apiService.postData("SaveLookUp",req).subscribe((data: SaveReponse) => {
                    if (data.SuccessCode == 1) {
                        if(this.Mode == 'ADD'){
                            this.sessionService.showSuccess("Lookup added successfully");
                        }
                        else if(this.Mode == 'EDIT'){
                            this.sessionService.showSuccess("Lookup updated successfully");
                        }

                        console.log(data);
                        this.selectedDataGridItem.LookupID = data.ID;
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
        this.submitAttempt = false;
        this.selectedDataGridItem = null;
        this.cancelClicked.emit();
    }

    onDomainChange(){

       
    }

    refreshClick(){
       
    }

}