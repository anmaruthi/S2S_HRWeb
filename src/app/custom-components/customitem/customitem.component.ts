import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { WebApiService } from "../../service/webapi.service";
import { SessionService } from "../../service/session.service";
import { CommonService } from "../../service/common.service";
import { AppConfig, MasterStatus} from "../../const/app.config";
import { LoaderService } from '../../service/loader.service';
import { FormGroup} from '@angular/forms';
import { Status, Master_Item, Master_ItemType, Master_UOM, Master_Item_PUOM, ItemCategoryTaxDetails, ItemTypeInfo, FieldMasterInfo, ItemCategoryInfo, TaxDetItemCat, Item_Supplier_Price, SupplierMasterInfo, Master_Item_Price } from "../../model/shared.model";
import { MatDialog } from "@angular/material/dialog";
import { ServiceReponse, ItemGetByCorpIDResponse, MasterData_SaveItem_GetAllResponse, SaveReponse, MasterDataMaterialGetAllResponse, ItemTaxDetailGetByItemCategoryIDResponse } from "../../model/response.model";
import { ItemCategoryTaxDetailsRequest, ItemTaxDetailsRequest, SaveItemRequest } from "../../model/request.model";
import { ConfirmDialogComponent } from '../../common/confirmdialog.component';
import * as moment from 'moment';

@Component({
    selector: 'custom-item',
    templateUrl: './customitem.component.html',
    styleUrls: ['./customitem.component.scss']
})

export class CustomItemComponent {
    cols: any[];
    cols1: any[];
    cols2: any[];

    public formGroup: FormGroup;
    public submitAttempt: boolean;
    @Input('Mode') Mode: string;
    @Input('selectedItem') selectedDataGridItem: Master_Item;
    @Input('FieldList') FieldList: FieldMasterInfo[];
    public backupItem:Master_Item;
    public SelectedRoleList: Master_Item[];
    public StatusList:Status[];
    public ItemCategoryList: ItemCategoryInfo[];
    public ItemTypeList:ItemTypeInfo[]; 
    public ItemTypeListFiltered:ItemTypeInfo[]; 
    public UOMList:Master_UOM[];
    public TaxDetailList:TaxDetItemCat[];
    public ItemSupplierList:Item_Supplier_Price[];
    public SupplierList: SupplierMasterInfo[];
    public MaterialPriceHistory: Master_Item_Price[];
    public selectedPriceItem:Item_Supplier_Price;
    public dialogPriceItem:Item_Supplier_Price;
    public fRows: number;
    public Mode1:string;
    public ItemPurchaseDetID:number;  
    public submitAttempt1: boolean;  
    public canUpdateStock:boolean;
    public RwID: number;

    @Output() public cancelClicked : EventEmitter<any> = new EventEmitter();
    @Output() public saveCompleted : EventEmitter<any> = new EventEmitter();

    @ViewChild('itemName') itemName:ElementRef;  
    
    constructor(public dialog: MatDialog,  private apiService: WebApiService,
        public sessionService: SessionService, 
        public commonService: CommonService,
        public loaderService: LoaderService
    ) 
    {

    }

    ngOnInit() {

        this.canUpdateStock = false;

        this.ItemPurchaseDetID = 0;
        this.ItemTypeList = [];
        this.UOMList = [];
        this.ItemSupplierList = new Array(); 
        this.TaxDetailList = new Array();
        this.SupplierList = new Array();
        this.Mode1 = 'HOME';
        this.fRows = 0;
        this.RwID = 0;

        this.MaterialPriceHistory = new Array();

        console.log(this.selectedDataGridItem);

        if (this.Mode == 'ADD'){
            this.StatusList = this.sessionService.StatusListAll.filter(x=> x.StatusCode==10);
            this.backupItem = new Master_Item();
        }
        else{
            this.StatusList = this.sessionService.StatusListAll;
            this.backupItem = this.commonService.cloneAny(this.selectedDataGridItem);
            this.MaterialPriceHistory = this.selectedDataGridItem.MaterialPriceHistory;
        }

        if (this.FieldList != null && this.FieldList.length > 0)
        {
            this.fRows = this.FieldList.length;
        }
      
        this.loadMasterData(this.Mode);

        this.cols = [
            { field: 'TaxCode', header: 'Tax Code', width: '20%', align: 'left', wrap: 'break-word' },
            { field: 'TaxName', header: 'Tax Name', width: '20%', align: 'left', wrap: 'break-word' },
            { field: 'TaxValue', header: '( % )', width: '20%', align: 'right', wrap: 'break-word' },
            { field: 'EffectiveDateFrom', header: 'Effective Date', width: '40%', align: 'left', wrap: 'break-word' }
          ];

        this.cols1 = [
            { field: 'SupplierName', header: 'Supplier', width: '60%', align: 'left', wrap: 'break-word' },
            { field: 'ItemPrice', header: 'Rate', width: '40%', align: 'left', wrap: 'break-word' }
        ];
      
        this.cols2 = [
            { field: 'ItemPrice', header: 'Price', width: '40%', align: 'left', wrap: 'break-word' },
            { field: 'EffectiveDate', header: 'Effective Date', width: '60%', align: 'left', wrap: 'break-word' }
        ];
    }

