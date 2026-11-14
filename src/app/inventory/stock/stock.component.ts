import { Component } from '@angular/core';
import { WebApiService } from "../../service/webapi.service";
import { SessionService } from "../../service/session.service";
import { CommonService } from "../../service/common.service";
import { AppConfig, MasterStatus} from "../../const/app.config";
import { HttpClient } from '@angular/common/http';
import { LoaderService } from '../../service/loader.service';
import { FormControl, FormGroup} from '@angular/forms';
import { Status, Master_Item, Master_ItemType, Master_UOM, StockInfo, ProjectDocuments, UpdateStockMaster } from "../../model/shared.model";
import { MatDialog } from "@angular/material/dialog";
import { ServiceReponse, ItemGetByCorpIDResponse, MasterData_SaveItem_GetAllResponse, StockGetBySiteIDResponse } from "../../model/response.model";
import { SaveItemRequest, StockForceUpdateRequest } from "../../model/request.model";
import { ConfirmDialogComponent } from '../../common/confirmdialog.component';
import { Router } from '@angular/router';
import { StockDetailDialogComponent } from './stockdetaildialog.component';
import { environment } from 'src/environments/environment';
import * as XLSX from 'xlsx';
import * as moment from 'moment';

@Component({
    templateUrl: './stock.component.html',
    styleUrls: ['./stock.component.scss']
})

export class StockComponent {

    public dataGridList: StockInfo[];
    public selectedData: StockInfo;
    public cols:any[];
    public Mode: string;
    public selectedDataGridItem: StockInfo;
    public FormColumnsWidth : number;

    public InwardRouterLink:string;
    public OutwardRouterLink:string;
    public MAX_PROJECT_DOCUMENT_SIZE:number;
    public selectedDoc:ProjectDocuments;
    public documentID: number;

    public stockUpdateJson:string;
    public stockUpdateFlag:number;
    public stockUpdateDate:string;

    public submitAttempt: boolean;

    constructor(public dialog: MatDialog,  private apiService: WebApiService,
        public sessionService: SessionService, private http: HttpClient,
        private router: Router,
        public commonService: CommonService,
        public loaderService: LoaderService
    ) 
    {
        this.FormColumnsWidth = 600; 
        this.MAX_PROJECT_DOCUMENT_SIZE = 2;
        this.documentID = 0;
        this.stockUpdateFlag = 0;
        this.submitAttempt = false;
    }

    ngOnInit() {
    
        this.Mode = 'HOME';

        let stockGroupMenu = this.sessionService.GroupMenuList.find(x=>x.GroupName == 'Store');

        console.log(stockGroupMenu);

        if(stockGroupMenu!=undefined){
            let inwardMenu = stockGroupMenu.MenuList.find(x=>x.MenuName =='Inward');
            if(inwardMenu!=undefined){
                this.InwardRouterLink = "/home/" + inwardMenu.RouterLink;
            }
            let outwardMenu = stockGroupMenu.MenuList.find(x=>x.MenuName =='Outward');
            if(outwardMenu!=undefined){
                this.OutwardRouterLink = "/home/" + outwardMenu.RouterLink;
            }
        }
    
        this.loadDataGrid();
    

        this.cols = [     
            { field: 'ItemName', header: "Material", width: '30%',align: 'left',wrap: 'break-word'},
            { field: 'ItemCode', header: "Part Number", width: '10%',align: 'left',wrap: 'break-word'},
            { field: 'QuantityOnHand', header: "Quantity On Hand", width: '10%', align: 'right',wrap: 'break-word'},
            { field: 'UOM', header: "Unit of Measurement", width: '10%', align: 'left',wrap: 'break-word'},
            { field: 'ItemPrice', header: "Rate/Unit", width: '10%', align: 'left',wrap: 'break-word'}
            // { field: 'TotalReserveQuantity', header: "Reserved Quantity", width: '10%', align: 'right',wrap: 'break-word'},
            // { field: 'TotalReserveQuantity', header: "Reserved Quantity", width: '10%', align: 'right',wrap: 'break-word'},
            // { field: 'TotalDeliveredQuantity', header: "Delivered Quantity",  width: '10%', align: 'right',wrap: 'break-word'},
            // { field: 'TotalAvailableQuantity', header: "Available Quantity",  width: '10%', align: 'right',wrap: 'break-word'}
        ];

    }

