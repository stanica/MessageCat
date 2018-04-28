import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';

import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard {
    authService;

    static parameters = [AuthService];
    constructor(authService) {
        this.authService = authService;
    }

    canActivate() {
        return this.authService.isLoggedIn();
    }
}