    ngAfterViewInit()
    {
        // if (this.Mode == 'EDIT')
        // {
        //     if (this.selectedDataGridItem != null && this.selectedDataGridItem.ItemID != null)
        //     {
        //         this.onSelectCategory();             
        //     }
        // }
    }

    onChangeCheckbox()
    {
        //console.log(this.canUpdateStock);
    }

    loadMasterData(Mode: string) {
  
        this.ItemTypeListFiltered = new Array();

        this.apiService.postData("MasterDataMaterialGetByCorpID", null).subscribe((data: MasterDataMaterialGetAllResponse) => {
            if (data.SuccessCode == 1) {
                this.ItemTypeList = data.ItemTypeList;
                this.ItemCategoryList = data.ItemCategoryList;
                this.UOMList = data.UOMList;
                this.SupplierList = data.SupplierList;
                this.Mode = Mode;

                if (this.Mode == 'EDIT')
                {
                    if (this.selectedDataGridItem != null && this.selectedDataGridItem.ItemID != null)
                    {
                        this.onSelectCategory();             
                    }
                }
            }
            else
            {
                this.sessionService.showError(data.ErrorMessage);
                this.cancelClick();
            }
        });
        
        //this.sessionService.scrollAdjust();
        //this.itemName.nativeElement.focus();
    }

    loadTaxDetailsByCategoryID()
    {
        this.TaxDetailList = new Array();
        this.ItemSupplierList = new Array();
        let nList:TaxDetItemCat[];
        let nSuppList:Item_Supplier_Price[];
        nList = new Array();
        nSuppList = new Array();

        if (this.selectedDataGridItem.ItemCategoryID != null)
        {
            let req = new ItemTaxDetailsRequest();
            req.ItemID = this.selectedDataGridItem.ItemID;         
            req.ItemCategoryID = this.selectedDataGridItem.ItemCategoryID; 

            this.apiService.postData("ItemTaxDetailGetByItemID", req).subscribe((data: ItemTaxDetailGetByItemCategoryIDResponse) => {
                if (data.SuccessCode == 1) {
                    nList = data.ResultList;
                    nSuppList = data.SupplierList;
                    
                    //this.TaxDetailList = data.ResultList;

                    console.log(nList);
                    if (this.commonService.getLength(nList)>0)
                    {
                        nList.forEach(x=> {
                            if (x.TaxID > 0)
                            {
                                let nItm = new TaxDetItemCat();
                                nItm.EffectiveDateFrom = moment(x.EffectiveDateFrom).format(AppConfig.GRID_DATE_FORMAT);                           
                                nItm.TaxCode = x.TaxCode;
                                nItm.TaxName = x.TaxName;
                                nItm.TaxValue = x.TaxValue;
                                nItm.TaxID = x.TaxID;
                                this.TaxDetailList.push(nItm);
                            }
                           
                        });
                    }
                    console.log(nList);

                    if (this.commonService.getLength(nSuppList)>0)
                    {
                        nSuppList.forEach(x=> {
                            let nItm = new Item_Supplier_Price();
                            nItm.SupplierID = x.SupplierID;
                            nItm.ItemPrice = x.ItemPrice;
                            nItm.SupplierName = x.SupplierName;

                            this.ItemSupplierList.push(nItm);
                        });
                    }
                }
            });
    
        }


    }

    onSelectCategory()
    {
        console.log(this.selectedDataGridItem);

        if (this.selectedDataGridItem.ItemCategoryID != null)
        {
            this.ItemTypeListFiltered = this.ItemTypeList.filter(d=> d.ItemCategoryID == this.selectedDataGridItem.ItemCategoryID);
            if (this.Mode != 'EDIT')
            {
                this.selectedDataGridItem.ItemTypeID = null;                
            }          
            else
            {
                //this.selectedDataGridItem.ItemTypeID = this.backupItem.ItemTypeID;
            }
            this.loadTaxDetailsByCategoryID();
        }
    }

