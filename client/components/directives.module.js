import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { RouterModule } from '@angular/router';

import { AuthModule } from './auth/auth.module';
import { DataModule } from './data/data.module';

import { NavbarComponent } from './navbar/navbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { FooterComponent } from './footer/footer.component';
import { OauthButtonsComponent } from './oauth-buttons/oauth-buttons.component';

@NgModule({
    imports: [
        CommonModule,
        AuthModule,
        DataModule,
        RouterModule,
    ],
    declarations: [
        NavbarComponent,
        SidebarComponent,
        FooterComponent,
        OauthButtonsComponent,
    ],
    exports: [
        NavbarComponent,
        SidebarComponent,
        FooterComponent,
        OauthButtonsComponent,
    ]
})
export class DirectivesModule {}
