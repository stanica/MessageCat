import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import backstretch from 'jquery-backstretch';

@Component({
    selector: 'main',
    template: require('./main.html'),
    styles: [require('./main.scss')],
})
export class MainComponent {
    Http;

    awesomeThings = [];
    newThing = '';

    static parameters = [Http];
    constructor(http) {
        this.Http = http;
        //TODO: Find a way to make this happen automatically
        $.backstretch('destroy');
    }

    ngOnInit() {
        return this.Http.get('/api/things')
            .map(res => res.json())
            // .catch(err => Observable.throw(err.json().error || 'Server error'))
            .subscribe(things => {
                this.awesomeThings = things;
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