import { Component, OnInit } from '@angular/core';
import { AppConfig, MasterStatus } from '../../const/app.config';
import { WebApiService } from "../../service/webapi.service";
import { Status, MasterComponentFields, Master_ComponentFields_GetAll_ByCorpIDResult, Master_LookUp, Master_ComponentFieldType } from "../../model/shared.model";
import { SessionService } from "../../service/session.service";
import { CommonService } from "../../service/common.service";
import { MatDialog } from '@angular/material/dialog';
import { ServiceReponse, ComponentFieldsGetByCorpIDResponse } from '../../model/response.model';
import { SaveComponentFieldsRequest } from '../../model/request.model';
import { ConfirmDialogComponent } from '../../common/confirmdialog.component';

@Component({
  templateUrl: './componentfields.component.html',
  styleUrls: ['./componentfields.component.css']
})

export class ComponentFieldsComponent implements OnInit {

    cols: any[];
    typeids: any[];

    public selectedDataGridItem: MasterComponentFields;
    public selectedData: MasterComponentFields;
    public dataGridList: Master_ComponentFields_GetAll_ByCorpIDResult[];
    public ComponentTypeList: Master_LookUp[]; 
    public ComponentFieldTypeList:Master_ComponentFieldType[];
    public Mode: string;
    public StatusList: Status[];
    public submitAttempt: boolean;

    public FormColumnsWidth: number;

  constructor(public dialog: MatDialog, public sessionService: SessionService, private apiService: WebApiService,
    public commonService: CommonService) {
    this.FormColumnsWidth = 600;
  }

  ngOnInit() {
    
    this.Mode = 'HOME';
    this.submitAttempt = false;
    this.loadDataGrid();

    this.cols = [
      { field: 'FieldName', header: 'Field Name', width: '35%', align: 'left', wrap: 'break-word' },
      { field: 'FieldDescription', header: 'Field Description', width: '35%', align: 'left', wrap: 'break-word' },
      { field: 'SortOrder', header: 'Sort Order', width: '10%', align: 'right', wrap: 'break-word' },
      { field: 'IsDefaultText', header: 'Is Default', width: '10%', align: 'left', wrap: 'break-word' },
      { field: 'StatusMessage', header: 'Status', width: '8%', align: 'left', wrap: 'break-word' }
    ];

    this.typeids = [
      { id: 1, description: 'Yarn' },
      { id: 2, description: 'Knit' }
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

    this.apiService.postData("ComponentFieldsGetByCorpID", null).subscribe((data: ComponentFieldsGetByCorpIDResponse) => {
      if (data.SuccessCode == 1) {
        this.dataGridList = data.ResultList;
        this.ComponentTypeList = data.ComponentTypeList;
        this.ComponentFieldTypeList = data.ComponentFieldTypeList;

        if (this.dataGridList != null && this.dataGridList.length>0)
        {
                    this.dataGridList.forEach(x=> {
                     
                        if (x.IsDefault == true)
                        {
                            x.IsDefaultText = 'Yes';
                        }
                        else
                        {
                             x.IsDefaultText = 'No';
                        }

                        x.TypeIDs = [];

                        if (x.TypeID != null)
                        {
                          x.TypeID.split(',').forEach(d=> {
                            x.TypeIDs.push(Number(d));
                          });
                        }

                    });
          }

          if (this.commonService.getLength(this.ComponentTypeList) == 0)
          {
            this.ComponentTypeList = new Array();
          }

          let nLookup = new Master_LookUp();
          nLookup.DomainID = 1;
          nLookup.Description = 'Common';
          nLookup.LookupID = 0;

          this.ComponentTypeList.unshift(nLookup);
        
      }
      else
      {
        this.sessionService.showError(data.ErrorMessage);
      }
    });    


  }

  loadMasterData(){
    if (this.Mode == 'ADD') {
        this.StatusList = this.sessionService.ActiveStatusList;        
    }
    else
    {
      this.StatusList = this.sessionService.StatusList;
    }
    
    this.sessionService.scrollAdjust();
  }

  addClick() {
    this.selectedDataGridItem = new MasterComponentFields();
    this.selectedDataGridItem.StatusCode = MasterStatus.Active;
    this.Mode = 'ADD';
    this.loadMasterData();
  }

  editClick() {
    this.onDoubleClick(this.selectedData);
  }

  onDoubleClick(rowData: MasterComponentFields) {
    if (rowData != null) {
      this.selectedDataGridItem = Object.assign({}, rowData);
      this.Mode = 'EDIT';
      this.loadMasterData();
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

          let req = new SaveComponentFieldsRequest();

          req.Result = new MasterComponentFields();

          req.Result.FieldID = this.selectedData.FieldID;
          req.SaveType = AppConfig.SaveType_Delete;

          this.apiService.postData("SaveComponentFields", req).subscribe((data: ServiceReponse) => {
            if (data.SuccessCode == 1) {
              this.sessionService.showSuccess("Component fields deleted sucessfully");
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

  refreshClick(){
    this.cancelClick();
    this.loadDataGrid();
  }

  SubmitClick(isValid: boolean) {

    this.submitAttempt = true;

    if (isValid) {
      this.selectedDataGridItem.TypeID = null;

      if (this.commonService.getLength(this.selectedDataGridItem.TypeIDs) > 0)
      {
        
        this.selectedDataGridItem.TypeIDs.forEach(x=> {
          if (this.selectedDataGridItem.TypeID != null)
          {
            this.selectedDataGridItem.TypeID = this.selectedDataGridItem.TypeID  + ',' + x.toString();
          }
          else
          {
            this.selectedDataGridItem.TypeID = x.toString();
          }

        });
      }

      let req = new SaveComponentFieldsRequest();
      req.Result = this.selectedDataGridItem;
      
      if (this.Mode == 'ADD') {
        req.SaveType = AppConfig.SaveType_Insert
      }
      else {
        req.SaveType = AppConfig.SaveType_Update
      }

      console.log(req);
      
      this.apiService.postData("SaveComponentFields", req).subscribe((data: ServiceReponse) => {
        if (data.SuccessCode == 1) {

          if (this.Mode == 'ADD') {
            this.sessionService.showSuccess("Component fields added successfully");
          }

          else if (this.Mode == 'EDIT') {
            this.sessionService.showSuccess("Component fields updated successfully");
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

}
