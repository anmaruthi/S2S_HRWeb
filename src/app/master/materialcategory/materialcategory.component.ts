import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl, SafeUrl} from '@angular/platform-browser';
import { AppConfig, MasterStatus } from '../../const/app.config';
import { WebApiService } from "../../service/webapi.service";
import { ItemCategoryInfo, Status, ItemTypeInfo, ItemCategoryTaxDetails, TaxmasterInfo, TaxDetItemCat } from "../../model/shared.model";
import { SessionService } from "../../service/session.service";
import { CommonService } from "../../service/common.service";
import { MatDialog } from '@angular/material/dialog';
import { ItemCategoryGetAllByCorpIDResponse, ServiceReponse, ItemCategoryTaxDetailsResponse, TaxMasterGetAllByCorpIDResponse } from '../../model/response.model';
import { ItemTypeGetAllRequest, ItemCategoryTaxDetailsRequest, SaveItemCategoryRequest, TaxMasterGetAllRequest } from '../../model/request.model';
//import { SettingDialogComponent } from '../settings/settingdialog.component';
import { ConfirmDialogComponent } from '../../common/confirmdialog.component';
import { CategoryTaxComponent } from './categorytax.component';
import * as moment from 'moment';

@Component({
  templateUrl: './materialcategory.component.html',
  styleUrls: ['./materialcategory.component.scss']
})
export class MaterialCategoryComponent implements OnInit {
  cols: any[];
  cols1: any[];

  public selectedDataGridItem: ItemCategoryInfo;
  public selectedData: ItemCategoryInfo;
  public dataGridList: ItemCategoryInfo[];
  public categoryList: ItemTypeInfo[];
  public ItemCategoryTaxList: ItemCategoryTaxDetails[];
  public selectedItemCategoryTax: ItemCategoryTaxDetails;
  public dialogItem: ItemCategoryTaxDetails;

  public Mode: string;
  public Mode1: string;
  public StatusList: Status[];  
  public submitAttempt: boolean;
  public submitAttempt1: boolean;
  public FormColumnsWidth: number;

  public TaxList: TaxmasterInfo[];
  public StatusList1: Status[];

  public RwID: number;

  constructor(public dialog: MatDialog, public sessionService: SessionService, private apiService: WebApiService,
    public commonService: CommonService, private sanitizer: DomSanitizer) {
      this.FormColumnsWidth = 600;
     }

