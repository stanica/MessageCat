'use strict';
import {
    async,
    ComponentFixture,
    inject,
    TestBed,
} from '@angular/core/testing';
import {
    BaseRequestOptions,
    ConnectionBackend,
    Http,
    HttpModule,
    Response,
    ResponseOptions,
} from '@angular/http';
import { MockBackend } from '@angular/http/testing';

import { FormsModule } from '@angular/forms';
import { MainComponent } from './main.component';

describe('Component: MainComponent', function() {
    let comp;
    let fixture;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                FormsModule,
                HttpModule,
            ],
            declarations: [MainComponent], // declare the test component
            providers: [
                BaseRequestOptions,
                MockBackend,
                {
                    provide: Http,
                    useFactory: (backend, defaultOptions) => new Http(backend, defaultOptions),
                    deps: [MockBackend, BaseRequestOptions]
                },
            ],
        }).compileComponents();
    }));

    beforeEach(async(inject([MockBackend], mockBackend => {
        mockBackend.connections.subscribe(conn => {
            conn.mockRespond(new Response(new ResponseOptions({
                body: JSON.stringify(['HTML5 Boilerplate', 'AngularJS', 'Karma', 'Express'])
            })));
        });
    })));

    beforeEach(async(() => {
        fixture = TestBed.createComponent(MainComponent);
        // MainComponent test instance
        comp = fixture.componentInstance;

        /**
         * Trigger initial data binding.
         */
        fixture.detectChanges();
    }));

    it('should attach a list of things to the controller', () => {
        expect(comp.awesomeThings.length).toEqual(4);
    });
});
