import { Component, ViewContainerRef } from '@angular/core';
import { Router, RouterLinkActive, NavigationStart, NavigationEnd } from "@angular/router";
import { SessionService } from './service/session.service';
import { logLevel } from './const/app.config';
import { environment } from "../environments/environment";

@Component({
  selector: 'app-root',
  template: "<router-outlet></router-outlet><angular-loader></angular-loader>"
})

export class AppComponent {
  title = 'nweb';

  private viewContainerRef: ViewContainerRef;
  constructor(private router: Router, vcr: ViewContainerRef, private sessionService: SessionService)
  {

    this.viewContainerRef = vcr;

    this.sessionService.log("Device Width: " + window.innerWidth, logLevel.Debug);
    this.sessionService.log("Device Height: " + window.innerHeight, logLevel.Debug);

    if (window.innerWidth <= 800 && window.innerHeight <= 600) {
        this.sessionService.DeviceType = "Mobile";
    }
    else {
        this.sessionService.DeviceType = "FS";
    }

    this.sessionService.log("Device Type: " + this.sessionService.DeviceType, logLevel.Debug);

    if (environment.production)
    {
        this.sessionService.isDebug = false;
    }
    else
    {
        this.sessionService.isDebug = true;
    }


  }


}
