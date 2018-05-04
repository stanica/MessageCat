import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { AuthHttp } from 'angular2-jwt';
import 'rxjs/add/operator/map';
import backstretch from 'jquery-backstretch';

@Component({
    selector: 'main',
    template: require('./main.html'),
    styles: [require('./main.scss')],
})
export class MainComponent {
    Http;
    boards = [];
    newThing = '';
    AuthHttp;

    static parameters = [Http, AuthHttp];
    constructor(http, authHttp) {
        this.Http = http;
        this.AuthHttp = authHttp;
        //TODO: Find a way to make this happen automatically
        $.backstretch('destroy');
    }

    ngOnInit() {
        return this.AuthHttp.get('/api/esp')
            .map(res => res.json())
            .subscribe(boards => {
                console.log(boards);
                this.boards = boards;
            });
    }


    addThing() {
        if(this.newThing) {
            let text = this.newThing;
            this.newThing = '';

            return this.Http.post('/api/things', { name: text })
                .map(res => res.json())
                .catch(err => Observable.throw(err.json().error || 'Server error'))
                .subscribe(thing => {
                    console.log('Added Thing:', thing);
                });
        }
    }

    deleteThing(thing) {
        return this.Http.delete(`/api/things/${thing._id}`)
            .map(res => res.json())
            .catch(err => Observable.throw(err.json().error || 'Server error'))
            .subscribe(() => {
                console.log('Deleted Thing');
            });
    }
}
