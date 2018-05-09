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

function handleError(err) {
    return Observable.throw(err || 'Server error');
}

@Component({
    selector: 'files',
    template: require('./files.html'),
    //styles: [require('./files.scss')],
})
export class FilesComponent {
    @ViewChild('fileName') fn
    Http;
    AuthHttp;
    toastr;
    selectedBoard = {};
    selectedFile;
    boards = [];
    Router;
    Route;
    sub;
    id;
    fileText;
    logText;
    connected = false;
    file = {};
    collapsedTable = false;
    options = {printMargin: false, enableBasicAutocompletion: true, maxLines: 35};


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

    getLog(){
        var that = this;
        that.AuthHttp.get('/api/files/' + this.selectedBoard.chipId + '/uploads/log.txt')
            .subscribe(file => {
                that.logText = file._body;
                setTimeout(function(){
                    that.getLog.call(that);
                }, 4000);
            });
    }

    setBoot(file){
        this.AuthHttp.get('/api/files/' + file.folder + '/boot/' + file.fileName)
            .map(res => res.json())
            .subscribe(files => {
                this.selectedBoard.files = files;
            });
    }

    edit(file){
        if(!this.connected){
            this.getLog();
            this.connected = true;
        }
        this.selectedFile = file;
        this.AuthHttp.get('/api/files/' + file.folder + '/uploads/' + file.fileName)
            .subscribe(file => {
                this.fileText = file._body;
                var editor = ace.edit('editor');
                editor.focus();
            });
    }

    modal(state){
        var that = this;
        this.modalTitle = 'Add new file';
        
        if(state === 1){
            setTimeout(function(){
                $("#myModal").addClass("in");
                that.fn.nativeElement.focus();
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

    create(form){
        if(form.invalid) return;
        if(form.value.fileName.substr(form.value.fileName.length - 4) !== '.lua'){
            form.value.fileName += '.lua';
        }
        var obj = {
            fileName: form.value.fileName,
            espId: this.selectedBoard._id,
            folder: this.selectedBoard.chipId,
            boot: 0,
            active: true,
            email: this.selectedBoard.email
        }
        this.file.fileName = '';
        this.AuthHttp.post('/api/files/', obj)
                .map(res => res.json())
                .subscribe(file => {
                    this.selectedBoard.files.push(file);
                    this.modal(0);
                    this.toastr.success('You created ' + file.fileName, 'Hooray!');
                },
                err => {
                    this.toastr.error('Oh no! Something went wrong');
                    return handleError();
                })
    }

    save(){
        var wordsList = ['Hooray', 'Fantabulous', 'Rad', 'Fantastic', 'Gnarly', 'Rad', 'Yipee', 'Sweet'];
        this.selectedFile.text = this.fileText;
        return this.AuthHttp.put('/api/files/' + this.selectedFile._id, this.selectedFile)
            .subscribe(file => {
                if(file.status === 201){
                    this.toastr.success('You saved ' + this.selectedFile.fileName, wordsList[Math.floor(Math.random() * wordsList.length)] +'!');
                }
            });
    }

    remove(file){
        if(confirm('Are you sure you want to delete ' + file.fileName + '? This will NOT delete the file off your board!')){
            this.fileText = '';
            this.selectedFile = {};
            return this.AuthHttp.delete('/api/files/' + file._id)
                .map(res => res.json())
                .catch(err => Observable.throw(err.json().error || 'Server error'))
                .subscribe(() => {
                    this.selectedBoard.files.splice(this.selectedBoard.files.indexOf(file), 1);
                    this.toastr.success('You deleted ' + file.fileName);
                });
        }
    }

    collapse(el){
        if(this.collapsedTable){
            $("#"+el).addClass("in");
        }
        else {
            $("#"+el).removeClass("in");
        }
        this.collapsedTable = !this.collapsedTable
    }
}
