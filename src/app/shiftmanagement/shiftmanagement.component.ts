import { Component, OnInit } from '@angular/core';
import { MasterStatus } from '../const/app.config';
import { WebApiService } from "../service/webapi.service";
import { SessionService } from "../service/session.service";
import { CommonService } from "../service/common.service";
import { MatDialog } from '@angular/material/dialog';
import { DailyEmployeeShift, Days, Employee, EmployeeCategory, EmployeeDepartment, 
         EmployeeDesignation, EmployeeGroup, EmployeeType, RadioButtonField, Shift, 
         Shiftmanagement, Status, WeeklyEmployeeOff } from '../model/shared.model';
import { MasterDataEmployeeGetAllResponse, SaveReponse, ShiftManagementResponse } from '../model/response.model';
import { SaveEmployeeShiftSchedule, ServiceRequest, ShiftManagementIDRequest } from '../model/request.model';
import * as moment from 'moment';

@Component({

  templateUrl: './shiftmanagement.component.html',
  styleUrls: ['./shiftmanagement.component.scss']
})
export class ShiftmanagementComponent implements OnInit {

  public FormColumnsWidth: number;
  public Mode: string;
  public cols: any;
  public RadioButtonList: RadioButtonField[];
  public selectedData: Shiftmanagement;
  public dataGridList: Shiftmanagement[];
  public submitAttempt: boolean;
  public ShiftList: Shift[];
  public DayList: Days[];
  public SelectedDay: Days;
  public SelectedShiftAll: Shift;
  public SelectedShift: Shift;
  public EmployeeCategoryList: EmployeeCategory[];
  public EmployeeDesignationList: EmployeeDesignation[];
  public EmployeeDepartmentList: EmployeeDepartment[];
  public EmployeeGroupList: EmployeeGroup[];
  public EmployeeTypeList: EmployeeType[];
  public SelectedEmployeeDetails: Shiftmanagement;
  public SelectedDesignation: EmployeeDesignation;
  public SelectedDepartment: EmployeeDepartment;
  public SelectedGroup: EmployeeGroup;
  public SelectedCategory: EmployeeCategory;
  public SelectedType: EmployeeType;
  public FromDate: string;
  public ToDate: string;

  public ShiftMode: string;

  constructor(public dialog: MatDialog, public sessionService: SessionService, private apiService: WebApiService,
    public commonService: CommonService) {

  }

  ngOnInit(): void {

    this.FormColumnsWidth = 600;
    this.SelectedEmployeeDetails = new Shiftmanagement();

    this.ShiftMode = 'Fixed';

    this.cols = [
      { field: 'MatCheck', header: "Check Box", width: '3%', align: 'left', wrap: 'break-word' },
      { field: 'EmpCode', header: "Emp Code", width: '10%', align: 'left', wrap: 'break-word' },
      { field: 'EmpName', header: "Emp Name", width: '20%', align: 'left', wrap: 'break-word' },
      // { field: 'GroupName', header: "Group", width: '10%', align: 'left', wrap: 'break-word' },
      // { field: 'Category', header: "Category", width: '10%', align: 'left', wrap: 'break-word' },
      // { field: 'TypeName', header: "Type", width: '10%', align: 'left', wrap: 'break-word' },
      { field: 'DepartmentName', header: "Department", width: '10%', align: 'left', wrap: 'break-word' },
      // { field: 'DestinationName', header: "Desgnation", width: '10%', align: 'left', wrap: 'break-word' },
      { field: 'Shift', header: "Shift", width: '10%', align: 'left', wrap: 'break-word' },
      { field: 'InTime', header: "In Time", width: '5%', align: 'right', wrap: 'break-word' },
      { field: 'OutTime', header: "Out Time", width: '5%', align: 'right', wrap: 'break-word' }

    ];
    this.pushRadioButtonFields();
    this.ShiftList = new Array();
    this.SelectedShift = new Shift();
    this.SelectedShiftAll = new Shift();
    this.loadDataGrid();
    this.loadMasterData();
    this.cancelClick();

    this.DayList = [
      { DayID: 1, Day: 'Sun' },
      { DayID: 2, Day: 'Mon' },
      { DayID: 3, Day: 'Tue' },
      { DayID: 4, Day: 'Wed' },
      { DayID: 5, Day: 'Thu' },
      { DayID: 6, Day: 'Fri' },
      { DayID: 7, Day: 'Sat' },
    ]
  }

  cancelClick() {
    this.Mode = 'HOME';
    this.submitAttempt = false;
    this.selectedData = null;
  }


  refreshClick() {
    this.cancelClick();
    this.loadDataGrid();
  }

