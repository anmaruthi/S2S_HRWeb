import { Component, Inject, OnInit, AfterViewInit} from '@angular/core';
import { WebApiService } from "../../service/webapi.service";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SessionService } from "../../service/session.service";
import { CommonService } from "../../service/common.service";
import { AppConfig, logLevel } from "../../const/app.config";
import { ItemCategoryTaxDetails, Status, TaxmasterInfo } from 'src/app/model/shared.model';
import { TaxMasterGetAllRequest } from 'src/app/model/request.model';
import { TaxMasterGetAllByCorpIDResponse } from 'src/app/model/response.model';

@Component({
    templateUrl: './categorytax.component.html',
    styleUrls: ['./categorytax.component.css']
})

export class CategoryTaxComponent implements OnInit 
{
    public txtMessage: string;
    public Mode: string;
    public dialogItem: ItemCategoryTaxDetails;
    public submitAttempt: boolean;
    public StatusList: Status[];
    public TaxList: TaxmasterInfo[];

    constructor(public dialogRef: MatDialogRef<CategoryTaxComponent>, public dialog: MatDialog,
        @Inject(MAT_DIALOG_DATA) public DialogInputData: any, public sessionService: SessionService, 
        public commonService: CommonService, private apiService: WebApiService)
    {    


    }

    ngOnInit() 
    {
        this.Mode = this.DialogInputData.Mode;
        this.txtMessage = this.DialogInputData.txtMessage;
        this.submitAttempt = false;

        if (this.Mode == 'ADD')
        {
            this.dialogItem = new ItemCategoryTaxDetails();
        }
        else
        {
            this.dialogItem = Object.assign({}, this.DialogInputData.selectedItem);
        }

        this.TaxList = Object.assign([], this.DialogInputData.TaxList);
        this.StatusList = Object.assign([], this.DialogInputData.StatusList);
        //this.loadMasterData();

    }

    ngAfterViewInit()
    {
      
        this.loadMasterData();

    }

    loadMasterData(){

        // let req = new TaxMasterGetAllRequest();
        // this.apiService.postData("TaxGetByCorpID", req).subscribe((data: TaxMasterGetAllByCorpIDResponse) => {
        //   if (data.SuccessCode == 1) {
        //     this.TaxList = data.ResultList;
        //   }
        //   else
        //   {
        //     this.sessionService.showError(data.ErrorMessage);
        //   }
        // });  

        // if (this.Mode == 'ADD'){
        // this.StatusList = this.sessionService.StatusListAll.filter(x=> x.StatusCode==10);
        // }
        // else{
        // this.StatusList = this.sessionService.StatusListAll;
        // }
    }

    closeClick()
    {
        this.dialogRef.close(0);
    }

    taxSelected(taxInfo:any)
    {
        if (taxInfo != null)
        {
            console.log(taxInfo);
            this.TaxList.forEach(x=>{
                if (x.TaxID == Number(taxInfo.ID))
                {
                    console.log('matched');
                    console.log(x);

                    this.dialogItem.TaxCode = x.TaxCode;
                    this.dialogItem.TaxName = x.TaxName;
                    this.dialogItem.TaxID = x.TaxID;
                }
            });
        }
    }

    submitClick(isValid:boolean)
    {
        this.submitAttempt = true;

        if (isValid) 
        {
            this.sessionService.dialogItem = this.commonService.cloneAny(this.dialogItem);
            this.dialogRef.close(1);
        }

    }

}
