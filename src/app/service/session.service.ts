import { Injectable } from "@angular/core";
import { AppConfig, logLevel } from '../const/app.config';
import { ToastrService } from 'ngx-toastr';
import { RequestBase, ServiceRequest, SettingGetAllRequest } from '../model/request.model';
import { Status, RoleInfo, GenderInfo, MenuGroup, SiteInfo, Master_LookUp, FunctionInfo, ErrorInfo, AppsInfo, Master_Item, MenuInfo, MasterMenuGetbyRoleidresult, MasterRoleFunctionidsGetbyRoleidResult, Master_FabricType, Country, State, TimeZone, HouseMasterInfo, AgentMasterInfo, ItemCategoryTaxDetails, Currency, MasterRoleReports, MasterTabView, CorpInfo, SettingDetail, Setting } from '../model/shared.model';
import { FormGroup} from '@angular/forms';
import { ShowOnDirtyErrorStateMatcher } from '@angular/material/core';

@Injectable()
export class SessionService 
{
    public AppID: number;
    public AppCode: string;

    public StatusList: Status[];
    public StatusListAll: Status[];
    public ActiveStatusList: Status[];
    public ItemList:Master_Item[]
    
    public DeviceType: string;
    public DeviceID: string;
    public UserID: number;
    public DepartmentID: number;
    public SiteID: number;
    public CorpID: number;
    public ManagerUserID: number;
    public UserName: string;
    public FullName: string;
    public SessionID: string;
    public RegionalTimeZone: string;
    public RoleID:number;
    public SelectedRoleList:RoleInfo[];
  
    public GenderList: GenderInfo[];
    public FabricTypeList: Master_FabricType[];
    
    public NoOfRowsPerPage: number;
    public RowsPerPageOptions: number[];
    public GroupMenuList:MenuGroup[];
    public UserCorpInfo: CorpInfo;
    public UserRoleInfo: RoleInfo[];
    public UserSiteInfo: SiteInfo[];
    public UserAppsInfo: AppsInfo[];
    public CurrentPath: string;
    public FunctionList:MasterRoleFunctionidsGetbyRoleidResult[];
    public ReportsList: MasterRoleReports[];    
    public LookupList: Master_LookUp[];
    
    public ToolTipPosition: string;

    public DataTableScrollHeight: string;
    public DataTableScrollHeight2: string;

    public ErrorMessageList:ErrorInfo[];

    public isDebug: boolean;

    public showMenuBar: boolean;

    public commonMessageType:logLevel;
    public commonMessage:string;

    public ServerDownMessage:string;

    public CountryList: Country[];
    public StateList: State[];
    public TimeZoneList: TimeZone[];
    public HouseList: HouseMasterInfo[];
    public AgentList: AgentMasterInfo[];
    public AppsList: AppsInfo[];
    public CurrencyList: Currency[];

    public matcher: ShowOnDirtyErrorStateMatcher;
    public dialogItem: ItemCategoryTaxDetails;
    public siteConfigList: Setting[];

    constructor(private toastService: ToastrService) 
    {

        this.StatusList = [];
        this.ActiveStatusList = [];

        this.UserRoleInfo = [];
        this.FunctionList =[];
        this.StatusList = new Array();
        this.NoOfRowsPerPage = 100;
        this.RowsPerPageOptions = [5,10,15,25, 50, 75, 100];
        this.ToolTipPosition = 'below';
      
        this.DataTableScrollHeight = this.getDataTableHeight(300).toString() + 'px';
        this.DataTableScrollHeight2 = this.getDataTableHeight(330).toString() + 'px';

        this.ServerDownMessage = "Unable to connect. Internet connectivity is very low or no internet access";

        this.showMenuBar = false;

        this.matcher  = new ShowOnDirtyErrorStateMatcher();
    }
    
    getFormDataScrollHeightInPX(): string
    {
        return this.getDataTableHeight(230).toString() + 'px';
    }

    getDataTableScrollHeightInPX(): string
    {
        return this.getDataTableHeight(300).toString() + 'px';
    }

