import { Component, OnInit } from '@angular/core';
import { AppConfig, MasterStatus } from '../const/app.config';
import { WebApiService } from "../service/webapi.service";
import { SessionService } from "../service/session.service";
import { CommonService } from "../service/common.service";
import { MatDialog } from '@angular/material/dialog';
import { SalaryFields, Status, AdditionalFields, DeductionFields } from '../model/shared.model';
import { ConfirmDialogComponent } from '../common/confirmdialog.component';
import { ServiceRequest, SaveFPDeviceRequest } from '../model/request.model';
import { FPDeviceGetAllBySiteIDResponse, SaveReponse } from '../model/response.model';
import { FormGroup } from '@angular/forms';



@Component({
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.scss']
})

export class ConfigurationComponent implements OnInit {
  cols: any[];
  public Mode: string;
  public Mode1: string;
  public submitAttempt1: boolean;
  public Mode2: string;
  public submitAttempt2: boolean;
  public Mode3: string;
  public submitAttempt3: boolean;
  public selectedData: SalaryFields;
  public SalaryFieldsInfo: any[];
  public FormColumnsWidth: number;
  public SalaryFieldList: SalaryFields[];
  public SelectedSalaryField: SalaryFields;
  public SalaryFieldDetail: SalaryFields;
  public AdditionalFieldsInfo: any[];
  public AdditionalFieldList: AdditionalFields[];
  public SelectedAdditionalField: AdditionalFields;
  public AdditionalFieldDetail: AdditionalFields;
  public DeductionFieldsInfo: any[];
  public DeductionFieldList: DeductionFields[];
  public SelectedDeductionField: DeductionFields;
  public DeductionFieldDetail: DeductionFields;
  public IsPfApplicable: boolean;
  public IsEsiApplicable: boolean;
  public RwID: any;
  public StatusList1: Status[];

  constructor(public dialog: MatDialog, public sessionService: SessionService, private apiService: WebApiService,
    public commonService: CommonService) {
    this.FormColumnsWidth = 600;

  }

  ngOnInit() {
    this.Mode1 = 'HOME';
    this.submitAttempt1 = false;
    this.Mode3 = 'HOME';
    this.submitAttempt3 = false;
    this.Mode2 = 'HOME';
    this.submitAttempt2 = false;
    this.SalaryFieldList = new Array();
    this.AdditionalFieldList = new Array();
    this.DeductionFieldList = new Array();
    this.IsEsiApplicable = false;
    this.IsPfApplicable = false;
    this.RwID = 0;
    this.cancelAdditionalFieldForm();
    this.cancelSalaryFieldForm()

    this.SalaryFieldsInfo = [
      { field: 'FieldLableName', header: 'Field Lable Name', width: '30%', align: 'left', wrap: 'break-word' },
      { field: 'Percentage', header: 'Percentage(%)', width: '20%', align: 'left', wrap: 'break-word' },
      { field: 'IsPfApplicable', header: ' PF Applicable', width: '25%', align: 'left', wrap: 'break-word' },
      { field: 'IsEsiApplicable', header: ' ESI Applicable', width: '25%', align: 'left', wrap: 'break-word' },

    ]
    this.AdditionalFieldsInfo = [
      { field: 'FieldLableName', header: 'Field Lable Name', width: '50%', align: 'left', wrap: 'break-word' },
      { field: 'IsEsiApplicable', header: ' ESI Applicable', width: '50%', align: 'left', wrap: 'break-word' },

    ]
    this.DeductionFieldsInfo = [
      { field: 'FieldLableName', header: 'Field Lable Name', width: '100%', align: 'left', wrap: 'break-word' },
    ]

  }

  addSalaryFieldclick() {
    this.SalaryFieldDetail = new SalaryFields();
    this.Mode1 = 'ADD'

  }

  editSalaryFieldclick() {
    this.Mode1 = 'EDIT';
    if (this.SelectedSalaryField != null) {
      this.StatusList1 = this.sessionService.StatusListAll.filter(x => x.StatusCode == 10 || x.StatusCode == 20);
      this.SalaryFieldDetail = this.commonService.cloneAny(this.SelectedSalaryField);
      this.Mode1 = 'EDIT';
    }

  }

  updateSalaryFieldDetails(isValid: boolean) {
    this.submitAttempt1 = true;
    if (isValid) {

      if (this.Mode1 == 'ADD') {
        let nItm = new SalaryFields();
        nItm = this.commonService.cloneAny(this.SalaryFieldDetail);

        this.RwID = this.RwID + (-1);
        nItm.RwID = this.RwID;
        this.SalaryFieldList.push(nItm);


      }
      else if (this.Mode1 == 'EDIT') {
        let nItm = new SalaryFields();
        nItm = this.commonService.cloneAny(this.SalaryFieldDetail);
        this.SalaryFieldList.forEach(x => {
          if (x.RwID == nItm.RwID) {
            x.FieldLableName = nItm.FieldLableName;
            x.Percentage = nItm.Percentage;
            x.IsPfApplicable = nItm.IsPfApplicable;
            x.IsEsiApplicable = nItm.IsEsiApplicable;

          }
        });

      }
    }
    this.cancelSalaryFieldForm();

  }

