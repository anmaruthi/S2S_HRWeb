import { Component } from '@angular/core';
import { WebApiService } from "../../service/webapi.service";
import { SessionService } from "../../service/session.service";
import { CommonService } from "../../service/common.service";
import { AppConfig, MasterStatus } from "../../const/app.config";
import { LoaderService } from '../../service/loader.service';
import { FormGroup } from '@angular/forms';
import { Status, Master_Item, Master_ItemType, Master_UOM, StockInfo } from "../../model/shared.model";
import { MatDialog } from "@angular/material/dialog";
import { ServiceReponse, ItemGetByCorpIDResponse, MasterData_SaveItem_GetAllResponse, StockGetBySiteIDResponse } from "../../model/response.model";
import { SaveItemRequest } from "../../model/request.model";
import { ConfirmDialogComponent } from '../../common/confirmdialog.component';
import { Router } from '@angular/router';


@Component({
    templateUrl: './reorderlevel.component.html',
    styleUrls: ['./reorderlevel.component.scss']
})

export class ReOrderLevelComponent {

    public dataGridList: StockInfo[];
    public selectedData: StockInfo;
    public cols: any[];
    public Mode: string;
    public selectedDataGridItem: StockInfo;
    public FormColumnsWidth: number;

    public InwardRouterLink: string;
    public OutwardRouterLink: string;

    constructor(public dialog: MatDialog, private apiService: WebApiService,
        public sessionService: SessionService,
        private router: Router,
        public commonService: CommonService,
        public loaderService: LoaderService
    ) {
        this.FormColumnsWidth = 600;
    }

    ngOnInit() {

        this.Mode = 'HOME';

        let stockGroupMenu = this.sessionService.GroupMenuList.find(x => x.GroupName == 'Store');

        console.log(stockGroupMenu);

        this.loadDataGrid();


        this.cols = [
            { field: 'ItemName', header: "Material", width: '30%', align: 'left', wrap: 'break-word' },
            { field: 'QuantityOnHand', header: "Quantity On Hand", width: '10%', align: 'right', wrap: 'break-word' },
            { field: 'ReservedQuantity', header: "Reorder Level Qty", width: '10%', align: 'right', wrap: 'break-word' },
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

    onKeyUp() {
        this.selectedDataGridItem = null;
    }

    loadDataGrid() {
        this.apiService.postData("ReorderLevelGetBySiteID", null).subscribe((data: StockGetBySiteIDResponse) => {
            if (data.SuccessCode == 1) {
                this.dataGridList = data.ResultList;
            }
            else {
                this.sessionService.showError(data.ErrorMessage);
            }
        });
    }

    // onDoubleClick(rowData:StockInfo){
    //     let dialogRef = this.dialog.open(StockDetailDialogComponent, {
    //         data:{
    //             selectedData:rowData
    //         },
    //         height: '80%',
    //         width: '60%',
    //         disableClose: false,
    //     });
    // }

    cancelClick() {
        this.Mode = 'HOME';
    }

    refreshClick() {
        this.loadDataGrid();
    }

}
