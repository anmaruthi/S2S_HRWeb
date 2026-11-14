import { Component, OnInit} from '@angular/core';
import { SessionService } from "../service/session.service";
import { CommonService } from "../service/common.service";
import { AppConfig, logLevel } from "../const/app.config";

@Component({
    templateUrl: './message.component.html',
    styleUrls: ['./message.component.css']
})

export class MessageComponent implements OnInit 
{
    public txtMessage: string;
    public productName: string;
    public imagename: string;
    public showSuvyaLink: boolean;

    constructor(public sessionService: SessionService, public commonService: CommonService)
    {    
        this.showSuvyaLink = false;
        this.productName = "FJCD";
    }

    ngOnInit() 
    {
        if (this.commonService.getLengthNA(this.sessionService.commonMessage) > 0) {

            this.txtMessage = this.sessionService.commonMessage;

            if (this.sessionService.commonMessageType == logLevel.Error)
            {
                this.imagename = "/assets/images/error.png";
            }
            else if (this.sessionService.commonMessageType == logLevel.Warning)
            {
                this.imagename = "/assets/images/warning.png";
            }
            else if (this.sessionService.commonMessageType == logLevel.Info) {
                this.imagename = "/assets/images/succcess.png";
            }
            else {
                this.imagename = "/assets/images/error.png";
            }

        }
        else
        {
            this.txtMessage = "Invalid request";
            this.imagename = "/assets/images/error.png";
        }
      
    }


    getDisplayPosition(): string {
        if (this.sessionService.DeviceType == 'Mobile') {
            return 'fixed';
        }
        else {
            return 'fixed';
        }
    }


}
