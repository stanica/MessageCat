import {
    NgModule,
    Injectable,
    ApplicationRef,
} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {
    Http,
    HttpModule,
    BaseRequestOptions,
} from '@angular/http';
import {
    removeNgStyles,
    createNewHosts,
    createInputTransfer,
} from '@angularclass/hmr';

import { RouterModule, Routes } from '@angular/router';
import { AuthHttp, AuthConfig } from 'angular2-jwt';

import { AppComponent } from './app.component';
import { MainModule } from './main/main.module';
import { DirectivesModule } from '../components/directives.module';
import { AccountModule } from './account/account.module';
import { AdminModule } from './admin/admin.module';
import { FilesModule } from './files/files.module';
import { PlaygroundModule } from './playground/playground.module';

import {
  ToastrModule,
  ToastNoAnimation,
  ToastNoAnimationModule,
} from 'ngx-toastr';

import constants from './app.constants';

export function getAuthHttp(http) {
    return new AuthHttp(new AuthConfig({
        noJwtError: true,
        globalHeaders: [{Accept: 'application/json'}],
        tokenGetter: () => localStorage.getItem('id_token'),
    }), http);
}

let providers = [{
    provide: AuthHttp,
    useFactory: getAuthHttp,
    deps: [Http]
}];

if(constants.env === 'development') {
    @Injectable()
    class HttpOptions extends BaseRequestOptions {
        merge(options) {
            options.url = `http://localhost:9000${options.url}`;
            return super.merge(options);
        }
    }

    providers.push({ provide: RequestOptions, useClass: HttpOptions });
}

const appRoutes = [{ path: '',
    redirectTo: '/boards',
    pathMatch: 'full'
}];

@NgModule({
    providers,
    imports: [
        BrowserModule,
        HttpModule,
        ToastNoAnimationModule,
        ToastrModule.forRoot({
          toastComponent: ToastNoAnimation,
        }),
        RouterModule.forRoot(appRoutes, { enableTracing: /*process.env.NODE_ENV === 'development'*/ false }),
        MainModule,
        DirectivesModule,
        AccountModule,
        AdminModule,
        FilesModule,
        PlaygroundModule
    ],
    declarations: [
        AppComponent,
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
    static parameters = [ApplicationRef];
    constructor(appRef) {
        this.appRef = appRef;
    }

    hmrOnInit(store) {
        if(!store || !store.state) return;
        console.log('HMR store', store);
        console.log('store.state.data:', store.state.data);
        // inject AppStore here and update it
        // this.AppStore.update(store.state)
        if('restoreInputValues' in store) {
            store.restoreInputValues();
        }
        // change detection
        this.appRef.tick();
        Reflect.deleteProperty(store, 'state');
        Reflect.deleteProperty(store, 'restoreInputValues');
    }

    hmrOnDestroy(store) {
        var cmpLocation = this.appRef.components.map(cmp => cmp.location.nativeElement);
        // recreate elements
        store.disposeOldHosts = createNewHosts(cmpLocation);
        // inject your AppStore and grab state then set it on store
        // var appState = this.AppStore.get()
        store.state = {data: 'yolo'};
        // store.state = Object.assign({}, appState)
        // save input values
        store.restoreInputValues = createInputTransfer();
        // remove styles
        removeNgStyles();
    }

    hmrAfterDestroy(store) {
        // display new elements
        store.disposeOldHosts();
        Reflect.deleteProperty(store, 'disposeOldHosts');
        // anything you need done the component is removed
    }
}
