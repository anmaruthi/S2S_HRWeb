import { Component, OnInit } from '@angular/core';
import { WebApiService } from "../service/webapi.service";
import { SessionService } from "../service/session.service";
import { CommonService } from "../service/common.service";
import { MatDialog } from '@angular/material/dialog';
import { DailyAttendance, Days, Employee, EmployeeCategory, EmployeeDepartment, EmployeeDesignation, EmployeeGroup, EmployeeType, RadioButtonField, Setting, Shift, Shiftmanagement, Status } from '../model/shared.model';
import { DailyAttendanceGetBySiteIDResponse, MasterDataEmployeeGetAllResponse, ServiceReponse, ShiftManagementResponse } from '../model/response.model';
import { DailyAttendanceGetBySiteIDRequest, SaveDailyAttendanceRequest, ServiceRequest, ShiftManagementIDRequest } from '../model/request.model';
import * as moment from 'moment';
import { StockRoutingModule } from '../inventory/stock/stock-routing.module';
import { shift } from '../shift/shift.module';
import * as FileSaver from 'file-saver';
import autoTable from 'jspdf-autotable';
import { AppConfig } from '../const/app.config';


@Component({
  selector: 'app-dailyattendance',
  templateUrl: './dailyattendance.component.html',
  styleUrls: ['./dailyattendance.component.scss']
})
export class DailyattendanceComponent implements OnInit {

  public FormColumnsWidth: number;
  public Mode: string;
  public cols: any;
  public selectedData: any = {};
  public dataGridList: DailyAttendance[];
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
  public SelectedEmployeeDetails: DailyAttendance;
  public SelectedDesignation: EmployeeDesignation;
  public SelectedDepartment: EmployeeDepartment;
  public SelectedGroup: EmployeeGroup;
  public SelectedCategory: EmployeeCategory;
  public SelectedType: EmployeeType;
  public SelectedDate: string;
  public ToDate: string;

  public iTime: string;
  pageCount: any;

  constructor(public dialog: MatDialog, public sessionService: SessionService, private apiService: WebApiService,
    public commonService: CommonService) {

  }


  ngOnInit(): void {

    this.cols = [
      { field: 'EmpCode', header: "Emp Code", width: '5%', align: 'left', wrap: 'break-word' },
      { field: 'EmpName', header: "Emp Name", width: '15%', align: 'left', wrap: 'break-word' },
      { field: 'GroupCode', header: "Group", width: '5%', align: 'left', wrap: 'break-word' },
      { field: 'CategoryCode', header: "Category", width: '5%', align: 'left', wrap: 'break-word' },
      { field: 'TypeCode', header: "Type", width: '5%', align: 'left', wrap: 'break-word' },
      { field: 'DepartmentName', header: "Department", width: '10%', align: 'left', wrap: 'break-word' },
      { field: 'DesignationName', header: "Designation", width: '10%', align: 'left', wrap: 'break-word' },
      { field: 'Shift', header: "Shift", width: '3%', align: 'left', wrap: 'break-word' },
      { field: 'InTime', header: "In Time", width: '4%', align: 'right', wrap: 'break-word' },
      { field: 'OutTime', header: "Out Time", width: '4%', align: 'right', wrap: 'break-word' },
      { field: 'AttStatus', header: "Status", width: '5%', align: 'right', wrap: 'break-word' },
      { field: 'OtS1', header: "OT-S1", width: '3%', align: 'right', wrap: 'break-word' },
      { field: 'OtS2', header: "OT-S2", width: '3%', align: 'right', wrap: 'break-word' },
      { field: 'StsS1', header: "S1", width: '3%', align: 'right', wrap: 'break-word' },
      { field: 'StsS2', header: "S2", width: '3%', align: 'right', wrap: 'break-word' },
      { field: 'LateMins', header: "Late", width: '3%', align: 'right', wrap: 'break-word' },
      { field: 'EarlMins', header: "Early", width: '3%', align: 'right', wrap: 'break-word' },
      { field: 'Punch', header: "Punches", width: '11%', align: 'right', wrap: 'break-word' }
    ];


    this.SelectedGroup = new EmployeeGroup();
    this.SelectedCategory = new EmployeeCategory();
    this.SelectedType = new EmployeeType();
    this.SelectedDepartment = new EmployeeDepartment();
    this.SelectedDesignation = new EmployeeDesignation();
    this.SelectedDate = moment().format();

    this.iTime = "";

    this.loadMasterData();
    this.refreshClick();
  }

