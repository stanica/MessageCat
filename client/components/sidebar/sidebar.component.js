import { Component } from '@angular/core';

import { Router } from '@angular/router';
import { DataService } from '../data/data.service';

@Component({
    selector: 'sidebar',
    template: require('./sidebar.html'),
})
export class SidebarComponent {
    isCollapsed = true;
    Router;

    static parameters = [Router, DataService];
    constructor(router, dataService) {
        this.Router = router;

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
