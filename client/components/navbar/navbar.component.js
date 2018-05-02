import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { DataService } from '../data/data.service';

@Component({
    selector: 'navbar',
    template: require('./navbar.html'),
})
export class NavbarComponent {
    isCollapsed = true;
    menu = [{
        title: 'Home',
        link: '/home',
    }];
    Router;
    isAdmin;
    isLoggedIn;
    currentUser = {};
    AuthService;
    DataService;
    state = false;

    static parameters = [AuthService, Router, DataService];
    constructor(authService, router, dataService) {
        this.AuthService = authService;

        this.DataService = dataService;

        this.Router = router;

        this.reset();

        this.AuthService.currentUserChanged.subscribe(user => {
            this.currentUser = user;
            this.reset();
        });
    }

    reset() {
        this.AuthService.isLoggedIn().then(is => {
            this.isLoggedIn = is;
        });
        this.AuthService.isAdmin().then(is => {
            this.isAdmin = is;
        });
        this.AuthService.getCurrentUser().then(user => {
            this.currentUser = user;
        });
    }

    logout() {
        return this.AuthService.logout().then(() => {
            this.Router.navigateByUrl('/login');
            this.reset();
        });
    }

    toggle(){
        this.state = !this.state;
        this.DataService.changeCollapse(this.state);
    }
}