  deleteSalaryFieldDetail() {

    if (this.SalaryFieldList != null) {
      let dialogRef = this.dialog.open(ConfirmDialogComponent, {
        data: {
          DialogHeader: 'Alert',
          DialogMessage: 'Are you sure you want to delete?'
        },
        disableClose: true,
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result == 1) {
          let idx = this.SalaryFieldList.findIndex(d => d.RwID == this.SelectedSalaryField.RwID);
          if (idx != null) {
            this.SalaryFieldList.splice(idx, 1);
          }
        }
        else {
          this.selectedData = null;
        }
      });
    }
  }

  cancelSalaryFieldForm() {
    this.submitAttempt1 = false;
    this.selectedData = null;
    this.SalaryFieldDetail = null;
    this.Mode1 = 'HOME';
  }

  hasError(form: FormGroup, control: any, errorCode: any): boolean {
    try {
      if (form != null) {
        if (control != null) {
          if (errorCode != null) {
            return form.controls[control].hasError(errorCode);
          }
          else {
            return false;
          }
        }
        else {
          return false;
        }
      }
      else {
        return false;
      }
    }
    catch {
      //console.log(form);
      //console.log(control);
    }
  }

  DisableEdit(): boolean {

    if (this.SelectedSalaryField != null) {
      return false;
    }
    else {
      return true;
    }
  }

  DisableEdit1(): boolean {

    if (this.SelectedAdditionalField != null) {
      return false;
    }
    else {
      return true;
    }
  }

  DisableEdit3(): boolean {

    if (this.SelectedDeductionField != null) {
      return false;
    }
    else {
      return true;
    }
  }

  addAdditionalFieldclick() {
    this.AdditionalFieldDetail = new AdditionalFields();
    this.Mode2 = 'ADD'

  }

  editAdditionalFieldclick() {
    this.Mode2 = 'EDIT';
    if (this.SelectedAdditionalField != null) {
      this.StatusList1 = this.sessionService.StatusListAll.filter(x => x.StatusCode == 10 || x.StatusCode == 20);
      this.AdditionalFieldDetail = this.commonService.cloneAny(this.SelectedAdditionalField);
      this.Mode2 = 'EDIT';
    }

  }

  updateAdditionalFieldDetails(isValid: boolean) {
    this.submitAttempt2 = true;
    if (isValid) {

      if (this.Mode2 == 'ADD') {
        let nItm = new AdditionalFields();
        nItm = this.commonService.cloneAny(this.AdditionalFieldDetail);

        this.RwID = this.RwID + (-1);
        nItm.RwID = this.RwID;
        this.AdditionalFieldList.push(nItm);


      }
      else if (this.Mode2 == 'EDIT') {
        let nItm = new AdditionalFields();
        nItm = this.commonService.cloneAny(this.AdditionalFieldDetail);
        this.AdditionalFieldList.forEach(x => {
          if (x.RwID == nItm.RwID) {
            x.FieldLableName = nItm.FieldLableName;
            x.IsEsiApplicable = nItm.IsEsiApplicable;

          }
        });

      }
    }
    this.cancelAdditionalFieldForm();

  }

  deleteAddditionalFieldDetail() {

    if (this.AdditionalFieldList != null) {
      let dialogRef = this.dialog.open(ConfirmDialogComponent, {
        data: {
          DialogHeader: 'Alert',
          DialogMessage: 'Are you sure you want to delete?'
        },
        disableClose: true,
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result == 1) {
          let idx = this.AdditionalFieldList.findIndex(d => d.RwID == this.SelectedAdditionalField.RwID);
          if (idx != null) {
            this.AdditionalFieldList.splice(idx, 1);
          }
        }
        else {
          this.selectedData = null;
        }
      });
    }
  }

  cancelAdditionalFieldForm() {
    this.submitAttempt2 = false;
    this.selectedData = null;
    this.AdditionalFieldDetail = null;
    this.Mode2 = 'HOME';
  }

  addDeductionFieldclick() {
    this.DeductionFieldDetail = new DeductionFields();
    this.Mode3 = 'ADD'

  }

  editDeductionFieldclick() {
    this.Mode3 = 'EDIT';
    if (this.SelectedDeductionField != null) {
      this.StatusList1 = this.sessionService.StatusListAll.filter(x => x.StatusCode == 10 || x.StatusCode == 20);
      this.DeductionFieldDetail = this.commonService.cloneAny(this.SelectedDeductionField);
      this.Mode3 = 'EDIT';
    }

  }

  updateDeductionFieldDetails(isValid: boolean) {
    this.submitAttempt3 = true;
    if (isValid) {

      if (this.Mode3 == 'ADD') {
        let nItm = new DeductionFields();
        nItm = this.commonService.cloneAny(this.DeductionFieldDetail);

        this.RwID = this.RwID + (-1);
        nItm.RwID = this.RwID;
        this.DeductionFieldList.push(nItm);


      }
      else if (this.Mode3 == 'EDIT') {
        let nItm = new DeductionFields();
        nItm = this.commonService.cloneAny(this.DeductionFieldDetail);
        this.DeductionFieldList.forEach(x => {
          if (x.RwID == nItm.RwID) {
            x.FieldLableName = nItm.FieldLableName;

          }
        });

      }
    }
    this.cancelDeductionFieldForm();

  }

  deleteDeductionFieldDetail() {

    if (this.DeductionFieldList != null) {
      let dialogRef = this.dialog.open(ConfirmDialogComponent, {
        data: {
          DialogHeader: 'Alert',
          DialogMessage: 'Are you sure you want to delete?'
        },
        disableClose: true,
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result == 1) {
          let idx = this.DeductionFieldList.findIndex(d => d.RwID == this.SelectedDeductionField.RwID);
          if (idx != null) {
            this.DeductionFieldList.splice(idx, 1);
          }
        }
        else {
          this.selectedData = null;
        }
      });
    }
  }

  cancelDeductionFieldForm() {
    this.submitAttempt3 = false;
    this.selectedData = null;
    this.DeductionFieldDetail = null;
    this.Mode3 = 'HOME';
  }


}
