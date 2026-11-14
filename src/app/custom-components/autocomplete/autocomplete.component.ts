import { Component, Input, AfterViewInit, OnInit, OnChanges, SimpleChanges, Output, EventEmitter, ViewChild, AfterContentInit } from '@angular/core';
import { forwardRef } from '@angular/core';
import { NG_VALIDATORS, Validator, FormControl } from '@angular/forms';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Observable } from 'rxjs';
  
@Component({
  selector: 'autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AutoCompleteComponent),
      multi: true
    },
    { provide: NG_VALIDATORS, useExisting: forwardRef(() => AutoCompleteComponent), multi: true }
   ]
})

export class AutoCompleteComponent implements ControlValueAccessor, Validator, AfterViewInit, OnInit, OnChanges {

    //
    public checkWriteValue: boolean;
    //

    @Input() placeholder: string  = 'autocomplete';
    @Input() required: boolean = false;
    @Input() submitAttempt: boolean = false;
    @Input() disableControl: boolean = false;
    @Input() InputDataList: any[];
    @Input() ReadOnlyControl: boolean = false;
    @Input('KeyID') ID: string = 'ID';
    @Input('KeyDescription') Description: string = 'Description';
    @Input('debugLog') debugLog: boolean = false;
    @Input('suffixButton') suffixButton: boolean = false;
    @Input('suffixButtonIcon') suffixButtonIcon: string = 'add';
    @Input('suffixButtonText') suffixButtonText: string = 'Add';

    @Output() public AutoCompleteChange : EventEmitter<any> = new EventEmitter();
    @Output() public SelectionDone : EventEmitter<any> = new EventEmitter();
    // @Output() public SuffixButtonClick : EventEmitter<any> = new EventEmitter();
  
    @ViewChild('autoControl') autoControl;

    //
  
    // not used, used for touch input
    public registerOnTouched() { }

    // this is the initial value set to the component
    public writeValue(obj: any) {

      if (this.debugLog)
      {
        console.log('inside writeValue');
      }

      if (obj) {

          if (this.debugLog)
          {
            console.log('inside writeValue: ' + obj);
          }

          this.checkWriteValue = true;
          this.descriptionID = obj;

          if (this.checkWriteValue)
          {
            if (this.DataList != null && this.DataList.length > 0){
              let item = this.DataList.find(item => item.ID == this.descriptionID);
              if (item == null){
                this.descriptionID = null;
                this.descriptionString = null;
              }
              else
              {
                 this.descriptionString = item.Description;
              }
            }
            else
            {
                this.descriptionID = null;
                this.descriptionString = null;
            }
            
            this.DataListFiltered = this.doFilter(this.descriptionString, null);
  
          }

          if (this.debugLog)
          {
            console.log('after doFilter 1: ');
            console.log(this.DataListFiltered);
          }

      }
      else
      {

        this.descriptionID = null;
        this.descriptionString = null;

        this.DataListFiltered = this.doFilter(this.descriptionString, null);

        if (this.debugLog)
        {
          console.log('call from writevalue - after doFilter 2: ');
          console.log( this.DataListFiltered);
        }
        
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
            descriptionParseError: {
            valid: false,
            },
      };
    }

    //
    
    DataListFiltered:any[];
    DataList:any[];

    descriptionString: string;
    private parseError: boolean;
    private descriptionID: any;

    //

    ngAfterViewInit()
    {
      //   if (this.debugLog)
      //   {
      //     console.log('inside ngAfterViewInit');
      //   }

      //  this.loadInputData();

    }

    ngAfterContentInit ()
    {
      if (this.debugLog)
      {
        console.log('inside ngAfterContentInit');
      }

      this.loadInputData();
    }

    //

    loadInputData()
    {

      if (this.debugLog)
      {
        console.log('inside loadInputData');
        console.log(this.InputDataList);
      }

      this.DataList = [];

      if (this.InputDataList != null && this.InputDataList.length > 0){
        this.InputDataList.forEach( itm => {
          this.DataList.push({ID: itm[this.ID], Description: itm[this.Description]});
        });
      }

    }

    //

  constructor() { 

  }

  //

  ngOnInit()
  {

    

  }

  //

