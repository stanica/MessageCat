import { Component } from '@angular/core';

import { Router } from '@angular/router';
import { AuthService } from '../../../components/auth/auth.service';
import backstretch from 'jquery-backstretch';

@Component({
    selector: 'signup',
    template: require('./signup.html'),
})
export class SignupComponent {
    user = {
        name: '',
        email: '',
        password: ''
    };
    errors = {};
    submitted = false;
    AuthService;
    Router;


    static parameters = [AuthService, Router];
    constructor(_AuthService_, router) {
        this.AuthService = _AuthService_;
        this.Router = router;
        $.backstretch("../../assets/images/login.jpg", {transitionDuration: 500});
    }

    register(form) {
        if(form.invalid) return;

        this.submitted = true;

        return this.AuthService.createUser({
            name: this.user.name,
            email: this.user.email,
            password: this.user.password
        })
            .then(() => {
                // Account created, redirect to home
                $.backstretch("destroy");
                this.Router.navigateByUrl('/boards');
            })
            .catch(err => {
                this.errors = err.errors;

                // Update validity of form fields that match the mongoose errors
                Object.entries(err.errors).forEach(([field, error]) => {
                    this.errors[field] = error.message;

                    if(field === 'email' && error.kind === 'user defined') {
                        form.form.controls[field].setErrors({inUse: true});
                    }
                });

                this.submitted = false;
            });
    }
}
