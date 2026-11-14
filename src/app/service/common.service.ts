import { Injectable } from "@angular/core";
import { MatDialog } from '@angular/material/dialog';
import { AppConfig  } from '../const/app.config';
import * as moment from 'moment';
//import { NoteBoxDialogComponent } from "../common/noteboxdialog.component";
import { ChangePasswordDialogComponent } from '../useraccess/usersetup/changepassworddialog.component';
import { ConfirmDialogComponent } from '../common/confirmdialog.component';
import { SettingGetAllRequest } from "../model/request.model";
import { SessionService } from "./session.service";
import { SettingGetBySiteIDResponse } from "../model/response.model";
import { WebApiService } from "./webapi.service";

@Injectable()
export class CommonService {

    public readonly PATTERN_NUMBERS_ONLY: string = "^[0-9]*$";
    public readonly PATTERN_DATE: string = "^[0-9/]*$";
    public readonly PATTERN_VPA: string = "[a-zA-Z0-9.-]+@[a-zA-Z0-9-]*";

    public readonly PATTERN_EMAIL: string = "^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$";
    public readonly PATTERN_PAN: string = "[A-Z|a-z]{5}[0-9]{4}[A-Z|a-z]{1}";
    public readonly PATTERN_TAN: string = "[A-Z|a-z]{4}[0-9]{5}[A-Z|a-z]{1}";
    public readonly PATTERN_GST: string = "[0-9]{2}[A-Z|a-z]{5}[0-9]{4}[A-Z|a-z]{1}[0-9]{1}[Z|z]{1}[A-Z|a-z|0-9]{1}";
    public readonly PATTERN_IFSC: string = "[A-Z|a-z]{4}[0][A-Z|a-z|0-9]{6}";
    public readonly PATTERN_LAT: string = "^[+-]?(([1-8]?[0-9])(\.[0-9]{1,6})?|90(\.0{1,6})?)$";
    public readonly PATTERN_LNG: string = "^[+-]?((([1-9]?[0-9]|1[0-7][0-9])(\.[0-9]{1,6})?)|180(\.0{1,6})?)$";

    public readonly PATTERN_CITY: string = "^[a-zA-Z ]*$";
    public readonly PATTERN_STATE: string = "^[a-zA-Z ]*$";
    public readonly PATTERN_COUNTRY: string = "^[a-zA-Z ]*$";
    public readonly PATTERN_PINCODE: string = "^[a-zA-Z0-9]*";

    public readonly PATTERN_MOBILE :string = "^[0-9]*";

    public readonly MIN_QUANTITY1 :number = 1;
    public readonly MAX_QUANTITY :number = 9999999999;
    public readonly PATTERN_QUANTITY: string = "^[0-9]*$";

    public readonly MIN_QUANTITY0 :number = 0;

    public readonly MIN_PERCENTAGE0 :number = 0;
    public readonly MAX_PERCENTAGE :number = 100;
    public readonly PATTERN_PERCENTAGE: string = "^[0-9]{0,3}(\.[0-9]{1,4})?$";

    public readonly MIN_RATIO :number = 0.0001;
    public readonly MAX_RATIO :number = 100;
    public readonly PATTERN_RATIO: string = "^[0-9]{0,3}(\.[0-9]{1,4})?$";

    public readonly MIN_AMOUNT0 :number = 0;
    public readonly MIN_AMOUNT1 :number = 1;
    public readonly MIN_AMOUNT :number = 0.0001;
    public readonly MAX_AMOUNT : number = 9999999999.9999;
    public readonly PATTERN_AMOUNT: string = "^[0-9]{0,10}(\.[0-9]{1,4})?$";

    public readonly MIN_CONVERSION_RATE :number = 0.0001;
    public readonly MAX_CONVERSION_RATE : number = 9999.9999;
    public readonly PATTERN_CONVERSION_RATE: string = "^[0-9]{0,4}(\.[0-9]{1,4})?$";

