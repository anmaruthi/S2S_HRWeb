import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';


@Injectable()
export class NavLoaderService {    
private loaderSubject = new Subject<NavLoaderState>();
loaderState = this.loaderSubject.asObservable();
constructor() { }
show() {
        this.loaderSubject.next(<NavLoaderState>{show: true});
    }
    hide() {
        this.loaderSubject.next(<NavLoaderState>{show: false});
    }
}

export interface NavLoaderState {
    show: boolean;
}
