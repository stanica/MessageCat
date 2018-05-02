import { Component } from '@angular/core';

@Component({
    selector: 'app',
    template: `<navbar></navbar>
    <sidebar></sidebar>
    <router-outlet></router-outlet>
    <footer></footer>`
})
export class AppComponent {}
