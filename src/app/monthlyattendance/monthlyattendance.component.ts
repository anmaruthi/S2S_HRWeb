import { Component, OnInit } from '@angular/core';
import { SessionService } from '../service/session.service';
import { DailyAttendance, EmployeeCategory, EmployeeDepartment, EmployeeDesignation, EmployeeGroup, EmployeeType } from '../model/shared.model';
import { CommonService } from '../service/common.service';
import { DailyAttendanceGetBySiteIDRequest, ServiceRequest } from '../model/request.model';
import { WebApiService } from '../service/webapi.service';
import { DailyAttendanceGetBySiteIDResponse, MasterDataEmployeeGetAllResponse } from '../model/response.model';
import * as FileSaver from 'file-saver';
import * as jspdf from 'jspdf';
import autoTable from 'jspdf-autotable';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-monthlyattendance',
  templateUrl: './monthlyattendance.component.html',
  styleUrls: ['./monthlyattendance.component.scss']
})
export class MonthlyattendanceComponent implements OnInit {
  public cols: any;
  public cols1: any;
  public selectedData: any;
  public dataGridList: any[];
  public FormColumnsWidth: number;
  public Mode: string
  public SelectedGroup: EmployeeGroup;
  public submitAttempt: boolean = false;
  public EmployeeGroupList: EmployeeGroup[];
  public EmployeeCategoryList: EmployeeCategory[];
  public SelectedCategory: EmployeeCategory;
  public EmployeeTypeList: EmployeeType[];
  public SelectedType: EmployeeType;
  public EmployeeDepartmentList: EmployeeDepartment[];
  public SelectedDepartment: EmployeeDepartment;
  public EmployeeDesignationList: EmployeeDesignation[];
  public SelectedDesignation: EmployeeDesignation;
  public SelectedMonth: any
  public month_list: any[];
  public year_list: any[];
  public SelectedYear: any
  public visible: boolean = false
  filtterGroupID: any;
  filttercatID: any;
  filtterTypeID: any;
  filtterDepID: any;
  filtterDesID: any;
  filttermonthID: any;
  filtteryearID: any;
  filterList: any[] = [];
  tableColumns: {}[];
  pageCount: any;
  data: any;
  dataGridList1: any[];
  SelectedDate: any;
  currentMonth: number;
  currentYear: number;
  daysInMonth: Date[] = [];
  individual: any[] = [];
  empCode: any;
  IndEmpDetails: any;
  constructor(public DatePipe: DatePipe, public sessionService: SessionService, public commonService: CommonService, private apiService: WebApiService,) {
    const currentDate = new Date();
    this.currentMonth = currentDate.getMonth() + 1;
    this.currentYear = currentDate.getFullYear();
  }