  ngOnInit()
  {
    this.Mode = 'HOME';
    this.submitAttempt = false;
    this.submitAttempt1 = false;
    this.loadDataGrid();

    this.cols = [
      { field: 'ItemCategoryName', header: 'MaterialCategory Name', width: '60%', align: 'left', wrap: 'break-word' },
      { field: 'StatusMessage', header: 'Status', width: '40%', align: 'left', wrap: 'break-word' }
    ];


    this.cols1 = [
      { field: 'TaxCode', header: 'Tax Code', width: '20%', align: 'left', wrap: 'break-word' },
      { field: 'TaxName', header: 'Tax Name', width: '20%', align: 'left', wrap: 'break-word' },
      { field: 'TaxValue', header: '( % )', width: '20%', align: 'right', wrap: 'break-word' },
      { field: 'EffectiveDateFromStr', header: 'Effective Date', width: '40%', align: 'left', wrap: 'break-word' }
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

  loadDataGrid() {

    let req = new ItemTypeGetAllRequest();
    this.apiService.postData("ItemCategoryGetByCorpID", req).subscribe((data: ItemCategoryGetAllByCorpIDResponse) => {
      if (data.SuccessCode == 1) {
        this.dataGridList = data.ResultList;
      }
      else
      {
        this.sessionService.showError(data.ErrorMessage);
      }
    });

  }

  loadMasterData(){

    if (this.Mode == 'ADD'){
      this.StatusList = this.sessionService.StatusListAll.filter(x=> x.StatusCode==10);
    }
    else{
      this.StatusList = this.sessionService.StatusListAll;
    }

    this.loadTaxDetails();
    this.loadDialogMasters();
    this.sessionService.scrollAdjust();
  }

  loadTaxDetails()
  {
    this.RwID = 0;
    let req = new ItemCategoryTaxDetailsRequest();

    if (this.selectedDataGridItem != null) 
    {
      this.ItemCategoryTaxList = new Array();
      req.ItemCategoryID = this.selectedDataGridItem.ItemCategoryID;

      console.log(req);

      this.apiService.postData("TaxDetailGetByItemCategoryID", req).subscribe((data: ItemCategoryTaxDetailsResponse) => {
        if (data.SuccessCode == 1) {
          this.ItemCategoryTaxList = data.ResultList;
          
          if (this.ItemCategoryTaxList != null && this.ItemCategoryTaxList.length > 0 )
          {
            this.ItemCategoryTaxList.forEach( itm => {
   
              this.RwID = this.RwID + 1;
              itm.TaxDetID = this.RwID;

              if (this.commonService.getLengthNA(itm.EffectiveDateFrom) > 0)
                {
                    itm.EffectiveDateFromStr = moment(itm.EffectiveDateFrom).format(AppConfig.GRID_DATE_FORMAT);
                }
              if (this.commonService.getLengthNA(itm.EffectiveDateTo) > 0)
                {
                    itm.EffectiveDateToStr = moment(itm.EffectiveDateTo).format(AppConfig.GRID_DATE_FORMAT);
                }
             });
  
          }
        }
        else
        {
          this.sessionService.showError(data.ErrorMessage);
        }
      });


    }
    
  }

  addClick() {
    this.RwID = 0;
    this.selectedDataGridItem = new ItemCategoryInfo();
    this.selectedDataGridItem.StatusCode = MasterStatus.Active;
    this.Mode = 'ADD';
    this.loadMasterData();
  }

  editClick() {
    this.Mode = 'EDIT';
    this.onDoubleClick(this.selectedData);
  }

  onDoubleClick(rowData: ItemCategoryInfo) {
    if (rowData != null) {
      this.RwID = 0;
      this.selectedDataGridItem = Object.assign({}, rowData);
      this.Mode = 'EDIT';
      this.loadMasterData();
      console.log(this.Mode);
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

          let req = new SaveItemCategoryRequest();

          req.Result = this.selectedData;
          req.SaveType = AppConfig.SaveType_Delete;

          this.apiService.postData("SaveItemCategoryMaster", req).subscribe((data: ServiceReponse) => {
            if (data.SuccessCode == 1) {
              this.sessionService.showSuccess("ItemCategoryName deleted sucessfully");
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

  refreshClick() {
    this.cancelClick();
    this.loadDataGrid();
  }

  submitClick(isValid: boolean) {

    this.submitAttempt = true;

    if (isValid) {

      let req = new SaveItemCategoryRequest();
      req.Result = this.selectedDataGridItem;
      req.ItemTaxList = new Array();

      if (this.Mode == 'ADD') {
        req.SaveType = AppConfig.SaveType_Insert
      }
      else {
        req.SaveType = AppConfig.SaveType_Update
      }

      if (this.ItemCategoryTaxList != null && this.ItemCategoryTaxList.length >0)
      {
        this.ItemCategoryTaxList.forEach(d=> {
          let xItm = new TaxDetItemCat();
          xItm.EffectiveDateFrom = moment(d.EffectiveDateFrom).format(AppConfig.UPDATE_DATE_FORMAT);
          xItm.EffectiveDateTo = moment(d.EffectiveDateTo).format(AppConfig.UPDATE_DATE_FORMAT);
          xItm.ItemCategoryID = req.Result.ItemCategoryID;
          xItm.TaxID = d.TaxID;
          xItm.TaxValue = d.TaxValue;

          req.ItemTaxList.push(xItm);
        });
      }

      console.log(req);

      this.apiService.postData("SaveItemCategoryMaster", req).subscribe((data: ServiceReponse) => {
        if (data.SuccessCode == 1) {

          if (this.Mode == 'ADD') {
            this.sessionService.showSuccess("Material Category added successfully");
          }

          else if (this.Mode == 'EDIT') {
            this.sessionService.showSuccess("Material Category updated successfully");
          }

          this.refreshClick();
          this.Mode = 'HOME';
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

  DisableEdit(): boolean {

    if (this.selectedData != null) {
        return false;
    }
    else {
      return true;
    }

    
  }

  loadDialogMasters()
  {
    this.TaxList = new Array();
    let req = new TaxMasterGetAllRequest();
    this.apiService.postData("TaxGetByCorpID", req).subscribe((data: TaxMasterGetAllByCorpIDResponse) => {
      if (data.SuccessCode == 1) {
        this.TaxList = data.ResultList;
      }
      else
      {
        this.sessionService.showError(data.ErrorMessage);
      }
    });  

    
  }

  openCategoryDialog(nMode:string)
  {
    let dialogRef = this.dialog.open(CategoryTaxComponent, {
        data: {
          Mode: nMode,
          TaxList: this.TaxList,
          StatusList: this.StatusList1,
          selectedItem: this.selectedItemCategoryTax
        },
        height: '500px',
        width: '350px',
        disableClose: false,
    });

    dialogRef.afterClosed().subscribe(result => {
        if (result == 1) {
          if (nMode=='ADD') {
            console.log(this.sessionService.dialogItem);
            this.ItemCategoryTaxList.push(this.sessionService.dialogItem);            
            console.log(this.ItemCategoryTaxList);
          }
        }
        else
        {
          // do nothing
        }
    });


  }

  addtaxclick()
  {

      this.StatusList1 = this.sessionService.StatusListAll.filter(x=> x.StatusCode==10);
      this.selectedItemCategoryTax = new ItemCategoryTaxDetails();
      this.Mode1 = 'ADD';
      //this.openCategoryDialog('ADD');

  }

  edittaxclick()
  {

    if (this.dialogItem != null)
    {
      this.StatusList1 = this.sessionService.StatusListAll.filter(x=> x.StatusCode==10 || x.StatusCode == 20);
      this.selectedItemCategoryTax = this.commonService.cloneAny(this.dialogItem);      
      this.Mode1 = 'EDIT';
    }
      //this.openCategoryDialog('ADD');
  }


  updateTaxDetails(isValid:boolean)
  {
    this.submitAttempt1 = true;
    if (isValid)
    {
      if (this.Mode1 == 'ADD')
      {
        let nItm  = new ItemCategoryTaxDetails();
        nItm = this.commonService.cloneAny(this.selectedItemCategoryTax);
        let yItm = this.ItemCategoryTaxList.filter(x=> x.TaxCode == nItm.TaxCode && moment(x.EffectiveDateFrom).format(AppConfig.GRID_DATE_FORMAT) == moment(nItm.EffectiveDateFrom).format(AppConfig.GRID_DATE_FORMAT)) ;
       
        if (yItm == null || yItm == undefined || (yItm != null && yItm.length == 0))
        {
          this.RwID = this.RwID + 1;
          nItm.TaxDetID = this.RwID;

          if (this.commonService.getLengthNA(nItm.EffectiveDateFrom) > 0)
          {
            nItm.EffectiveDateFromStr = moment(nItm.EffectiveDateFrom).format(AppConfig.GRID_DATE_FORMAT);
          }
          if (this.commonService.getLengthNA(nItm.EffectiveDateTo) > 0)
          {
            nItm.EffectiveDateToStr = moment(nItm.EffectiveDateTo).format(AppConfig.GRID_DATE_FORMAT);
          }

          this.ItemCategoryTaxList.push(nItm);
          this.cancelTaxForm();
        }
        else
        {
          this.sessionService.showError('Tax Code & Effective Date is already exists ')
        }
      }
      else if (this.Mode1 == 'EDIT')
      {
        let nItm  = new ItemCategoryTaxDetails();
        nItm = this.commonService.cloneAny(this.selectedItemCategoryTax);
        let yFlag:boolean;
        yFlag = false;

        let yItm1 = this.ItemCategoryTaxList.filter(x=> x.TaxCode == nItm.TaxCode && moment(x.EffectiveDateFrom).format(AppConfig.GRID_DATE_FORMAT) == moment(nItm.EffectiveDateFrom).format(AppConfig.GRID_DATE_FORMAT) && x.TaxDetID != nItm.TaxDetID ) ;
        if (yItm1 != null && yItm1 != undefined && yItm1.length > 0)
        {
          yFlag = true;
        }

        if (yFlag == true)
        {
          this.sessionService.showError('Tax Code & Effective Date is already exists ')
        }
        else
        {
          this.ItemCategoryTaxList.forEach(x=> {
            if  (x.TaxDetID == nItm.TaxDetID)
            {
              x.EffectiveDateFrom = nItm.EffectiveDateFrom;
              x.TaxCode = nItm.TaxCode;
              x.TaxName = nItm.TaxName;
              x.TaxValue = nItm.TaxValue;
              x.StatusCode = nItm.StatusCode;

              if (this.commonService.getLengthNA(nItm.EffectiveDateFrom) > 0)
              {
                x.EffectiveDateFromStr = moment(nItm.EffectiveDateFrom).format(AppConfig.GRID_DATE_FORMAT);
              }
              if (this.commonService.getLengthNA(nItm.EffectiveDateTo) > 0)
              {
                x.EffectiveDateToStr = moment(nItm.EffectiveDateTo).format(AppConfig.GRID_DATE_FORMAT);
              }
            }
          });
          this.cancelTaxForm();
        }
        

      }

    }
  }

  cancelTaxForm()
  {
    this.Mode1 = 'HOME';
    this.submitAttempt1=false;
    this.selectedItemCategoryTax = null;
    this.dialogItem = null;
  }

  deleteTaxDetail()
  {
    if (this.dialogItem != null)
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
          let idx = this.ItemCategoryTaxList.findIndex(d=> d.TaxDetID == this.dialogItem.TaxDetID );
          if (idx != null)
          {
            this.ItemCategoryTaxList.splice(idx,1);
          }
        }
        else {
          this.selectedData = null;
        }
      });


    }
  }

  taxSelected(taxInfo:any)
  {
      if (taxInfo != null)
      {
          this.TaxList.forEach(x=>{
              if (x.TaxID == Number(taxInfo.ID))
              {
                  this.selectedItemCategoryTax.TaxCode = x.TaxCode;
                  this.selectedItemCategoryTax.TaxName = x.TaxName;
                  this.selectedItemCategoryTax.TaxID = x.TaxID;
              }
          });
      }
  }

  DisableEdit1(): boolean {

    if (this.dialogItem != null) {
        return false;
    }
    else {
      return true;
    }

  }



}
