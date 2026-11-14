import { ApplicationInitStatus, Component, Inject, OnInit } from '@angular/core';
import { AppConfig } from '../../const/app.config';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { StockInfo, StockDetailInfo, StockHistoryInfo, StockBalanceInfo } from 'src/app/model/shared.model';
import { SessionService } from 'src/app/service/session.service';
import { CommonService } from 'src/app/service/common.service';
import { WebApiService } from 'src/app/service/webapi.service';
import { StockDetailGetByStockIDResponse } from 'src/app/model/response.model';
import { ServiceRequest } from 'src/app/model/request.model';
import * as moment from 'moment';

@Component({
    templateUrl: './stockdetaildialog.component.html',
    styleUrls: ['./stockdetaildialog.component.css']
})

export class StockDetailDialogComponent implements OnInit {

    public selectedDataGridItem:StockInfo;

    public HistoryList:StockHistoryInfo[];
    public BalanceInfo:StockBalanceInfo[];
    public selectedData:StockHistoryInfo;

    public historyCols:any[];
    public balanceCols:any[];
  
    constructor(public dialogRef: MatDialogRef<StockDetailDialogComponent>,
        public dialog: MatDialog, public commonService: CommonService,
        @Inject(MAT_DIALOG_DATA) public DialogInputData: any,
        private apiService: WebApiService, public sessionService: SessionService) {

    }
      
      cancelClick() {        
          this.dialogRef.close(0);
      }
    
      ngOnInit() {
          this.selectedDataGridItem = this.DialogInputData.selectedData;
          console.log(this.selectedDataGridItem)
        
          this.historyCols = [     
            { field: 'TransDate', header: "Date", width: '10%', align: 'left',wrap: 'break-word'},
            { field: 'TransNumber', header: "DC Number", width: '10%', align: 'rigleftht',wrap: 'break-word'},
            { field: 'MovementFlag', header: "In/Out", width: '10%', align: 'left',wrap: 'break-word'},
            { field: 'CustomerFlag', header: "Description", width: '10%', align: 'left',wrap: 'break-word'},
            { field: 'Customer', header: "Supplier/Receiver", width: '10%', align: 'left',wrap: 'break-word'},
            { field: 'QuantityReceived', header: "Qty. Received", width: '10%', align: 'right',wrap: 'break-word'},            
            { field: 'QuantityDelivered', header: "Qty. Delivered", width: '10%', align: 'right',wrap: 'break-word'},
            { field: 'Comments', header: " ", width: '10%', align: 'left',wrap: 'break-word'}
        ];

        this.balanceCols = [     
            { field: 'QuantityOnHand', header: "Quantity On Hand", width: '15%', align: 'right',wrap: 'break-word'},
            { field: 'QuantityReceived', header: "Quantity Received", width: '15%', align: 'right',wrap: 'break-word'},
            { field: 'QuantityDelivered', header: "Quantity Delivered", width: '15%', align: 'right',wrap: 'break-word'},
            { field: 'ReturnedQuantity', header: "Returned Quantity",  width: '15%', align: 'right',wrap: 'break-word'},
            { field: 'ReservedQuantity', header: "Reserved Quantity",  width: '15%', align: 'right',wrap: 'break-word'},
            { field: 'ClosingStock', header: "Closing Stock",  width: '15%', align: 'right',wrap: 'break-word'}
        ];
          this.LoadMasterData();
      }
      
      LoadMasterData() {

          let req = new ServiceRequest();
          req.ID = this.selectedDataGridItem.StockID;

        this.apiService.postData("StockHistoryGetByStockID", req).subscribe((data: StockDetailGetByStockIDResponse) => {
            if (data.SuccessCode == 1) {
                this.HistoryList = data.ResultList;
                this.BalanceInfo = data.BalanceInfo;

                console.log(this.HistoryList);

                if (this.commonService.getLength(this.HistoryList)>0)
                {
                    this.HistoryList.forEach(x=> {
                        if (x.TransDate != null)
                        {
                            x.TransDate = moment(x.TransDate).format(AppConfig.GRID_DATE_FORMAT);
                        }
                    });
                }

                if (this.commonService.getLength(this.BalanceInfo)>0)
                {
                    this.BalanceInfo.forEach(x=> {
                        x.ClosingStock = (x.QuantityReceived - x.QuantityDelivered) + x.ReturnedQuantity;
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

    