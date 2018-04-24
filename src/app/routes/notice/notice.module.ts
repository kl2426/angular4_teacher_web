import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';


import { SchoolnoticeComponent } from './schoolnotice/schoolnotice.component';
import { ClassnoticeComponent } from './classnotice/classnotice.component';
import { ClassnoticeAddComponent } from './classnotice/add/add.component';
//   server
import { SchoolnoticeService } from './schoolnotice/schoolnotice.service';

//   module
import { VoteModule } from '../vote/vote.module';

const COMPONENTS = [
    SchoolnoticeComponent,
    ClassnoticeComponent,
    ClassnoticeAddComponent,
];

const PROVID = [
    SchoolnoticeService,
];


@NgModule({
    imports: [SharedModule, VoteModule,
        //
    ],
    providers: [
        ...PROVID,
    ],
    declarations: [
        ...COMPONENTS,
    ],
    exports: [
        ...COMPONENTS,
    ]
})
export class  NoticeModule { }
