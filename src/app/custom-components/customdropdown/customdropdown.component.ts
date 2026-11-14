import { Component, Input, AfterViewInit, OnInit, OnChanges, SimpleChanges, 
          Output, EventEmitter, ViewChild, ChangeDetectorRef } from '@angular/core';
import { forwardRef } from '@angular/core';
import { NG_VALIDATORS, Validator, FormControl } from '@angular/forms';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'customdropdown',
  templateUrl: './customdropdown.component.html',
  styleUrls: ['./customdropdown.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomDropdownComponent),
      multi: true
    },
    { provide: NG_VALIDATORS, useExisting: forwardRef(() => CustomDropdownComponent), multi: true }
   ]
})

export class CustomDropdownComponent implements ControlValueAccessor, Validator, AfterViewInit, OnInit, OnChanges {

    //
    SelectedItem:any;
    SelectedItems:any[];
    PreviousSelectedItem:any;

    @Input() placeholder: string  = 'customdropdown';
    @Input() required: boolean = false;
    @Input() submitAttempt: boolean = false;
    @Input() disableControl: boolean = false;
    @Input() InputDataList: any[];
    @Input() ReadOnlyControl: boolean = false;
    @Input() allowAdd: boolean = false;
    @Input() multiSelect: boolean = false;
    @Input('KeyID') ID: string = 'ID';
    @Input('KeyDescription') Description: string = 'Description';
    @Input('debugLog') debugLog: boolean = false;

    @Output() public onChange : EventEmitter<any> = new EventEmitter();
    @Output() public SelectionDone : EventEmitter<any> = new EventEmitter();
    @Output() public AddClick : EventEmitter<any> = new EventEmitter();

    @ViewChild('autoControl') autoControl;
  
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
          
          this.descriptionID = obj;

          if (this.multiSelect == false)
          {
              if (this.DataList != null && this.DataList.length > 0)
              {
                let item = this.DataList.find(item => item.ID == this.descriptionID);
                if (item == null){
                  this.descriptionID = null;
                  this.descriptionString = null;
    
                  this.SelectedItem = null;
                  this.PreviousSelectedItem = null;
                }
                else
                {
                  this.descriptionString = item.Description;     
                  this.descriptionID = item.ID;   
                  this.SelectedItem = item;       
                  this.PreviousSelectedItem = obj;
                }
              }
              else
              {
                  this.descriptionID = null;
                  this.descriptionString = null;
              }
  
          }
          else
          {      
         
            console.log(this.DataList);

            if (this.DataList != null && this.DataList.length > 0){
              let xstr:string;
              xstr = this.descriptionID + '';
              this.SelectedItems = [];

              console.log(xstr);
            
              if (xstr != null)
              {

                xstr.split(',').forEach(itm=> {

                  let item = this.DataList.find(item => item.ID == itm);
                  if (item != null){
                    this.SelectedItems.push(item);                    
                  }

                });
                  
              }
              else
              {
                this.descriptionString = null;  
                this.SelectedItems = [];
              }

            }
            else
            {
                this.SelectedItems = [];
                this.descriptionID = null;
                this.descriptionString = null;
            }

          }
          

      }
      else
      {

        this.descriptionID = null;
        this.descriptionString = null;

        
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
        if (this.debugLog)
        {
          console.log('inside ngAfterViewInit');
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

      if (this.getLength(this.InputDataList) > 0){
        this.InputDataList.forEach( itm => {
          this.DataList.push({ID: itm[this.ID], Description: itm[this.Description]});
        });

      }
      else
      {
        //console.log('no data');
      }
     

    }
   

    //

  constructor(private ref: ChangeDetectorRef) { 

  }

  //

  ngOnInit()
  {

   
  }

  ngDoCheck() {
    this.ref.markForCheck(); 
  }

  //

  ngOnChanges(changes: SimpleChanges) {

    if (this.debugLog)
    {
      console.log('inside ngOnChanges');
    }

    // for (let propName in changes) {

    //     let chng = changes[propName];
    //     let cur  = JSON.stringify(chng.currentValue);
    //     let prev = JSON.stringify(chng.previousValue);

    //      console.log(`${propName}: currentValue = ${cur}, previousValue = ${prev}`);

    // }

   //this.ref.detectChanges();


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



        this.loadInputData();
        
      }

    }
    
  }
  //

  getLength(data: any[]): number
  {
      if (data != null)
      {
          return data.length;
      }
      else
      {
          return 0;
      }
  }

  onSelectionChange(inputText:any)
  {

    if (this.debugLog)
    {
      console.log('inside onSelection');
    }

  

    if (inputText != null)
    {
      if (this.debugLog)
      {
        console.log('inputText is not null - set error');
      }

     

      if (this.SelectedItem != null)
      {
      

        if (this.SelectedItem.ID == -100)
        {
          this.parseError = false;
        }
        else
        {
      
          this.parseError = false;
          inputText.control.updateValueAndValidity();
          this.descriptionID = this.SelectedItem.ID;
        }
        
      }
      else
      {
       

        inputText.control.setErrors({
          descriptionParseError: true
        });
        this.parseError = true;
        this.SelectedItem = null;
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

//for multiSelect
onSelectionChange1(inputText1:any)
{

  if (this.debugLog)
  {
    console.log('inside onSelection');
  }

  if (inputText1 != null)
  {
    if (this.debugLog)
    {
      console.log('inputText1 is not null - set error');
    }

    console.log(this.SelectedItems);

    if (this.SelectedItems != null && this.SelectedItems.length > 0)
    {
      this.descriptionID = null;

      this.SelectedItems.forEach(f=> {
         if (this.descriptionID == null)
         {
           this.descriptionID = f.ID;
         }
         else
         {
           this.descriptionID = this.descriptionID + ',' + f.ID;
         }
      });

      this.parseError = false;
      inputText1.control.updateValueAndValidity();      
      
    }
    else
    {
     
      inputText1.control.setErrors({
        descriptionParseError: true
      });
      this.parseError = true;
      this.SelectedItems = null;
      this.descriptionID = null;
    }

  }
  else
  {
        
    inputText1.control.setErrors({
      descriptionParseError: true
    });
    this.parseError = true;
    this.descriptionID = null;
    this.SelectedItems = null;
  }


}



  changeEventEmit()
  {
    if (this.debugLog)
    {
      console.log('inside changeEventEmit');
    }

    if (this.multiSelect == false)
    {
    
      let tmp = this.DataList.find(f=> f.ID == this.SelectedItem.ID);
      
      if (tmp != null)
      {
        this.onChange.emit(tmp.ID);
        this.SelectionDone.emit(tmp.ID);
      }
  
    }
    else
    {
       if (this.descriptionID == null)
      {
          this.descriptionID = null;
          this.SelectedItem = null;
    
          this.onChange.emit(null);
          this.SelectionDone.emit(this.descriptionID);
      }
      else
      {
        this.onChange.emit(this.descriptionID);
        this.SelectionDone.emit(this.descriptionID);
      }


    }


  }

  clickEventChange()
  {
   
    //this.SelectedItem = null;
    this.AddClick.emit();
  }

}

