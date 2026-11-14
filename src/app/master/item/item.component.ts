import { Component } from '@angular/core';
import { WebApiService } from "../../service/webapi.service";
import { SessionService } from "../../service/session.service";
import { CommonService } from "../../service/common.service";
import { AppConfig, MasterStatus} from "../../const/app.config";
import { LoaderService } from '../../service/loader.service';
import { FormGroup} from '@angular/forms';
import { Status, Master_Item, Master_ItemType, Master_UOM, Master_Item_PUOM, FieldMasterInfo, Master_Item_Price } from "../../model/shared.model";
import { MatDialog } from "@angular/material/dialog";
import { ServiceReponse, ItemGetByCorpIDResponse, MasterData_SaveItem_GetAllResponse } from "../../model/response.model";
import { SaveItemRequest } from "../../model/request.model";
import { ConfirmDialogComponent } from '../../common/confirmdialog.component';
import * as moment from 'moment';

@Component({
    templateUrl: './item.component.html',
    styleUrls: ['./item.component.scss']
})

export class ItemComponent {

    public formGroup: FormGroup;
    public submitAttempt: boolean;
    public dataGridList: Master_Item[];
    public MaterialPriceHistory: Master_Item_Price[];
    public FieldList: FieldMasterInfo[];
    public purchaseUOMList: Master_Item_PUOM[];
    public cols:any[];
    public Mode: string;
    public selectedDataGridItem: Master_Item;
    public selectedData: Master_Item;
    public SelectedRoleList: Master_Item[];
    public StatusList:Status[];
    public ItemTypeList:Master_ItemType[]; 
    public UOMList:Master_UOM[];

    public FormColumnsWidth : number;
    public firstTime: boolean;
    userMode:string;
    
    constructor(public dialog: MatDialog,  private apiService: WebApiService,
        public sessionService: SessionService, 
        public commonService: CommonService,
        public loaderService: LoaderService
    ) 
    {
        this.FormColumnsWidth = 600; 
    }

