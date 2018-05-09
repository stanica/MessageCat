import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { AuthHttp } from 'angular2-jwt';
import 'rxjs/add/operator/map';
import backstretch from 'jquery-backstretch';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { AceEditorComponent } from 'ng2-ace-editor';
import 'brace';
import 'brace/mode/lua';
import 'brace/theme/xcode';
import 'brace/ext/language_tools';
var LuaVM = require('lua.vm.js');

function handleError(err) {
    return Observable.throw(err || 'Server error');
}

@Component({
    selector: 'playground',
    template: require('./playground.html'),
    //styles: [require('./files.scss')],
})
export class PlaygroundComponent {
    Http;
    AuthHttp;
    toastr;
    fileText;
    logText = '';
    lua;
    options = {printMargin: false, enableBasicAutocompletion: true, maxLines: 35};


    static parameters = [Http, AuthHttp, ToastrService, Router, ActivatedRoute];
    constructor(http, authHttp, toastrService, Router, ActivatedRoute) {
        var that = this;
        this.Http = http;
        this.AuthHttp = authHttp;
        this.toastr = toastrService;
        this.Router = Router;
        this.Route = ActivatedRoute;
        //TODO: Find a way to make this happen automatically
        $.backstretch('destroy');
        this.lua = new LuaVM.Lua.State();
        LuaVM.emscripten.print = function(x){
            that.logText += x + '\n';
        }
    }

    ngOnInit() {
        var editor = ace.edit('editor');
        editor.focus();
    }

    run() {
        this.logText = '';
        try{
            if(this.fileText){
                this.lua.execute(this.fileText) + '\n';
            }
        }
        catch(e){
            this.logText = e.toString();
        }
    }
}