  loadMasterData() {
    let req = new ServiceRequest();

    this.ToDate = moment().format();
    this.FromDate = moment().add('months', -3).format();

    this.apiService.postData("MasterDataEmployeeGetAll", req).subscribe((data: MasterDataEmployeeGetAllResponse) => {
      if (data.SuccessCode == 1) {

        this.EmployeeGroupList = data.EmpGroupList;
        this.EmployeeCategoryList = data.EmpCategoryList;
        this.EmployeeTypeList = data.EmpTypeList;
        this.EmployeeDepartmentList = data.EmpDepartmentList;
        this.EmployeeDesignationList = data.EmpDesignationList
      }


      else {
        this.sessionService.showError(data.ErrorMessage);
      }
    });



  }


  SelectShift(nShiftID: number) {

    if (nShiftID != null) {

      let itm = this.ShiftList.find(x => x.ShiftID == nShiftID);

      if (itm != null && this.selectedData != null) {
        this.dataGridList.forEach(x => {
          if (x.EmpID == this.selectedData.EmpID) {
            x.InTime = itm.InTime;
            x.OutTime = itm.OutTime;
          }

        });
      }
    }

  }


  submitClick(isValid: boolean) {

    this.submitAttempt = true;

    if (isValid == true) {

      let req = new SaveEmployeeShiftSchedule();  
      req.ShiftDetailList = new Array();
      req.WeekOffList = new Array();
      req.ShiftType = this.ShiftMode;
      req.FromDate = null;
      req.ToDate = null;
      req.WOffDate = null;

      if (this.SelectedEmployeeDetails.FromDate != null && this.SelectedEmployeeDetails.ToDate != null)
      {
        req.FromDate = moment(this.SelectedEmployeeDetails.FromDate).format();
        req.ToDate = moment(this.SelectedEmployeeDetails.ToDate).format();  

        if (req.FromDate != null && req.ToDate != null)
        {
            if (moment(req.ToDate).isBefore(moment(req.FromDate))) 
            {
                this.sessionService.showError("To Date should be greater than From Date");
                return;
            }    
            if (moment(req.FromDate).isSame(moment(req.ToDate))) 
            {
               this.sessionService.showError("From Date and To Date should not be Same");
               return;
            }
        }

        if (this.SelectedEmployeeDetails.WeekOffDate != null)
        {
          req.WOffDate = moment(this.SelectedEmployeeDetails.WeekOffDate).format();
        }

      }     

      if (this.commonService.getLength(this.dataGridList)>0)
      {
        let xList = this.dataGridList.filter(x=> x.IsSelected == true);

        if (this.commonService.getLength(xList)<=0)
        {
          this.sessionService.showError("Please select atleast one record before submit...!");
          return;
        }

        let wDate:string;
        if (this.SelectedEmployeeDetails.WeekOffDate != null)
        {
          wDate = moment(this.SelectedEmployeeDetails.WeekOffDate).format();
        }

        xList.forEach(x=> {
            let xitm = new DailyEmployeeShift();
            let witm = new WeeklyEmployeeOff();

            xitm.EmpID = x.EmpID;
            xitm.ShiftID = x.ShiftID;
            xitm.StatusCode = MasterStatus.Active;

            witm.EmpID = x.EmpID;
            witm.ShiftDate = wDate;
            xitm.StatusCode = MasterStatus.Active;
            
            req.ShiftDetailList.push(xitm);
            req.WeekOffList.push(witm);


        });



        this.apiService.postData("SaveShiftSchedule", req).subscribe((data: SaveReponse) => {
          if (data.SuccessCode == 1) {
  
            this.sessionService.showSuccess("Shift schedule updated successfully");
  
            this.refreshClick();
            this.Mode = 'HOME';
          }
          else {
            this.sessionService.showError(data.ErrorMessage);
          }
        });
  

      }

    }
    else {
      this.sessionService.showError("Some mandatory informations are missing, please check");
      return;
    }


  }

  loadDataGrid() {
    let req = new ShiftManagementIDRequest();
    // req.FromDate = moment(this.SelectedEmployeeDetails.FromDate).add('day', -1).format();
    // req.ToDate = moment(this.SelectedEmployeeDetails.ToDate).add('day', 1).format();
    req.GroupID = this.SelectedEmployeeDetails.GroupID;
    req.CategoryID = this.SelectedEmployeeDetails.CategoryID;
    req.TypeID = this.SelectedEmployeeDetails.TypeID;
    req.DepartmentID = this.SelectedEmployeeDetails.DepartmentID;
    req.DesignationID = this.SelectedEmployeeDetails.DesignationID;

    this.apiService.postData("ShiftManagmentGetBySiteID", req).subscribe((data: ShiftManagementResponse) => {
      if (data.SuccessCode == 1) {

        this.dataGridList = data.ResultList;
        this.ShiftList = data.ShiftMasterList;
        if (this.commonService.getLength(this.dataGridList) > 0) {
          this.dataGridList.forEach(itm => {


          });
        }
      }
      else {
        this.sessionService.showError(data.ErrorMessage);
      }
    });
  }