  ngOnInit(): void {

    this.month_list = [
      { id: 1, month: "Jan" },
      { id: 2, month: "Feb" },
      { id: 3, month: "Mar" },
      { id: 4, month: "Apr" },
      { id: 5, month: "May" },
      { id: 6, month: "Jun" },
      { id: 7, month: "Jul" },
      { id: 8, month: "Aug" },
      { id: 9, month: "Sep" },
      { id: 10, month: "Oct" },
      { id: 11, month: "Nov" },
      { id: 12, month: "Dec" },
    ];

    this.year_list = [
      { id: '2023', year: "2023" },
      { id: '2024', year: "2024" },
      { id: '2025', year: "2025" },
      { id: '2026', year: "2026" },
    ]
    this.cols1 = [
      { field: 'EmpCode', header: "Emp Code", width: '5%', align: 'left', wrap: 'break-word' },
      { field: 'EmpName', header: "Emp Name", width: '15%', align: 'left', wrap: 'break-word' },
      { field: 'Shift', header: "Shift", width: '3%', align: 'left', wrap: 'break-word' },
      { field: 'InTime', header: "In Time", width: '4%', align: 'right', wrap: 'break-word' },
      { field: 'OutTime', header: "Out Time", width: '4%', align: 'right', wrap: 'break-word' },
      { field: 'Status', header: "Status", width: '5%', align: 'right', wrap: 'break-word' },
      { field: 'OtS1', header: "OT-S1", width: '3%', align: 'right', wrap: 'break-word' },
      { field: 'OtS2', header: "OT-S2", width: '3%', align: 'right', wrap: 'break-word' },
      { field: 'StsS1', header: "S1", width: '3%', align: 'right', wrap: 'break-word' },
      { field: 'StsS2', header: "S2", width: '3%', align: 'right', wrap: 'break-word' },
      { field: 'LateMins', header: "Late", width: '3%', align: 'right', wrap: 'break-word' },
      { field: 'EarlMins', header: "Early", width: '3%', align: 'right', wrap: 'break-word' },
    ];
    this.cols = [
      { field: 'unique_id_no', header: "Emp Code", width: '5%', align: 'left', wrap: 'break-word' },
      { field: 'name', header: "Emp Name", width: '5%', align: 'left', wrap: 'break-word' },
      { field: '1', header: "1", width: '1%', align: 'left', wrap: 'break-word' },
      { field: '2', header: "2", width: '1%', align: 'left', wrap: 'break-word' },
      { field: '3', header: "3", width: '1%', align: 'left', wrap: 'break-word' },
      { field: '4', header: "4", width: '1%', align: 'left', wrap: 'break-word' },
      { field: '5', header: "5", width: '1%', align: 'left', wrap: 'break-word' },
      { field: '6', header: "6", width: '1%', align: 'left', wrap: 'break-word' },
      { field: '7', header: "7", width: '1%', align: 'left', wrap: 'break-word' },
      { field: '8', header: "8", width: '1%', align: 'left', wrap: 'break-word' },
      { field: '9', header: "9", width: '1%', align: 'left', wrap: 'break-word' },
      { field: '10', header: "10", width: '1%', align: 'left', wrap: 'break-word' },
      { field: '11', header: "11", width: '1%', align: 'left', wrap: 'break-word' },
      { field: '12', header: "12", width: '1%', align: 'left', wrap: 'break-word' },
      { field: '13', header: "13", width: '1%', align: 'left', wrap: 'break-word' },
      { field: '14', header: "14", width: '1%', align: 'left', wrap: 'break-word' },
      { field: '15', header: "15", width: '1%', align: 'left', wrap: 'break-word' },
      { field: '16', header: "16", width: '1%', align: 'left', wrap: 'break-word' },
      { field: '17', header: "17", width: '1%', align: 'left', wrap: 'break-word' },
      { field: '18', header: "18", width: '1%', align: 'left', wrap: 'break-word' },
      { field: '19', header: "19", width: '1%', align: 'left', wrap: 'break-word' },
      { field: '20', header: "20", width: '1%', align: 'left', wrap: 'break-word' },
      { field: '21', header: "21", width: '1%', align: 'left', wrap: 'break-word' },
      { field: '22', header: "22", width: '1%', align: 'left', wrap: 'break-word' },
      { field: '23', header: "23", width: '1%', align: 'left', wrap: 'break-word' },
      { field: '24', header: "24", width: '1%', align: 'left', wrap: 'break-word' },
      { field: '25', header: "25", width: '1%', align: 'left', wrap: 'break-word' },
      { field: '26', header: "26", width: '1%', align: 'left', wrap: 'break-word' },
      { field: '27', header: "27", width: '1%', align: 'left', wrap: 'break-word' },
      { field: '28', header: "28", width: '1%', align: 'left', wrap: 'break-word' },
      { field: '29', header: "29", width: '1%', align: 'left', wrap: 'break-word' },
      { field: '30', header: "30", width: '1%', align: 'left', wrap: 'break-word' },
      { field: '31', header: "31", width: '1%', align: 'left', wrap: 'break-word' },
    ];
    this.dataGridList = [
      {
        "1": "0",
        "2": "0",
        "3": "PH",
        "4": "PH",
        "5": "0",
        "6": "0",
        "7": "0",
        "8": "0",
        "9": "0",
        "10": "PH",
        "11": "PH",
        "12": "0",
        "13": "1",
        "14": "1",
        "15": "1",
        "16": "1",
        "17": "PH",
        "18": "PH",
        "19": "0",
        "20": "1",
        "21": "1",
        "22": "1",
        "23": "1",
        "24": "PH",
        "25": "PH",
        "26": "LH",
        "27": "1",
        "28": "1",
        "29": "LH",
        "30": "1",
        "31": "0",
        "unique_id_no": "1021671191",
        "name": "Boobalan",
        "GroupID": '5',
        "CategoryID": '8',
        "TypeID": '2',
        "DepartmentID": '1',
        "DesignationID": '3',
        "Month": '1',
        "Year": '2023',
      },
      {
        "1": "0",
        "2": "0",
        "3": "PH",
        "4": "PH",
        "5": "0",
        "6": "0",
        "7": "0",
        "8": "0",
        "9": "0",
        "10": "PH",
        "11": "PH",
        "12": "0",
        "13": "1",
        "14": "1",
        "15": "1",
        "16": "1",
        "17": "PH",
        "18": "PH",
        "19": "0",
        "20": "1",
        "21": "1",
        "22": "1",
        "23": "1",
        "24": "PH",
        "25": "PH",
        "26": "LH",
        "27": "1",
        "28": "1",
        "29": "LH",
        "30": "1",
        "31": "0",
        "unique_id_no": "1021671191",
        "name": "Boobalan2",
        "GroupID": '5',
        "CategoryID": '8',
        "TypeID": '2',
        "DepartmentID": '1',
        "DesignationID": '3',
        "Month": '1',
        "Year": '2024',
      },

    ]
    this.individual = [
      { EmpCode: 1, EmpFID: '1090976', GroupName: 'Group', EmpName: 'testing Emp 1', DestinationName: 'designation', In: '0792', Out: '1900', date: '01/02/2024', DepartmentName: 'DepartmentName' },
      { EmpCode: 1, EmpFID: '1090976', GroupName: 'Group', EmpName: 'testing Emp 1', DestinationName: 'designation', In: '0792', Out: '1900', date: '02/02/2024', DepartmentName: 'DepartmentName' },
      { EmpCode: 1, EmpFID: '1090976', GroupName: 'Group', EmpName: 'testing Emp 1', DestinationName: 'designation', In: '0792', Out: '1900', date: '03/02/2024', DepartmentName: 'DepartmentName' },
      { EmpCode: 1, EmpFID: '1090976', GroupName: 'Group', EmpName: 'testing Emp 1', DestinationName: 'designation', In: '0792', Out: '1900', date: '04/02/2024', DepartmentName: 'DepartmentName' },
      { EmpCode: 1, EmpFID: '1090976', GroupName: 'Group', EmpName: 'testing Emp 1', DestinationName: 'designation', In: '0792', Out: '1900', date: '05/02/2024', DepartmentName: 'DepartmentName' },
      { EmpCode: 1, EmpFID: '1090976', GroupName: 'Group', EmpName: 'testing Emp 1', DestinationName: 'designation', In: '0792', Out: '1900', date: '06/02/2024', DepartmentName: 'DepartmentName' },
      { EmpCode: 1, EmpFID: '1090976', GroupName: 'Group', EmpName: 'testing Emp 1', DestinationName: 'designation', In: '0792', Out: '1900', date: '07/02/2024', DepartmentName: 'DepartmentName' },
      { EmpCode: 1, EmpFID: '1090976', GroupName: 'Group', EmpName: 'testing Emp 1', DestinationName: 'designation', In: '0792', Out: '1900', date: '08/02/2024', DepartmentName: 'DepartmentName' },
      { EmpCode: 2, EmpFID: '1090976', GroupName: 'Group', EmpName: 'testing Emp 1', DestinationName: 'designation', In: '0792', Out: '1900', date: '08/02/2024', DepartmentName: 'DepartmentName' },

    ]

    this.loadMasterData();
    this.SelectedGroup = new EmployeeGroup();
    this.SelectedCategory = new EmployeeCategory();
    this.SelectedType = new EmployeeType();
    this.SelectedDepartment = new EmployeeDepartment();
    this.SelectedDesignation = new EmployeeDesignation();
    this.filtterGroupID = '';
    this.filttercatID = '';
    this.filtterTypeID = '';
    this.filtterDepID = '';
    this.filtterDesID = '';
    this.filttermonthID = '';
    this.filtteryearID = '';
    this.SelectedMonth = this.currentMonth
    this.SelectedYear = this.currentYear

  }

