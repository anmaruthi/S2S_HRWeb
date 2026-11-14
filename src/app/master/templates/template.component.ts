import { Component, OnInit, ViewChild } from '@angular/core';
import { AppConfig, MasterStatus } from '../../const/app.config';
import { TemplateInfo, FieldInfo } from "../../model/shared.model";
import { SessionService } from "../../service/session.service";
import { MatDialog } from '@angular/material/dialog';
import { CommonService } from "../../service/common.service";
import { ServiceReponse, MasterSMSEmailTemplateGetAllResponse, MasterSMSEmailTemplateMastersDataGetAllResponse } from '../../model/response.model';
import { SaveTemplateRequest } from '../../model/request.model';
import { ConfirmDialogComponent } from '../../common/confirmdialog.component';
import { WebApiService } from "../../service/webapi.service";
import { Editor } from "primeng/editor";

@Component({
    templateUrl: './template.component.html',
    styleUrls: ['./template.component.scss']
})

export class TemplateComponent implements OnInit {

  public cols: any[];
  public selectedDataGridItem: TemplateInfo;
  public dataGridList: TemplateInfo[];
  public ToolTipPosition: string;
  public selectedData: TemplateInfo;
  public Mode: string;
  public submitAttempt: boolean;
  public cols1: any[]; 

  public FieldList: FieldInfo[];
  public selectedField: FieldInfo;
  public TemplateTypeList: TemplateInfo[];
  public isBodyValid: boolean;
  
  cursorPosition: number = 0;
  cursorPositionSub: number = 0;

  public FormColumnsWidth : number;
  
  private quill: any;
  @ViewChild('Editor') editor: Editor;

  ngAfterViewInit() {
    this.quill = this.editor.getQuill();
    this.loadBodyText();    
  }

  constructor(public dialog: MatDialog, public sessionService: SessionService, 
    public commonService: CommonService, private apiService: WebApiService) 
  {
    this.FormColumnsWidth = 900;
  }

  ngOnInit() 
  {   
      this.Mode = 'HOME';

      this.loadDataGrid();
      
      this.cols = [
          { field: 'TemplateName', header: 'Template Name', width: '70%' },
          { field: 'TemplateTypeName', header:  'Template Type',  width: '22%' },
          { field: 'StatusMessage', header: 'Status',  width: '8%' }
      ];

      this.selectedDataGridItem = new TemplateInfo();
  }

  isRowSelected(): boolean {
    
    if (this.selectedData != undefined) {
        return true;
    }
    else {
        return false;        
    }

  }

  onKeyUp()
  {
    this.selectedData = null;
  }	

  loadBodyText() {
    
    if (this.selectedDataGridItem) {  
      if (this.selectedDataGridItem.IsBodyHtml == false) {
        this.quill.setText(this.selectedDataGridItem.Body);
      }
    }

  }

  loadDataGrid()
  {

    this.apiService.postData("MasterSMSEmailTemplateGetAll", null).subscribe((data: MasterSMSEmailTemplateGetAllResponse) => {
      if (data.SuccessCode == 1) {
        this.dataGridList = data.ResultList;      
      }
      else
      {
        this.sessionService.showError(data.ErrorMessage);
      }
    });

  }

  LoadMasterData(Mode:string) 
  {

    this.cursorPosition = 0;
    this.cursorPositionSub = 0;
 
     this.selectedField = new FieldInfo();
 
      if (this.commonService.getLength(this.FieldList) == 0 || this.commonService.getLength(this.TemplateTypeList) == 0 )
      {
        this.apiService.postData("MasterSMSEmailTemplateMastersDataGetAll", null).subscribe((data: MasterSMSEmailTemplateMastersDataGetAllResponse) => {
          if (data.SuccessCode == 1) {
            this.FieldList = data.FieldList;
            this.TemplateTypeList = data.TemplateTypeList;

            this.Mode = Mode;
          }
          else
          {
           this.sessionService.showError(data.ErrorMessage);
           this.cancelClick();
          }
        });    
      }
      else
      {
        this.Mode = Mode;
      }

      this.sessionService.scrollAdjust();

  }

  addClick() {
    this.selectedDataGridItem = new TemplateInfo();
    this.selectedDataGridItem.StatusCode = MasterStatus.Active;
    this.LoadMasterData('ADD');
  }

  onDoubleClick(rowData: TemplateInfo) {
    if (rowData != null) {
      this.selectedDataGridItem = Object.assign({}, rowData);
      this.LoadMasterData('EDIT');
    }
  }

  editClick() {
    this.onDoubleClick(this.selectedData);
  }

  refreshClick() {
    this.cancelClick();
    this.loadDataGrid();
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

          let req = new SaveTemplateRequest();

          req.ResultList = new TemplateInfo();
          req.ResultList.TemplateID = this.selectedData.TemplateID;
          req.SaveType = AppConfig.SaveType_Delete;

          this.apiService.postData("SaveTemplate", req).subscribe((data: ServiceReponse) => {
            if (data.SuccessCode == 1) {
              this.sessionService.showSuccess("Template deleted sucessfully");
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

  SubmitClick(isValid: boolean) {

    this.submitAttempt = true;

    this.isBodyValid = true;

    if (this.selectedDataGridItem.Body == null ||  this.selectedDataGridItem.Body.trim() == ' ') {
      this.isBodyValid = false;
      return;
    }
    
    if(this.selectedDataGridItem.TemplateType == 'S'){
      this.selectedDataGridItem.Subject = null;
    }

    if (isValid) {
      
      let req = new SaveTemplateRequest();
      req.ResultList = this.selectedDataGridItem;   

      if (this.Mode == 'ADD') {
        req.SaveType = AppConfig.SaveType_Insert;
      }
      else {
        req.SaveType = AppConfig.SaveType_Update;
      }

      this.apiService.postData("SaveTemplate", req).subscribe((data: ServiceReponse) => {
        if (data.SuccessCode == 1) {

          if (this.Mode == 'ADD') {
            this.sessionService.showSuccess("Template added successfully");
          }

          else if (this.Mode == 'EDIT') {
            this.sessionService.showSuccess("Template updated successfully");
          }

          this.refreshClick();

        }
        else {
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
    this.selectedData = null;
  }

  dragStart(event, itm: FieldInfo) {
    this.selectedField = itm;
  }

  dropInEditor(event) {
    let insertItem: string = ' ';

    if (this.selectedDataGridItem.Body == null) {
      this.selectedDataGridItem.Body = "";
    }

    if (this.selectedField != undefined) {
      insertItem = this.selectedField.PlaceHolder;
      this.quill.insertText(this.cursorPosition, insertItem, 'regular', true); 
    }

  }

  dragEnd(event) {

  }

  onTextChangeQuill() {

    if (this.quill.getSelection() != null) {
      this.cursorPosition = this.quill.getSelection().index;
    }
    
  }

}