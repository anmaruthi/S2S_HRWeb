import { Component, Inject, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SessionService } from "../../service/session.service";
import { ChangePasswordRequest } from "../../model/request.model";
import { ServiceReponse } from "../../model/response.model";
import { AppConfig } from "../../const/app.config";
import { FormBuilder, FormGroup, FormControl, Validators, ValidatorFn} from '@angular/forms';
import { WebApiService } from "../../service/webapi.service";

@Component({
    templateUrl: './changepassworddialog.component.html',
    styleUrls: ['./changepassworddialog.component.scss']
})

export class ChangePasswordDialogComponent implements OnInit {

    public formGroup : FormGroup;
    public submitAttempt: boolean;
    public DialogHeader: string;
    public isPinMismatch:boolean;

    constructor(public dialogRef: MatDialogRef<ChangePasswordDialogComponent>,
        public dialog: MatDialog,
        @Inject(MAT_DIALOG_DATA) public DialogInputData: any,
          public sessionService: SessionService, private apiService: WebApiService) {

    }
      
      cancelClick() {        
          this.dialogRef.close(0);
      }
    
      ngOnInit() {
          this.DialogHeader = "Change Password";

          this.formGroup = new FormGroup({
            CurrentPassword: new FormControl('', [Validators.required]),
            NewPassword: new FormControl('', [Validators.required]),
            ConfirmPassword: new FormControl('', [Validators.required]),
            });
        }

        submitClick() {
            this.submitAttempt=true;
            this.isPinMismatch =false;
            if(this.formGroup.valid){
                let req = new ChangePasswordRequest();
                req = this.formGroup.value;
    
                if (req.NewPassword != req.ConfirmPassword) {
                    this.isPinMismatch =true;
                    return;
                }
                this.apiService.postData("ChangePassword",req).subscribe((data: ServiceReponse)=>{
                    if (data.SuccessCode == 1) {
                        this.sessionService.showSuccess("Password Updated Successfully");  
                        this.dialogRef.close();
                    }
                    else{
                        this.sessionService.showError(data.ErrorMessage);
                    }
                },error=>{
                    this.sessionService.showError(error.message)
                });
            }
        }

}
     
      
