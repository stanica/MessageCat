import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard {
    authService;
    router;

    static parameters = [AuthService, Router];
    constructor(authService, router) {
        this.authService = authService;
        this.router = router;
    }

    canActivate() {
        if(localStorage.getItem('user') && localStorage.getItem('id_token')) {
            return true;
        }
        else {
            this.router.navigate(['/login'] );
            return false;
        }
	}
}
