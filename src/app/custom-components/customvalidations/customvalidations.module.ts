import { NgModule } from '@angular/core';
import { CustomMaxValueDirective } from './maxvalue.directive';
import { CustomMinValueDirective } from './minvalue.directive';

@NgModule({
    declarations: [CustomMaxValueDirective, CustomMinValueDirective],
    imports: [],
    exports: [CustomMaxValueDirective, CustomMinValueDirective],
    providers: []
})

export class CustomValidationsModule {}
