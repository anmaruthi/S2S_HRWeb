import { Component, OnInit } from '@angular/core';
import { AppConfig, MasterStatus} from '../../const/app.config';
import { WebApiService } from "../../service/webapi.service";
import { Status, State, Country, VendorMasterInfo } from "../../model/shared.model";
import { SessionService } from "../../service/session.service";
import { CommonService } from "../../service/common.service";
import { MatDialog } from '@angular/material/dialog';
import { MasterData_RegisterCorp_GetAllResponse, Master_VendorGetByCorpIDResponse, ServiceReponse } from '../../model/response.model';
import { SaveVendorRequest } from '../../model/request.model';
import { ConfirmDialogComponent } from '../../common/confirmdialog.component';

@Component({
  templateUrl: './vendormaster.component.html',
  styleUrls: ['./vendormaster.component.scss']
})

export class VendorMasterComponent implements OnInit {

  public submitAttempt:boolean;
  public selectedDataGridItem:VendorMasterInfo;
  public selectedData:VendorMasterInfo;
  public Mode:string;

  public dataGridList:VendorMasterInfo[];
  public cols:any[];

  public CountryList:Country[];
  public StateList:State[];
  public StateListFiltered:State[];
  public StatusList:Status[];

  public FormColumnsWidth : number;
  
    constructor(public dialog: MatDialog, public sessionService: SessionService, private apiService: WebApiService,
      public commonService: CommonService) {

        this.FormColumnsWidth = 600;

    }
  
    ngOnInit() {

      this.Mode = 'HOME';

      this.loadDataGrid();

      this.cols =[
        { field: 'VendorName', header: 'Vendor Name', width: '27%', align: 'left', wrap: 'break-word' },
        { field: 'SPOC', header: 'SPOC', width: '27%', align: 'left', wrap: 'break-word' },
        { field: 'MobileNumber', header: 'Mobile', width: '9%', align: 'left', wrap: 'break-word' },
        { field: 'Email', header: 'Email', width: '22%', align: 'left', wrap: 'break-word' },
        { field: 'City', header: 'City', width: '10%', align: 'left', wrap: 'break-word' },
        { field: 'StatusMessage', header: 'Status', width: '8%', align: 'left', wrap: 'break-word' }
      ];
      
    }
    
    loadDataGrid(){

      this.apiService.postData('Master_VendorGetByCorpID',null).subscribe((data:Master_VendorGetByCorpIDResponse) => {
        if(data.SuccessCode == 1){
          this.dataGridList = data.ResultList;
        }
        else{
          this.sessionService.showError(data.ErrorMessage);
        }
      });

    }

    loadMasterData(Mode:string){

      if (Mode == 'ADD') {
          this.StatusList = this.sessionService.ActiveStatusList;
      }
      else
      {
        this.StatusList = this.sessionService.StatusList;
      }
      
      this.CountryList = this.sessionService.CountryList;
      this.StateList = this.sessionService.StateList;
  
      if (Mode != 'ADD') {
        this.onCountrySelect();
      }
  
      this.Mode = Mode;

      // if (this.commonService.getLength(this.CountryList) == 0 || this.commonService.getLength(this.StateList) == 0 )
      // {
  
      //   this.apiService.postData("MasterData_RegisterCorp_GetAll", null).subscribe((data: MasterData_RegisterCorp_GetAllResponse) => {
      //   if (data.SuccessCode == 1) {
        
      //       this.StateList = data.StateList;
      //       this.CountryList = data.CountryList;
             
      //       if (Mode != 'ADD') {
      //         this.onCountrySelect();
      //       }
  
      //       this.Mode = Mode;
      //     }
      //     else
      //     {
      //       this.sessionService.showError(data.ErrorMessage);
      //       this.cancelClick();
      //     }
      //   });
  
      // }
      // else
      // {
      //   if (Mode != 'ADD') {
      //     this.onCountrySelect();
      //   }
  
      //   this.Mode = Mode;
      // }

      this.sessionService.scrollAdjust();
    }

