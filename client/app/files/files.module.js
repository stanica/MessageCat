import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AuthGuard } from '../../components/auth/auth-guard.service';

import { RouterModule, Routes } from '@angular/router';


import { FilesComponent } from './files.component';


export const ROUTES =
[{
    path: 'files',
    component: FilesComponent,
    canActivate: [AuthGuard]
},
{
    path: 'files/:id',
    component: FilesComponent,
    canActivate: [AuthGuard]
}];


@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        RouterModule.forChild(ROUTES),


    ],
    declarations: [
        FilesComponent,
    ],

    exports: [
        FilesComponent,
    ],
})
export class FilesModule {}
