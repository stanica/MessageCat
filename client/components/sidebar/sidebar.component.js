import { Component } from '@angular/core';

import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
    selector: 'sidebar',
    template: require('./sidebar.html'),
})
export class SidebarComponent {
    isCollapsed = true;
    Router;
    isLoggedIn;

    static parameters = [AuthService, Router];
    constructor(authService, router) {
        this.Router = router;

        authService.isLoggedIn().then(is => {
            this.isLoggedIn = is;
        });
    }

}
