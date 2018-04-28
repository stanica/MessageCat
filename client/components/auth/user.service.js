import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { AuthHttp } from 'angular2-jwt';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';

function handleError(err) {
    return Observable.throw(err.json() || 'Server error');
}

@Injectable()
export class UserService {
    AuthHttp;

    static parameters = [AuthHttp];
    constructor(authHttp) {
        this.AuthHttp = authHttp;
    }

    query() {
        return this.AuthHttp.get('/api/users/')
            .map(res => res.json())
            .catch(handleError);
    }
    get(user = {id: 'me'}) {
        return this.AuthHttp.get(`/api/users/${user.id || user._id}`)
            .map(res => res.json())
            .catch(handleError);
    }
    create(user) {
        return this.AuthHttp.post('/api/users/', user)
            .map(res => res.json())
            .catch(handleError);
    }
    changePassword(user, oldPassword, newPassword) {
        return this.AuthHttp.put(`/api/users/${user.id || user._id}/password`, {oldPassword, newPassword})
            .map(res => res.json())
            .catch(handleError);
    }
    remove(user) {
        return this.AuthHttp.delete(`/api/users/${user.id || user._id}`)
            .map(() => user)
            .catch(handleError);
    }
}
