import { Component, OnInit } from '@angular/core';
import { AppConfig, MasterStatus } from '../const/app.config';
import { WebApiService } from "../service/webapi.service";
import { SessionService } from "../service/session.service";
import { CommonService } from "../service/common.service";
import { LoaderService } from '../service/loader.service';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { FP_Devices, Status, Employee, EmployeeDesignation, EmployeeDepartment, EmployeeGroup, EmployeeCategory, EmployeeType, GenderInfo, Country, State, PersonalInfo, AddressInfo, EmpFamilyInfo, EmpEducationInfo, RelaionShipListInfo, QualificationListInfo, Bank, BankInfo, KYCInfo, KYCDocInfo, Married, OTFlag, MasterReason, AccountType, ProjectDocuments } from '../model/shared.model';
import { ConfirmDialogComponent } from '../common/confirmdialog.component';
import { ServiceRequest, SaveFPDeviceRequest, SaveEmployeeRequest, SaveEmployeePersonalInfoRequest, SaveEmployeeBankInfoRequest, BulkEmployeeUpdateRequest } from '../model/request.model';
import { EmpDesignationListGetBySiteIDResponse, MasterDataEmployeeGetAllResponse, MasterData_PersonalInfoGetByEmpID, ServiceReponse } from '../model/response.model';
import { FormGroup, FormControl } from '@angular/forms';
import * as moment from 'moment';
import { environment } from 'src/environments/environment';
import { NativeDateModule } from '@angular/material/core';
import { repeat } from 'rxjs';
import * as XLSX from 'xlsx';

@Component({
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss']
})

export class EmployeeComponent implements OnInit {
  cols: any[];
  public Mode: string;
  public Mode1: string;
  public Mode2: string;
  public Mode3: string;
  public Mode4: string;
  public Mode5: string;
  public FormColumnsWidth: number;
  // public StatusList1: Status[];
  public dataGridList: Employee[];
  public submitAttempt: boolean;
  public selectedData: Employee;
  public selectedDataGridItem: Employee;
  public StatusList: Status[];
  public EmployeeCategoryList: EmployeeCategory[];
  public SelectedCategory: EmployeeCategory;
  public EmployeeTypeList: EmployeeType[];
  public SelectedType: EmployeeType;
  public EmployeeDesignationList: EmployeeDesignation[];
  public EmployeeDepartmentList: EmployeeDepartment[];
  public SelectedDesignation: EmployeeDesignation;
  public SelectedDepartment: EmployeeDepartment
  public EmployeeGroupList: EmployeeGroup[];
  public SelectedGroup: EmployeeGroup;
  public GenderList: GenderInfo[];
  public CountryList: Country[];
  public StateList: State[];
  public AccountTypeList: AccountType[];
  public SelectedAccountType: AccountType;
  public RelationshipList: RelaionShipListInfo[];
  public SelectedRelation: RelaionShipListInfo;
  public QualificationList: QualificationListInfo[];
  public StateListFiltered: State[];
  public personalInfoDetail: PersonalInfo;
  public AddressInfo: any[];
  public EducationInfo: any[];
  public BankInfo: any[];
  public submitAttempt0: boolean;
  public submitAttempt1: boolean;
  public submitAttempt2: boolean;
  public submitAttempt3: boolean;
  public submitAttempt4: boolean;
  public submitAttempt5: boolean;
  public AddressInfoDetail: AddressInfo;
  public SelectedAddressInfo: AddressInfo;
  // public XmlEmployeedAddressInfo: AddressInfo[];
  public AddressInfoList: AddressInfo[];
  public AddressInfoList_Deleted: AddressInfo[];
  public FamilyInfoDetail: EmpFamilyInfo;
  public SelectedFamilyInfo: EmpFamilyInfo;
  public FamilyInfoList: EmpFamilyInfo[];
  public FamilyInfoList_Deleted: EmpFamilyInfo[];
  public EducationInfoDetail: EmpEducationInfo;
  public SelectedEducationInfo: EmpEducationInfo;
  public EducationInfoList: EmpEducationInfo[];
  public EducationInfoList_Deleted: EmpEducationInfo[];
  public BankInfoDetail: BankInfo;
  public BankInfoDetailList: BankInfo[];
  public BankInfoDetailList_Deleted: BankInfo[];
  public SelectedBankDetail: BankInfo;
  public BankList: Bank[];
  public ReasonList: MasterReason[];
  public OtFlagList: OTFlag[];
  public MarriedList: Married[];
  public KycInfoDetail: KYCDocInfo;
  public KycGridList: KYCDocInfo[];
  public KycGridList_Deleted: KYCDocInfo[];
  public SelectedKycInfoDetail: KYCDocInfo;
  public KycList: KYCInfo[];
  public SelectedKyc: KYCInfo;
  public RwID: any;
  public FamilyInfo: any[];
  public IsDefault: boolean;
  public AttendanceBonus: boolean;
  public KYCInfo: any;

  public MAX_PROJECT_DOCUMENT_SIZE:number;
  public selectedDoc:ProjectDocuments;
  public documentID: number;
  public empUpdateFlag:number;
  // public submitAttempt0: boolean;

  private isModified:boolean = false;

  constructor(public dialog: MatDialog, public sessionService: SessionService, private apiService: WebApiService,
    public commonService: CommonService, public loaderService: LoaderService, private http: HttpClient) {
      this.CountryList = [];
      this.StateList = [];
      this.BankList = [];
      this.OtFlagList = [];
      this.KycList = [];
      this.ReasonList = [];
      this.AccountTypeList = [];
      this.MarriedList = [];
      this.QualificationList = [];
      this.RelationshipList = [];
      this.StateListFiltered = [];
      this.FormColumnsWidth = 900;

      this.MAX_PROJECT_DOCUMENT_SIZE = 2;
      this.documentID = 0;
      this.empUpdateFlag = 0;
  }

