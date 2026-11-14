import { Component, OnInit } from '@angular/core';
import { SessionService } from "../service/session.service";
import { CommonService } from "../service/common.service";
import { MatDialog } from '@angular/material/dialog';
import { MenuGroup, SiteInfo } from '../model/shared.model';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { AppConfig } from "../const/app.config";
import { Router } from '@angular/router';
import { SettingGetAllRequest } from '../model/request.model';
import { WebApiService } from '../service/webapi.service';
import { SettingGetBySiteIDResponse } from '../model/response.model';

@Component({
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    animations: [
        trigger('indicatorRotate', [
          state('collapsed', style({transform: 'rotate(0deg)'})),
          state('expanded', style({transform: 'rotate(180deg)'})),
          transition('expanded <=> collapsed',
            animate('400ms cubic-bezier(0.4,0.0,0.2,1)')
          )
        ]),
        trigger('menuToggle', [
            transition(':enter', [
              style({ transform: 'translateY(-100%)', height: '0px', opacity: 0, color: '#FFFFFF'}),
              animate('400ms ease-in', style({transform: 'translateY(0%)', height: '*', opacity: .5, color: '#5c44c6'}))
            ]),
            transition(':leave', [
              style({ transform: 'translateY(0%)', height: '*', opacity: .5, color: '#5c44c6'}),
              animate('400ms ease-out', style({transform: 'translateY(100%)', height: '0px', opacity: 0, color: '#FFFFFF'}))
            ])
        ]),

      ]
})

export class HomeComponent implements OnInit {

    public UserSiteInfo: SiteInfo[];
    public SelectedSiteID: number;
    public SelectedSiteIDList:SiteInfo
    public showMenuBar: boolean;
    
    constructor(public sessionService: SessionService,private router: Router, private apiService: WebApiService,
         public commonService: CommonService, public dialog: MatDialog) {

            this.showMenuBar = true;
            
    }
    
    ngOnInit() {

        this.UserSiteInfo = this.sessionService.UserSiteInfo;
        if(this.sessionService.UserSiteInfo!=null && this.sessionService.UserSiteInfo.length>0){
            this.SelectedSiteID = this.sessionService.SiteID;
            console.log(this.SelectedSiteID)
        }

       
        
    }

    toggleMenuBar(callFrom:string) {

        if (this.sessionService.showMenuBar){
            for(let item of this.sessionService.GroupMenuList){
                if(item.MenuList!=undefined && item.MenuList.length>1){
                    if (item.IsExpanded) {
                        item.IsExpanded = !item.IsExpanded;
                        item.CanExpand = true;
                    }
                    else{
                        item.CanExpand = false;
                    }
                }
            }
    
        }
        else{
            if (callFrom == 'HTML')
            {
                for(let item of this.sessionService.GroupMenuList){
                    if(item.MenuList!=undefined && item.MenuList.length>1){
                        if (item.CanExpand) {
                            item.IsExpanded = !item.IsExpanded;
                        }
                    }
                }
            }

        }
        
        this.sessionService.showMenuBar = !this.sessionService.showMenuBar;
    } 

    viewModules()
    {
        // this.sessionService.AppCode = null; 
        // this.sessionService.AppID = null;
        
        this.router.navigate(['/appshome']);
    }

    menuClick(menu:MenuGroup){
        if (menu.MenuList != undefined && menu.MenuList.length>0){                       
            if (this.sessionService.showMenuBar)
            {
                menu.IsExpanded = !menu.IsExpanded; 
            }
            else if (!menu.IsExpanded)
            {
                menu.IsExpanded = true;
                this.toggleMenuBar('TS');
            }         
        }

    }

    OnSiteChange(){

        this.showMenuBar = this.showMenuBar;
    
        if(this.SelectedSiteID > 0 ){
            this.sessionService.SiteID = this.SelectedSiteID;
            this.sessionService.CurrentPath = this.router.url.replace("/home/","");
            this.router.navigateByUrl('home/unauthorized', {skipLocationChange: true}).then(()=>
            {
                this.router.navigate(['home/' + this.sessionService.CurrentPath]);
            });

            this.commonService.loadSiteSettingsAll();
            
        }
        else{
            console.log("SiteChangeNotification Failed. Invalid Site ID");
        }
       
    }




}