  refreshClick() {
    this.cancelClick();
    this.loadDataGrid();
  }

  loadDataGrid() {

    let req = new DailyAttendanceGetBySiteIDRequest();
    req.GroupID = this.commonService.ifNullNum(this.SelectedGroup.GroupID);
    req.CategoryID = this.commonService.ifNullNum(this.SelectedCategory.CategoryID);
    req.TypeID = this.commonService.ifNullNum(this.SelectedType.TypeID);
    req.DepartmentID = this.commonService.ifNullNum(this.SelectedDepartment.DepartmentID);
    req.DesignationID = this.commonService.ifNullNum(this.SelectedDesignation.DesignationID);
    req.AttDate = this.commonService.ifNullDt(this.SelectedDate);

    this.dataGridList = new Array();

    this.apiService.postData("DailyAttendanceGetBySiteID", req).subscribe((data: DailyAttendanceGetBySiteIDResponse) => {
      if (data.SuccessCode == 1) {


        if (this.commonService.getLength(data.ResultList) > 0) {
          data.ResultList.forEach(x => {
            x.AttDate = this.commonService.ifNullDt(x.AttDate);
            x.AttIn = this.commonService.ifNullStr(x.AttIn);
            x.AttOut = this.commonService.ifNullStr(x.AttOut);

            x.OtS1 = x.FnOt;
            x.OtS2 = x.AnOt;
            x.StsS1 = x.FnStatus;
            x.StsS2 = x.AnStatus;

          });

          this.dataGridList = data.ResultList;
          console.log(this.dataGridList);

        }
      }
      else {
        this.sessionService.showError(data.ErrorMessage);
      }
    });

  }

