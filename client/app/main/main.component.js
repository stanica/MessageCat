import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { AuthHttp } from 'angular2-jwt';
import 'rxjs/add/operator/map';
import backstretch from 'jquery-backstretch';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';

function handleError(err) {
    return Observable.throw(err || 'Server error');
}

@Component({
    selector: 'main',
    template: require('./main.html'),
    styles: [require('./main.scss')],
})
export class MainComponent {
    Http;
    boards = [];
    modalTitle;
    AuthHttp;
    board = {
        name: '',
        description: '',
        chipId: '',
        _id: ''
    };
    disableEdit = false;
    toastr;
    route;
    sub;


    static parameters = [Http, AuthHttp, ToastrService, ActivatedRoute];
    constructor(http, authHttp, toastrService, ActivatedRoute) {
        this.Http = http;
        this.AuthHttp = authHttp;
        this.toastr = toastrService;
        this.route = ActivatedRoute;
        //TODO: Find a way to make this happen automatically
        $.backstretch('destroy');
    }

    ngOnInit() {
        this.sub = this.route
          .queryParams
          .subscribe(params => {
            if(params.new === 'true'){
                this.modal(1);
            }
          });
        return this.AuthHttp.get('/api/esp')
            .map(res => res.json())
            .subscribe(boards => {
                this.boards = boards;
            });
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    modal(state, board){
        var that = this;
        if(board){
            this.modalTitle = 'Edit ' + board.name;
            this.board = board;
            this.disableEdit = true;
        }
        else {
            this.modalTitle = 'Add new board';
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
        var wordsList = ['Hooray', 'Fantabulous', 'Rad', 'Fantastic', 'Gnarly', 'Rad', 'Yipee', 'Sweet'];
        if(form.invalid) return;
        if(this.board){
            this.AuthHttp.put(`/api/esp/${this.board._id}`, this.board)
                .map(res => res.json())
                .subscribe(board => {
                    this.modal(0);
                    this.toastr.success('You updated ' + board.name, wordsList[Math.floor(Math.random() * wordsList.length)] +'!');
                },
                err => {
                    this.toastr.error('Oh no! Something went wrong');
                    console.log(err);
                    return handleError(err);
                })
        }
        else {
            var user = JSON.parse(localStorage.getItem('user'));
            form.value.email = user.email;
            this.AuthHttp.post('/api/esp/', form.value)
                .map(res => res.json())
                .subscribe(board => {
                    this.boards.push(board);
                    this.modal(0);
                    this.toastr.success('You added ' + board.name, 'Hooray!');
                },
                err => {
                    this.toastr.error('Oh no! Something went wrong');
                    console.log(err);
                    return handleError();
                })
        }
    }

    remove(board){
        if(confirm('Are you sure you want to delete ' + board.name + '?')){
            return this.Http.delete(`/api/esp/${board._id}`)
                .map(res => res.json())
                .catch(err => Observable.throw(err.json().error || 'Server error'))
                .subscribe(() => {
                    this.boards.splice(this.boards.indexOf(board), 1);
                });
        }
    }
}