  loadDataGrid() {
    debugger
    let req = new DailyAttendanceGetBySiteIDRequest();
    req.GroupID = this.commonService.ifNullNum(this.SelectedGroup.GroupID);
    req.CategoryID = this.commonService.ifNullNum(this.SelectedCategory.CategoryID);
    req.TypeID = this.commonService.ifNullNum(this.SelectedType.TypeID);
    req.DepartmentID = this.commonService.ifNullNum(this.SelectedDepartment.DepartmentID);
    req.DesignationID = this.commonService.ifNullNum(this.SelectedDesignation.DesignationID);
    req.AttDate = this.commonService.ifNullDt(this.SelectedDate);

    this.dataGridList1 = new Array();

    this.apiService.postData("DailyAttendanceGetBySiteID", req).subscribe((data: DailyAttendanceGetBySiteIDResponse) => {
      if (data.SuccessCode == 1) {


        if (this.commonService.getLength(data.ResultList) > 0) {
          data.ResultList.forEach(x => {
            x.AttDate = this.commonService.ifNullDt(x.AttDate);
            x.AttIn = this.commonService.ifNullStr(x.AttIn);
            x.AttOut = this.commonService.ifNullStr(x.AttOut);
          });

          this.dataGridList1 = data.ResultList;
          console.log(this.dataGridList1);

        }
      }
      else {
        this.sessionService.showError(data.ErrorMessage);
      }
    });

  }