  cancelClick() {
    this.Mode = 'HOME';
    this.submitAttempt = false;
    this.selectedData = null;
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

  loadMasterData() {
    let req = new ServiceRequest();

    this.apiService.postData("MasterDataEmployeeGetAll", req).subscribe((data: MasterDataEmployeeGetAllResponse) => {
      if (data.SuccessCode == 1) {

        this.EmployeeGroupList = data.EmpGroupList;
        this.EmployeeCategoryList = data.EmpCategoryList;
        this.EmployeeTypeList = data.EmpTypeList;
        this.EmployeeDepartmentList = data.EmpDepartmentList;
        this.EmployeeDesignationList = data.EmpDesignationList
        this.ShiftList = data.ShiftList;

        if (this.commonService.getLength(this.ShiftList)) {
          this.ShiftList.forEach(x => {
            x.inTimeVal = Number(x.InTime);
            x.outTimeVal = Number(x.OutTime);
          });

        }
      }


      else {
        this.sessionService.showError(data.ErrorMessage);
      }
    });



  }

  getAttendanceDet(atDt: any, iTime: any, oTime: any, rdw: any) {
    //debugger
    let myPromise = new Promise((resolve, reject) => {

      this.getShift(atDt, iTime, oTime, rdw);
      this.attIndvCalc(atDt, iTime, oTime, rdw);

    });


  }

  attIndvCalc(atDt: string, iTime: string, oTime: string, rdw: any) {
    let iTm: string, oTm: string, aDt: string, pTm: string, nTm: string;
    let sftIn: string, sftOut: string, sTm: string, eTm: string;
    let selShift: Shift, l: number, dif1: number, dif2: number;
    let itm1: Shift, itm2: Shift, lS1: any, lS2: any;
    let ot1: number, ot2: number, minOtHr: number, minsHf: number;
    let itmhr: Setting, itmot: Setting, sft: Shift;

    aDt = moment(atDt).format();
    aDt = moment(atDt).format();
    iTime = atDt + " " + iTime.slice(0, 2) + ":" + iTime.substring(iTime.length - 2, iTime.length) + ":00";
    oTime = atDt + " " + oTime.slice(0, 2) + ":" + oTime.substring(oTime.length - 2, oTime.length) + ":00";
    iTm = moment(iTime).format();
    oTm = moment(oTime).format();

    sft = rdw.ShiftMst;

    sftIn = atDt + " " + sft?.InTime.slice(0, 2) + ":" + sft?.InTime.substring(sft.InTime.length - 2, sft.InTime.length) + ":00";
    sftOut = atDt + " " + sft?.OutTime.slice(0, 2) + ":" + sft?.OutTime.substring(sft.OutTime.length - 2, sft.OutTime.length) + ":00";
    sTm = moment(sftIn).format();
    eTm = moment(sftOut).format();

    dif1 = moment(sTm).diff(iTm, 'minute');
    dif2 = moment(oTm).diff(eTm, 'minute');

    rdw.StsS1 = null;
    rdw.StsS2 = null;
    rdw.LateMins = null;
    rdw.EarlMins = null;
    rdw.OtS1 = null;
    rdw.OtS2 = null;

    ot1 = 0.00;
    ot2 = 0.00;

    itmhr = new Setting();
    itmot = new Setting();
    minOtHr = 0;
    minsHf = 0;

    if (this.commonService.getLength(this.sessionService.siteConfigList) > 0) {
      itmhr = this.sessionService.siteConfigList.find(d => d.SettingName == 'MINIMUM_MINUTES_HALFHOUR_OT');
      itmot = this.sessionService.siteConfigList.find(d => d.SettingName == 'MINIMUM_OT_HOUR');

      if (itmhr != null) {
        minOtHr = Number(itmhr.SettingsValue);
      }

      if (itmot != null) {
        minsHf = Number(itmot.SettingsValue);
      }

    }

    if (dif1 < 0) {
      rdw.LateMins = Math.abs(dif1);
    }
    else {
      // rdw.OtS1 = dif1;
      rdw.OtS1 = Number.isNaN(dif1) ? '' : dif1;
    }

    if (dif2 < 0) {
      rdw.EarlMins = Math.abs(dif2);
    }
    else {
      rdw.OtS2 = Number.isNaN(dif2) ? '' : dif2;
    }

    if (rdw.OtS1 != null && rdw.OtS1 > 0) {
      let mn: number, hr: number;
      mn = 0;
      hr = 0;

      hr = rdw.OtS1 / 60;
      hr = parseInt(hr.toString());
      mn = rdw.OtS1 - (hr * 60)

      if (hr >= minsHf) {
        if (mn >= minOtHr) {
          hr = hr + 0.5;
        }
      }

      rdw.OtS1 = Number(hr.toFixed(2));

    }

    if (rdw.OtS2 != null && rdw.OtS2 > 0) {
      let mn1: number, hr1: number;
      mn1 = 0;
      hr1 = 0;

      hr1 = rdw.OtS2 / 60;
      hr1 = parseInt(hr1.toString());
      mn1 = rdw.OtS2 - (hr1 * 60)

      if (hr1 >= minsHf) {
        if (mn1 >= minOtHr) {
          hr1 = hr1 + 0.5;
          hr1 = parseFloat(hr1.toString());
        }
      }

      rdw.OtS2 = Number(hr1.toFixed(2));
    }

    lS1 = '';
    lS2 = '';

    if (rdw.LateMins != null && rdw.LateMins > sft.GraceTime) {
      lS1 = 'L';

      if (rdw.LateMins != null && rdw.LateMins > sft.LateAsPermissionGoBeyond) {
        lS1 = 'P';
      }

    }


    if (rdw.EarlMins != null && rdw.EarlMins > sft.LateAsPermissionGoBeyond) {
      lS2 = 'P';
    }

    rdw.StsS1 = lS1;
    rdw.StsS2 = lS2;

  }

  getShift(atDt: any, iTime: any, oTime: any, rdw: any) {
    debugger
    if (!rdw) {
      rdw = {};
    }
    let iTm: string, oTm: string, aDt: string, ln: number, pTm: string, nTm: string;
    let selShift: Shift, l: number, dif1: number, dif2: number, inTmVl: number;
    let itm1: Shift, itm2: Shift, outTmVl: number, retItm: any;

    inTmVl = Number(iTime.slice(0, 2) + iTime.substring(iTime.length - 2, iTime.length))
    outTmVl = Number(oTime.slice(0, 2) + oTime.substring(oTime.length - 2, oTime.length))

    aDt = moment(atDt).format();
    iTime = atDt + " " + iTime.slice(0, 2) + ":" + iTime.substring(iTime.length - 2, iTime.length) + ":00";
    oTime = atDt + " " + oTime.slice(0, 2) + ":" + oTime.substring(oTime.length - 2, oTime.length) + ":00";
    iTm = moment(iTime).format();
    oTm = moment(oTime).format();

    selShift = new Shift();
    l = 0;
    dif1 = 0;
    dif2 = 0;

    let itmlst1 = this.ShiftList.filter(d => d.inTimeVal <= inTmVl);
    let itmlst2 = this.ShiftList.filter(d => d.inTimeVal > inTmVl);

    itm1 = new Shift();
    itm2 = new Shift();

    if (this.commonService.getLength(itmlst1)) {
      itm1 = itmlst1[itmlst1.length - 1];
    }

    if (this.commonService.getLength(itmlst2)) {
      itm2 = itmlst2[0];
    }

    pTm = atDt + " " + itm1.InTime?.slice(0, 2) + ":" + itm1.InTime?.substring(itm1.InTime.length - 2, itm1.InTime.length) + ":00";
    nTm = atDt + " " + itm2.InTime?.slice(0, 2) + ":" + itm2.InTime?.substring(itm2.InTime.length - 2, itm2.InTime.length) + ":00";
    dif1 = moment(iTm).diff(pTm, 'minute');
    dif2 = moment(nTm).diff(iTm, 'minute');
    console.log(dif1);
    console.log(dif2);

    if (dif1 <= dif2) {
      retItm = itm1;
    }
    else if (dif1 > dif2) {
      retItm = itm2;
    }

    rdw.ShiftID = retItm?.ShiftID;
    rdw.Shift = retItm?.Shift;
    console.log(rdw.Shift);

    rdw.ShiftMst = new Shift();
    rdw.ShiftMst = retItm;

    if (rdw?.AttIn && rdw?.AttOut && rdw?.AttIn != 0 && rdw?.AttOut != 0) {
      rdw.Status = 'P'
    }
    else if ((rdw?.AttIn == 0 || rdw?.AttIn == '0') && (rdw?.AttOut == 0 || rdw?.AttOut == '0')) {
      rdw.Status = 'A'
    }
    else if (rdw?.AttIn || rdw?.AttOut) {
      rdw.Status = 'MP'
    }
    else if (rdw.ShiftID) {
      let shift = this.ShiftList.filter(d => d.ShiftID == rdw.ShiftID);
      if (rdw?.AttIn <= shift[0].FirstSession) {
        rdw.Status = 'FH'
      }
      else if (rdw?.AttIn <= shift[0].SecondSession) {
        rdw.Status = 'SH'
      }
      else {
        rdw.Status = ''
      }

    }

    rdw.AttStatus = rdw.Status;
  }

  exportExcel() {

    import('xlsx').then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(this.dataGridList);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, 'Daily Attendance');
    });
  }

  exportPdf() {

    // /    this.cols = [
    //       {}
    //     ]

    import('jspdf').then((jsPDF) => {
      import('jspdf-autotable').then((x) => {
        const doc = new jsPDF.default("l", 'pt');
        // const tableDataWithSno = this.tableData.map((obj, index) => ({ ...obj, "S.No": index + 1 }));
        doc.deletePage(1);
        doc.addPage('a3', 'landscape');
        autoTable((doc as any), {
          head: [this.cols.map(column => column.header)],
          body: this.dataGridList.map(obj => this.cols.map(column => obj[column.field])),
          theme: 'grid',
          margin: { top: 120, right: 100, bottom: 40, left: 100 },
          styles: { halign: 'center', fontStyle: 'bold' },
          showHead: 'everyPage',
          headStyles: {
            minCellHeight: 30,
            fillColor: [52, 103, 235],
            textColor: [255, 255, 255]
          },
          didDrawPage: function (data) {
            data.settings.margin.top = 95;
          },
          columnStyles: {
            // Set first and second columns to left alignment
            1: { halign: 'left' },
          }
        });
        const imageOnTop = (doc: any) => {
          const imageData = new Image()
          imageData.src = ''
          this.pageCount = doc.internal.getNumberOfPages()
          for (var i = 1; i <= this.pageCount; i++) {
            doc.setPage(i)
            // doc.addImage(imageData, 'PNG', 550, 20, 60, 60);
          }
        }
        const addFooterAndHeader = (doc: any) => {
          const pageCount = doc.internal.getNumberOfPages()
          doc.setFont('sans-serif', 'bold')
          var today = new Date();
          var date = today.getDate() + '/' + (today.getMonth() + 1) + '/' + today.getFullYear();
          var h = today.getHours(), m = today.getMinutes();
          var time = (h > 12) ? (h - 12 + ':' + m + ' PM') : (h + ':' + m + ' AM');
          const header = date + ' - ' + time;
          const footer = window.location.host + window.location.pathname
          doc.setFontSize(12)
          for (var i = 1; i <= pageCount; i++) {
            doc.setPage(i)
            doc.text(header, 40, 15, { baseline: 'top' });
            doc.text(' Page ' + String(i) + ' of ' + String(pageCount), doc.internal.pageSize.width / 2, 815, {

              align: 'center'

            });
          }
        }

        let pdfName = "Daily Attendance"
        const pdfHtml = document.querySelector('#htmlData');
        doc.html(pdfHtml.innerHTML, {
          callback: function (doc) {
            addFooterAndHeader(doc)
            imageOnTop(doc)
            doc.save(pdfName);
          },
        });
      });

    });
  }

  submit() {

    let req = new SaveDailyAttendanceRequest();
    req.Result = this.dataGridList;

    req.Result.forEach(x=> {

      x.AttDate = moment(x.AttDate).format(AppConfig.UPDATE_DATE_FORMAT);
      x.AttIn = x.AttDate + 'T' + x.AttIn.slice(0,2) + ':' + x.AttIn.slice(2,4) + ':00'
      x.AttOut = x.AttDate + 'T' + x.AttOut.slice(0,2) + ':' + x.AttOut.slice(2,4) + ':00'
      x.FnOt = x.OtS1;
      x.AnOt = x.OtS2;
      x.FnStatus = x.StsS1;
      x.AnStatus = x.StsS2;

    });


    this.apiService.postData("SaveDailyAttendance", req).subscribe((data: ServiceReponse) => {
      if (data.SuccessCode == 1) {

        this.sessionService.showSuccess("DailyAttendance  updated successfully");

      }
      else {
        this.sessionService.showError(data.ErrorMessage);
      }
    });
  }




  saveAsExcelFile(buffer: any, fileName: string): void {
    let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    let EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }

}
