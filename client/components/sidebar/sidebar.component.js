import { Component } from '@angular/core';

import { Router } from '@angular/router';
import { DataService } from '../data/data.service';
import { AuthService } from '../auth/auth.service';

var accordion = require('dcjqaccordion');

jQuery.cookie = function(name, value, options) {
    if (typeof value != 'undefined') { // name and value given, set cookie
        options = options || {};
        if (value === null) {
            value = '';
            options.expires = -1;
        }
        var expires = '';
        if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
            var date;
            if (typeof options.expires == 'number') {
                date = new Date();
                date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
            } else {
                date = options.expires;
            }
            expires = '; expires=' + date.toUTCString(); // use expires attribute, max-age is not supported by IE
        }
        // CAUTION: Needed to parenthesize options.path and options.domain
        // in the following expressions, otherwise they evaluate to undefined
        // in the packed version for some reason...
        var path = options.path ? '; path=' + (options.path) : '';
        var domain = options.domain ? '; domain=' + (options.domain) : '';
        var secure = options.secure ? '; secure' : '';
        document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
    } else { // only name given, get cookie
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
};

@Component({
    selector: 'sidebar',
    template: require('./sidebar.html'),
})
export class SidebarComponent {
    isCollapsed = true;
    Router;
    currentUser = {};
    isAdmin;

    static parameters = [Router, DataService, AuthService];
    constructor(router, dataService, AuthService) {
        this.Router = router;
        AuthService.currentUserChanged.subscribe(user => {
            this.currentUser = user;
        });

        AuthService.currentUserChanged.subscribe(user => {
            AuthService.isAdmin().then(is => {
                this.isAdmin = is;
            });
        });

        dataService.currentState.subscribe(collapse => {
            if(!collapse){
                $('#sidebar').css('margin-left', '0');
                $('#main-content').css('margin-left', '210px');
                $('#nav-accordion').css('display', 'block');
            }
            else {
                $('#sidebar').css('margin-left', '-210px');
                $('#main-content').css('margin-left', '0');
                $('#nav-accordion').css('display', 'none');
            }
        });

        jQuery(document).ready(function($) {
            jQuery('#nav-accordion').dcAccordion();
        });
    }

}