  ngOnChanges(changes: SimpleChanges) {

    if (this.debugLog)
    {
      console.log('inside ngOnChanges');
      console.log(this.InputDataList );

    }

    
    // for (let propName in changes) {

    //     let chng = changes[propName];
    //     let cur  = JSON.stringify(chng.currentValue);
    //     let prev = JSON.stringify(chng.previousValue);

    //      console.log(`${propName}: currentValue = ${cur}, previousValue = ${prev}`);

    // }

   for (let propName in changes) {

      if (propName == "InputDataList")
      {
        
        if (this.debugLog)
        {
          console.log('property InputDataList is changed');
        }

        let chng = changes[propName];

        this.InputDataList = chng.currentValue;

        let cur  = JSON.stringify(chng.currentValue);
        let prev = JSON.stringify(chng.previousValue);
        
        if (this.debugLog)
        {
          console.log(`${propName}: currentValue = ${cur}, previousValue = ${prev}`);
        }

        //

        this.loadInputData();

        //

        if (this.descriptionID == null && (this.descriptionString == null || this.descriptionString.length == 0)){
          this.DataListFiltered = this.DataList;
        }
        
      }
      else if (propName == "submitAttempt")
      {
        
        let chng1 = changes[propName];     
        let cur1  = JSON.stringify(chng1.currentValue);
       
        if (cur1?.trim() == 'true')
        {
          this.submitAttempt = true;
        }
        else
        {
          this.submitAttempt = false;
        }
        
      }
    }
    
  }
  //

  doFilter(descriptionString, inputText) {

    if (this.debugLog)
    {
      console.log('inside doFilter');
    }
    // validate input

    if (inputText != null) {
      if (this.debugLog)
      {
        console.log('inputText is not null - set error');
      }

      if (descriptionString != null && descriptionString.length > 0)
      {
        if (this.debugLog)
        {
          console.log('inputText is not null & description string not null - set error');
        }
        //console.log(this.DataList);

        if (this.DataList != null && this.DataList.length > 0){
          let item = this.DataList.find(item => item.Description.toLowerCase() == descriptionString.toLowerCase());
          //let item = this.DataList.find(item => item.Description.toLowerCase().includes(descriptionString.toLowerCase()));
          //

          if (item == null){
            inputText.control.setErrors({
              descriptionParseError: true
            });
            this.parseError = true;
            this.descriptionID = null;
          }
          else
          {
            console.log(descriptionString);
            console.log(inputText);
            console.log(item);
            this.parseError = false;
            inputText.control.updateValueAndValidity();
            this.descriptionID = item.ID;
          }
        }
        else
        {
          inputText.control.setErrors({
            descriptionParseError: true
          });
          this.parseError = true;
          this.descriptionID = null;
        }
      }
      else
      {        
          this.parseError = false;
          inputText.control.updateValueAndValidity();
          this.descriptionID = null;
      }

  }

    if (this.debugLog)
    {
      console.log('update the form with propagate change');
    }

    // update the form
    this.propagateChange(this.descriptionID);

    //

    if (this.DataList != null && this.DataList.length > 0){
      
      if (this.debugLog)
      {
        console.log('DataList is not empty');
      }

      if (descriptionString != null && descriptionString.length > 0)
      {

        if (this.debugLog)
        {
          console.log('descriptionString is not empty');
        }
        const filterValue = descriptionString.toLowerCase();
        return this.DataList.filter(item => item.Description.toLowerCase().includes(filterValue));
      }
      else
      {

        if (this.debugLog)
        {
          console.log('return full list');
        }
      
        return this.DataList;
      }

    }
    else
    {
      if (this.debugLog)
      {
        console.log('datalist is empty');
      }
    }

  }

  changeEventEmit()
  {
    if (this.debugLog)
    {
      console.log('inside changeEventEmit');
    }

    this.AutoCompleteChange.emit(this.descriptionString);

    let tmp = this.DataList.find(f=> f.Description.toLowerCase() == this.descriptionString.toLowerCase());

    if (tmp != null)
    {
      this.SelectionDone.emit(tmp);
    }

  }

  // SuffixButtonClicked()
  // {
  //   this.SuffixButtonClick.emit();
  // }



}