  ngOnInit() {
    this.Mode = 'HOME';
    this.AttendanceBonus = false;
    this.RwID = 0;
    this.Mode1 = 'HOME';
    this.Mode2 = 'HOME';
    this.Mode3 = 'HOME';
    this.Mode4 = 'HOME';
    this.Mode5 = 'HOME';
    this.submitAttempt = false;
    this.submitAttempt0 = false;
    this.submitAttempt1 = false;
    this.submitAttempt2 = false;
    this.submitAttempt3 = false;
    this.submitAttempt4 = false;
    this.submitAttempt5 = false;
    this.loadMasterData();
    this.refreshClick();
    this.loadDataGrid();
    this.cancelClick();   

    this.cols = [
      { field: 'EmpCode', header: 'Employee Code', width: '15', align: 'left', wrap: 'break-word' },
      { field: 'EmpName', header: 'Employee Name', width: '15%', align: 'left', wrap: 'break-word' },
      { field: 'EmpFID', header: 'Finger / Face ID', width: '10%', align: 'left', wrap: 'break-word' },
      { field: 'DesignationName', header: 'Employee Destination', width: '20%', align: 'left', wrap: 'break-word' },
      { field: 'DepartmentName', header: 'Employee Department', width: '20%', align: 'left', wrap: 'break-word' },
      { field: 'StatusMessage', header: ' Status', width: '20%', align: 'left', wrap: 'break-word' }
    ];

    this.AddressInfo = [
      { field: 'Address1', header: 'Address1', width: '15%', align: 'left', wrap: 'break-word' },
      { field: 'Address2', header: 'Address2', width: '15%', align: 'left', wrap: 'break-word' },
      { field: 'CountryName', header: ' Country', width: '10%', align: 'left', wrap: 'break-word' },
      { field: 'StateName', header: ' State', width: '15%', align: 'left', wrap: 'break-word' },
      { field: 'City', header: ' City', width: '15%', align: 'left', wrap: 'break-word' },
      { field: 'Pincode', header: ' Pin Code', width: '10%', align: 'left', wrap: 'break-word' },
      { field: 'IsPermanentAddr', header: 'Permanent Address', width: '10%', align: 'left', wrap: 'break-word' },
      { field: 'StatusMessage', header: ' Status', width: '10%', align: 'left', wrap: 'break-word' }
    ];
    this.FamilyInfo = [
      { field: 'RelationshipName', header: 'Relation Name', width: '25%', align: 'left', wrap: 'break-word' },
      // { field: 'RContectNo', header: 'Relation Contect No', width: '15%', align: 'left', wrap: 'break-word' },
      { field: 'Relationship', header: 'Reletionship', width: '35%', align: 'left', wrap: 'break-word' },
      { field: 'RAge', header: ' Relation Age', width: '15%', align: 'left', wrap: 'break-word' },
      { field: 'RDOB', header: ' Relation DOB', width: '15%', align: 'left', wrap: 'break-word' },
      { field: 'StatusMessage', header: ' Status', width: '10%', align: 'left', wrap: 'break-word' }
    ];
    this.EducationInfo = [
      { field: 'Qualification', header: 'Emp Qualification', width: '20%', align: 'left', wrap: 'break-word' },
      { field: 'Institute', header: 'Institute', width: '25%', align: 'left', wrap: 'break-word' },
      { field: 'Location', header: ' Location', width: '20%', align: 'left', wrap: 'break-word' },
      { field: 'PassingYear', header: ' Passing Year', width: '20%', align: 'left', wrap: 'break-word' },
      { field: 'Percentage', header: 'Percentage(%)', width: '15%', align: 'left', wrap: 'break-word' },
      { field: 'StatusMessage', header: ' Status', width: '10%', align: 'left', wrap: 'break-word' }
    ];
    this.BankInfo = [
      { field: 'BankName', header: 'Bank Name', width: '20%', align: 'left', wrap: 'break-word' },
      { field: 'AccountNumber', header: 'Account Number', width: '20%', align: 'left', wrap: 'break-word' },
      { field: 'AccountType', header: ' Account Type', width: '20%', align: 'left', wrap: 'break-word' },
      { field: 'IFSCCode', header: ' IFSC Code', width: '10%', align: 'left', wrap: 'break-word' },
      { field: 'Branch', header: 'Branch', width: '20%', align: 'left', wrap: 'break-word' },
      { field: 'IsDefault', header: 'Set As Default', width: '10%', align: 'left', wrap: 'break-word' }
    ]
    this.KYCInfo = [
      { field: 'KycTitle', header: 'Type', width: '30%', align: 'left', wrap: 'break-word' },
      { field: 'NameAsInDocument', header: 'Name As In Doc', width: '30%', align: 'left', wrap: 'break-word' },
      { field: 'DocumentNumber', header: ' Doc Number', width: '20%', align: 'left', wrap: 'break-word' },
      { field: 'ExpiryDate', header: ' Expiry Date', width: '20%', align: 'left', wrap: 'break-word' }

    ]

  }



  repeatchrs()
  {
    let x:number;
    let repeats:any[];    
    let str:string;
    str = 'mammal';

    let vstr=str.split('');
    repeats = new Array();
    vstr.forEach(z=> {     
      
      let y = repeats.find(n=> n==z);

      if (y == undefined || y == null)
      {
        console.log(z.toString() + ' occurs ' + this.nosOccur(str,z.toString()) + ' times');
        repeats.push(z)
      }


    });

  }

  nosOccur(v:string,k:string):number
  {
    let d:number;
    let r:number;

    r=0;
    for(d = 0, length = v.length; d < length; d++) {
      var l = v.charAt(d);
      if (k==l) { r++; };
    }

    return r;
  }

  onKeyUp() {
    this.selectedDataGridItem = null;
  }

  addClick() {
    this.personalInfoDetail = new PersonalInfo();
    this.selectedDataGridItem = new Employee();
    this.BankInfoDetail = new BankInfo();
    this.SelectedKyc = new KYCInfo();
    this.AddressInfoList = new Array();
    this.FamilyInfoList = new Array();
    this.BankInfoDetailList = new Array();
    this.KycGridList = new Array();
    this.EducationInfoList = new Array();

    this.Mode = 'ADD';


  }