    ngOnInit() {
    
        this.firstTime = true;
        this.Mode = 'HOME';
    
        this.loadDataGrid();
    
        this.cols = [     
            { field: 'ItemCode', header: "Code", width: '7%',align: 'left',wrap: 'break-word'},
            { field: 'ItemName', header: "Name", width: '15%',align: 'left',wrap: 'break-word'},
            { field: 'ItemCategoryName', header: "Category", width: '10%', align: 'left',wrap: 'break-word'},
            { field: 'ItemTypeName', header: "Type", width: '10%', align: 'right',wrap: 'break-word'},
            { field: 'ItemSize', header: "Size", width: '10%', align: 'right',wrap: 'break-word'},
            { field: 'ItemPrice', header: "Rate", width: '10%', align: 'right',wrap: 'break-word'},
            { field: 'UOM', header: "UOM", width: '10%', align: 'right',wrap: 'break-word'}
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
        this.apiService.postData("MaterialGetByCorpID", null).subscribe((data: ItemGetByCorpIDResponse) => {
            if (data.SuccessCode == 1) {
                this.dataGridList = data.ResultList;
                this.MaterialPriceHistory = data.ItemPriceList;

                this.FieldList = data.FieldList;
                //this.purchaseUOMList = data.PurchaseUOMList;
                this.sessionService.ItemList = data.ResultList;

                if (this.FieldList != null && this.FieldList.length>0 && this.firstTime == true)
                {

                    let l = 0;
                    let fldStr:string;
        
                    this.FieldList.forEach(x=> {
                        l = l + 1;
                        fldStr = "ItemField" + l.toString().trim();
                        if (x.DisplayInGrid == true)
                        {
                            this.cols.push({ field: fldStr, header: x.FieldName,  width: '10%', align: 'left',wrap: 'break-word'});            
                        }
                    });

                    
                }
                        

                if (this.firstTime == true)
                {
                    this.cols.push({ field: 'StatusMessage', header: "Status",  width: '8%', align: 'left',wrap: 'break-word'});
                }


                this.firstTime = false;
                // if (this.commonService.getLength(this.dataGridList)>0)
                // {
                //     this.dataGridList.forEach(d=> {

                //         let puomlist = this.purchaseUOMList.filter(x=> x.ItemID == d.ItemID);

                //         if (this.commonService.getLength(puomlist)>0)
                //         {
                //             d.PurchaseUOMDetails = puomlist;
                //         }
                //         else
                //         {
                //             d.PurchaseUOMDetails = new Array();
                //         }

                //     });
                // }
            }
            else
            {
                this.sessionService.showError(data.ErrorMessage);
            }
        });
                        

    }

    loadMasterData(Mode: string) {
  
        this.Mode = Mode;

        if (Mode == 'ADD'){
            this.StatusList = this.sessionService.ActiveStatusList;
        }
        else{
            this.StatusList = this.sessionService.StatusList;
        }

        // this.apiService.postData("MasterData_Item_GetAll", null).subscribe((data: MasterData_SaveItem_GetAllResponse) => {
        //     if (data.SuccessCode == 1) {
        //         this.ItemTypeList = data.ItemTypeList;
        //         this.UOMList = data.UOMList;
        //         this.Mode = Mode;
        //     }
        //     else
        //     {
        //         this.sessionService.showError(data.ErrorMessage);
        //         this.cancelClick();
        //     }
        // });
        
        this.sessionService.scrollAdjust();
    }
    
    
    onDoubleClick(rowData:Master_Item){
  
        if (rowData != null){
            this.selectedDataGridItem = Object.assign({},rowData);
            this.selectedDataGridItem.MaterialPriceHistory = new Array();

            if (this.selectedDataGridItem != null && this.commonService.getLength(this.MaterialPriceHistory)>0)   
            {
                let mList = this.MaterialPriceHistory.filter(x=> x.ItemID == this.selectedDataGridItem.ItemID);
                if (this.commonService.getLength(mList)>0)
                {
                    mList.forEach(x=> {
                        x.EffectiveDate = moment(x.EffectiveDate).format(AppConfig.DATE_FORMAT);
                        this.selectedDataGridItem.MaterialPriceHistory.push(x);
                    });                    
                }

            }
            this.loadMasterData('EDIT');
        }
    }
  
    addClick() 
    {
        this.selectedDataGridItem = new Master_Item();
        this.selectedDataGridItem.StatusCode = MasterStatus.Active;
        this.selectedDataGridItem.PurchaseUOMDetails = new Array();
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
                    let req = new SaveItemRequest();
                    req.Result = new Master_Item();
                    req.Result.ItemID = this.selectedData.ItemID;
                    req.Result.StatusCode = 50;
                    req.SaveType = AppConfig.SaveType_Delete;

                    this.apiService.postData("SaveMaterialMaster",req).subscribe((data: ServiceReponse) => {
                        if (data.SuccessCode == 1) {
                            this.sessionService.showSuccess("Item deleted sucessfully..");                               
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

        let req = new SaveItemRequest();
 
        req.Result =  this.selectedDataGridItem;
       
        if (isValid) 
        {
            req.Result = this.selectedDataGridItem;
             
            if(this.Mode == 'ADD'){
                req.SaveType = AppConfig.SaveType_Insert
            }
            else{
                req.SaveType = AppConfig.SaveType_Update
            }
   
            this.apiService.postData("SaveItem",req).subscribe((data: ServiceReponse) => {
                if (data.SuccessCode == 1) {

                    if(this.Mode == 'ADD') {
                        this.sessionService.showSuccess("Item added successfully");
                    }

                    else if(this.Mode == 'EDIT') {
                        this.sessionService.showSuccess("Item updated successfully");
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

    itemSaved()
    {
        this.refreshClick();
        this.Mode = 'HOME'; 
    }

}