    public readonly MIN_WEIGHT :number = 0.0001;
    public readonly MAX_WEIGHT : number = 9999999999.9999;
    public readonly PATTERN_WEIGHT: string = "^[0-9]{0,10}(\.[0-9]{1,4})?$";

    public readonly MIN_DIA :number = 0.0001;
    public readonly MAX_DIA : number = 9999999999.9999;
    public readonly PATTERN_DIA: string = "^[0-9]{0,10}(\.[0-9]{1,4})?$";

    public readonly MIN_GSM :number = 0.0001;
    public readonly MAX_GSM : number = 9999999999.9999;
    public readonly PATTERN_GSM: string = "^[0-9]{0,10}(\.[0-9]{1,4})?$";

    public readonly MIN_HIERARCHY :number = 1;
    public readonly MAX_HIERARCHY :number = 9999999999;
    public readonly PATTERN_HIERARCHY: string = "^[0-9]*$";
    public readonly PATTERN_EMPID: string = "^[a-z0-9A-Z-]*$";

    constructor(public dialog: MatDialog,public sessionService: SessionService, private apiService: WebApiService) {
    }

    cloneAny(c: any): any {
        let target = [];
        for (let prop in c) {
            target[prop] = c[prop];
        }
        return target;
    }

    cloneAnyArray(itm: any[]): any[] {
        let target = new Array();
        if (this.getLength(itm) != 0)
        {
            itm.forEach(aitm => {
                let targetItem = this.cloneAny(aitm);
                target.push(targetItem);
            });
        }
        return target;
    }

    formatDuration(hour, minute, second) {
        return ("00" + hour.toString()).slice(-2) + ":" + ("00" + minute.toString()).slice(-2) + ":" + ("00" + second.toString()).slice(-2);
    }

    formatDateTime(DateTimeStr: string) {
        if (DateTimeStr != null){
            return moment(DateTimeStr).format(AppConfig.GRID_DATETIME_FORMAT);
        }
        else
        {
            return null;
        }
    }

    formatDate(DateTimeStr: string) {
        if (DateTimeStr != null){
            return moment(DateTimeStr,AppConfig.GRID_DATE_FORMAT,true);
        }
        else{
            return null;
        }
    }

    formatAmount(amount: number) {
        if (amount != null){
           return amount.toFixed(4);
        }
        else{
            return null;
        }
    }

    formatAmount2Digits(amount: number) {
        if (amount != null){
           return amount.toFixed(2);
        }
        else{
            return null;
        }
    }

    formatNoDigits(amount: number) {
        if (amount != null){
           return amount.toFixed(0);
        }
        else{
            return null;
        }
    }

    formatPercentage(percentage: number) {
        if (percentage != null){
           return percentage.toFixed(4);
        }
        else{
            return null;
        }
    }

    formatRate(rate: number) {
        if (rate != null){
           return rate.toFixed(4);
        }
        else{
            return null;
        }
    }

    formatRate2Digits(rate: number) {
        if (rate != null){
           return rate.toFixed(2);
        }
        else{
            return null;
        }
    }


    formatWeight(weight: number) {
        if (weight != null){
           return weight.toFixed(4);
        }
        else{
            return null;
        }
    }

    formatWeight2Digits(weight: number) {
        if (weight != null){
           return weight.toFixed(2);
        }
        else{
            return null;
        }
    }

    formatGSM(gsm: number) {
        if (gsm != null){
           return gsm.toFixed(4);
        }
        else{
            return null;
        }
    }

    formatGSM2Digits(gsm: number) {
        if (gsm != null){
           return gsm.toFixed(2);
        }
        else{
            return null;
        }
    }

    toNumber(numberString: string) : number {
        if (numberString != null){
           try{
                return Number(numberString);
            }
            catch{
                return null;
            }
        }
        else{
            return null;
        }
    }

    ifNullNum(data:any): number {
        if (data != null) {
            return data;
        }
        else {
            return 0;
        }
    }

    ifNullStr(data:any): string {
        if (data != null) {
            return data;
        }
        else {
            return "";
        }
    }

    ifNullDt(data:any): string {
        if (data != null) {
            return data;
        }
        else {
            return moment().format();
        }
    }