  isRowSelected(): boolean {
    if (this.selectedData != null) {
      return true;
    }
    else {
      return false;
    }
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

          let req = new SaveEmployeeRequest();

          req.Result = new Employee();

          req.Result = this.selectedData;
          req.SaveType = AppConfig.SaveType_Delete;

          this.apiService.postData("SaveEmployee", req).subscribe((data: ServiceReponse) => {
            if (data.SuccessCode == 1) {
              this.sessionService.showSuccess("Employee  deleted sucessfully");
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

  editClick() {

    this.Mode = 'EDIT';
    this.onDoubleClick(this.selectedData);
  }

  DisableEdit(): boolean {

    if (this.selectedData != null) {
      return false;
    }
    else {
      return true;
    }
  }

  submitClick(isValid: boolean) {


    this.submitAttempt = true;

    if (isValid) {

      let req = new SaveEmployeeRequest();
      req.Result = this.selectedDataGridItem;
      console.log(req.Result);

      if (this.Mode == 'ADD') {
        req.SaveType = AppConfig.SaveType_Insert
      }
      else {
        req.SaveType = AppConfig.SaveType_Update
      }

      this.apiService.postData("SaveEmployee", req).subscribe((data: ServiceReponse) => {
        if (data.SuccessCode == 1) {
          // console.log(data);
          if (this.Mode == 'ADD') {
            this.sessionService.showSuccess("Employee  added successfully");
            this.isModified = true;
          }

          else if (this.Mode == 'EDIT') {
            this.sessionService.showSuccess("Employee  updated successfully");
            this.isModified = true;
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
    this.loadDataGrid();

  }

  cancelClick() {
    this.Mode = 'HOME';
    this.submitAttempt = false;
    this.selectedData = null;
    this.selectedDataGridItem = null;
    if (this.isModified) {
      this.refreshClick();
    }

  }

  onDoubleClick(rowData: Employee) {
    this.Mode = 'EDIT';
    this.isModified = false;
    if (rowData != null) {

      this.personalInfoDetail = new PersonalInfo();
      this.BankInfoDetail = new BankInfo();
      this.AddressInfoList = new Array();
      this.FamilyInfoList = new Array();
      this.BankInfoDetailList = new Array();
      this.KycGridList = new Array();
      this.EducationInfoList = new Array();

      this.BankInfoDetailList_Deleted = new Array();
      this.AddressInfoList_Deleted = new Array();
      this.FamilyInfoList_Deleted = new Array();
      this.BankInfoDetailList_Deleted = new Array();
      this.KycGridList_Deleted = new Array();
      this.EducationInfoList_Deleted = new Array();

      this.selectedDataGridItem = Object.assign({}, rowData);
      //this.loadMasterData();
      this.loadPersonalInfoDetails();

    }
  }


  loadMasterData() {
    let req = new ServiceRequest();

    this.apiService.postData("MasterDataEmployeeGetAll", req).subscribe((data: MasterDataEmployeeGetAllResponse) => {
      if (data.SuccessCode == 1) {
        console.log(data);
        this.OtFlagList = data.OtFlagList;
        this.MarriedList = data.MarriedList;
        this.RelationshipList = data.RelationshipList;
        this.QualificationList = data.QualificationList;
        this.BankList = data.BankList;
        this.EmployeeGroupList = data.EmpGroupList;
        this.EmployeeCategoryList = data.EmpCategoryList;
        this.EmployeeTypeList = data.EmpTypeList;
        this.EmployeeDepartmentList = data.EmpDepartmentList;
        this.EmployeeDesignationList = data.EmpDesignationList
        this.KycList = data.KycList;
        this.ReasonList = data.ReasonList;
        this.StatusList = this.sessionService.StatusListAll.filter(x => x.StatusCode != 50);
        // this.StatusList = this.sessionService.StatusListAll;
        this.GenderList = this.sessionService.GenderList;
        this.CountryList = this.sessionService.CountryList;
        this.StateList = this.sessionService.StateList;


        this.AccountTypeList = new Array();
        let jtm = new AccountType;
        jtm.AccountType = 'Current Account';
        jtm.AccountTypeID = 1;

        this.AccountTypeList.push(jtm);

        jtm = new AccountType;

        jtm.AccountType = 'Savings Account';
        jtm.AccountTypeID = 2;
        this.AccountTypeList.push(jtm);

        // if (this.selectedDataGridItem != null && this.selectedDataGridItem.DepartmentID != null) {
        //   let Dep = this.EmployeeDepartmentList.find(x => x.DepartmentID == this.selectedDataGridItem.DepartmentID);

        //   if (Dep != null) {
        //     this.selectedDataGridItem = this.commonService.cloneAny(Dep);
        //     this.EmployeeDepartmentList.push(Dep);

        //   }


        // }


        // this.loadEditQuoteValues();
      }


      else {
        this.sessionService.showError(data.ErrorMessage);
      }
    });



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

  onCountrySelect() {

    this.StateListFiltered = [];

    if (this.commonService.getLengthNA(this.AddressInfoDetail.CountryCode) > 0) {
      if (this.commonService.getLength(this.StateList) > 0) {

        this.StateListFiltered = this.StateList.filter(itm => itm.CountryCode == this.AddressInfoDetail.CountryCode);

      }
    }
    else {
      this.AddressInfoDetail.StateID = null;
    }
  }

  kycInfoSave(isValid: boolean)
  {
    this.submitAttempt1 = true;

    if (isValid) {

      let req = new SaveEmployeeBankInfoRequest();
      req.EmpID = this.selectedDataGridItem.EmpID;
      req.EmployeeBankDetails = new Array();
      req.EmployeeKYCDetails = new Array();

      if (this.commonService.getLength(this.BankInfoDetailList)) {
        this.BankInfoDetailList.forEach(d => {
          console.log(d);
          let nItm = new BankInfo();

          nItm.BankDetID =  d.BankDetID;
          nItm.EmpID = this.selectedDataGridItem.EmpID;
          nItm.BankID =  d.BankID;
          nItm.AccountTypeID =  d.AccountTypeID;
          nItm.AccountType =  d.AccountType;
          nItm.IFSCCode =  d.IFSCCode;
          nItm.Branch =  d.Branch;
          nItm.BankName =  d.BankName;
          nItm.RwID =  d.RwID;
          nItm.IsDefault =  d.IsDefault;
          nItm.AccountNumber =  d.AccountNumber;
          nItm.StatusCode =  d.StatusCode;
          nItm.StatusMessage =  d.StatusMessage;

          req.EmployeeBankDetails.push(nItm);

        });

      }

      //deleted rows
      if (this.commonService.getLength(this.BankInfoDetailList_Deleted)) {
        this.BankInfoDetailList_Deleted.forEach(d => {
          let nItm = new BankInfo();

          nItm.BankDetID =  d.BankDetID;
          nItm.EmpID = this.selectedDataGridItem.EmpID;
          nItm.BankID =  d.BankID;
          nItm.AccountTypeID =  d.AccountTypeID;
          nItm.AccountType =  d.AccountType;
          nItm.IFSCCode =  d.IFSCCode;
          nItm.Branch =  d.Branch;
          nItm.BankName =  d.BankName;
          nItm.RwID =  d.RwID;
          nItm.IsDefault =  d.IsDefault;
          nItm.AccountNumber =  d.AccountNumber;
          nItm.StatusCode =  d.StatusCode;
          nItm.StatusMessage =  d.StatusMessage;

          req.EmployeeBankDetails.push(nItm);

        });

      }


      if (this.commonService.getLength(this.KycGridList)) {
        this.KycGridList.forEach(d => {
          console.log(d);
          let nItm = new KYCDocInfo();

          nItm.KycDetID =  d.KycDetID;
          nItm.EmpID =  this.selectedDataGridItem.EmpID;
          nItm.KycID =  d.KycID;
          nItm.KycTitle =  d.KycTitle;
          nItm.NameAsInDocument =  d.NameAsInDocument;
          nItm.DocumentNumber =  d.DocumentNumber;
          nItm.ExpiryDate =  d.ExpiryDate;
          nItm.RwID =  d.RwID;

          req.EmployeeKYCDetails.push(nItm);

        });

      }

      
      //deleted rows
      if (this.commonService.getLength(this.KycGridList_Deleted)) {
        this.KycGridList_Deleted.forEach(d => {
          let nItm = new KYCDocInfo();

          nItm.KycDetID =  d.KycDetID;
          nItm.EmpID =  this.selectedDataGridItem.EmpID;
          nItm.KycID =  d.KycID;
          nItm.KycTitle =  d.KycTitle;
          nItm.NameAsInDocument =  d.NameAsInDocument;
          nItm.DocumentNumber =  d.DocumentNumber;
          nItm.ExpiryDate =  d.ExpiryDate;
          nItm.RwID =  d.RwID;

          req.EmployeeKYCDetails.push(nItm);

        });

      }

      if (this.Mode == 'ADD') {
        req.SaveType = AppConfig.SaveType_Insert
      }
      else {
        req.SaveType = AppConfig.SaveType_Update
      }
      console.log(req);

      this.apiService.postData("SaveEmployeeKYCInfo", req).subscribe((data: ServiceReponse) => {
        if (data.SuccessCode == 1) {
          // console.log(data);
          if (this.Mode == 'ADD') {
            this.sessionService.showSuccess("Employee KYC Info added successfully");
            this.isModified = true;
          }

          else if (this.Mode == 'EDIT') {
            this.sessionService.showSuccess("Employee KYC Info updated successfully");
            this.isModified = true;
          }

          // this.refreshClick();
          // this.Mode = 'HOME';
        }
        else {
          this.sessionService.showError(data.ErrorMessage);
        }
      });



      
    }


  }

  personalInfoSave(isValid: boolean) {

    this.submitAttempt0 = true;

    if (isValid) {

      let req = new SaveEmployeePersonalInfoRequest();
      req.Result = this.personalInfoDetail;

      if (req.Result.IsHandicap == undefined || req.Result.IsHandicap == null) { req.Result.IsHandicap = false; }
      req.Result.EmpID = this.selectedDataGridItem.EmpID;
      req.EmployeeAddressDetails = new Array();
      req.EmployeeFamilyDetails = new Array();
      req.EmployeeEducationDetails = new Array();

      if (this.commonService.getLength(this.AddressInfoList)) {
        this.AddressInfoList.forEach(d => {
          d.AddrDetID = d.RwID;
          d.EmpID = this.selectedDataGridItem.EmpID;
          if (d.IsPermanentAddr == undefined || d.IsPermanentAddr == null) { d.IsPermanentAddr = false; }

          let nItm = new AddressInfo();

          nItm.AddrDetID = d.AddrDetID;
          nItm.Address1 = d.Address1;
          nItm.Address2 = d.Address2;
          nItm.CountryCode = d.CountryCode;
          nItm.StateID = d.StateID;
          nItm.City = d.City;
          nItm.Pincode = d.Pincode;
          nItm.IsPermanentAddr = d.IsPermanentAddr;
          nItm.StatusCode = d.StatusCode;

          req.EmployeeAddressDetails.push(nItm);

        });

      }

      //deleted rows
      if (this.commonService.getLength(this.AddressInfoList_Deleted)) {
        this.AddressInfoList_Deleted.forEach(d => {
          console.log(d);
          d.AddrDetID = d.RwID;
          d.EmpID = this.selectedDataGridItem.EmpID;
          if (d.IsPermanentAddr == undefined || d.IsPermanentAddr == null) { d.IsPermanentAddr = false; }

          let nItm = new AddressInfo();

          nItm.AddrDetID = d.AddrDetID;
          nItm.Address1 = d.Address1;
          nItm.Address2 = d.Address2;
          nItm.CountryCode = d.CountryCode;
          nItm.StateID = d.StateID;
          nItm.City = d.City;
          nItm.Pincode = d.Pincode;
          nItm.IsPermanentAddr = d.IsPermanentAddr;
          nItm.StatusCode = MasterStatus.Deleted;

          req.EmployeeAddressDetails.push(nItm);

        });

      }


      if (this.commonService.getLength(this.FamilyInfoList)) {
        this.FamilyInfoList.forEach(d => {
          console.log(d);
          d.FamilyDetID = d.RwID;
          d.EmpID = this.selectedDataGridItem.EmpID;

          let nItm = new EmpFamilyInfo();

          nItm.FamilyDetID = d.FamilyDetID;
          nItm.RelationshipID = d.RelationshipID;
          nItm.RelationshipName = d.RelationshipName;
          nItm.RContactNo = d.RContactNo;
          nItm.RAge = d.RAge;
          nItm.RDOB = moment(d.RDOB).format(AppConfig.UPDATE_DATE_FORMAT);
          nItm.RwID = d.RwID;
          nItm.StatusCode = d.StatusCode;

          req.EmployeeFamilyDetails.push(nItm);

        });

      }

      //deleted
      if (this.commonService.getLength(this.FamilyInfoList_Deleted)) {
        this.FamilyInfoList_Deleted.forEach(d => {
          console.log(d);
          d.FamilyDetID = d.RwID;
          d.EmpID = this.selectedDataGridItem.EmpID;

          let nItm = new EmpFamilyInfo();

          nItm.FamilyDetID = d.FamilyDetID;
          nItm.RelationshipID = d.RelationshipID;
          nItm.RelationshipName = d.RelationshipName;
          nItm.RContactNo = d.RContactNo;
          nItm.RAge = d.RAge;
          nItm.RDOB = moment(d.RDOB).format(AppConfig.UPDATE_DATE_FORMAT);
          nItm.RwID = d.RwID;
          nItm.StatusCode = MasterStatus.Deleted;

          req.EmployeeFamilyDetails.push(nItm);

        });
        
      }


      if (this.commonService.getLength(this.EducationInfoList)) {
        this.EducationInfoList.forEach(d => {
          console.log(d);
          d.EducationDetID = d.RwID;
          d.EmpID = this.selectedDataGridItem.EmpID;

          let nItm = new EmpEducationInfo();

          nItm.EducationDetID = d.EducationDetID;
          nItm.QualificationID = d.QualificationID;
          nItm.Qualification = d.Qualification;
          nItm.Institute = d.Institute;
          nItm.Location = d.Location;
          nItm.PassingYear = d.PassingYear;
          nItm.Percentage = d.Percentage;
          nItm.Description = d.Description;
          nItm.StatusCode = d.StatusCode;
          nItm.RwID = d.RwID;

          req.EmployeeEducationDetails.push(nItm);

        });
      }

      //deleted      
      if (this.commonService.getLength(this.EducationInfoList_Deleted)) {
        this.EducationInfoList_Deleted.forEach(d => {
          console.log(d);
          d.EducationDetID = d.RwID;
          d.EmpID = this.selectedDataGridItem.EmpID;

          let nItm = new EmpEducationInfo();

          nItm.EducationDetID = d.EducationDetID;
          nItm.QualificationID = d.QualificationID;
          nItm.Qualification = d.Qualification;
          nItm.Institute = d.Institute;
          nItm.Location = d.Location;
          nItm.PassingYear = d.PassingYear;
          nItm.Percentage = d.Percentage;
          nItm.Description = d.Description;
          nItm.StatusCode =  MasterStatus.Deleted;
          nItm.RwID = d.RwID;

          req.EmployeeEducationDetails.push(nItm);

        });


      }



      if (this.Mode == 'ADD') {
        req.SaveType = AppConfig.SaveType_Insert
      }
      else {
        req.SaveType = AppConfig.SaveType_Update
      }
      console.log(req);

      this.apiService.postData("SaveEmployeePersonalInfo", req).subscribe((data: ServiceReponse) => {
        if (data.SuccessCode == 1) {
          // console.log(data);
          if (this.Mode == 'ADD') {
            this.sessionService.showSuccess("Employee Personal Info added successfully");
            this.isModified = true;
          }

          else if (this.Mode == 'EDIT') {
            this.sessionService.showSuccess("Employee Personal Info updated successfully");
            this.isModified = true;
          }

          // this.refreshClick();
          // this.Mode = 'HOME';
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
    this.loadDataGrid();
    this.loadPersonalInfoDetails();


  }

  addAddressInfoclick() {
    this.AddressInfoDetail = new AddressInfo();
    this.Mode1 = 'ADD';
  }

  editAddressInfoclick() {
    if (this.SelectedAddressInfo != null) {
      this.StatusList = this.sessionService.StatusListAll.filter(x => x.StatusCode == 10 || x.StatusCode == 20);
      this.AddressInfoDetail = this.commonService.cloneAny(this.SelectedAddressInfo);
      this.Mode1 = 'EDIT';
    }
  }

  deleteAddressInfoDetail() {

    if (this.SelectedAddressInfo != null) {
      let dialogRef = this.dialog.open(ConfirmDialogComponent, {
        data: {
          DialogHeader: 'Alert',
          DialogMessage: 'Are you sure you want to delete?'
        },
        disableClose: true,
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result == 1) {
          let idx = this.AddressInfoList.findIndex(d => d.RwID == this.SelectedAddressInfo.RwID && d.AddrDetID == this.SelectedAddressInfo.AddrDetID);
          if (idx != null) {
            this.AddressInfoList_Deleted.push(this.AddressInfoList.find(d => d.RwID == this.SelectedAddressInfo.RwID && d.AddrDetID == this.SelectedAddressInfo.AddrDetID));
            this.AddressInfoList.splice(idx, 1);
          }
        }
        else {
          this.selectedData = null;
        }
      });
    }
  }

  cancelAddressInfoForm() {
    this.submitAttempt1 = false;
    this.Mode1 = 'HOME';
  }

  DisableEdit1(): boolean {

    if (this.SelectedAddressInfo != null) {
      return false;
    }
    else {
      return true;
    }
  }

  DisableEdit2(): boolean {

    if (this.SelectedFamilyInfo != null) {
      return false;
    }
    else {
      return true;
    }
  }

  DisableEdit3(): boolean {

    if (this.SelectedEducationInfo != null) {
      return false;
    }
    else {
      return true;
    }
  }
  DisableEdit4(): boolean {

    if (this.SelectedBankDetail != null) {
      return false;
    }
    else {
      return true;
    }
  }

  DisableEdit5(): boolean {

    if (this.SelectedKycInfoDetail != null) {
      return false;
    }
    else {
      return true;
    }
  }

  updateAddressInfoDetails(isValid: boolean) {
    this.submitAttempt1 = true;
    if (isValid) {

      let nItm = new AddressInfo();
      let nItm1 = new AddressInfo();

      nItm = this.commonService.cloneAny(this.AddressInfoDetail);

      if (this.Mode1 == 'ADD') {
        this.RwID = this.RwID + (-1);
        nItm.RwID = this.RwID;
      }

      nItm1 = this.AddressInfoList.find(x => x.IsPermanentAddr  == true && x.RwID != nItm.RwID);

      if (nItm1 != null && nItm1 != undefined && nItm.IsPermanentAddr == true) {
        let dialogRef = this.dialog.open(ConfirmDialogComponent, {
          data: {
            DialogHeader: 'Alert',
            DialogMessage: 'Candidate already has Permanent Address,Do you want to make this Permanent..?'
          },
          disableClose: true,
        });


        dialogRef.afterClosed().subscribe(result => {
          if (result == 1) {
            this.AddressInfoList.find(x => x.IsPermanentAddr == true && x.RwID != nItm.RwID).IsPermanentAddr = false;
            this.ExecuteAddressUpdate(nItm);
          }

        });

      }
      else {

        this.ExecuteAddressUpdate(nItm);
      }

    }

  }

  ExecuteAddressUpdate(nItm:AddressInfo)
  {

    if (this.Mode1 == 'ADD') {
      nItm.CountryName = this.CountryList.find(z => z.CountryCode == nItm.CountryCode).CountryName;
      nItm.StatusMessage = this.StatusList.find(z => z.StatusCode == nItm.StatusCode).StatusMessage;
      nItm.StateName = this.StateList.find(z => z.StateID == nItm.StateID).StateName;
      this.AddressInfoList.push(nItm);
      this.cancelAddressInfoForm();
    }
    else if (this.Mode1 == 'EDIT') {
      nItm.CountryName = this.CountryList.find(z => z.CountryCode == nItm.CountryCode).CountryName;
      nItm.StatusMessage = this.StatusList.find(z => z.StatusCode == nItm.StatusCode).StatusMessage;
      nItm.StateName = this.StateList.find(z => z.StateID == nItm.StateID).StateName;

      this.AddressInfoList.forEach(x => {

        if (x.RwID == nItm.RwID && x.AddrDetID == nItm.AddrDetID) {
          x.Address1 = nItm.Address1;
          x.Address2 = nItm.Address2;
          x.CountryName = nItm.CountryName;
          x.StateName = nItm.StateName;
          x.CountryCode = nItm.CountryCode;
          x.StateID = nItm.StateID;
          x.City = nItm.City;
          x.Pincode = nItm.Pincode;
          x.IsPermanentAddr = nItm.IsPermanentAddr;
          x.StatusCode = nItm.StatusCode;
          x.StatusMessage = nItm.StatusMessage;

        }
      });
      this.cancelAddressInfoForm();

    }
    
  }


  addFamilyInfoclick() {
    this.SelectedRelation = new RelaionShipListInfo();
    this.FamilyInfoDetail = new EmpFamilyInfo();
    this.Mode2 = 'ADD';
  }

  editFamilyInfoclick() {
    this.Mode2 = 'EDIT';
    if (this.SelectedFamilyInfo != null) {
      this.StatusList = this.sessionService.StatusListAll.filter(x => x.StatusCode == 10 || x.StatusCode == 20);
      this.FamilyInfoDetail = this.commonService.cloneAny(this.SelectedFamilyInfo);
      this.Mode2 = 'EDIT';
    }

  }

  updateFamilyInfoDetails(isValid: boolean) {
    this.submitAttempt2 = true;
    if (isValid) {

      if (this.Mode2 == 'ADD') {
        let nItm = new EmpFamilyInfo();
        nItm = this.commonService.cloneAny(this.FamilyInfoDetail);
        nItm.StatusMessage = this.StatusList.find(z => z.StatusCode == nItm.StatusCode).StatusMessage;
        nItm.Relationship = this.RelationshipList.find(z => z.RelationshipID == nItm.RelationshipID).Relationship;
        this.RwID = this.RwID + (-1);
        nItm.RwID = this.RwID;
        this.FamilyInfoList.push(nItm);
        console.log(this.FamilyInfoList);
      }
      else if (this.Mode2 == 'EDIT') {
        let nItm = new EmpFamilyInfo();
        nItm = this.commonService.cloneAny(this.FamilyInfoDetail);
        nItm.StatusMessage = this.StatusList.find(z => z.StatusCode == nItm.StatusCode).StatusMessage;
        nItm.Relationship = this.RelationshipList.find(z => z.RelationshipID == nItm.RelationshipID).Relationship;
        this.FamilyInfoList.forEach(x => {
          if (x.RwID == nItm.RwID && x.FamilyDetID == nItm.FamilyDetID) {

            x.FamilyDetID = nItm.FamilyDetID;
            x.EmpID = nItm.EmpID;
            x.RelationshipName = nItm.RelationshipName;
            x.RelationshipID = nItm.RelationshipID
            x.Relationship = nItm.Relationship;
            x.StatusCode = nItm.StatusCode;
            x.StatusMessage = nItm.StatusMessage;
            x.RAge = nItm.RAge;
            x.RDOB = moment(nItm.RDOB).format(AppConfig.UPDATE_DATE_FORMAT);

          }
        });

      }
      this.cancelFamilyInfoForm();
    }


  }

  SelectedRelationship(RelationInfo: any) {
    if (RelationInfo != null) {
      this.RelationshipList.forEach(x => {
        if (x.RelationshipID == Number(RelationInfo.ID)) {
          this.SelectedRelation = this.commonService.cloneAny(x);

        }
      });
    }
  }

  deleteFamilyInfoDetail() {

    if (this.SelectedFamilyInfo != null) {
      let dialogRef = this.dialog.open(ConfirmDialogComponent, {
        data: {
          DialogHeader: 'Alert',
          DialogMessage: 'Are you sure you want to delete?'
        },
        disableClose: true,
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result == 1) {
          let idx = this.FamilyInfoList.findIndex(d => d.RwID == this.SelectedFamilyInfo.RwID && d.FamilyDetID == this.SelectedFamilyInfo.FamilyDetID);
          if (idx != null) {
            this.FamilyInfoList_Deleted.push(this.FamilyInfoList.find(d => d.RwID == this.SelectedFamilyInfo.RwID && d.FamilyDetID == this.SelectedFamilyInfo.FamilyDetID));
            this.FamilyInfoList.splice(idx, 1);
          }
        }
        else {
          this.SelectedFamilyInfo = null;
        }
      });
    }
  }

  cancelFamilyInfoForm() {
    this.submitAttempt2 = false;
    this.Mode2 = 'HOME';
  }

  addEducationInfoclick() {
    this.EducationInfoDetail = new EmpEducationInfo();
    this.Mode3 = 'ADD';
  }

  editEducationInfoclick() {
    this.Mode3 = 'EDIT';
    if (this.SelectedEducationInfo != null) {
      this.StatusList = this.sessionService.StatusListAll.filter(x => x.StatusCode == 10 || x.StatusCode == 20);
      this.EducationInfoDetail = this.commonService.cloneAny(this.SelectedEducationInfo);
      this.Mode3 = 'EDIT';
    }

  }

  updateEducationInfoDetails(isValid: boolean) {
    this.submitAttempt3 = true;
    if (isValid) {

      if (this.Mode3 == 'ADD') {
        let nItm = new EmpEducationInfo();
        nItm = this.commonService.cloneAny(this.EducationInfoDetail);
        nItm.StatusMessage = this.StatusList.find(z => z.StatusCode == nItm.StatusCode).StatusMessage;
        nItm.Qualification = this.QualificationList.find(z => z.QualificationID == nItm.QualificationID).Qualification;

        this.RwID = this.RwID + (-1);
        nItm.RwID = this.RwID;
        this.EducationInfoList.push(nItm);
        console.log(this.EducationInfoList);

      }
      else if (this.Mode3 == 'EDIT') {
        let nItm = new EmpEducationInfo();
        nItm = this.commonService.cloneAny(this.EducationInfoDetail);
        nItm.StatusMessage = this.StatusList.find(z => z.StatusCode == nItm.StatusCode).StatusMessage;
        nItm.Qualification = this.QualificationList.find(z => z.QualificationID == nItm.QualificationID).Qualification;
        this.EducationInfoList.forEach(x => {
          if (x.RwID == nItm.RwID && x.EducationDetID == nItm.EducationDetID) {
            x.QualificationID = nItm.QualificationID;
            x.Qualification = nItm.Qualification;
            x.Institute = nItm.Institute;
            x.Location = nItm.Location;
            x.PassingYear = nItm.PassingYear;
            x.Percentage = nItm.Percentage;
            x.StatusCode = nItm.StatusCode;
            x.StatusMessage = nItm.StatusMessage;

          }
        });

      }
      this.cancelEducationInfoForm();
    }


  }

  deleteEducationInfoDetail() {

    if (this.SelectedEducationInfo != null) {
      let dialogRef = this.dialog.open(ConfirmDialogComponent, {
        data: {
          DialogHeader: 'Alert',
          DialogMessage: 'Are you sure you want to delete?'
        },
        disableClose: true,
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result == 1) {
          let idx = this.EducationInfoList.findIndex(d => d.EducationDetID == this.SelectedEducationInfo.EducationDetID);
          if (idx != null) {
            this.EducationInfoList_Deleted.push(this.EducationInfoList.find(d => d.EducationDetID == this.SelectedEducationInfo.EducationDetID));
            this.EducationInfoList.splice(idx, 1);
          }
        }
        else {
          this.SelectedEducationInfo = null;
        }
      });
    }
  }

  cancelEducationInfoForm() {
    this.submitAttempt3 = false;
    this.Mode3 = 'HOME';
  }

  addBankInfoclick() {
    this.BankInfoDetail = new BankInfo();
    this.Mode4 = 'ADD';
  }

  editBankInfoclick() {
    this.Mode4 = 'EDIT';
    if (this.SelectedBankDetail != null) {
      this.StatusList = this.sessionService.StatusListAll.filter(x => x.StatusCode == 10 || x.StatusCode == 20);
      this.BankInfoDetail = this.commonService.cloneAny(this.SelectedBankDetail);
      this.Mode4 = 'EDIT';
    }

  }

  updateBankInfoDetails(isValid: boolean) {
    this.submitAttempt4 = true;

    if (isValid) {
      let nItm = new BankInfo();
      let nItm1 = new BankInfo();
      nItm = this.commonService.cloneAny(this.BankInfoDetail);
      nItm1 = this.BankInfoDetailList.find(x => x.IsDefault == true && x.RwID != nItm.RwID);
      if (nItm1 != null && nItm1 != undefined && nItm.IsDefault == true) {
        let dialogRef = this.dialog.open(ConfirmDialogComponent, {
          data: {
            DialogHeader: 'Alert',
            DialogMessage: 'Candidate already has default Account,Do you want to make this default..?'
          },
          disableClose: true,
        });


        dialogRef.afterClosed().subscribe(result => {
          if (result == 1) {
            this.BankInfoDetailList.find(x => x.IsDefault == true && x.RwID != nItm.RwID).IsDefault = false;
            this.ExecuteBankUpdate(nItm);
          }

        });



      }
      else {

        this.ExecuteBankUpdate(nItm);
      }

    }


  }

  ExecuteBankUpdate(nItm: BankInfo) {

    if (this.Mode4 == 'ADD') {
      nItm.BankName = this.BankList.find(z => z.BankID == nItm.BankID).BankName;
      nItm.AccountType = this.AccountTypeList.find(z => z.AccountTypeID == nItm.AccountTypeID).AccountType;
      this.RwID = this.RwID + (-1);
      nItm.RwID = this.RwID;
      this.BankInfoDetailList.push(nItm);
      this.cancelBankInfoForm();
    }
    else if (this.Mode4 == 'EDIT') {
      nItm.BankName = this.BankList.find(z => z.BankID == nItm.BankID).BankName;
      nItm.AccountType = this.AccountTypeList.find(z => z.AccountTypeID == nItm.AccountTypeID).AccountType;
      this.BankInfoDetailList.forEach(x => {
        if (x.RwID == nItm.RwID) {
          x.BankID = nItm.BankID;
          x.BankName = nItm.BankName;
          x.AccountNumber = nItm.AccountNumber;
          x.AccountType = nItm.AccountType;
          x.AccountTypeID = nItm.AccountTypeID;
          x.IFSCCode = nItm.IFSCCode;
          x.IsDefault = nItm.IsDefault;
          x.Branch = nItm.Branch;

        }
      });
      this.cancelBankInfoForm();
    }
  }



  deleteBankInfoDetail() {

    if (this.BankInfoDetail != null) {
      let dialogRef = this.dialog.open(ConfirmDialogComponent, {
        data: {
          DialogHeader: 'Alert',
          DialogMessage: 'Are you sure you want to delete?'
        },
        disableClose: true,
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result == 1) {
          let idx = this.BankInfoDetailList.findIndex(d => d.RwID == this.SelectedBankDetail.RwID);
          if (idx != null) {
            this.BankInfoDetailList_Deleted.push(this.BankInfoDetailList.find(d => d.RwID == this.SelectedBankDetail.RwID));
            this.BankInfoDetailList.splice(idx, 1);
          }
        }
        else {
          this.selectedData = null;
        }
      });
    }
  }

  cancelBankInfoForm() {
    this.submitAttempt4 = false;
    this.Mode4 = 'HOME';
  }

  SelectIsDefault(isValid: boolean) {
    if (isValid) {

    }
  }

  addKYCInfoclick() {
    this.KycInfoDetail = new KYCDocInfo();
    this.SelectedKyc = new KYCInfo();
    this.Mode5 = 'ADD';
  }

  editKycInfoclick() {
    this.Mode5 = 'EDIT';
    if (this.SelectedKycInfoDetail != null) {
      this.StatusList = this.sessionService.StatusListAll.filter(x => x.StatusCode == 10 || x.StatusCode == 20);
      this.KycInfoDetail = this.commonService.cloneAny(this.SelectedKycInfoDetail);
      if (this.KycInfoDetail.KycID != null) {
        this.KycList.forEach(x => {
          if (x.KycID == this.KycInfoDetail.KycID) {
            this.SelectedKyc = this.commonService.cloneAny(x);
          }
        });
      }

      this.Mode5 = 'EDIT';
    }

  }

  updateKycInfoDetails(isValid: boolean) {
    this.submitAttempt5 = true;
    if (isValid) {

      if (this.Mode5 == 'ADD') {
        let nItm = new KYCDocInfo();
        nItm = this.commonService.cloneAny(this.KycInfoDetail);
        nItm.KycTitle = this.KycList.find(z => z.KycID == nItm.KycID).KycTitle;

        this.RwID = this.RwID + (-1);
        nItm.RwID = this.RwID;
        this.KycGridList.push(nItm);

      }
      else if (this.Mode5 == 'EDIT') {
        let nItm = new KYCDocInfo();
        nItm = this.commonService.cloneAny(this.KycInfoDetail);
        nItm.KycTitle = this.KycList.find(z => z.KycID == nItm.KycID).KycTitle;

        this.KycGridList.forEach(x => {
          if (x.RwID == nItm.RwID) {
            x.KycID = nItm.KycID;
            x.KycTitle = nItm.KycTitle;
            x.NameAsInDocument = nItm.NameAsInDocument;
            x.DocumentNumber = nItm.DocumentNumber;
            x.ExpiryDate = nItm.ExpiryDate

          }
        });

      }
      this.cancelKycInfoForm();
    }


  }

  deleteKycInfoDetail() {

    if (this.KycInfoDetail != null) {
      let dialogRef = this.dialog.open(ConfirmDialogComponent, {
        data: {
          DialogHeader: 'Alert',
          DialogMessage: 'Are you sure you want to delete?'
        },
        disableClose: true,
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result == 1) {
          let idx = this.KycGridList.findIndex(d => d.RwID == this.SelectedKycInfoDetail.RwID);
          if (idx != null) {
            this.KycGridList_Deleted.push(this.KycGridList.find(d => d.RwID == this.SelectedKycInfoDetail.RwID));
            this.KycGridList.splice(idx, 1);
          }
        }
        else {
          this.selectedData = null;
        }
      });
    }
  }

  cancelKycInfoForm() {
    this.submitAttempt5 = false;
    this.Mode5 = 'HOME';
  }

  SelectEmpDesignation(DesignationInfo: any) {
    if (DesignationInfo != null) {
      this.EmployeeDesignationList.forEach(x => {
        if (x.DesignationID == Number(DesignationInfo.ID)) {
          this.SelectedDesignation = this.commonService.cloneAny(x);

        }
      });
    }

  }
  SelectEmpDepartment(DepartmentInfo: any) {
    if (DepartmentInfo != null) {
      this.EmployeeDepartmentList.forEach(x => {
        if (x.DepartmentID == Number(DepartmentInfo.ID)) {
          this.SelectedDepartment = this.commonService.cloneAny(x);

        }
      });
    }

  }

  SelectEmpGroup(GroupInfo: any) {
    if (GroupInfo != null) {
      this.EmployeeGroupList.forEach(x => {
        if (x.GroupID == Number(GroupInfo.ID)) {
          this.SelectedGroup = this.commonService.cloneAny(x);

        }
      });
    }

  }


  SelectEmpCategory(CategoryInfo: any) {
    if (CategoryInfo != null) {
      this.EmployeeCategoryList.forEach(x => {
        if (x.CategoryID == Number(CategoryInfo.ID)) {
          this.SelectedCategory = this.commonService.cloneAny(x);

        }
      });
    }
  }


  SelectEmpType(TypeInfo: any) {
    if (TypeInfo != null) {
      this.EmployeeTypeList.forEach(x => {
        if (x.TypeID == Number(TypeInfo.ID)) {
          this.SelectedType = this.commonService.cloneAny(x);

        }
      });
    }
  }

  SelectedAccountTypeList(AccountTypeInfo: any) {
    if (AccountTypeInfo != null) {
      this.AccountTypeList.forEach(x => {
        if (x.AccountTypeID == Number(AccountTypeInfo.ID)) {
          this.SelectedAccountType = this.commonService.cloneAny(x);

        }
      });
    }

  }

  SelectKYCDocumentType(KycInfo: any) {
    if (KycInfo != null) {
      this.KycList.forEach(x => {
        if (x.KycID == Number(KycInfo.ID)) {
          this.SelectedKyc = this.commonService.cloneAny(x);

        }
      });
    }
  }

  loadDataGrid() {

    let req = new ServiceRequest();
    this.apiService.postData("EmployeeGetBySiteID", req).subscribe((data: ServiceReponse) => {
      if (data.SuccessCode == 1) {
        this.dataGridList = data.ResultList;
      }
      else {
        this.sessionService.showError(data.ErrorMessage);
      }
    });

  }

  loadPersonalInfoDetails() {

    let req = new ServiceRequest();
    req.ID = this.selectedDataGridItem.EmpID;

    this.apiService.postData("MasterDataEmployeePersnolInfoGetByEmpID", req).subscribe((data: MasterData_PersonalInfoGetByEmpID) => {
      if (data.SuccessCode == 1) {
        if (data.EmployeePersonalInfo != null) {
          this.personalInfoDetail = data.EmployeePersonalInfo;         
        };
        
        if (this.commonService.getLength(data.MasterEmployeeAddressDetailList) > 0) {
          this.AddressInfoList = new Array();
          data.MasterEmployeeAddressDetailList.forEach(x=> {
            x.RwID = x.AddrDetID;
            this.AddressInfoList.push(x);
          });
          //this.AddressInfoList = data.MasterEmployeeAddressDetailList;
           
        };

        if (this.commonService.getLength(data.MasterEmployeeFamilyDetailList) > 0) {
          this.FamilyInfoList = new Array();
          data.MasterEmployeeFamilyDetailList.forEach(x=> {
            x.RwID = x.FamilyDetID;
            this.FamilyInfoList.push(x);
          });
          //this.FamilyInfoList = data.MasterEmployeeFamilyDetailList;
          
        };

        if (this.commonService.getLength(data.MasterEmployeeEducationDetailList) > 0) {
          //this.EducationInfoList = data.MasterEmployeeEducationDetailList;
          this.EducationInfoList = new Array();
          data.MasterEmployeeEducationDetailList.forEach(x=> {
            x.RwID = x.EducationDetID;
            this.EducationInfoList.push(x);
          });
        };

        if (this.commonService.getLength(data.MasterEmployeeBankDetailList) > 0) {
          //this.BankInfoDetailList = data.MasterEmployeeBankDetailList;
          this.BankInfoDetailList = new Array();
          data.MasterEmployeeBankDetailList.forEach(x=> {
            x.RwID = x.BankDetID;
            this.BankInfoDetailList.push(x);
          });
        };

        if (this.commonService.getLength(data.MasterEmployeeKycDetailList) > 0) {
          //this.KycGridList = data.MasterEmployeeKycDetailList;
          this.KycGridList = new Array();
          data.MasterEmployeeKycDetailList.forEach(x=> {
            x.RwID = x.KycDetID;
            this.KycGridList.push(x);
          });
        };
      
      }
      else {
        this.sessionService.showError(data.ErrorMessage);
      }
    });
  }


  getFile() {
    document.getElementById("xlUpdate").click();
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
          this.empUpdateFlag = 1; 
      }

  }

  bulkEmplistUpdate()
  {
    this.submitAttempt = true;
    let res:any;
    res =  document.getElementById("json-result").textContent;
    var jres = JSON.parse(res);

    let req = new BulkEmployeeUpdateRequest();
    req.EmpList = new Array();
    if (jres.Sheet1 != null && jres.Sheet1.length >0)
    {
      jres.Sheet1.forEach(d=> {
        let itm = new Employee();
        itm.EmpCode = d.EmpCode;
        itm.EmpName = d.EmpName;
        itm.EmpFID = d.EmpFID;
        itm.GenderCode = d.GenderCode;
        itm.EmpDOB = d.EmpDOB;
        itm.EmpDOJ = d.EmpDOJ;
        itm.GroupID = d.GroupID;
        itm.CategoryID = d.CategoryID;
        itm.TypeID = d.TypeID;
        itm.DepartmentID = d.DepartmentID;
        itm.DesignationID = d.DesignationID;
        itm.OTFlagID = d.OTFlagID;
        itm.AttBonusFlag = d.AttBonusFlag;

        req.EmpList.push(itm);                    
      });
    }




  }

}
