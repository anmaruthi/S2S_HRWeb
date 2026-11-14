import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { logLevel } from "../const/app.config";
import { SessionService } from "../service/session.service";
import { CommonService } from "../service/common.service";
import { WebApiService } from "../service/webapi.service";
import { MenuGetByRoleIDRequest, ServiceRequest } from "../model/request.model";
import { LoaderService } from '../service/loader.service';
import { MatDialog } from '@angular/material/dialog';
import { MasterDataGetAllResponse, MenuGetByRoleIDResponse, MasterData_RegisterCorp_GetAllResponse, SaveReponse, ServiceReponse, CorporateGetByCorpIDResponse } from '../model/response.model';

@Component({
    templateUrl: './appshome.component.html',
    styleUrls: ['./appshome.component.scss']
})

export class AppsHomeComponent implements OnInit {
    
    public ToolTipPosition: string;
    public showMenuBar: boolean;

    constructor( private router: Router, private apiService: WebApiService,
        public sessionService: SessionService, public commonService: CommonService, private loaderService: LoaderService,
        public dialog: MatDialog
    ) {

    }

    ngOnInit() {
        console.log('app home redirected');
        this.loadMasterData();
    }

    loadMasterData(){
        console.log('master data call');
        let req=new ServiceRequest();

        this.apiService.postData("MasterDataGetAll", req).subscribe((data: MasterDataGetAllResponse) => {
            if (data.SuccessCode == 1) {

                this.sessionService.StatusListAll = data.StatusList;
                this.sessionService.LookupList = data.LookUpList;
                this.sessionService.GenderList = data.GenderList;
                this.sessionService.StateList = data.StateList;
                this.sessionService.CountryList = data.CountryList;
                this.sessionService.TimeZoneList = data.TimeZoneList;
                this.sessionService.AppsList = data.AppsList;
                this.sessionService.CurrencyList = data.CurrencyList;
                console.log(data)

                if (this.commonService.getLength(this.sessionService.UserAppsInfo) == 1)
                {
                    this.AppsClick(this.sessionService.UserAppsInfo[0].AppID);
                }
            }
            else {
                this.sessionService.showError(data.ErrorMessage);
            }
        });

        // this.apiService.postData("MasterData_RegisterCorp_GetAll", null).subscribe((data: MasterData_RegisterCorp_GetAllResponse) => {
        //     if (data.SuccessCode == 1) {
            
        //         this.sessionService.StateList = data.StateList;
        //         this.sessionService.CountryList = data.CountryList;
        //         this.sessionService.TimeZoneList = data.TimeZoneList;
      
        //     }
        //     else
        //     {
        //       this.sessionService.showError(data.ErrorMessage);
              
        //     }
        // });
      
        // this.apiService.postData("ReadDataFromReader", req).subscribe((data: SaveReponse) => {
        //     if (data.SuccessCode == 1) {

        //         console.log(data)
        //     }
        //     else {
        //         this.sessionService.showError(data.ErrorMessage);
        //     }
        // });
    }

    toggleMenuBar() {
        this.showMenuBar = !this.showMenuBar;
    }
    
    AppsClick(appid)
    {
        this.sessionService.AppID = appid;

        this.sessionService.log('inside AppsClick', logLevel.Debug);

        let req = new MenuGetByRoleIDRequest();

        req.RoleID = this.sessionService.RoleID;
        req.SiteID = this.sessionService.SiteID;
        req.AppID = this.sessionService.AppID;

        // this.apiService.postData('ReadDataFromFPReader', null).subscribe(
        //     (res:ServiceReponse) => {
        //         console.log(res);
        // });

        this.LoadCorpInfo();

        this.apiService.postData('MenuGetByRoleID', req).subscribe(
            (response: MenuGetByRoleIDResponse) => {
                console.log(response);
                if (response.SuccessCode == 1) {

                    this.sessionService.FunctionList = response.FunctionList;
                    this.sessionService.GroupMenuList = response.GroupMenuList;
                    this.sessionService.ReportsList = response.ReportsList;

                    console.log(this.sessionService.ReportsList);

                    for(let menu of this.sessionService.GroupMenuList){
                        menu.DisplayName = menu.GroupName;
                            if(menu.DisplayName == undefined){
                                menu.DisplayName  = menu.GroupName;                         
                            }
                    
                            for(let subMenu of menu.MenuList){
                                subMenu.DisplayName =  subMenu.MenuName;
                                if(subMenu.DisplayName == undefined){
                                    subMenu.DisplayName  = subMenu.MenuName;
                                }
                            }
                    
                            // if(menu.MenuList.length > 1){
                            //     menu.IsExpanded = true;
                            // }                       
                    }


                    let selectedApps = this.sessionService.UserAppsInfo.find(x => x.AppID == appid);
                    let selectedMenuInfo = this.sessionService.GroupMenuList.filter(x=>x.AppID == appid)

                    let menuData;
                    for(let item of selectedMenuInfo){
                        if(item.MenuList!=undefined){
                            menuData = item.MenuList.find(x1 => x1.RouterLink == selectedApps.DefaultPage);
                            if(menuData!=undefined){
                                break;
                            }
                        }
                    }

                    // if(selectedApps != undefined) {
                    //     if (menuData != undefined) {
                    //         console.log("aaaaaaaaaaa");
                    //         this.router.navigate(['/home/' + menuData.RouterLink.toLowerCase()]); 
                    //     }
                    //     else {
                    //         console.log("bbbbbbbbbb");
                    //         this.router.navigate(['/home/' + selectedMenuInfo[0].MenuList[0].RouterLink.toLowerCase()]); 
                    //     }
                    // }

                    console.log(selectedMenuInfo[0].MenuList[0]);

                    this.router.navigate(['/home/' + selectedMenuInfo[0].MenuList[0].RouterLink.toLowerCase()]); 


                }
                else {
                    this.sessionService.HandleWebAPIResponseError(response);
                }
            }
        );

        this.sessionService.log('end of moduleclick -appid: ' + appid, logLevel.Debug);
    }



