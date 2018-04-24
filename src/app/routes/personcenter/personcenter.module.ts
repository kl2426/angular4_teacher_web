import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';


import { BaseinfoComponent } from './baseinfo/baseinfo.component';
import { ChangepasswordComponent } from './changepassword/changepassword.component';
//   server
import { BaseinfoService } from './baseinfo/baseinfo.service';
import { ChangepasswordService } from './changepassword/changepassword.service';

//   module
import { VoteModule } from '../vote/vote.module';

const COMPONENTS = [
    BaseinfoComponent,
    ChangepasswordComponent,
];

const PROVID = [
    BaseinfoService,
    ChangepasswordService,
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
export class PersoncenterModule { }
