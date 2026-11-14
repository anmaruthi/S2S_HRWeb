import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavLoaderService, NavLoaderState } from './../service/navloader.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'angular-navloader',
    templateUrl: 'navloader.component.html',
    styleUrls: ['navloader.component.css']
})
export class NavLoaderComponent implements OnInit {

    show = false;
    private subscription: Subscription;

    constructor(private navloaderService: NavLoaderService) {
    }

    ngOnInit() {
        this.subscription = this.navloaderService.loaderState
            .subscribe((state: NavLoaderState) => {
                this.show = state.show;
            });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

}