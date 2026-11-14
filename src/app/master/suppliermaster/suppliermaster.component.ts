import { Component, OnInit } from '@angular/core';
import { AppConfig, MasterStatus} from '../../const/app.config';
import { WebApiService } from "../../service/webapi.service";
import { Status, State, Country, SupplierMasterInfo,Master_LookUp, SupplierItemCategory, SupplierItem, SupplierItemCategoryExt } from "../../model/shared.model";
import { SessionService } from "../../service/session.service";
import { CommonService } from "../../service/common.service";
import { MatDialog } from '@angular/material/dialog';
import { MasterData_RegisterCorp_GetAllResponse, ServiceReponse, Master_SupplierGetByCorpIDResponse, SupplierItemGetByCorpIDResponse } from '../../model/response.model';
import { SaveSupplierRequest, SupplierItemGetByCorpIDRequest } from '../../model/request.model';
import { ConfirmDialogComponent } from '../../common/confirmdialog.component';

@Component({
  templateUrl: './suppliermaster.component.html',
  styleUrls: ['./suppliermaster.component.scss']
})

export class SupplierMasterComponent implements OnInit {

    public submitAttempt: boolean;
    public selectedDataGridItem: SupplierMasterInfo;
    public selectedData: SupplierMasterInfo;
    public dataGridList: SupplierMasterInfo[];
     
    
    public cols: any[];
  
    public Mode: string;
    
    public StatusList: Status[];
    public StateList: State[];
    public StateListFiltered: State[];
    public CountryList: Country[];
    public FormColumnsWidth : number;
  
    public SupplierTypeList:Master_LookUp[];
    public ItemCategoryList: SupplierItemCategory[];
    public ItemList: SupplierItem[];
    public PickListItems: SupplierItemCategoryExt[];
    public AvailableItems: SupplierItemCategoryExt[];
    public TaggedItems: SupplierItemCategoryExt[];

    constructor(public dialog: MatDialog, public sessionService: SessionService, private apiService: WebApiService,
      public commonService: CommonService) {
    
      this.StateList = [];
      this.StateListFiltered = [];
      this.CountryList = [];
      this.FormColumnsWidth = 600;

    }
  
    ngOnInit() {
      
      this.Mode = 'HOME';
  
      this.loadDataGrid();
  
      this.cols = [
        { field: 'SupplierName', header: 'Supplier Name', width: '25%', align: 'left', wrap: 'break-word' ,resizable:true },
        { field: 'ContactPerson', header: 'Contact Person', width: '15%', align: 'left', wrap: 'break-word' },
        { field: 'MobileNumber', header: 'Mobile', width: '10%', align: 'left', wrap: 'break-word' },
        { field: 'Email', header: 'Email', width: '20%', align: 'left', wrap: 'break-word' },
        { field: 'City', header: 'City', width: '10%', align: 'left', wrap: 'break-word' },
        { field: 'SupplierType', header: 'Supplier Type', width: '10%', align: 'left', wrap: 'break-word' },
        { field: 'StatusMessage', header: 'Status', width: '10%', align: 'left', wrap: 'break-word' }
      ];
  
    }
    
    loadDataGrid() {
  
      this.apiService.postData("SupplierGetByCorpID", null).subscribe((data: Master_SupplierGetByCorpIDResponse) => {
        if (data.SuccessCode == 1) {
            this.dataGridList = data.ResultList;
            this.SupplierTypeList = data.SupplierTypeList;
            
        }
        else
        {
          this.sessionService.showError(data.ErrorMessage);
        }
      });
  
    }

  onCountrySelect() {

    this.StateListFiltered = [];

    if (this.commonService.getLengthNA(this.selectedDataGridItem.CountryCode) > 0) {
      if (this.commonService.getLength(this.StateList) > 0) {

        this.StateListFiltered = this.StateList.filter(itm => itm.CountryCode == this.selectedDataGridItem.CountryCode);
        let currCountry = this.CountryList.find(itm => itm.CountryCode == this.selectedDataGridItem.CountryCode);

        this.selectedDataGridItem.CurrencyCode = currCountry.CurrencyCode;
      }
    }
    else {
      this.selectedDataGridItem.StateID = null;
    }
  }
  
    
  loadMasterData(Mode: string)
  {
      
      if (Mode == 'ADD') {
        this.StatusList = this.sessionService.StatusListAll.filter(x=> x.StatusCode==10);
      }
      else if (Mode == 'EDIT')
      {      
        this.StatusList = this.sessionService.StatusListAll;
      }
  
      this.CountryList = this.sessionService.CountryList;
      this.StateList = this.sessionService.StateList;
  
  
      if (Mode != 'ADD') {
        this.onCountrySelect();
      }
  
      this.Mode = Mode;

      let req = new SupplierItemGetByCorpIDRequest();
      req.SupplierID = null;
      if (this.selectedDataGridItem != null)
      {
        req.SupplierID = this.selectedDataGridItem.SupplierID;
      }
      
      this.ItemCategoryList = new Array();
      this.ItemList = new Array();

      this.PickListItems = new Array();
      this.AvailableItems = new Array();
      this.TaggedItems = new Array();

      this.apiService.postData("SupplierItemGetByCorpID", req).subscribe((data: SupplierItemGetByCorpIDResponse) => {
      if (data.SuccessCode == 1) {
        
            this.ItemCategoryList = data.ItemCategoryList;
            this.ItemList = data.ItemList;

            if (this.commonService.getLengthNA(this.ItemCategoryList)>0)
            {
              this.ItemCategoryList.forEach(d=> {

                let nItm = new SupplierItemCategoryExt();
                nItm.ItemCategoryID = d.ItemCategoryID;
                nItm.ItemCategoryName = d.ItemCategoryName;
                nItm.StatusCode = d.StatusCode;
                nItm.IsTagged = d.IsTagged;              

                this.PickListItems.push(nItm);

              });

            }

            this.AvailableItems = this.PickListItems.filter(x => x.IsTagged == 'N');
            this.TaggedItems = this.PickListItems.filter(x=> x.IsTagged == 'Y');

                if(this.commonService.getLength(this.AvailableItems) > 0){

                    for (let item of this.AvailableItems) 
                    {
                        item.AssignedItem = this.ItemList.filter(x1 => x1.ItemCategoryID == item.ItemCategoryID);
                        item.AvailableItem = this.ItemList.filter(x1 => x1.ItemCategoryID == item.ItemCategoryID);
                    }

                }
                
                if(this.commonService.getLength(this.TaggedItems) > 0){
                    for (let item of this.TaggedItems)
                    {
                        item.IsSelected = true;

                        item.AssignedItem = this.ItemList.filter(x1 => x1.ItemCategoryID == item.ItemCategoryID && x1.IsTagged == 'Y');
                        item.AvailableItem = this.ItemList.filter(x1 => x1.ItemCategoryID == item.ItemCategoryID);

                    }

                }


          }
          else
          {
            this.sessionService.showError(data.ErrorMessage);

          }
      });
      
      
      this.sessionService.scrollAdjust();
  }
  