    getLengthNA(data: any): number {
        if (data != null) {
            return data.length;
        }
        else {
            return 0;
        }
    }

    getLength(data: any[]): number
    {
        if (data != null)
        {
            return data.length;
        }
        else
        {
            return 0;
        }
    }

    
    loadSiteSettingsAll()
    {
        let req = new SettingGetAllRequest();

        req.IsCorporateSetting = false;
        req.SettingCorpID = this.sessionService.CorpID;
        req.SettingSiteID = this.sessionService.SiteID;

        this.sessionService.siteConfigList = new Array();
  
        this.apiService.postData("SettingGetAll", req).subscribe((data: SettingGetBySiteIDResponse) => {
          if (data.SuccessCode == 1) {
  
            if (this.getLength(data.ResultList) > 0) {
                data.ResultList.forEach(x=> {
                    if (this.getLength(x.SettingList) > 0)
                    {
                        x.SettingList.forEach(d=> {
                            this.sessionService.siteConfigList.push(d);
                        });
                    }
                });
            }
  
          }

        });
    }


    // getYears(): YearInfo[] {

    //     let i = 1980;
    //     let YearList = [];

    //     while (i <= moment().year()) {
    //         let nYear = new YearInfo();
    //         nYear.Yearname = i;
    //         YearList.push(nYear);
    //         i += 1;
    //     };

    //     return YearList;
    // }

    // getMonths(): MonthInfo[] {

    //     let i = 1;
    //     let MonthList = [];

    //     while (i <= 12) {
    //         let nMon = new MonthInfo();
    //         nMon.Monthid = i;
    //         nMon.Monthname = moment("1/" + i + "/2000", "D/M/YYYY").format('MMMM');
    //         MonthList.push(nMon);
    //         i += 1;
    //     };

    //     return MonthList;
    // }

    getMaxID(data: any[], propertyName: string)
    {
        let id = 0;

        if (this.getLength(data) > 0)
        {
            data.forEach(x => {
                if (x[propertyName] > id)
                    id = x[propertyName];
            });
        }

        return id;
    }

    nvl(data, nvlReplaceVal): any {
        if (data != null)
        {
            return data;
        }
        else
        {
            return nvlReplaceVal;
        }
    }

    getCurrentDateTimeStr(): string {
        return new Date().toLocaleTimeString().toString();
    }

