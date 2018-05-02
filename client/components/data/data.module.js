'use strict';

import { NgModule } from '@angular/core';
import { DataService } from './data.service';

@NgModule({
    providers: [
        DataService,
    ]
})
export class DataModule {}