  onMoveToTarget() {
        
    if (this.TaggedItems != null) {
        this.TaggedItems.forEach(x => x.IsSelected = true);
    }
    
}

onMoveToSource() {
    
    if (this.AvailableItems != null) {
        this.AvailableItems.forEach(x => x.IsSelected = false);
    }
}


    addClick() {
      this.selectedDataGridItem = new SupplierMasterInfo();
      this.selectedDataGridItem.StatusCode = MasterStatus.Active;
      this.Mode='ADD';
      this.loadMasterData('ADD');
    }
  
    editClick() {
        this.onDoubleClick(this.selectedData);
    }
  
    onDoubleClick(rowData: SupplierMasterInfo) {
      if (rowData != null) {
        this.selectedDataGridItem = Object.assign({}, rowData);
        this.loadMasterData('EDIT');
      }
    }
    
    deleteClick() {
  
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
  
            let req = new SaveSupplierRequest();
  
            req.Result = new SupplierMasterInfo();
  
            //req.Result.SupplierID = this.selectedData.SupplierID;
            req.Result = this.selectedData;
            req.SaveType = AppConfig.SaveType_Delete;
  
            this.apiService.postData("SaveSupplierMaster", req).subscribe((data: ServiceReponse) => {
              if (data.SuccessCode == 1) {
                this.sessionService.showSuccess("Supplier Master deleted sucessfully..");
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
  
    RefreshClick() {
      this.cancelClick();
      this.loadDataGrid();
    }
  
    SubmitClick(isValid: boolean) {
  
      this.submitAttempt = true;
  
      if (isValid) {
    
        if (this.selectedDataGridItem.CountryCode == 'IND')
        {
          if (this.selectedDataGridItem.CurrencyCode != 'INR')
          {
            this.sessionService.showError("Invalid currency code for selected country");
            return;
          }
          if (this.commonService.getLengthNA(this.selectedDataGridItem.Pincode) != 6)
          {
              this.sessionService.showError("Invalid pincode");
              return;
          }
        }

        if (this.selectedDataGridItem.CountryCode == 'USA')
        {
          if (this.selectedDataGridItem.CurrencyCode != 'USD')
          {
            this.sessionService.showError("Invalid currency code for selected country");
            return;
          }
        }
  
        let req = new SaveSupplierRequest();
        req.Result = this.selectedDataGridItem;  
        req.ItemList = new Array();

        console.log(this.TaggedItems);


        if (this.commonService.getLengthNA(this.TaggedItems)>0)
        {
          this.TaggedItems.forEach(x=> {

            if (this.commonService.getLengthNA(x.AssignedItem)>0)
            {
              x.AssignedItem.forEach(d=> {
                let nItm = new SupplierItem();
                  nItm.ItemID = d.ItemID;
                  nItm.ItemPrice = d.ItemPrice;
                  //nItm.SupplierID = d.SupplierID;
  
                  req.ItemList.push(nItm);

              });
            }

          });
        }


        if (req.Result.GSTIN != null && req.Result.GSTIN.length > 0) {

            req.Result.GSTIN = req.Result.GSTIN.toUpperCase();

            if (req.Result.GSTIN.substring(0, 2) != this.StateList.find(itm => itm.StateID == req.Result.StateID).TIN) {
                this.sessionService.showError("Invalid GST Number. Please check state code.");
                return;
            }
            
            // if (req.Result.GSTIN.substring(2, 12) != req.Result.PAN) {
            //     this.sessionService.showError("Invalid GST Number. Please check PAN and GST Number.");
            //     return;
            // }

        }

        req.SaveType = this.Mode == 'ADD' ? AppConfig.SaveType_Insert : AppConfig.SaveType_Update;
        console.log(req);

        this.apiService.postData("SaveSupplierMaster", req).subscribe((data: ServiceReponse) => {
          if (data.SuccessCode == 1) {
            this.sessionService.showSuccess(this.Mode == 'ADD' ? "Supplier Master added successfully" : "Supplier Master updated successfully");
            this.Mode = 'HOME';
            this.RefreshClick();       
          }
          else
          {
            this.sessionService.showError(data.ErrorMessage);
          }
        });
      }
      else {
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
  
    onKeyUp() {
      this.selectedData = null;
    }
  
    isRowSelected(): boolean {

      if (this.selectedData != null) {
          return true;
      }
      else {
          return false;        
      }
    }
  
}  
