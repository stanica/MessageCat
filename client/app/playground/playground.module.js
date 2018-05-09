import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AuthGuard } from '../../components/auth/auth-guard.service';
import { AceEditorModule } from 'ng2-ace-editor';

import { RouterModule, Routes } from '@angular/router';


import { PlaygroundComponent } from './playground.component';


export const ROUTES =
[{
    path: 'playground',
    component: PlaygroundComponent,
    canActivate: [AuthGuard]
}];


@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        RouterModule.forChild(ROUTES),
        AceEditorModule

    ],
    declarations: [
        PlaygroundComponent,
    ],

    exports: [
        PlaygroundComponent,
    ],
})
export class PlaygroundModule {}