    onCountrySelect(){
      this.StateListFiltered = [];
      if (this.commonService.getLengthNA(this.selectedDataGridItem.CountryCode) > 0) {
        if (this.commonService.getLength(this.StateList) > 0)
        {
          this.StateListFiltered = this.StateList.filter(x => x.CountryCode == this.selectedDataGridItem.CountryCode);
          let currCountry = this.CountryList.find(itm => itm.CountryCode == this.selectedDataGridItem.CountryCode);
          this.selectedDataGridItem.CurrencyCode = currCountry.CurrencyCode;
        }
        else{
          this.selectedDataGridItem.StateID = null;
        }
      }
    }

    addClick(){
      this.selectedDataGridItem = new VendorMasterInfo();
      this.selectedDataGridItem.StatusCode = MasterStatus.Active;
      this.loadMasterData('ADD');
    }

    editClick(){
      this.onDoubleClick(this.selectedData);
    }

    onDoubleClick(rowData: VendorMasterInfo){
      if(rowData != null){
        this.selectedDataGridItem = Object.assign({},rowData);
        this.loadMasterData('EDIT');
      }
    }
    
    deleteClick(){
      if(this.selectedData != null){

        let dialogRef = this.dialog.open(ConfirmDialogComponent,{
          data:{
            DialogHeader: 'Alert',
            DialogMessage: 'Are you sure you want to delete?'
          },
          disableClose:true,
        });

        dialogRef.afterClosed().subscribe(result =>{
          if(result == 1){

            let req = new SaveVendorRequest();

            req.Result = new VendorMasterInfo();  

            req.Result.VendorID = this.selectedData.VendorID;

            req.SaveType = AppConfig.SaveType_Delete;
  
            this.apiService.postData("SaveVendor", req).subscribe((data: ServiceReponse) => {
              if (data.SuccessCode == 1) {
                this.sessionService.showSuccess("Vendor Master deleted sucessfully..");
                this.loadDataGrid();
                this.selectedData = null;
              }
              else {
                this.sessionService.showError(data.ErrorMessage);
              }
            });
          }
          else{
            this.selectedData = null;
          }
        });

      }
    }

    RefreshClick(){
      this.cancelClick();
      this.loadDataGrid();
    }

    SubmitClick(isValid:boolean){
      this.submitAttempt = true;

      if(isValid){

        if (this.selectedDataGridItem.CountryCode == 'IND')
        {
          if (this.selectedDataGridItem.CurrencyCode != 'INR')
          {
            this.sessionService.showError("Invalid currency code for selected country");
            return;
          }
          if(this.commonService.getLengthNA(this.selectedDataGridItem.Pincode) != 6){
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

        let req = new SaveVendorRequest();
        req.Result = this.selectedDataGridItem;  
        
        if(req.Result.GSTIN != null && req.Result.GSTIN.length > 0){

          req.Result.GSTIN = req.Result.GSTIN.toUpperCase();

          if(req.Result.GSTIN.substring(0,2) != this.StateList.find(x => x.StateID == req.Result.StateID).TIN){
            this.sessionService.showError("Invalid GST Number. Please check state code.");
            return;
          }

          if(req.Result.GSTIN.substring(2,12) != req.Result.PAN){
            this.sessionService.showError("Invalid GST Number. Please check PAN and GST Number.");
            return;
          }

        }

        req.SaveType = this.Mode == 'ADD' ? AppConfig.SaveType_Insert : AppConfig.SaveType_Update;

        this.apiService.postData("SaveVendor", req).subscribe((data: ServiceReponse) => {
          if (data.SuccessCode == 1) {
            this.sessionService.showSuccess(this.Mode == 'ADD' ? "Vendor Master added successfully" : "Vendor Master updated successfully");
            this.Mode = 'HOME';
            this.RefreshClick();       
          }
          else
          {
            this.sessionService.showError(data.ErrorMessage);
          }
        });

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