  loadMasterData() {
    let req = new ServiceRequest();

    this.apiService.postData("MasterDataEmployeeGetAll", req).subscribe((data: MasterDataEmployeeGetAllResponse) => {
      if (data.SuccessCode == 1) {
        debugger
        this.EmployeeGroupList = data.EmpGroupList;
        this.EmployeeCategoryList = data.EmpCategoryList;
        this.EmployeeTypeList = data.EmpTypeList;
        this.EmployeeDepartmentList = data.EmpDepartmentList;
        this.EmployeeDesignationList = data.EmpDesignationList
        // this.ShiftList = data.ShiftList;

        // if (this.commonService.getLength(this.ShiftList)) {
        //   this.ShiftList.forEach(x => {
        //     x.inTimeVal = Number(x.InTime);
        //     x.outTimeVal = Number(x.OutTime);
        //   });

        // }
      }


      else {
        this.sessionService.showError(data.ErrorMessage);
      }
    });



  }

  // loadDataGrid() {

  //   let req = new DailyAttendanceGetBySiteIDRequest();
  //   req.GroupID = this.commonService.ifNullNum(this.SelectedGroup.GroupID);
  //   req.CategoryID = this.commonService.ifNullNum(this.SelectedCategory.CategoryID);
  //   req.TypeID = this.commonService.ifNullNum(this.SelectedType.TypeID);
  //   req.DepartmentID = this.commonService.ifNullNum(this.SelectedDepartment.DepartmentID);
  //   req.DesignationID = this.commonService.ifNullNum(this.SelectedDesignation.DesignationID);
  //   // req.AttDate = this.commonService.ifNullDt(this.SelectedDate);

  //   this.dataGridList = new Array();

  //   this.apiService.postData("DailyAttendanceGetBySiteID", req).subscribe((data: DailyAttendanceGetBySiteIDResponse) => {

  //   });

  // }

  SelectEmpGroup(GroupInfo: any) {
    if (GroupInfo != null) {
      this.EmployeeGroupList.forEach(x => {
        if (x.GroupID == Number(GroupInfo.ID)) {
          this.SelectedGroup = this.commonService.cloneAny(x);
          this.filtterGroupID = GroupInfo.ID

        }
      });
    }

  }