    getColumnScrollHeightInPX(): string
    {
        return this.getDataTableHeight(100).toString() + 'px';
    }

    public FillRequestBase(request: RequestBase)
    {
        request.UserID = this.UserID;
        request.CorpID = this.CorpID;
        request.SiteID = this.SiteID;
        request.SessionID = this.SessionID;
        request.DeviceType = 'FS';
        request.DeviceID = this.DeviceID;
        request.AppAuthKey = AppConfig.APP_AUTH_KEY;
        request.AppID = this.AppID;
    }

    public GetRequestBase(): ServiceRequest 
    {
        let request = new ServiceRequest();
        request.UserID = this.UserID;
        request.CorpID = this.CorpID;
        request.SiteID = this.SiteID;
        request.SessionID = this.SessionID;
        request.DeviceType = 'FS';
        request.DeviceID = this.DeviceID;
        request.AppAuthKey = AppConfig.APP_AUTH_KEY;
        request.AppID = this.AppID;
        return request;
    }

    public showSuccess(message: string) 
    {
        this.toastService.success(message, 'Success');
    }

    public showError(message: string) 
    {
        this.toastService.error(message, 'Error');
    }

    public parseNumber(n1: number): number 
    {

        if (n1 != undefined && n1 != null && n1.toString().length > 0) {
            n1 = Number.parseFloat(n1.toString())
        }
        else {
            n1 = 0;
        }
        return Number.parseFloat(n1.toString())
    }

    public log(message, level)
    {
        if (level <= AppConfig.CONSOLE_LOG_LEVEL) {
            if (level == logLevel.Error) {
                console.error(message);
            }
            else if (level == logLevel.Warning) {
                console.warn(message);
            }
            else if (level == logLevel.Info) {
                console.info(message);
            }
            else if (level == logLevel.Debug) {
                console.info(message);
            }
            else if (level == logLevel.Trace) {
                console.trace(message);
            }
            else if (level == logLevel.DevLog) {
                console.log(message);
            }
        }
    }