    isRowSelected(): boolean {

        if (this.selectedDataGridItem != null) {
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
        this.apiService.postData("StockGetBySiteID", null).subscribe((data: StockGetBySiteIDResponse) => {
            if (data.SuccessCode == 1) {
                this.dataGridList = data.ResultList;
            }
            else
            {
                this.sessionService.showError(data.ErrorMessage);
            }
        });
    }

    onDoubleClick(rowData:StockInfo){
        let dialogRef = this.dialog.open(StockDetailDialogComponent, {
            data:{
                selectedData:rowData
            },
            height: '80%',
            width: '80%',
            disableClose: false,
        });
    }
  
    cancelClick() {
        this.Mode = 'HOME';
    }
    
    refreshClick(){
        this.loadDataGrid();
    }

    getFile() {
        document.getElementById("xlUpdate").click();
    }

    ClearRq()
    {
        this.stockUpdateDate = null;
        this.stockUpdateFlag = 0;
        document.getElementById("file_upload").hidden = true;
    }

    StockUpdateRequest()
    {
        this.submitAttempt = true;
        if (this.stockUpdateDate != null)
        {
            let res:any;
            res =  document.getElementById("json-result").textContent;
            var jres = JSON.parse(res);

            let req = new StockForceUpdateRequest();
            req.ItemList = new Array();
            req.StockDate = moment(this.stockUpdateDate).format(); 

            if (jres.Sheet1 != null && jres.Sheet1.length >0)
            {
                jres.Sheet1.forEach(d=> {
                     let itm = new UpdateStockMaster();
                     itm.ItemCode = d.itemcode;
                     itm.ItemName = d.itemname;
                     itm.StockQuantity = d.stockquantity;
                     req.ItemList.push(itm);                    
                });
            }

            console.log(req);

            this.apiService.postData("StockUpdateByForce", req).subscribe((data: ServiceReponse) => {
                if (data.SuccessCode == 1) {
                    this.sessionService.showSuccess("Material stock update request placed successfully");
                }
                else {
                    this.sessionService.showError(data.ErrorMessage);
                }
            });


        }
        else
        {
            this.sessionService.showError('Date is required for stock update');
        }
       
    }

    //file handling
    chooseFile(event:any)
    {
        let documentList = event.target.files; 
        if(documentList.length > 0){
            let fileExtension = documentList[0].name.substr(documentList[0].name.lastIndexOf('.')+1);
            if(fileExtension == undefined){
                this.sessionService.showError("Invalid File");
                event.preventDefault();
                return;
            }

            if( ((documentList[0].size / 1024) / 1024) > this.MAX_PROJECT_DOCUMENT_SIZE){
                this.sessionService.showError('File size exceeds ' + this.MAX_PROJECT_DOCUMENT_SIZE + ' MB');
                event.preventDefault();
                return;
            }

            this.excelFileToJSON(documentList[0]);


        }
    }

    handleFileSelect(event:any, formControl: FormControl){
            
        console.log(this.MAX_PROJECT_DOCUMENT_SIZE);

        let documentList = event.target.files; 

        if(documentList.length > 0){

            let fileExtension = documentList[0].name.substr(documentList[0].name.lastIndexOf('.')+1);
            if(fileExtension == undefined){
                this.sessionService.showError("Invalid File");
                event.preventDefault();
                return;
            }

            if( ((documentList[0].size / 1024) / 1024) > this.MAX_PROJECT_DOCUMENT_SIZE){
                this.sessionService.showError('File size exceeds ' + this.MAX_PROJECT_DOCUMENT_SIZE + ' MB');
                event.preventDefault();
                return;
            }

            // if (this.commonService.getLength(this.selectedData.ProjectDocuments) > 0){
            //     let count = this.selectedData.ProjectDocuments.filter( itm => itm.StatusCode == MasterStatus.Active).length;
            //     if (count > this.MAX_PROJECT_DOCUMENT_UPLOAD){
            //         this.sessionService.showError('Exceeds maximum allowed files (' + this.MAX_PROJECT_DOCUMENT_UPLOAD + ' files)');
            //         event.preventDefault();
            //         return;
            //     }
            // }

            let formData = new FormData();

            formData.append('Authkey',  AppConfig.APP_AUTH_KEY);
            formData.append('CorpID', this.sessionService.CorpID.toString());
            formData.append('SiteID', this.sessionService.SiteID.toString());
            formData.append('UserID', this.sessionService.UserID.toString());
            formData.append('ActualFileName', documentList[0].name.toString());
            formData.append('SessionID', this.sessionService.SessionID);
            formData.append('file[]', documentList[0])

            this.loaderService.show();
            
            this.http
                .post(environment.WEBAPI_ENDPOINT + "DocumentUpload", formData).subscribe(
                (response:any) => {
                    this.loaderService.hide();
                    var res = response.json();
                    if (res.SuccessCode == 1) {
                        this.documentID += -1;

                        let newDocument = new ProjectDocuments();
                        newDocument.DocumentID = this.documentID;
                        newDocument.DocumentPath = res.FolderPath;
                        newDocument.FileName = documentList[0].name.toString();
                        newDocument.StatusCode = MasterStatus.Active;

                        let isValidDoc : boolean = false;

                        if (res.FileExtension == ".xls" || res.FileExtension == ".xlsx" )
                        {
                            isValidDoc = true;

                            var reader = new FileReader();
                            reader.readAsDataURL(documentList[0]); // read file as data url
                            reader.onload = (eventData:any) => { // called once readAsDataURL is completed
                                newDocument.DocumentImage = eventData.target.result;
                            }   
                        }                       

                        // this.selectedData.ProjectDocuments.push(newDocument);

                        this.selectedDoc = newDocument;

                        //

                        var ele = document.getElementById('imageClearbutton');

                        if (ele != null)
                        {
                            ele.click();
                        }

                    }
                    else{
                        this.sessionService.showError(res.ErrorMessage);
                    }
                },
                error => {
                    this.loaderService.hide();
                }
            );
            
        }
        
    } 

    //Method to read excel file and convert it into JSON 
    excelFileToJSON(file){
        try {
          var reader = new FileReader();
          reader.readAsBinaryString(file);
          reader.onload = function(e) {

              var data = e.target.result;
              var workbook = XLSX.read(data, {
                    type : 'binary'
                });
              var result = {};
              workbook.SheetNames.forEach(function(sheetName) {
                var roa = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
                if (roa.length > 0) {
                    result[sheetName] = roa;
                }
              });

              //displaying the json result

              var resultEle = document.getElementById("json-result");
              resultEle.innerHTML = JSON.stringify(result, null, 4);
              resultEle.style.display='block';

              document.getElementById("file_upload").hidden = false;
                           
            }
            
        }catch(e){
            console.error(e);
        }
        finally {
            this.stockUpdateFlag = 1; 
        }

    }


}
