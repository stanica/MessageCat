import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { AuthHttp } from 'angular2-jwt';
import 'rxjs/add/operator/map';
import backstretch from 'jquery-backstretch';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';

function handleError(err) {
    return Observable.throw(err || 'Server error');
}

@Component({
    selector: 'files',
    template: require('./files.html'),
    //styles: [require('./files.scss')],
})
export class FilesComponent {
    Http;
    AuthHttp;
    toastr;
    selectedBoard = {};
    boards = [];
    Router;
    Route;
    sub;
    id;
    fileText;


    static parameters = [Http, AuthHttp, ToastrService, Router, ActivatedRoute];
    constructor(http, authHttp, toastrService, Router, ActivatedRoute) {
        this.Http = http;
        this.AuthHttp = authHttp;
        this.toastr = toastrService;
        this.Router = Router;
        this.Route = ActivatedRoute;
        //TODO: Find a way to make this happen automatically
        $.backstretch('destroy');
    }

    ngOnInit() {
        return this.AuthHttp.get('/api/esp')
            .map(res => res.json())
            .subscribe(boards => {
                this.boards = boards;
                this.AuthHttp.get('/api/files')
                    .map(res => res.json())
                    .subscribe(files => {
                        for(var x=0; x<this.boards.length; x++){
                            this.boards[x].files = [];
                           for(var y=0; y<files.length; y++){
                            if(this.boards[x]._id === files[y].espId){
                                this.boards[x].files.push(files[y]);
                            }
                           }
                        }
                    });
                    this.sub = this.Route.params.subscribe(params => {
                        this.id = +params['id']; // (+) converts string 'id' to a number
                        if(this.id){
                            for(var x=0; x<this.boards.length; x++){
                                if(+this.boards[x].chipId === this.id){
                                    this.selectedBoard = this.boards[x];
                                    break;
                                }
                            }
                        }
                    });
            });
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    setBoot(file){
        this.AuthHttp.get('/api/files/' + file.folder + '/boot/' + file.fileName)
            .map(res => res.json())
            .subscribe(files => {
                this.selectedBoard.files = files;
            });
    }

    edit(file){
        this.AuthHttp.get('/api/files/' + file.folder + '/uploads/' + file.fileName)
            .subscribe(file => {
                console.log(file._body);
                this.fileText = file._body;
            });
    }

    modal(state, board){
        var that = this;
        if(board){
            this.modalTitle = 'Edit ' + board.name;
            this.board = board;
            this.disableEdit = true;
        }
        else {
            this.modalTitle = 'Add new file';
            this.board = '';
            this.disableEdit = false;
        }
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

    save(form){
       
    }

    remove(board){
        
    }
}