  SelectEmpCategory(CategoryInfo: any) {
    if (CategoryInfo != null) {
      this.EmployeeCategoryList.forEach(x => {
        if (x.CategoryID == Number(CategoryInfo.ID)) {
          this.SelectedCategory = this.commonService.cloneAny(x);
          this.filttercatID = CategoryInfo.ID

        }
      });
    }
  }

  SelectEmpType(TypeInfo: any) {
    if (TypeInfo != null) {
      this.EmployeeTypeList.forEach(x => {
        if (x.TypeID == Number(TypeInfo.ID)) {
          this.SelectedType = this.commonService.cloneAny(x);
          this.filtterTypeID = TypeInfo.ID

        }
      });
    }
  }
  SelectEmpDepartment(DepartmentInfo: any) {
    if (DepartmentInfo != null) {
      this.EmployeeDepartmentList.forEach(x => {
        if (x.DepartmentID == Number(DepartmentInfo.ID)) {
          this.SelectedDepartment = this.commonService.cloneAny(x);
          this.filtterDepID = DepartmentInfo.ID

        }
      });
    }

  }

  SelectEmpDesignation(DesignationInfo: any) {
    if (DesignationInfo != null) {
      this.EmployeeDesignationList.forEach(x => {
        if (x.DesignationID == Number(DesignationInfo.ID)) {
          this.SelectedDesignation = this.commonService.cloneAny(x);
          this.filtterDesID = DesignationInfo.ID

        }
      });
    }

  }

  SelectedMonthFun(month: any) {
    debugger
    if (month != null) {
      this.month_list.forEach(x => {
        if (x.id == Number(month.id)) {
          this.SelectedMonth = this.commonService.cloneAny(x);
          // this.filttermonthID = this.SelectedMonth.id

        }
      });
    }
  }

  SelectedYearFun(year: any) {
    if (year != null) {
      this.year_list.forEach(x => {
        if (x.id == Number(year.id)) {
          this.SelectedYear = this.commonService.cloneAny(x);
          // this.filtteryearID = year.ID

        }
      });
    }
  }

  onDoubleClick(rowdata: any, empcode) {
    this.empCode = empcode
    debugger
    this.loadDataGrid();
    this.visible = true
    this.data = rowdata
    this.daysInMonth = [];

    const daysCount = new Date(this.SelectedYear, this.SelectedMonth, 0).getDate();

    console.log(daysCount);

    for (let i = 1; i <= daysCount; i++) {
      const date = new Date(this.SelectedYear, this.SelectedMonth - 1, i);

      this.daysInMonth.push(date);
    }
    console.log(this.daysInMonth);
    this.individual = this.individual.filter(x => x.EmpCode == this.empCode)
    console.log(this.individual);
    this.IndEmpDetails = this.individual[0]
    console.log(this.IndEmpDetails);


  }

  filter() {
    this.submitAttempt = true;

    if (this.filtterGroupID && this.filttercatID && this.filtterTypeID && this.filtterDepID && this.filtterDesID && this.SelectedMonth && this.SelectedYear) {
      this.dataGridList = this.dataGridList.filter(x =>
        (x.GroupID == this.filtterGroupID) &&
        (x.CategoryID == this.filttercatID) &&
        (x.TypeID == this.filtterTypeID) &&
        (x.DepartmentID == this.filtterDepID) &&
        (x.DesignationID == this.filtterDesID) &&
        (x.Month == this.SelectedMonth) &&
        (x.Year == this.SelectedYear)
      )

    }
    else {
      this.sessionService.showError("Kindly Select All the Fields...!");
    }
  }
  clear() {
    this.ngOnInit();
  }

  exportPdf() {

    this.tableColumns = [
      {}
    ]

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

        let pdfName = "Monthly Attendance"
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

  exportExcel() {

    import('xlsx').then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(this.dataGridList);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, 'Monthly Attendance');
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

  close() {
    this.visible = false
  }
}
