import { Component } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { ValidateLoginRequest, ServiceRequest, PrepareToSendMailRequest} from "../model/request.model";
import { ValidateLoginResponse, MenuGetByRoleIDResponse, MasterDataGetAllResponse, SaveReponse} from "../model/response.model";
import { WebApiService } from "../service/webapi.service";
import { SessionService } from "../service/session.service";
import { CommonService } from "../service/common.service";
import { AppConfig, logLevel } from "../const/app.config";
import { MatDialog } from '@angular/material/dialog';
import { LoaderService } from '../service/loader.service';
import { MatIconModule } from '@angular/material/icon';
import * as moment from 'moment';

@Component({
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent {

    public IsLoginSuccess:boolean;
    public login: ValidateLoginRequest;
    public RoleID:number;
    public AppID: number;

    public CopyRightInfo: string;
    public VersionInfo: string;

    constructor(public dialog: MatDialog, private router: Router, private apiService: WebApiService,
        public sessionService: SessionService,
        public commonService: CommonService,
        public loaderService: LoaderService
    ) {

        this.CopyRightInfo = "© " + moment().format("YYYY") + " Macromaxx Technologies, All Rights Reserved."
        this.VersionInfo = "Version: " + AppConfig.Version;

        this.login = new ValidateLoginRequest();

        if (this.sessionService.isDebug)
        {
            // this.login.UserName = "";
            // this.login.Password = "";
            // this.login.CorporateCode = "";

          this.login.UserName = "admin";
          this.login.Password = "abc@123";
          this.login.CorporateCode = "S2S";
        }
        else {
            this.login.UserName = "";
            this.login.Password = "";
            this.login.CorporateCode = "";
        }

        this.IsLoginSuccess = false;
    }

    ngOnInit() {
    }

    authenticate()
    {

        if (this.login.UserName != null && this.login.Password != null)
        {

            this.apiService.postData("ValidateLogin", this.login).subscribe(
                    (response: ValidateLoginResponse) => {

                 if (response.SuccessCode == 1) {
                    console.log('Login Response');
                    console.log(response);

                    this.sessionService.log('inside validate login response', logLevel.Debug);

                    this.sessionService.DeviceType = "FS";
                    this.sessionService.UserID = response.UserInfo.UserID;
                    this.sessionService.SessionID = response.SessionID;
                    this.sessionService.FullName = response.UserInfo.FirstName + ' ' + response.UserInfo.LastName;
                    this.sessionService.UserName = response.UserInfo.UserName;
                    this.sessionService.UserRoleInfo = response.UserRoleInfo;
                    this.sessionService.UserSiteInfo = response.UserSiteInfo;
                    this.sessionService.UserAppsInfo = response.UserAppInfo;
                    this.sessionService.DepartmentID = response.UserInfo.DepartmentID;

                    // adding default corporate and default center option - ALL
                    this.sessionService.CorpID = response.UserInfo.CorpID;
                    this.IsLoginSuccess = true;

                    if(this.sessionService.UserSiteInfo != undefined && this.sessionService.UserSiteInfo.length >0){
                        let primarySite = this.sessionService.UserSiteInfo.find(x=> x.SiteID == response.UserInfo.PrimarySiteID);
                        if(primarySite != undefined){
                            this.sessionService.SiteID = primarySite.SiteID;
                        }
                        else{
                            this.sessionService.SiteID = this.sessionService.UserSiteInfo[0].SiteID;
                        }

                        this.commonService.loadSiteSettingsAll();
                    }

                    if(this.sessionService.UserRoleInfo!=undefined&& this.sessionService.UserRoleInfo.length>0){
                        this.RoleID = this.sessionService.UserRoleInfo[0].RoleID;

                        this.sessionService.RoleID = this.RoleID;

                        this.loaderService.hide();

                        if (this.commonService.getLength(this.sessionService.UserRoleInfo) == 1)
                        {                             
                             this.submitClick();
                        }
                    }
                    else{
                        this.sessionService.showError("No Role is mapped for this user");
                    }
                }
                else {
                    this.sessionService.showError(response.ErrorMessage);
                }
            }
        );

        }
    }


    submitClick()
    {
        if (this.sessionService.SiteID != null && this.RoleID != null) {
            this.router.navigate(['/appshome']);
        }
    }

    cancelClick(){
        this.IsLoginSuccess =false;
        this.RoleID = undefined;
        this.sessionService.SiteID = undefined;
    }

}