    SubmitClick(isValid:boolean) {
        
        this.submitAttempt = true;

        let req = new SaveItemRequest();         
       
        if (isValid) 
        {
            
            req.Result = this.selectedDataGridItem;
            req.ItemSupplierList = new Array();
            req.ItemTaxList = new Array();
            req.canUpdateStock = this.canUpdateStock;
            //req.PurchaseUOMList = new Array();

            // if (req.Result != null && this.commonService.getLength(req.Result.PurchaseUOMDetails) > 0)
            // {
            //     req.Result.PurchaseUOMDetails.forEach(d=> {

            //         req.PurchaseUOMList.push(d);

            //     });
            // }
             
            //req.Result.PurchaseUOMDetails = null;

            req.Result.EffectiveDate = moment(req.Result.EffectiveDate).format(AppConfig.UPDATE_DATE_FORMAT)

            if (this.canUpdateStock == true)
            {
                req.Result.StockDate  = moment(req.Result.StockDate).format(AppConfig.UPDATE_DATE_FORMAT)
            }


            if (this.commonService.getLengthNA(this.TaxDetailList)>0)
            {
                this.TaxDetailList.forEach(x=> {
                    let nItem = new TaxDetItemCat();
                    nItem.TaxID = x.TaxID;
                    nItem.TaxValue = x.TaxValue;

                    req.ItemTaxList.push(nItem);

                });
            }

            if (this.commonService.getLengthNA(this.ItemSupplierList)>0)
            {
                this.ItemSupplierList.forEach(x=> {
                    let nItem = new Item_Supplier_Price();
                    nItem.SupplierID = x.SupplierID;
                    nItem.ItemPrice = x.ItemPrice;

                    req.ItemSupplierList.push(nItem);

                });
            }

            if(this.Mode == 'ADD'){
                req.SaveType = AppConfig.SaveType_Insert
            }
            else{
                req.SaveType = AppConfig.SaveType_Update
            }
   
            console.log(req);

            this.apiService.postData("SaveMaterialMaster",req).subscribe((data: SaveReponse) => {
                if (data.SuccessCode == 1) {

                    if(this.Mode == 'ADD') {
                        this.sessionService.showSuccess("Material added successfully");
                    }

                    else if(this.Mode == 'EDIT') {
                        this.sessionService.showSuccess("Material updated successfully");
                    }
                    console.log(data);
                    this.selectedDataGridItem.ItemID = data.ID;
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


    supplierSelected(suppInfo:any)
    {
        if (suppInfo != null)
        {
            this.SupplierList.forEach(x=>{
                if (x.SupplierID == Number(suppInfo.ID))
                {
                    this.selectedPriceItem.SupplierID = x.SupplierID;
                }
            });
        }
    }
  
    updateSuppInfo(isValid:boolean)
    {
        this.submitAttempt1 = true;
        console.log(this.selectedPriceItem);

        if (isValid)
        {
          if (this.Mode1 == 'ADD')
          {
            let nItm  = new Item_Supplier_Price();
            nItm = this.commonService.cloneAny(this.selectedPriceItem);
            let yItm = this.ItemSupplierList.filter(x=> x.SupplierID == nItm.SupplierID) ;
           
            if (yItm == null || yItm == undefined || (yItm != null && yItm.length == 0))
            {
              this.RwID = this.RwID + 1;
              nItm.DetID = this.RwID;
              nItm.SupplierName = this.SupplierList.find(z=> z.SupplierID == nItm.SupplierID).SupplierName;
              this.ItemSupplierList.push(nItm);
              this.calSuppItem();
            }
            else
            {
              this.sessionService.showError('Supplier is already exists ')
            }
          }
          else if (this.Mode1 == 'EDIT')
          {
            let nItm  = new Item_Supplier_Price();
            nItm = this.commonService.cloneAny(this.selectedPriceItem);
            let yFlag:boolean;
            yFlag = false;
    
            let yItm1 = this.ItemSupplierList.filter(x=> x.SupplierID == nItm.SupplierID && x.DetID != nItm.DetID) ;
            if (yItm1 != null && yItm1 != undefined && yItm1.length > 0)
            {
              yFlag = true;
            }
    
            if (yFlag == true)
            {
              this.sessionService.showError('Supplier is already exists ')
            }
            else
            {
              this.ItemSupplierList.forEach(x=> {
                if  (x.DetID == nItm.DetID)
                {
                  x.SupplierID = nItm.SupplierID;
                  x.SupplierName = nItm.SupplierName;
                  x.ItemPrice = nItm.ItemPrice;
                  x.ItemID = nItm.ItemID;
                }
              });
              this.calSuppItem();
            }
            
    
          }
    
        }
    
    }
    
    calSuppItem()
    {
        this.Mode1 = 'HOME';
        this.submitAttempt1=false;
        this.selectedPriceItem = null;
        this.dialogPriceItem = null;
    }

    addsuppclick()
    {
        this.selectedPriceItem = new Item_Supplier_Price();
        this.Mode1 = 'ADD';
    }

    editsuppclick()
    {
        if (this.dialogPriceItem != null)
        {
          this.selectedPriceItem = this.commonService.cloneAny(this.dialogPriceItem);      
          this.Mode1 = 'EDIT';
        }
    }

    DisableEdit1(): boolean {

        if (this.dialogPriceItem != null) {
            return false;
        }
        else {
          return true;
        }
    
      }
    


    deletesuppDetail()
    {
        if (this.dialogPriceItem != null)
        {
          let dialogRef = this.dialog.open(ConfirmDialogComponent, {
            data: {
              DialogHeader: 'Alert',
              DialogMessage: 'Are you sure you want to delete?'
            },
            disableClose: true,
          });
    
          dialogRef.afterClosed().subscribe(result => {
            if (result == 1) {
              let idx = this.ItemSupplierList.findIndex(d=> d.DetID == this.dialogPriceItem.DetID );
              if (idx != null)
              {
                this.ItemSupplierList.splice(idx,1);
              }
            }
            else {
              this.dialogPriceItem = null;
            }
          });
    
    
        }
    
    }


}