    isValidDate(dateInput: string): boolean {

        //console.log('common service date input ' + dateInput);

        if (dateInput != null) {
            if ((dateInput.length) == 10) {
                if (moment(dateInput, "DD-MM-YYYY", true).isValid()) {
                    return true;
                }
                else if (moment(dateInput, "DD/MM/YYYY", true).isValid())
                {
                    return true;
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

    isValidPartialDate(dateInput: string) {
        if (dateInput != null
            && (dateInput.length == 4 || dateInput.length == 6 || dateInput.length == 8)) {

            //log('YYYY: ' + moment(dateInput, "YYYY", true).isValid());
            //log('DD-MMM: ' + moment(dateInput, "DD-MMM", true).isValid());
            //log('MMM-YYYY: ' + moment(dateInput, "MMM-YYYY", true).isValid());

            //Valid - partial date formats => MON, YYYY, DD-MON, MON-YYYY
            if (
                (dateInput.length == 4 && moment(dateInput, "YYYY", true).isValid()) ||
                (dateInput.length == 6 && moment(dateInput, "DD-MMM", true).isValid()) ||
                (dateInput.length == 8 && moment(dateInput, "MMM-YYYY", true).isValid())
            ) {
                return true;
            }
            else {
                return false;
            }
        }
        else {
            return false;
        }
    }

    // reloadLookUp() {
    //     this.apiService.postData("LookUpGetAllByCorpID", null).subscribe((data: LookUpGetAllByCorpIDResponse) => {
    //         if (data.SuccessCode == 1) {
    //             this.sessionService.LookUp = data.lookupList;
    //         }
    //         else if (data.SuccessCode == 0) {
    //             this.sessionService.showError(data.ErrorMessage);
    //         }
    //     });
    // }

    loadFuntionsInfo(menuID) {

        //let req = new FunctionsInfoGetAllRequest();

        //req.roleid = this.sessionService.UserRoleInfo[0].roleid;
        //req.menuid = menuID;

        //this.signalRService.postData("FunctionsInfoGetAll", req).subscribe((data: FunctionsInfoGetAllResponse) => {
        //    if (data.SuccessCode == 1) {
        //        this.sessionService.functionsList = data.ResultList;
        //    }
        //    else {
        //        this.sessionService.showError(data.ErrorMessage);
        //    }
        //});

    }



    compareStartAndEndDate(startDate: string, endDate: string): boolean
    {
        let startDateFrom = null;
        let startDateTo = null;
        let endDateFrom = null;
        let endDateTo = null;

        if (this.getLengthNA(startDate) > 0 && this.getLengthNA(endDate) > 0)
        {

            if (startDate == "Unknown")
            {
                return true;
            }

            if (endDate == "Unknown") {
                return true;
            }

            if (this.isValidDate(startDate)) {
                startDateFrom = startDate;
                startDateTo = startDate;
            }
            else
            {
                if (startDate.length == 6) {
                    //infinite year
                    return true;
                }
                else if (startDate.length == 8)
                {
                    startDateFrom = "01" + "-" + startDate;
                    startDateTo = moment(startDate, "MMM-YYYY").daysInMonth() + "-" + startDate;
                }
                else if (startDate.length == 4) {
                    startDateFrom = "01" + "-JAN-" + startDate;
                    startDateTo = "31" + "-DEC-" + startDate;
                }
            }

            if (this.isValidDate(endDate)) {
                endDateFrom = endDate;
                endDateTo = endDate;
            }
            else
            {
                if (endDate.length == 6) {
                    //infinite year
                    return true;
                }
                else if (endDate.length == 8) {
                    endDateFrom = "01" + "-" + endDate;
                    endDateTo = moment(endDate, "MMM-YYYY").daysInMonth() + "-" + endDate;
                }
                else if (endDate.length == 4) {
                    endDateFrom = "01" + "-JAN-" + endDate;
                    endDateTo = "31" + "-DEC-" + endDate;
                }
            }

            if (moment(startDateFrom).isAfter(endDateTo)) {
                return false;
            }
            else
            {
                return true;
            }

        }
        else
        {
            return true;
        }

    }


    filler(): string {
        return '—';
    }

    nvlFiller(data: string): string {
        return this.nvl(data, this.filler());
    }

    getNoteToolTip(note): string {
        if (this.getLengthNA(note) > 0)
        {
            if (this.getLengthNA(note) <= 100)
            {
                return note;
            }
            else
            {
                return note.substring(0, 100) + " ...";
            }
        }
        else
        {
            return null;
        }
    }

    showNoteBox(notetypedesc, note) {
        // let dialogRef = this.dialog.open(NoteBoxDialogComponent, {
        //     //height: '450px',
        //     width: '600px',
        //     data: {
        //         Header: notetypedesc,
        //         Message: note
        //     },
        //     disableClose: false,
        // });

        // dialogRef.afterClosed().subscribe(result => {
        //     if (result) {
        //         {

        //         }
        //     }
        // });
    }

    yesNo(trueFalse: Boolean): string {

        if (trueFalse != null) {
            if (trueFalse) {
                return 'Yes';
            }
            else {
                return 'No';
            }
        }
        else {
            return 'No';
        }

    }

    logout() {

        let dialogRef = this.dialog.open(ConfirmDialogComponent, {
            data: {
                DialogHeader: 'Logout Confirmation',
                DialogMessage: 'Are you sure ?'
            },
            disableClose: true,
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result == 1) {

                window.location.reload();

            }
        });

    }

    changePasswordClick() {
        let dialogRef = this.dialog.open(ChangePasswordDialogComponent, {
            height: '55%',
            width: '40%',
            disableClose: true,
        });
    }

 
   

}