    public actionAllowed(fname: string): boolean 
    {
        if (this.FunctionList != null) {
            if (this.FunctionList.findIndex(x => x.FunctionName == fname && x.IsTagged == 'Y') >= 0) {
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

    public reportAllowed(fname: string): boolean 
    {
        if (this.ReportsList != null) {
            if (this.ReportsList.findIndex(x => x.ReportName == fname) >= 0) {
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

    public GetStatusByCategory(categoryName:string){
        return this.StatusListAll.filter(x=>x.Category == categoryName);
    }

    LookUp(lookupDomain: string): any[] 
    {
        let x = new Array();
        if (this.LookupList != null) {
            x = this.LookupList.filter(x => x.DomainDescription == lookupDomain);
        }
        return x;
    }

    LookUpDescription(lookupID: number): string 
    {
        let x = null;
        if (this.LookupList != null) {
            x = this.LookupList.find(x => x.LookupID == lookupID).LookupDomain;
            if (x == null || x == undefined)
            {
                x = '';
            }
        }
        return x;
    }

    LookUpDomain(lookupID: number): string 
    {
        let x = null;
        if (this.LookupList != null) {
            x = this.LookupList.find(x => x.LookupID == lookupID).DomainDescription;
            if (x == null || x == undefined) {
                x = '';
            }
        }
        return x;
    }

    LookUpDefault(lookupDomain: string): number
    {
        let x = 0;
        if (this.LookupList != null) {
            if (this.LookupList.find(x => x.DomainDescription == lookupDomain && x.IsDefault == true) != null)
            {
              if (this.LookupList.find(x => x.DomainDescription == lookupDomain && x.IsDefault == true).LookupID != null)
              {
                  x = this.LookupList.find(x => x.DomainDescription == lookupDomain && x.IsDefault == true).LookupID;
                  return x;
              }
              else {
                  return null;
              }
            }
            else {
                return null;
            }
        }
        else
        {
            return null;
        }
    }

    LookUpDefaultItem(lookupDomain: string): Master_LookUp
    {
        if (this.LookupList != null) {
            if (this.LookupList.find(x => x.DomainDescription == lookupDomain && x.IsDefault == true) != null) {
                let x = this.LookupList.find(x => x.DomainDescription == lookupDomain && x.IsDefault == true);
                return x;
             }
             else {
                    return null;
             }
        }
        else {
          return null;
        }
    }


    LookUpDomainExists(lookupDomain: string): boolean 
    {
        if (this.LookupList != null) {
            let x = this.LookupList.find(x => x.DomainDescription == lookupDomain);
            if (x != null) {
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

    LookUpIDExists(lookupID: number): boolean 
    {
        if (this.LookupList != null) {
            let x = this.LookupList.find(x => x.LookupID == lookupID);
            if (x != null) {
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

    
    public getDataTableHeight(heightReduce: number): number 
    {
        let height = screen.availHeight - heightReduce;
        if (height <= 0) {
            height = 500;
        }
        return height;
    }

    public GetStatusByMode(mode: string): Status[] 
    {
        
        if (mode == 'ADD') {
        
            return this.StatusList.filter(x => x.StatusCode == 10);
        }
        else {
            return this.StatusList.filter(x => (x.StatusCode == 10 || x.StatusCode == 20));
        }
    }

    public ErrorMessageGetByErrorCode(errorCode:string, errorMessage:string):string
    {

        if(errorCode == "-1"){
            return this.ServerDownMessage;
        }
        let errorInfo = this.ErrorMessageList.find(x => x.ErrorCode == errorCode);
        if (errorInfo != null) {
            return errorInfo.ErrorDescription;
        }
        return errorMessage;
    }

    public GetSuccessMessageTextByMode(mode:string, screenName:string):string
    {
        if (mode == 'ADD') {
            return screenName +" "+ "Added Successfully";
        }
        else if (mode == 'EDIT') {
            return  screenName +" "+ "Updated Successfully"
        }
        else if (mode == 'DELETE') {
            return screenName +" "+ "Deleted Successfully"
        }
    }

    public HandleWebAPIResponseError(response: any) {
        if (response.ErrorCode == "0004") {
            alert(this.ErrorMessageGetByErrorCode(response.ErrorCode, response.ErrorMessage));
            window.location.reload();
        }
        else {

            this.showError(this.ErrorMessageGetByErrorCode(response.ErrorCode, response.ErrorMessage));
        }
    }

    getScreenWidth(): number
    {
        if (this.showMenuBar)
        {
            return  (window.innerWidth - 253);
        }
        else
        {
            return (window.innerWidth - 88);
        }
    }

    getScreenWidth1(): number
    {
        return (window.innerWidth - 88);
    }

    getIframHeight(pxl:number): string
    {
        return (this.getDataTableHeight(pxl) + 'px');
    }
  

    /* start - azure style pagelayout methods */
     
    getTotalScreenWidthInPx(mode, formColumnsWidth)
    {
        if (mode == 'ADD' || mode == 'EDIT')
        {
            return this.getScreenWidth() + formColumnsWidth + 'px';
        }
        else
        {
            return this.getScreenWidth() + 'px';    
        }
    }
    
    getScreenWidthInPx()
    {
        return this.getScreenWidth() + 'px';
    }

    FirstColumnWidthInPx(formColumnsWidth)
    {        
        return formColumnsWidth + 'px';
    }

    scrollAdjust()
    {
        var ele = document.getElementById('routerContainer');
        if (ele != null){
            ele.scrollTo(0, 0);
        }
    }

    /* end - azure style pagelayout methods */

        //component error raise
        hasError(form:FormGroup, control: any, errorCode: any): boolean
        {
                try{
                    if (form != null){
                        if (control != null){
                            if (errorCode != null){
                                return form.controls[control].hasError(errorCode);
                            }
                            else
                            {
                                return false;
                            }
                        }
                        else
                        {
                            return false;
                        }
                    }
                    else{
                        return false;
                    }
                }
                catch{
                    //console.log(form);
                    //console.log(control);
                }
        }
        
        //
    

}