  pushRadioButtonFields() {

    this.RadioButtonList = new Array();
    let Button0 = new RadioButtonField();
    Button0.RadioButtonField = 'Select All';
    Button0.RadioButtonFieldID = 1;

    let Button1 = new RadioButtonField();
    Button1.RadioButtonField = 'Deselect All';
    Button1.RadioButtonFieldID = 2;

    let Button2 = new RadioButtonField();
    Button2.RadioButtonField = 'Invert selection';
    Button2.RadioButtonFieldID = 0;

    this.RadioButtonList.push(Button0);
    this.RadioButtonList.push(Button1);
    this.RadioButtonList.push(Button2);
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

  SelectedDateInDay(DayInfo: any) {
    if (DayInfo != null) {
      this.DayList.forEach(x => {
        if (x.DayID == Number(DayInfo.ID)) {
          this.SelectedDay = this.commonService.cloneAny(x);
        }
      });
    }

  }

  SelectShiftAll(ShiftInfo: any) {
    if (ShiftInfo != null) {
      this.ShiftList.forEach(x => {
        if (x.ShiftID == Number(ShiftInfo.ID)) {
          this.SelectedShiftAll = this.commonService.cloneAny(x);
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

  onSelectRow() {

    if (this.commonService.getLength(this.dataGridList) > 0) {
      this.dataGridList.forEach(x => {
        if (this.SelectedEmployeeDetails.RadioButtonFieldID == 1) {
          x.IsSelected = true;
        }
        else if (this.SelectedEmployeeDetails.RadioButtonFieldID == 2) {
          x.IsSelected = false;
        }
        else if (this.SelectedEmployeeDetails.RadioButtonFieldID == 0) {
          x.IsSelected = !x.IsSelected;
        }
      });
    }


  }

  radioChange() {
    this.onSelectRow();
  }

  DisableEdit(): boolean {

    if (this.SelectedEmployeeDetails.GroupID != null || this.SelectedEmployeeDetails.CategoryID != null || this.SelectedEmployeeDetails.TypeID != null || this.SelectedEmployeeDetails.DepartmentID != null || this.SelectedEmployeeDetails.DesignationID != null) {
      return false;
    }
    else {
      return true;
    }
  }

  DisableEdit1(): boolean {

    if (this.SelectedEmployeeDetails.ShiftID != null) {
      return false;
    }
    else {
      return true;
    }
  }

  ApplyShift(nShiftID: number) {

    if (nShiftID != null && this.commonService.getLength(this.dataGridList) > 0) {

      let lst = this.dataGridList.filter(x => x.IsSelected == true);

      if (this.commonService.getLength(lst) > 0) {
        let itm = this.ShiftList.find(x => x.ShiftID == nShiftID);

        if (itm != null && this.SelectedEmployeeDetails.ShiftID != null) {
          this.dataGridList.filter(x => x.IsSelected == true).forEach(d => {
            d.ShiftID = itm.ShiftID;
            d.InTime = itm.InTime;
            d.OutTime = itm.OutTime;
            d.Shift = itm.Shift;
          });


        }
      }
      else {
        this.sessionService.showError("select Atleast one Employee");
      }

    }

  }

  ClearData() {
    this.SelectedEmployeeDetails.GroupID = null;
    this.SelectedEmployeeDetails.TypeID = null;
    this.SelectedEmployeeDetails.CategoryID = null;
    this.SelectedEmployeeDetails.DepartmentID = null;
    this.SelectedEmployeeDetails.DesignationID = null;
    this.SelectedEmployeeDetails.RadioButtonFieldID = null;
    this.SelectedEmployeeDetails.FromDate = null;
    this.SelectedEmployeeDetails.ToDate = null;
    this.SelectedEmployeeDetails.ShiftID = null;
    this.SelectedEmployeeDetails.WeekOffDate = null;
    this.SelectedEmployeeDetails.WeekOffDay = null;
    this.SelectedShiftAll.InTime = null;
    this.SelectedShiftAll.OutTime = null;
    this.refreshClick();

  }

  FilterList() {

    this.loadDataGrid();

  }

}
