import { Component, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { forwardRef } from '@angular/core';
import { NG_VALIDATORS, Validator, FormControl } from '@angular/forms';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { AppConfig } from '../../const/app.config';
import { CommonService } from '../../service/common.service';
import * as moment from 'moment';

@Component({
  selector: 'customdate',
  templateUrl: './customdate.component.html',
  styleUrls: ['./customdate.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomDateComponent),
      multi: true
    },
    { provide: NG_VALIDATORS, useExisting: forwardRef(() => CustomDateComponent), multi: true }
   ]
})

export class CustomDateComponent implements ControlValueAccessor, Validator {

    @ViewChild('strDate') inputText : FormControl;
    
    public checkWriteValue: boolean;
    public subscribeObject: any;

    //

    @Input() placeholder: string  = 'custom date';
    @Input() required: boolean = false;
    @Input() submitAttempt: boolean = false;
    @Input() ReadOnlyControl: boolean = false;
    @Input('showHint') showHint: boolean = false;
    @Input('allowFutureDate') allowFutureDate: boolean;
    @Input('allowCurrentDate') allowCurrentDate: boolean;
    @Input('allowPastDate') allowPastDate: boolean;
    @Input('after') afterDate: string  = null;
    @Input('sameOrAfter') sameOrAfter: string  = null;
    @Input('before') beforeDate: string  = null;
    @Input('sameOrBefore') sameOrBefore: string  = null;
    
    @Output() public onDateChange : EventEmitter<any> = new EventEmitter();
    //
    
    // not used, used for touch input
    public registerOnTouched() { }

    // this is the initial value set to the component
    public writeValue(obj: any) {
      
      if (obj) 
      {

        this.stringDate = moment(obj).format(AppConfig.DATE_FORMAT);

        this.checkWriteValue = true;

        this.subscribeObject = this.inputText.valueChanges.subscribe(val => {
          if (this.checkWriteValue){
             if (val != null)
             {
                this.checkWriteValue = false;
                this.txtDateChange(this.inputText);
                this.subscribeObject.unsubscribe();
             }
          }
          else
          {
            this.subscribeObject.unsubscribe();
          }

        });

      }
      else
      {
        this.stringDate = null;
        this.dtDate = null;
      }

    }
    
    // registers 'fn' that will be fired whem changes are made
    // this is how we emit the changes back to the form
    public registerOnChange(fn: any) {
        this.propagateChange = fn;
    }

    // the method set in registerOnChange to emit changes back to the form
    private propagateChange = (_: any) => { };

    //

    // validates the form, returns null when valid else the validation object
    // in this case we're checking if the json parsing has passed or failed from the onChange method
    public validate(c: FormControl) {
      return (!this.parseError) ? null : {
            invalidDateError: {
            valid: false,
            },
      };
    }

    //
    
    private parseError: boolean;
    public stringDate: string;
    public dtDate: string;
    public DATE_FORMAT: string;

//

  constructor(public commonService: CommonService) { 

    this.DATE_FORMAT = AppConfig.DATE_FORMAT;

  }

  //

