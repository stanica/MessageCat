import { Component } from '@angular/core';

import { Router } from '@angular/router';
import { AuthService } from '../../../components/auth/auth.service';

import backstretch from 'jquery-backstretch';

@Component({
    selector: 'login',
    template: require('./login.html'),
    styles: [require('./login.scss')],
})
export class LoginComponent {
    user = {
        name: '',
        email: '',
        password: '',
    };
    errors = {login: undefined};
    submitted = false;
    AuthService;
    Router;
    showNav = false;

    static parameters = [AuthService, Router];
    constructor(_AuthService_, router) {
        this.AuthService = _AuthService_;
        this.Router = router;
        $.backstretch("../../assets/images/login.jpg", {transitionDuration: 500});
    }

    login(form) {
        if(form.invalid) return;

        return this.AuthService.login({
            email: this.user.email,
            password: this.user.password
        })
            .then(() => {
                // Logged in, redirect to home
                $.backstretch("destroy");
                this.Router.navigateByUrl('/home');
            })
            .catch(err => {
                console.log(err);
                this.errors.login = err.json().message;
            });
    }

    modal(state){
        if(state === 1){
            setTimeout(function(){
                $("#myModal").addClass("in");
            }, 100);
            $("#myModal").css("display","block");
        }
        else {
            $("#myModal").removeClass("in");
            setTimeout(function(){
                $("#myModal").css("display","none");
            }, 100)
        }
    }
}
