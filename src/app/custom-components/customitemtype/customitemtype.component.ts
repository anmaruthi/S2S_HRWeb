import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { WebApiService } from "../../service/webapi.service";
import { SessionService } from "../../service/session.service";
import { CommonService } from "../../service/common.service";
import { AppConfig, MasterStatus} from "../../const/app.config";
import { LoaderService } from '../../service/loader.service';
import { FormGroup} from '@angular/forms';
import { Status, Master_Item, Master_ItemType, Master_UOM, Master_Item_PUOM, ItemTypeInfo, ItemCategoryInfo } from "../../model/shared.model";
import { MatDialog } from "@angular/material/dialog";
import { ServiceReponse, ItemGetByCorpIDResponse, MasterData_SaveItem_GetAllResponse, SaveReponse } from "../../model/response.model";
import { SaveItemRequest, SaveItemTypeRequest } from "../../model/request.model";
import { ConfirmDialogComponent } from '../../common/confirmdialog.component';

@Component({
    selector: 'custom-itemtype',
    templateUrl: './customitemtype.component.html',
    styleUrls: ['./customitemtype.component.scss']
})

export class CustomItemTypeComponent {

    public formGroup: FormGroup;
    public submitAttempt: boolean;
    @Input('Mode') Mode: string;
    @Input('selectedItem') selectedDataGridItem: ItemTypeInfo;
    @Input('itemCategoryList') categoryList:ItemCategoryInfo[]; 
    public StatusList:Status[];
    
    @Output() public cancelClicked : EventEmitter<any> = new EventEmitter();
    @Output() public saveCompleted : EventEmitter<any> = new EventEmitter();

    @ViewChild('ItemTypeName') ItemTypeName:ElementRef; 
    
    constructor(public dialog: MatDialog,  private apiService: WebApiService,
        public sessionService: SessionService, 
        public commonService: CommonService,
        public loaderService: LoaderService
    ) 
    {

    }

    ngOnInit() {

        //this.categoryList = [];       
        this.StatusList = this.sessionService.StatusList;
        this.loadMasterData(this.Mode);
    }

    ngAfterViewInit()
    {
        console.log(this.Mode);
        console.log(this.selectedDataGridItem);  
    }

    loadMasterData(Mode: string) {

      // this.apiService.postData("ItemCategoryGetByCorpID", null).subscribe((data: ColorGetByCorpIDResponse) => {
      //   if (data.SuccessCode == 1) {
      //     this.dataGridList = data.ResultList;
      //   }
      //   else
      //   {
      //     this.sessionService.showError(data.ErrorMessage);
      //   }
      // });    
  

        if (this.Mode == 'ADD') {
            this.StatusList = this.sessionService.ActiveStatusList;
        }
        else
        {
          this.StatusList = this.sessionService.StatusList;
        }
        
        //this.sessionService.scrollAdjust();
        this.ItemTypeName.nativeElement.focus();
    }


    SubmitClick(isValid:boolean) {
        
        this.submitAttempt = true;

        if (isValid) {
    
          let req = new SaveItemTypeRequest();
          req.Result = this.selectedDataGridItem;
    
          if (this.Mode == 'ADD') {
            req.SaveType = AppConfig.SaveType_Insert
          }
          else {
            req.SaveType = AppConfig.SaveType_Update
          }
    
          this.apiService.postData("SaveItemType", req).subscribe((data: SaveReponse) => {
            if (data.SuccessCode == 1) {
    
              if (this.Mode == 'ADD') {
                this.sessionService.showSuccess("Item Type added successfully");
              }
    
              else if (this.Mode == 'EDIT') {
                this.sessionService.showSuccess("Item Type updated successfully");
              }
              console.log(data);
                this.selectedDataGridItem.ItemTypeID = data.ID;
                this.saveCompleted.emit(this.selectedDataGridItem);
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
        this.submitAttempt = false;
        this.selectedDataGridItem = null;
        this.cancelClicked.emit();
    }
    

}
