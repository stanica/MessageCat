import { Component } from '@angular/core';

import { Router } from '@angular/router';
import { DataService } from '../data/data.service';
import { AuthService } from '../auth/auth.service';

@Component({
    selector: 'sidebar',
    template: require('./sidebar.html'),
})
export class SidebarComponent {
    isCollapsed = true;
    Router;
    currentUser = {};

    static parameters = [Router, DataService, AuthService];
    constructor(router, dataService, AuthService) {
        this.Router = router;
        AuthService.currentUserChanged.subscribe(user => {
            this.currentUser = user;
        });

        dataService.currentState.subscribe(collapse => {
            if(!collapse){
                $('#sidebar').css('margin-left', '0');
                $('#main-content').css('margin-left', '210px');
                $('#nav-accordion').css('display', 'block');
            }
            else {
                $('#sidebar').css('margin-left', '-210px');
                $('#main-content').css('margin-left', '0');
                $('#nav-accordion').css('display', 'none');
            }
        });
    }

}