    LoadCorpInfo() {
        let req=new ServiceRequest();
        this.apiService.postData("CorporateGetByCorpID", req).subscribe((response: CorporateGetByCorpIDResponse) => {
            if (response.SuccessCode == 1) {

              if (response.ResultList != null) 
              {
                console.log(response.ResultList);
                this.sessionService.UserCorpInfo = response.ResultList;
              }
            }
          });

      }
    
    // AppsClick(appid)
    // {
        
    //     this.sessionService.log('inside AppsClick', logLevel.Debug);

    //     let appinfo = this.sessionService.UserAppsInfo.find(itm => itm.AppID == appid);

    //     this.sessionService.AppID = appid;
    //     this.sessionService.AppCode = appinfo.AppCode;

    //     this.loaderService.show();

    //     let req = new MenuGetByRoleIDRequest();

    //     req.RoleID = this.sessionService.RoleID;
    //     req.SiteID = this.sessionService.SiteID;

    //     this.apiService.postData("MenuGetByRoleID",req).subscribe(
    //         response => {
        
    //             if (response.SuccessCode == 1) {

    //                 this.loaderService.hide();

    //                 this.sessionService.GroupMenuList = response.GroupMenuList;
    //                 this.sessionService.FunctionList = response.FunctionList;
                    
    //                 if(this.sessionService.GroupMenuList != null &&
    //                     this.sessionService.GroupMenuList.length > 0 ){

    //                     for(let menu of this.sessionService.GroupMenuList){
    //                         menu.DisplayName = menu.GroupName;
    //                         if(menu.DisplayName == undefined){
    //                             menu.DisplayName  = menu.GroupName;                         
    //                         }

    //                         for(let subMenu of menu.MenuList){
    //                            subMenu.DisplayName =  subMenu.MenuName;
    //                             if(subMenu.DisplayName == undefined){
    //                                 subMenu.DisplayName  = subMenu.MenuName;
    //                             }
    //                         }

    //                         if(menu.MenuList.length > 1){
    //                             menu.IsExpanded = true;
    //                         }                       
    //                     }

    //                     console.log(['/home/' + this.sessionService.GroupMenuList[0].MenuList[0].RouterLink]); 

    //                     this.router.navigate(['/home/' + 'user']); 

    //                 }
    //                 else {

    //                     let dialogRef = this.dialog.open(OkDialogComponent, {
    //                         data: {
    //                             DialogHeader: 'Alert',
    //                             DialogMessage: 'No Menu Tagged'
    //                         },
    //                         disableClose: true,
    //                     });
                
    //                     dialogRef.afterClosed().subscribe(result => {
    //                         if (result == 1) {
                                
    //                         }
    //                     });

    //                 }

    //             }
    //             else {
    //                 this.loaderService.hide();
    //                 this.sessionService.showError(response.ErrorMessage);
    //             }
    //         },
    //         error => {
    //             var err = error as Response;
    //             if (err.status == 0) {
    //                 //this.ProgressSpinner = false;
    //                 this.loaderService.hide();
    //                 this.sessionService.showError("Unable to connect. Internet connectivity is very low or no internet access");
    //             }
    //         }
    //     );
    // }

}
function req(arg0: string, req: any) {
    throw new Error('Function not implemented.');
}

