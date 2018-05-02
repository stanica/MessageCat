import { Injectable, EventEmitter, Output } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
import { Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { safeCb, extractData } from '../util';
import constants from '../../app/app.constants';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

class Data {
    _id = '';
    name = '';
    email = '';
    role = '';
    $promise = undefined;
}

@Injectable()
export class DataService {
    isCollapsed = new BehaviorSubject(false);
    currentState = this.isCollapsed.asObservable();

    constructor() { }

    changeCollapse(state) {
        this.isCollapsed.next(state)
    }
}
