import { Component, OnInit } from '@angular/core';
import { AppConfig, MasterStatus } from '../../const/app.config';
import { WebApiService } from "../../service/webapi.service";
import { MasterHoliday, Status, MasterHolidayType, MasterHolidayYear } from "../../model/shared.model";
import { SessionService } from "../../service/session.service";
import { CommonService } from "../../service/common.service";
import { MatDialog } from '@angular/material/dialog';
import { MasterHolidayGetAllByCorpIDResponse, ServiceReponse } from '../../model/response.model';
import { MasterHolidayGetAllRequest, SaveHolidayRequest, SaveReasonCategoryRequest } from '../../model/request.model';
//import { SettingDialogComponent } from '../settings/settingdialog.component';
import { ConfirmDialogComponent } from '../../common/confirmdialog.component';
import { yearsPerPage } from '@angular/material/datepicker';
import * as moment from 'moment';


@Component({
  selector: 'app-holidays',
  templateUrl: './holidays.component.html',
  styleUrls: ['./holidays.component.scss']
})
export class HolidaysComponent implements OnInit {
  cols: any[];

  public selectedDataGridItem: MasterHoliday;
  public selectedData: MasterHoliday;
  public dataGridList: MasterHoliday[];

  public HolidayTypeList: MasterHolidayType[];
  public HolidayYear: MasterHolidayYear[];
  public selectedHolidayYear: MasterHolidayYear;
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

    this.HolidayYear = new Array();
    let yrItm = new MasterHolidayYear();
    yrItm = new MasterHolidayYear();
    yrItm.Year = 2022;
    this.HolidayYear.push(yrItm);
    yrItm = new MasterHolidayYear();
    yrItm.Year = 2023;
    this.HolidayYear.push(yrItm);

    this.selectedHolidayYear = new MasterHolidayYear();
    this.selectedHolidayYear.Year = 2022;

    
    this.cols = [
      { field: 'Holiday', header: 'Holiday', width: '25%', align: 'left', wrap: 'break-word' },
      { field: 'HolidayDescription', header: 'Description', width: '25%', align: 'left', wrap: 'break-word' },
      { field: 'HolidayType', header: 'HolidayType', width: '25%', align: 'left', wrap: 'break-word' },
      { field: 'StatusMessage', header: 'Status', width: '25%', align: 'left', wrap: 'break-word' }
    ];

    this.loadDataGrid();

  }

  onYearChange()
  {
    this.loadDataGrid();
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
    
    let req = new MasterHolidayGetAllRequest();
    req.HolidayYear = this.selectedHolidayYear.Year;


    this.apiService.postData("MasterHolidayGetByCorpID", req).subscribe((data: MasterHolidayGetAllByCorpIDResponse) => {
      if (data.SuccessCode == 1) {
        this.dataGridList = data.ResultList;
        this.HolidayTypeList = data.HolidayTypeList;

        if (this.dataGridList != null && this.dataGridList.length > 0 )
        {
          this.dataGridList.forEach( itm => {
 
            if (this.commonService.getLengthNA(itm.HolidayDate) > 0)
              {
                  itm.HolidayDate = moment(itm.HolidayDate).format(AppConfig.GRID_DATE_FORMAT);
              }
           
           });

        }
        
      }
      else {
        this.sessionService.showError(data.ErrorMessage);
      }
    });

  }

  loadMasterData() {

    let req = new MasterHolidayGetAllRequest();

    if (this.Mode == 'ADD') {
      this.StatusList = this.sessionService.StatusListAll.filter(x => x.StatusCode == 10);
    }
    else {
      this.StatusList = this.sessionService.StatusListAll;
    }

    this.sessionService.scrollAdjust();
  }

  addClick() {
      this.selectedDataGridItem = new MasterHoliday();
      this.selectedDataGridItem.StatusCode = MasterStatus.Active;
      this.Mode = 'ADD';
      this.loadMasterData();
  }

  editClick() {
      this.Mode = 'EDIT';
      this.onDoubleClick(this.selectedData);
  }

  onDoubleClick(rowData: MasterHoliday) {
      if (rowData != null) {
        this.selectedDataGridItem = Object.assign({}, rowData);
        this.selectedDataGridItem.HolidayDate = moment(rowData.HolidayDate).format();
        this.Mode = 'EDIT';
        this.loadMasterData();
        console.log(rowData);
        console.log(this.selectedDataGridItem);
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

            let req = new SaveHolidayRequest();
            req.Result = this.selectedData;
            req.SaveType = AppConfig.SaveType_Delete;

            console.log(req);

            this.apiService.postData("SaveHoliday", req).subscribe((data: ServiceReponse) => {
              if (data.SuccessCode == 1) {
                this.sessionService.showSuccess("Holiday deleted sucessfully");
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

        let req = new SaveHolidayRequest();
        req.Result = this.selectedDataGridItem;

        console.log(req);

        if (this.Mode == 'ADD') {
          req.SaveType = AppConfig.SaveType_Insert
        }
        else {
          req.SaveType = AppConfig.SaveType_Update
        }

        console.log(req);

        this.apiService.postData("SaveHoliday", req).subscribe((data: ServiceReponse) => {
          if (data.SuccessCode == 1) {

            if (this.Mode == 'ADD') {
              this.sessionService.showSuccess("Holiday added successfully");
            }

            else if (this.Mode == 'EDIT') {
              this.sessionService.showSuccess("Holiday updated successfully");
            }

            this.refreshClick();
            this.Mode = 'HOME';
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





}
