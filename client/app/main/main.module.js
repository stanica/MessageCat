import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AuthGuard } from '../../components/auth/auth-guard.service';

import { RouterModule, Routes } from '@angular/router';


import { MainComponent } from './main.component';


export const ROUTES = [{
    path: 'boards',
    component: MainComponent,
    canActivate: [AuthGuard]
}];


@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        RouterModule.forChild(ROUTES),


    ],
    declarations: [
        MainComponent,
    ],

    exports: [
        MainComponent,
    ],
})
export class MainModule {}
