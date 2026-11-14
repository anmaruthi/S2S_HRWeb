import { Injectable } from "@angular/core";
import { SessionService } from "./session.service";
import { HttpHeaders  } from "@angular/common/http";

// import { Headers } from "@angular/common/";
// import { Request } from "@angular/common/http";
// import { RequestOptions } from "@angular/http";
// import { RequestMethod } from "@angular/common/http";
// import { RequestOptionsArgs } from "@angular/common/http";

import { ServiceRequest } from "../model/request.model";
import { AppConfig } from "../const/app.config";
import { environment } from "../../environments/environment";
import { LoaderService } from "./loader.service";
import { Observable } from 'rxjs';
import { throwError  } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { tap, finalize } from 'rxjs/operators';

@Injectable()
export class WebApiService {

    constructor(private http: HttpClient, private sessionService: SessionService,
        private loaderService: LoaderService) {
        // do nothing
    }

    public postData(apiName: string, req: any): any{

        this.loaderService.show();
        if (req == null)
        {
            req = new ServiceRequest();
        }

        this.sessionService.FillRequestBase(req);

        let headers = new HttpHeaders();

        headers = headers.set('Content-Type', 'application/json');
        headers = headers.set('DeviceType', 'FS');

        if(this.sessionService.UserID!=undefined){
            headers = headers.set('userid', this.sessionService.UserID.toString());
            headers = headers.set('sessionid', this.sessionService.SessionID);
            headers = headers.set('siteid', this.sessionService.SiteID.toString());
            headers = headers.set('authkey', AppConfig.APP_AUTH_KEY);
        }
        else
        {
            headers = headers.set('authkey', AppConfig.APP_AUTH_KEY);
        }

        return  this.http.post(environment.WEBAPI_ENDPOINT + apiName, req, { headers: headers} ).pipe(tap((res: Response) => {
            this.onSuccess(res);
        }, (error: any) => {
            this.onError(error,req);
        }), finalize(() => {
            this.onFinally();
        }));

        //return this.http.post(environment.WEBAPI_ENDPOINT + apiName,req,this.getRequestOptionArgs())

        // return this.http.post(environment.WEBAPI_ENDPOINT + apiName,req,this.getRequestOptionArgs())
        //     .pipe((res: any) => {
        //         return res.json();
        //     })
        //     .timeout(60000)
        //     .catch((error: Response) => this.handleError(error))
        // .finally(() => {
        //   this.loaderService.hide();
        // });

    }

    private onSuccess(res: Response): void {
        //console.log(res);
    }

    private onError(error: any, requestData:any): void {
        if(error!=null){
            if(error.status == 0 && requestData.ShowServerDown != "false"){
                this.sessionService.showError("Unable to connect. Internet connectivity is very low or no internet access");
            }
            else {
                if (error.status == 403) // forbidden
                {
                    alert("Invalid request");
                    window.location.reload();
                }
                else if (error.status == 401) // Unauthorized
                {
                    alert("Unauthorized access");
                    window.location.reload();
                }
                else if (error.status == 408) // request time out
                {
                    alert("Session expired");
                    window.location.reload();
                }
                else if (error.status == 500) // internal server error
                {
                    alert("Unexpected error occured");
                    //window.location.reload();
                }
                else if (error.name == 'TimeoutError') // time out error
                {
                    alert("Timeout occured, please try again after sometime"); // all others
                }
                else
                {
                    console.log(error);
                    alert("Unexpected error occured"); // all others
                    //window.location.reload();
                }
            }
        }
    }

    private onFinally(): void {
        this.loaderService.hide();
    }

    private onCatch(error: any, caught: Observable<any>): Observable<any> {
        console.log("On Catch");
        console.log(this.sessionService);
        if (error.status == 0) {
            alert("Unable to connect. Internet connectivity is very low or no internet access");
        }

        return throwError (error);
    }


}
