import { Directive, Input } from '@angular/core';
import { NG_VALIDATORS, Validator, FormControl } from '@angular/forms';

@Directive({
  selector: '[maxValue][formControlName],[maxValue][formControl],[maxValue][ngModel]',
  providers: [{provide: NG_VALIDATORS, useExisting: CustomMaxValueDirective, multi: true}]
})

export class CustomMaxValueDirective implements Validator {

  @Input('maxValue') maxValue: number;
  
  validate(c: FormControl): {[key: string]: any} {
      let v = c.value;
      return ( v > this.maxValue)? {"maxValue": true} : null;
  }

}