  validateDate(inputText) {

      // validate input

      this.parseError = false;

      if (this.stringDate != null && this.stringDate.length > 0)
      {
        
        if (!this.commonService.isValidDate(this.stringDate))
        {
        
          if (inputText != null) {
              inputText.control.setErrors({
                DateParseError: true
              });
            }

           this.parseError = true;
        }
        else
        {
            // other date validations
            
              if (moment(this.stringDate,AppConfig.DATE_FORMAT,true).isAfter(moment().format('L')))
              {
                if (!this.allowFutureDate)
                { 
                    if (inputText != null) {
                      inputText.control.setErrors({
                        FutureDateError: true
                      });
                    }
                  
                    this.parseError = true;
                  }
                  else if (moment(this.stringDate,AppConfig.DATE_FORMAT,true).diff(moment(),'year') > 100)
                  {
                    //console.log(moment(this.stringDate,AppConfig.DATE_FORMAT,true).diff(moment(),'year'));

                    if (inputText != null) {
                      inputText.control.setErrors({
                        FutureDateYearsError: true
                      });
                    }
          
                    this.parseError = true;
                  }
              }
              else if (moment(this.stringDate,AppConfig.DATE_FORMAT,true).isBefore(moment().format('L')))
              {
                
                if (!this.allowPastDate)
                {
                  if (inputText != null) {
                    inputText.control.setErrors({
                      PastDateError: true
                    });
                  }
                  
                  this.parseError = true;
                }
                else if (moment().diff(moment(this.stringDate,AppConfig.DATE_FORMAT,true),'year') > 100)
                {
                  //console.log(moment().diff(moment(this.stringDate,AppConfig.DATE_FORMAT,true),'year'));

                  if (inputText != null) {
                    inputText.control.setErrors({
                      PastDateYearsError: true
                    });
                  }
        
                  this.parseError = true;
                }
              }
              else if (moment(this.stringDate,AppConfig.DATE_FORMAT,true).isSame(moment().format('L')))
              {
                if (!this.allowCurrentDate)
                {
                  if (inputText != null) {
                    inputText.control.setErrors({
                      CurrentDateError: true
                    });
                  }
        
                  this.parseError = true;
                }
              }


              //

              if (this.afterDate  != null && this.afterDate.length > 0)
              {
                if (moment(this.stringDate,AppConfig.DATE_FORMAT,true).isSameOrBefore(moment(this.afterDate)))
                {
                    if (inputText != null) {
                      inputText.control.setErrors({
                        AfterDateError: true
                      });
                    }
                  
                    this.parseError = true;
                }
              }

              //

              if (this.beforeDate  != null && this.beforeDate.length > 0)
              {
                if (moment(this.stringDate,AppConfig.DATE_FORMAT,true).isSameOrAfter(moment(this.beforeDate)))
                {
                    if (inputText != null) {
                      inputText.control.setErrors({
                        BeforeDateError: true
                      });
                    }
                  
                    this.parseError = true;
                }
              }



              //

              if (this.sameOrAfter != null && this.sameOrAfter.length > 0)
              {
                if (moment(this.stringDate,AppConfig.DATE_FORMAT,true).isBefore(moment(this.sameOrAfter)))
                {
                    if (inputText != null) {
                      inputText.control.setErrors({
                        SameAfterDateError: true
                      });
                    }
                  
                    this.parseError = true;
                }
              }

              if (this.sameOrBefore != null && this.sameOrBefore.length > 0)
              {
                if (moment(this.stringDate,AppConfig.DATE_FORMAT,true).isAfter(moment(this.sameOrBefore)))
                {
                    if (inputText != null) {
                      inputText.control.setErrors({
                        SameBeforeDateError: true
                      });
                    }
                  
                    this.parseError = true;
                }
              }

              //
    

        }
      }
      else
      {
        

        if (this.required == true)
        {
          this.parseError = true;
        }

      }

      
  }

  //

  dateChange(inputText) {

    if (this.dtDate != null) {
        this.stringDate = moment(this.dtDate).format(AppConfig.DATE_FORMAT);
    }
    else
    {
      this.stringDate = null;
    }

    if (inputText != null) // then only the validation will fire
    {
       inputText.control.setValue(this.stringDate);
       inputText.control.markAsDirty();
       inputText.control.markAsTouched();
    }

    this.validateDate(inputText);

    // update the form
    this.propagateChange(moment(this.stringDate, AppConfig.DATE_FORMAT, true).format("L"));

}

//

changeEventEmit()
{
  this.onDateChange.emit();
}

txtDateChange(inputText) {


    if (this.commonService.isValidDate(this.stringDate)) {
        this.dtDate = moment(this.stringDate, AppConfig.DATE_FORMAT, true).format();

        this.validateDate(inputText);
        
        // update the form
        this.propagateChange(moment(this.stringDate, AppConfig.DATE_FORMAT, true).format("L"));
    }
    else {
        this.dtDate = null;

        this.validateDate(inputText);
        
        this.propagateChange(null);
        
    }

    
  }


  test()
  {
    
  }
}

