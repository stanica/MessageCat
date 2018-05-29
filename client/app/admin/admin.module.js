import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../components/auth/auth-guard.service';
import { AuthModule } from '../../components/auth/auth.module';
import { AdminUsersComponent } from './admin.component';
import { AdminLearningComponent } from './learning.component';


const adminRoutes = [{
    path: 'admin/users',
    component: AdminUsersComponent,
    canActivate: [AuthGuard],
}, {
    path: 'admin/learning',
    component: AdminLearningComponent,
    canActivate: [AuthGuard],
}];

@NgModule({
    imports: [
        AuthModule,
        BrowserModule,
        RouterModule.forChild(adminRoutes),

    ],
    declarations: [
        AdminUsersComponent,
        AdminLearningComponent
    ],
    exports: [
        AdminUsersComponent,
        AdminLearningComponent
    ],
})
export class AdminModule {}
